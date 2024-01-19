class MyStorage {
	static _defaultExpr = 1000 * 60 * 60 * 24;

	/**
	 * @return {boolean} Check if LocalStorage is enabled on the current browser
	 */
	static get isStorageEnable() {
		let checked = typeof Storage !== undefined;
		if (!checked) {
			throw new Error('Local storage is not enabled');
		}
		return checked;
	}

	/**
	 * @param {string} key Key of the data to store
	 * @param {any} value Value to store
	 * @returns {boolean} Check if the value was successfully added
	 */
	static add(key, value) {
		if (this.isStorageEnable) {
			window.localStorage.setItem(key, value);
			return this.hasKey(key);
		}
		return false;
	}

	/**
	 * @param {string} key Key of the data to delete
	 * @returns {boolean} Check if the value was successfully deleted
	 */
	static remove(key) {
		if (this.isStorageEnable) {
			if (this.hasKey(key)) {
				window.localStorage.removeItem(key);
				return !this.hasKey(key);
			}
		}
		return false;
	}

	/**
	 * @param {string} key Key of the data
	 * @returns {any} Return the data binded to the given key
	 */
	static get(key) {
		if (this.isStorageEnable) {
			if (this.hasKey(key)) {
				return window.localStorage.getItem(key);
			}
		}
		return false;
	}

	/**
	 * @returns {boolean} Check if Storage was cleared successfully
	 */
	static clear() {
		if (this.isStorageEnable) {
			window.localStorage.clear();
			return window.localStorage.length == 0;
		}
		return false;
	}

	/**
	 * @param {string} key Key to check if exists
	 * @returns {boolean} Check if the key exists
	 */
	static hasKey(key) {
		if (this.isStorageEnable) {
			return Object.keys(window.localStorage).includes(key);
		}
		return false;
	}

	/**
	 * @param {string} key Key to bind to the data
	 * @param {any} value Value to store
	 * @param {int} expr Expiry date of the data
	 * @returns {boolean} Check if the data was successfully stored
	 */
	static setCookie(key, value, expr) {
		if (this.isStorageEnable) {
			if (!expr) { expr = this._defaultExpr; }
			key = `cookie-${key}`;
			const now = new Date();
			const item = { value, expiry: now.getTime() + expr };
			window.localStorage.setItem(key, JSON.stringify(item));
			return this.hasKey(key);
		}
		return false;
	}

	/**
	 * @param {string} key Key of the data to retrive
	 * @returns {any | boolean}
	 */
	static getCookie(key) {
		if (this.isStorageEnable) {
			key = `cookie-${key}`;
			const itemStr = window.localStorage.getItem(key);
			if (!itemStr) return false;
			const item = JSON.parse(itemStr);
			const now = new Date();
			if (now.getTime() > item.expiry) {
				window.localStorage.removeItem(key);
				return false;
			}
			return item.value;
		}
		return false;
	}
}