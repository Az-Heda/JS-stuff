class DragNDrop {
	// https://www.w3schools.com/howto/howto_js_draggable.asp
	static #_attr = 'movable';
	static #_styleID = `dnd-style-${new Date().getTime()}`;
	static #_snap2Grid = 1;
	static #_allElements = [];

	static get attr() { return this.#_attr }
	static get grid() { return this.#_snap2Grid; }

	static set attr(v) { return (this.#_attr = v, this.#_attr) }
	static set grid(v) { return (this.#_snap2Grid = v, this.#_snap2Grid); }

	static auto() {
		this.#_setStyle();
		let elements = document.querySelectorAll(`[${this.#_attr}]`);
		for (let e of Array.from(elements)) {
			this.#_enableDragEvent(e)
		}
	}

	static add(element) {
		this.#_setStyle();
		if (!element.hasAttribute(this.#_attr)) {
			element.setAttribute(this.#_attr, '');
		}
		this.#_enableDragEvent(element);
	}

	static remove(element) {
		if (element.hasAttribute(this.#_attr)) {
			element.removeAttribute(this.#_attr);
		}

		element.onmousedown = null;
		if (this.#_allElements.indexOf(el) >= 0) {
			this.#_allElements.splice(this.#_allElements.indexOf(el), 1);
		}
	}

	static #_enableDragEvent(el) {
		if (this.#_allElements.indexOf(el) === -1) {
			this.#_allElements.push(el);
		}
		this.#_autoSnap2Grid(el);
		let pos1 = 0;
		let pos2 = 0;
		let pos3 = 0;
		let pos4 = 0;
		el.onmousedown = (event) => {
			event.preventDefault();
			pos3 = event.clientX;
			pos4 = event.clientY;
			document.onmouseup = () => {
				document.onmouseup = null;
				document.onmousemove = null;
				let parentBB = el.parentNode.getBoundingClientRect();
				el.style.top = parentBB.top + this.#_calcGrid(+el.style.top.replace('px', ''))+'px'
				el.style.left = parentBB.left + this.#_calcGrid(+el.style.left.replace('px', ''))+'px'
			};

			document.onmousemove = (event) => {
				event.preventDefault();
				pos1 = pos3 - event.clientX;
				pos2 = pos4 - event.clientY;
				pos3 = event.clientX;
				pos4 = event.clientY;

				const elementBB = el.getBoundingClientRect()
				const parentBB = el.parentNode.getBoundingClientRect()

				let top = el.offsetTop - pos2;
				let left = el.offsetLeft - pos1;

				top  = (top  < parentBB.top)  ? parentBB.top  : top;
				left = (left < parentBB.left) ? parentBB.left : left;
				
				top  = (top  + elementBB.height > parentBB.bottom) ? (parentBB.bottom - elementBB.height) : top;
				left = (left + elementBB.width  > parentBB.right)  ? (parentBB.right  - elementBB.width)  : left;
				
				el.style.top = `${top}px`;
				el.style.left = `${left}px`;
			}
		};
	}

	static #_setStyle() {
		if (document.querySelector(`#${this.#_styleID}`)) { return false; }
		let tag = document.createElement('style');
		tag.setAttribute('id', this.#_styleID);
		tag.innerHTML = `
		[movable] { position: absolute; }
		[movable]:active { user-select: none; }
		[movable]:hover { cursor: move; }`;
		document.head.appendChild(tag);
		return true;
	}

	static #_autoSnap2Grid(el) {
		let parentBB = el.parentNode.getBoundingClientRect();
		el.style.top = parentBB.top + this.#_calcGrid(+el.style.top.replace('px', ''))+'px'
		el.style.left = parentBB.left + this.#_calcGrid(+el.style.left.replace('px', ''))+'px'
	}

	static #_calcGrid(val) {
		let tmp = val - (val % this.#_snap2Grid) 
		if (val - tmp > this.#_snap2Grid / 2) {
			tmp += this.#_snap2Grid;
		}
		return tmp;
	}
}


window.addEventListener('load', () => { DragNDrop.auto() })