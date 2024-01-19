class RandomNumberGenerator {
	#_fobject = {};
	/**
	 * @param {Number} seed Number to set the seed, if omitted, it's generated randomly
	 */
	constructor(seed) {
		if (seed !== undefined && typeof seed !== 'number') {
			throw new Error(`Seed must be a number; received: "${seed.constructor.name}"`);
		}
		Object.defineProperty(this, 'a', { writable: false, configurable: false, value: 1103515245 });
		Object.defineProperty(this, 'c', { writable: false, configurable: false, value: 12345      });
		Object.defineProperty(this, 'm', { writable: false, configurable: false, value: 0x80000000 });

		let state = (seed) ? seed : Math.floor(Math.random() * (this.m - 1));
		this.state = state;

		Object.defineProperty(this, 'seed', { writable: false, configurable: false, value: state });

		this.#_fobject = {
			'nextInt': () => {
				this.state = (this.a * this.state + this.c) % this.m;
				return this.state;
			},
			'nextFloat': () => {
				return this.nextInt() / (this.m - 1);
			},
			'nextRange': (start, end) => {
				start = Math.min(start, end)
				end = Math.max(start, end)
				let rangeSize = end - start;
				let randomUnder1 = this.nextInt() / this.m;
				return start + Math.floor(randomUnder1 * rangeSize);
			},
			'color': () => {
				return '#' + [...new Array(6).fill(0)].map(() => { return this.nextRange(0, 16).toString(16) }).join('').toUpperCase();
			},
			'choice': (array) => {
				return array[this.nextRange(0, array.length)];
			}
		}

		for (let [fname, fbody] of Object.entries(this.#_fobject)) {
			Object.defineProperty(this, fname, {
				value: fbody,
				writable: false,
				configurable: false,
			})
		}
	}

	/**
	 * @param {string} funcname Name of the function to call as a generator
	 * @param {...any} params 
	 * @generator
	 */
	*generator(funcname, ...params) {
		if (Object.keys(this.#_fobject).includes(funcname)) {
			while (true) {
				yield this[funcname](...params);
			}
		}
	}
}