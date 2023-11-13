class CheckTime {
	static #_t1 = null;
	static #_t2 = null;

	/**
	 * @returns {null | int} Returns the timestamp difference between each of this functions calls (first time returns null)
	 * 
	 * __Usage__
	 * ```js
	 * CheckTime.record();
	 * // Some code
	 * console.log(CheckTime.record());
	 * >>> <int>
	 * ```
	 */
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

	/**
	 * @param {int} ms milliseconds to convert into HH:MM:SS.FFF
	 * @returns {string | null} Returns the time formatted
	 * 
	 * __Usage__
	 * ```js
	 * console.log(CheckTime.parse(57500000));
	 * >>> 15:58:20.000
	 * ```
	 */
	static parse(ms) {
		if (ms) {
			return new Date(ms).toISOString().substr(11, 12)
		}
		return null;
	}
}