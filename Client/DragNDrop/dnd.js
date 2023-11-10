class dnd {
	static count=0;
	static #_movableElements = [];

	static add(elem) {
		this.#_config(elem);
	}	
	
	static auto() {
		let elements = this.#_getElementByAttribute('movable');
		for (let p = 0; p < elements.length; p ++) {
			this.#_config(elements[p]);
		}
	}

	static #_config(el) {
		let sizes = el.getBoundingClientRect;
		el.onmousedown = function(e) {
			el.ctx = {
				dx: sizes.left - e.clientX,
				dy: sizes.top - e.clientY,
				isDown: true,
			}
		}
		this.#_movableElements.push(el);
	}

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
				elements.push(element);
			}
		}
		return (elements.length > 0) ? elements : null;
	}
}