class Tag {
	/**
	 * @param {string} t Name of a valid tag
	 * @returns {Tag}
	 */
	constructor(t) {
		this.tag = t;
		this.element = document.createElement(this.tag);
		this.attr = {};
		this.parent = null; 	
	}

	/**
	 * @param {HTMLElement} parent Parent to append this Tag as a child
	 * @returns {this} Itself for chaining operations
	 */
	appendTo(parent) {
		this.parent = parent;
		this.parent.appendChild(this.element);
		return this;
	}

	/**
	 * @param {HTMLElement} e Swap the given element with this element
	 * @returns {this} Itself for chaining operations
	 */
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

	/**
	 * @param {string} name Name of the attribute to set
	 * @param {string | number} value To assign to the given name
	 * @returns {this} Itself for chaining operations
	 */
	addAttr(name, value) {
		this.attr[name] = value;
		this.applyAttribs;
		return this;
	}

	/**
	 * __NOT WORKING__
	 * @param {string} name Of the attribute to remove
	 * @returns {this} Itself for chaining operations
	 */
	removeAttr(name) {
		if (Object.keys(this.attr).includes(name)) { delete this.attr[name]; }
		this.applyAttribs;
		return this;
	}

	/**
	 * @param  {...string} ...names Add all of the given names to the class
	 * @returns {this} Itself for chaining operations
	 */
	addClass(...names) {
		names.forEach((name) => {
			if (!this.element.classList.contains(name)) { this.element.classList.add(name); }
		})
		return this;
	}

	/**
	 * 
	 * @param  {...string} ...names Remove all of the given names from the class
	 * @returns {this} Itself for chaining operations
	 */
	removeClass(...names) {
		names.forEach((name) => {
			if (this.element.classList.contains(name)) { this.element.classList.remove(name); }
		})
		return this;
	}

	/**
	 * @param {string | number} str Set the innerText of the element as the one received
	 * @returns {this} Itself for chaining operations
	 */
	text(str) {
		this.element.innerText = str;
		return this;
	}

	/**
	 * @param {string} str Set the innerHTML of the element as the one received
	 * @returns {this} Itself for chaining operations
	 */
	html(str) {
		this.element.innerHTML = str;
		return this;
	}

	/**
	 * @description Hides the element by applying
	 * ```css
	 * display: none
	 * ```
	 * @returns {this} Itself for chaining operations
	 */
	hide() {
		this.element.style.display = 'none';
		return this;
	}

	/**
	 * @description Show the element by removing the display style
	 * @returns {this} Itself for chaining operations
	 */
	show() {
		this.element.style.display = '';
		return this;
	}

	/**
	 * @param {string} name Event name to setup the event handler
	 * @param {function} callback Function that will be called when the event is emitted
	 * @returns {this} Itself for chaining operations
	 */
	event(name, callback) {
		this.element.addEventListener(name, callback);
		return this;
	}

	/**
	 * @description Destroy the HTMLElement created with this class
	 * @returns {HTMLElement} Return the parent of the Tag that was destroyed
	 */
	destroy() {
		this.element.remove();
		return this.parent
	}

	/**
	 * @returns {HTMLElement} HTMLElement created with this class with all of the properties
	 */
	get node() {
		return this.element
	}

	/**
	 * @returns {this} Itself for chaining operations
	 */
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