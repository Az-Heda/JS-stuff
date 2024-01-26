class MSVG {
	#_element = null;
	#_ns = 'http://www.w3.org/2000/svg';
	#_groups = {};
	#_gradients = [];

	get node() { return this.#_element }

	constructor(x, y, w, h) {
		this.#_element = document.createElementNS(this.#_ns, 'svg');
		this.setViewBox(x, y, w, h);
	}

	setViewBox(x, y, w, h) {
		this.#_checkSVG();
		this.#_element.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
	}

	appendTo(parent) {
		this.#_validateParent(parent);
		parent.appendChild(this.#_element)
	}


	// Shapes

	group(name, attributes={}) {
		if (Object.keys(this.#_groups).includes(name)) throw new Error('Group already exist');
		let tag = this.#_createTag('g');
		tag.setAttribute('name', name);
		this.#_addTagAttributes(tag, attributes);
		this.#_element.appendChild(tag);
		this.#_groups[name] = tag;
	}

	drawCircle(attributes, groupName=null) {
		this.#_requiredAttributes(attributes, 'cx', 'cy', 'r');
		this.#_init('circle', attributes, groupName, this.#_getUseCase(attributes, groupName));
	}
	
	drawEllipse(attributes, groupName=null) {
		this.#_requiredAttributes(attributes, 'cx', 'cy', 'rx', 'ry');
		this.#_init('ellipse', attributes, groupName, this.#_getUseCase(attributes, groupName));
	}
	
	drawImage(url, attributes, groupName=null) {
		attributes.href = url;
		this.#_init('image', attributes, groupName, this.#_getUseCase(attributes, groupName));
	}

	drawLine(attributes, groupName=null) {
		this.#_requiredAttributes(attributes, 'x1', 'x2', 'y1', 'y2');
		this.#_init('line', attributes, groupName, this.#_getUseCase(attributes, groupName));
	}
	

	linearGradient(name, attributes, groupName=null) {
		throw new Error('Linear gradient not yet implemented');
		this.#_requiredAttributes(attributes, 'colors');
		const { colors } = attributes;
		delete attributes.colors;
		
		let id = `MSVG_LG_${name}_${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;
		if (Object.keys(this.#_gradients).includes(id)) throw new Error('LinearGradient already exist');
		let defs = this.#_createTag('defs');
		let tag = this.#_createTag('linearGradient');
		tag.setAttribute('id', id);
		// this.#_gradients.push(id);
		this.#_gradients[id] = tag;
		defs.appendChild(tag);
		this.#_appendNewTag(defs, groupName)

		for (let color of colors) {
			this.#_init('stop', { 'stop-color': color }, id);
		}
		return id;
	}

	// Private methods

	#_validateParent(parent) {
		if (!parent.constructor.name.startsWith('HTML')) throw new Error('Invalid parent element');
		if (!parent.constructor.name.endsWith('Element')) throw new Error('Invalid parent element');
	}

	#_checkSVG() {
		if (this.#_element.constructor.name !== 'SVGSVGElement') throw new Error('Invalid SVG content');
	}

	#_init(name, attributes={}, groupName=null, useCase=null) {
		attributes = attributes || {};
		let tag = this.#_createTag(name);
		let newTag = useCase;
		if (useCase !== null) {
			newTag.appendChild(tag)
		}
		this.#_addTagAttributes(tag, attributes);
		this.#_appendNewTag((useCase) ? newTag : tag, groupName);
		return tag;
	}

	#_addTagAttributes(tag, attributes={}) {
		for (const [k, v] of Object.entries(attributes).filter(i => i[1] == 0 || i[1])) {
			if (Object.keys(this.#_gradients).includes(v)) tag.setAttribute(k, `url:('#${v}')`)
			else tag.setAttribute(k, v);
		}
	}

	#_appendNewTag(tag, groupName=null) {
		if (Object.keys(this.#_groups).includes(groupName)) this.#_groups[groupName].appendChild(tag);
		else if (Object.keys(this.#_gradients).includes(groupName)) this.#_gradients[groupName].appendChild(tag)
		else this.#_element.appendChild(tag);
	}

	#_createTag(name) {
		return document.createElementNS(this.#_ns, name);
	}

	#_requiredAttributes(attributes={}, ...reqiredAttributes) {
		let missing = [];
		let allKeys = Object.keys(attributes);
		for (let ra of reqiredAttributes) {
			if (!allKeys.includes(ra)) missing.push(ra);
		}
		if (missing.length == 0) return true;
		throw new Error(`Missing required parameters: [${missing.sort().join(', ')}]`)
	}

	#_getUseCase(attributes={}, groupName=null) {
		if (Object.entries(attributes).some(i => Object.keys(this.#_gradients).includes(i[1]))) {
			return this.#_createTag('use');
		}
		return null;
	}
}
