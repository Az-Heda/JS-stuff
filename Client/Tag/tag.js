class Tag {
	constructor(t) {
		this.tag = t;
		this.element = document.createElement(this.tag);
		this.attr = {};
		this.parent = null; 	
	}

	appendTo(parent) {
		this.parent = parent;
		this.parent.appendChild(this.element);
		return this;
	}

	swap(e) {
		if (this.element.parentElement && e.parentElement) {
			const tmp = document.createElement('div');
			this.element.parentNode.insertBefore(tmp, this.element);
			e.parentNode.insertBefore(this.element, e);
			tmp.parentNode.insertBefore(e, tmp);
			tmp.parentNode.removeChild(tmp);
		}
		else if (!this.element.parentElement && e.parentElement) {
			e.parentNode.insertBefore(this.element, e);
			e.parentNode.removeChild(e);
		}
		return this;
	}

	addAttr(name, value) {
		this.attr[name] = value;
		this.applyAttribs;
		return this;
	}

	removeAttr(name) {
		if (Object.keys(this.attr).includes(name)) { delete this.attr[name]; }
		this.applyAttribs;
		return this;
	}

	addClass(...names) {
		names.forEach((name) => {
			if (!this.element.classList.contains(name)) { this.element.classList.add(name); }
		})
		return this;
	}

	removeClass(...names) {
		names.forEach((name) => {
			if (this.element.classList.contains(name)) { this.element.classList.remove(name); }
		})
		return this;
	}

	text(str) {
		this.element.innerText = str;
		return this;
	}

	html(str) {
		this.element.innerHTML = str;
		return this;
	}

	hide() {
		this.element.style.display = 'none';
		return this;
	}

	show() {
		this.element.style.display = '';
		return this;
	}

	event(name, callback) {
		this.element.addEventListener(name, callback);
		return this;
	}

	destroy() {
		this.element.remove();
		return this.parent
	}

	get node() {
		return this.element
	}

	get applyAttribs() {
		[...this.element.getAttributeNames()].forEach((a) => {
			this.element.removeAttribute(a);
		});
		for (let [k, v] of Object.entries(this.attr)) {
			this.element.setAttribute(k, v);
		}
		return this;
	}
}