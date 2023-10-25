class CheckTime {
	static #_t1 = null;
	static #_t2 = null;

	static record() {
		if (this.#_t1 == null) {
			this.#_t1 = new Date();
			return null;
		}
		if (this.#_t2 == null) {
			this.#_t2 = new Date();
			return this.#_calculate();
		}
	}

	static #_calculate() {
		let t1 = this.#_t1.getTime();
		let t2 = this.#_t2.getTime();
		this.#_t1 = null;
		this.#_t2 = null;
		return t2 - t1;
	}

	static parse(ms) {
		if (ms) {
			return new Date(ms).toISOString().substr(11, 12)
		}
		return null;
	}
}