class MyEvent {
	static #_events = {};

	static bind(id, eventName, callback) {
		if (!Object.keys(this.#_events).includes(eventName)) {
			this.#_events[eventName] = {};
		}
		if (!Object.keys(this.#_events[eventName]).includes(id)) {
			this.#_events[eventName][id] = {
				element: document.getElementById(id),
				callbacks: [callback],
				created: new Date(),
			}
		}
		else {
			this.#_events[eventName][id].callbacks.push(callback);
		}
	}

	static unbind(id, eventName) {
		if (Object.keys(this.#_events).includes(eventName)) {
			if (Object.keys(this.#_events[eventName]).includes(id)) {
				delete this.#_events[eventName][id];
			}
		}
	}

	static emit(evt, ...params) {
		if (Object.keys(this.#_events).includes(evt)) {
			let rvals = [];
			let htmlelem = Object.keys(this.#_events[evt]);
			for (let x = 0; x < htmlelem.length; x ++) {
				for (let y = 0; y < this.#_events[evt][htmlelem[x]].callbacks.length; y ++) {
					rvals.push(this.#_events[evt][htmlelem[x]].callbacks[y](...params));
				}
			}
			return rvals;
		}
	}

	static get events() {
		return Object.keys(this.#_events)
	}
}
