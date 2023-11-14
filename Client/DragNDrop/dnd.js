class dnd {
	static #_objDragged = null;
	static #_movableElements = [];

	/**
	 * @param {HTMLElement} elem HTML Element that can be moved, (this will add the attribute "movable")
	 */
	static add(elem) {
		if (!elem.hasAttribute('movable')) {
			elem.setAttribute('movable', '');
		}
		this.#_config(elem);
	}	
	
	/**
	 * Set up all of the HTML Elements with the attribute "movable"
	 * 
	 * **Example**
	 * ```html
	 * <div movable>...</div>
	 * ```
	 */
	static auto() {
		let elements = this.#_getElementByAttribute('movable');
		if (elements) {
			for (let p = 0; p < elements.length; p ++) {
				this.#_config(elements[p]);
			}
			this._eventOnDocument();
		}
	}

	/**
	 * @param {HTMLElement} el Setup all of the events and logic for the HTML Element
	 */
	static #_config(el) {
		let sizes = el.getBoundingClientRect();
		let data = { element: el, ctx: {} };
		this.#_movableElements.push(data);
		let currentIndex = this.#_movableElements.length - 1;

		data.element.onmousedown = (e) => {
			data.ctx = {
				isDown: true,
				offsetX: sizes.left - e.clientX,
				offsetY: sizes.top - e.clientY
			};
			this.#_objDragged = data.element;
		};

		data.element.onmouseup = (e) => {
			data.ctx.isDown = false;
		};
	}

	static _eventOnDocument() {
		document.onmousemove = (e) => {
			for (let p = 0; p < this.#_movableElements.length; p ++) {
				let sizes = this.#_movableElements[p].element.getBoundingClientRect()
				let parentBoundingBox = this.#_movableElements[p].element.parentNode.getBoundingClientRect();

				if (e.clientX < parentBoundingBox.left || e.clientX > parentBoundingBox.right) { this.#_movableElements[p].ctx.isDown = false; }
				if (e.clientY < parentBoundingBox.top || e.clientY > parentBoundingBox.bottom) { this.#_movableElements[p].ctx.isDown = false; }
	
				if (this.#_objDragged && this.#_movableElements[p].ctx.isDown) {

					let newX = ((e.pageX + e.clientX) / 2) + this.#_movableElements[p].ctx.offsetX;
					if (newX + sizes.width > parentBoundingBox.right) { newX = parentBoundingBox.right - sizes.width; }
					if (newX < parentBoundingBox.left) { newX = parentBoundingBox.left; }
					
					let newY = ((e.pageY + e.clientY) / 2) + this.#_movableElements[p].ctx.offsetY;
					if (newY + sizes.height > parentBoundingBox.bottom) { newY = parentBoundingBox.bottom - sizes.height; }
					if (newY < parentBoundingBox.top) { newY = parentBoundingBox.top; }

					this.#_movableElements[p].element.style.left = `${newX}px`;
					this.#_movableElements[p].element.style.top  = `${newY}px`;
				}
			}
		}
	}

	/**
	 * @param {str} attr Attribute name to search
	 * @param {str} value Value of the element
	 * @param {HTMLElement} root Root element
	 * 
	 * @returns {Array<HTMLElement>} Returns all of the elements with the given attribute and value
	 * 
	 * ___
	 * This function will search all of the child elements of the param ::root::
	 */
	static #_getElementByAttribute(attr, value='', root=document.body) {
		root = root || document.body;
		if(root.hasAttribute(attr) && root.getAttribute(attr) == value) {
			return root;
		}
		let children = root.children;
		let elements = [];
		for(let i = children.length; i--; ) {
			let element = this.#_getElementByAttribute(attr, value, children[i]);
			if(element) {
				elements = elements.concat(element);
			}
		}
		return (elements.length > 0) ? elements : null;
	}
}

window.addEventListener('load', () => { dnd.auto() })