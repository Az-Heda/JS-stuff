// https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/Swap/swap.min.js
// https://unpkg.com/azheda-utils-v2@latest/Client/Swap/swap.js

class Swappable {
	static #_elements = {};
	static #_swapGroupAttr = 'swap-group';
	static #_applicationName = 'application-swap';
	static #_swapGroupAttrValue = '*';
	static #_debug = false;
	
	static #_generateID() {
		return `Swappable-auto-id-${(new Date()).getTime() * Math.random()}`;
	}

	static #_getFunction(n) {
		return {
			dragStartHandler: (event) => {
				event.dataTransfer.setData(this.#_applicationName, event.target.id);
				event.dataTransfer.effectAllow = 'move';
			},
			dragOverHandler: (event) => {
				event.preventDefault();
				event.dataTransfer.dropEffect = 'move';
			},
			dropHandler: (event) => {
				event.preventDefault();
				const target = event.target;
				const source = document.getElementById(event.dataTransfer.getData(this.#_applicationName));
				this.#_swap(source, target, true);
			}
		}
	}

	static add(element) {
		if (element.id.length == 0) {
			element.setAttribute('id', this.#_generateID());
		}
		if (!element.hasAttribute(this.#_swapGroupAttr)) {
			element.setAttribute(this.#_swapGroupAttr, this.#_swapGroupAttrValue);
		}
		const { dragStartHandler, dragOverHandler, dropHandler } = this.#_getFunction();
		element.addEventListener('dragstart', dragStartHandler);
		element.addEventListener('dragover', dragOverHandler);
		element.addEventListener('drop', dropHandler);
		element.setAttribute('draggable', 'true');

		if (Object.keys(this.#_elements).includes(`${element.getAttribute(this.#_swapGroupAttr)}`)) {
			this.#_elements[`${element.getAttribute(this.#_swapGroupAttr)}`].push(element);
		}
		else {
			this.#_elements[`${element.getAttribute(this.#_swapGroupAttr)}`] = [ element ];
		}
	}

	static #_swap(source, target, checkGroup=true) {
		if (checkGroup) {
			let groupSource = source.getAttribute(this.#_swapGroupAttr);
			let groupTarget = target.getAttribute(this.#_swapGroupAttr);
			this.#_log({ groupSource, groupTarget }, '');
			if (groupSource === null || groupTarget === null || groupSource !== groupTarget) {
				this.#_log(`Elements doesn\'t have the same value for ${this.#_swapGroupAttr}: \n Source: ${this.#_swapGroupAttr}="${groupSource}" \n Target: ${this.#_swapGroupAttr}="${groupTarget}" `, 'error')
				return null;
			}
		}
		const tmp = document.createElement('div');
		source.parentNode.insertBefore(tmp, source);
		target.parentNode.insertBefore(source, target);
		tmp.parentNode.insertBefore(target, tmp);
		tmp.parentNode.removeChild(tmp);
	}

	static #_log(txt, type='info') {
		if (this.#_debug) {
			if (['log', 'info', 'warn', 'error'].includes(type)) {
				console[type](`DEBUGGER Swappable - ${type} : `, txt);
			}
		}
	}
}