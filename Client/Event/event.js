class MyEvent {
	static #_events = {};

	/**
	 * @param {string} id HTML Element tag id for the event bindingNO
	 * @param {string} eventName Name of the event
	 * @param {function} callback Function to call when the event is triggered
	 * 
	 * __Example__
	 * 
	 * HTML
	 * ```html
	 * <div id="test"></div>
	 * ```
	 * JavaScript
	 * ```js
	 * const callback = (...x) => { console.log(x); return 'Done!' };
	 * MyEvent.bind('test', '<Event_Name>', callback);
	 * ```
	 */
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

	/**
	 * ## CURRENTLY NOT WORKING
	 * @no_docs
	 * @description Unbind the event from the element
	 * @param {string} id HTML Element tag id for the event binding
	 * @param {string} eventName Name of the event
	 */
	static unbind(id, eventName) {
		if (Object.keys(this.#_events).includes(eventName)) {
			if (Object.keys(this.#_events[eventName]).includes(id)) {
				delete this.#_events[eventName][id];
				delete this.#_events[eventName];
			}
		}
	}

	/**
	 * @param {string} evt Name of the event to trigger
	 * @param {any} ...params 
	 * @returns {string} Return the values returned by all of the callback linked to this event name
	 * 
	 * __Example__
	 * ```js
	 * const params = [ 1, 2, 3 ];
	 * const result = MyEvent.emit('<Event_Name>', ...params);
	 * // This will execute all of the callbacks with the given event name for every element
	 * >>> [1, 2, 3]
	 * 
	 * console.log(result);
	 * >>> [ 'Done!' ]
	 * ```
	 */
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
	
	/**
	 * @no_docs
	 * @param {string} evtname Name of the event
	 * @returns {Array<string>} The ID of every tag that was binded to that event name
	 */
	static getIDSFromEvent(evtname) {
		if (Object.keys(this.#_events).includes(evtname)) {
			return Object.keys(this.#_events[evtname]);
		}
		return [];
	}

	/**
	 * @returns {Array<string>} Get the name of all active events
	 * 
	 * __Example__ 
	 * ```js
	 * console.log(MyEvent.events) // ['event 1', 'event 2', ...]
	 * ```
	 */
	static get events() {
		return Object.keys(this.#_events)
	}
}
