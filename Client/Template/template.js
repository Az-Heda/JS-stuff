class $TemplatingError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name.replace('$', '');
	}
}

class $InvalidDataError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name.replace('$', '');
	}
}

class $MissingTemplate extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name.replace('$', '');
	}
}

class $MissingData extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name.replace('$', '');
	}
}

class Templating {
	/**
	 * @param {string} template HTML Template to save
	 * @param {object} data Data to fill the placeholders inside of the template
	 * @return {Templating}
	 */
	constructor(template, data) {
		this.placeholder = {
			start: Array.from('$%').map((i) => { return `\\${i}` }).join(''),
			end: Array.from('%$').map((i) => { return `\\${i}` }).join(''),
		}
		this._data = {};
		this._template = '';
		this._templateWithData = '';
		this.changeTemplate(template);
		this.changeData(data);
	}

	get template() {
		return this._templateWithData
	}

	/**
	 * @param {string} template HTML Template to save
	 */
	changeTemplate(template) {
		if(!this.#_checkIfValid(template)) throw new $TemplatingError('Template is not valid')
		this._template = template;
		if (this.#_checkForData(false)) this.parse();
	}

	/**
	 * @param {object} data with the data to insert into the template
	 */
	changeData(data) {
		if (!this.#_checkData(data)) throw new $InvalidDataError(`Data is not valid, Type allowed: "${({}).constructor.name}", received: "${data?.constructor?.name}"`);
		this._data = data;
		if (this.#_checkForTemplate(false)) this.parse();
	}

	/**
	 * @returns {string} Template with the data applied in the placeholders
	 */
	parse() {
		this.#_checkForTemplate();
		this.#_checkForData();
		this._templateWithData = this._template;
		let globalPattern = `${this.placeholder.start}([ ]{0,})({rep})([ ]{0,})${this.placeholder.end}`;
		for (let [k, v] of Object.entries(this._data)) {
			if (/^[a-zA-Z0-9]{1,}$/.exec(k) !== null) {
				let pattern = RegExp(globalPattern.replaceAll('{rep}', k))
				this._templateWithData = this._templateWithData.replace(pattern, v);
			}
		}
		return this._templateWithData
	}

	/**
	 * @param {object} data with the data to insert into the template
	 */
	#_checkData(data) {
		return data !== undefined && data.constructor.name == 'Object';
	}

	/**
	 * @param {string} htmlString String with html tag inside that needs to be validated
	 * @returns {boolean} Return true if the string was validated successfully
	 */
	#_checkIfValid(htmlString) {
		let parser = new DOMParser();
    	let doc = parser.parseFromString(htmlString, "application/xml");
    	let errorNode = doc.querySelector('parsererror');
		return (errorNode === null);
		// https://tonylea.com/checking-for-valid-html-strings-in-javascript
	}

	#_checkForTemplate(err=true) {
		let isFalse = false;
		if (this._template.constructor.name !== 'String') (err) ? (() => { throw new $MissingTemplate('Cannot find the template') })() : isFalse = true;
		return !isFalse;
	}
	#_checkForData(err=true) {
		let isFalse = false;
		if (this._data.constructor.name !== 'Object') (err) ? (() => { throw new $MissingData('Cannot find the template data') })() : isFalse = true;
		return !isFalse;
	}
}
