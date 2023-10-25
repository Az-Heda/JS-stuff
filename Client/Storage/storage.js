class MyStorage {
	static #_defaultExpr = 1000 * 60 * 60 * 24;

	static get isStorageEnable() {
		let checked = typeof Storage !== undefined;
		if (!checked) {
			throw new Error('Local storage is not enabled');
		}
		return checked;
	}

	static set #_packer(val) {
		return JSON.stringify({ content: val });
	}

	static set #_unpacker(val) {
		return JSON.parse(val).content;
	}

	static add(key, value) {
		if (this.isStorageEnable) {
			window.localStorage.setItem(key, this.#_packer = value);
			return this.hasKey(key);
		}
		return null;
	}

	static remove(key) {
		if (this.isStorageEnable) {
			if (this.hasKey(key)) {
				window.localStorage.removeItem(key);
				return !this.hasKey(key);
			}
		}
		return null;
	}

	static get(key) {
		if (this.isStorageEnable) {
			if (this.hasKey(key)) {
				return this.#_unpacker(window.localStorage.getItem(key));
			}
		}
		return null;
	}

	static clear() {
		if (this.isStorageEnable) {
			window.localStorage.clear();
			return window.localStorage.length == 0;
		}
		return null;
	}

	static hasKey(key) {
		if (this.isStorageEnable) {
			return Object.keys(window.localStorage).includes(key);
		}
		return null;
	}

	static setCookie(key, value, expr=null) {
		if (this.isStorageEnable) {
			if (!expr) { expr = this.#_defaultExpr; }
			key = `cookie-${key}`;
			const now = new Date();
			const item = { value, expiry: now.getTime() + expr };
			window.localStorage.setItem(key, JSON.stringify(item));
			return this.hasKey(key);
		}
		return null;
	}

	static getCookie(key) {
		if (this.isStorageEnable) {
			key = `cookie-${key}`;
			const itemStr = window.localStorage.getItem(key);
			if (!itemStr) return null;
			const item = JSON.parse(itemStr);
			const now = new Date();
			if (now.getTime() > item.expiry) {
				window.localStorage.removeItem(key);
				return null;
			}
			return item.value;
		}
		return null;
	}
}