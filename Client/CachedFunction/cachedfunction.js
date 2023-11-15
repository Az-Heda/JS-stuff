class $CacheError extends Error {
	/**
	 * @param {string} message Error message to print on console
	 */
	constructor(message) {
		super(message);
		this.name = this.constructor.name.replace('$', '');
	}
}

class $InvalidParams extends Error {
	/**
	 * @param {string} message Error message to print on console
	 */
	constructor(message) {
		super(message);
		this.name = this.constructor.name.replace('$', '');
	}
}

class CachedFunction {
	/**
	 * @param {function} fn This function required at least 1 parameter
	 * @returns {function} function with the cache storing
	 */
	constructor(fn, debug=false) {
		let cache = new Map();
		return function(...args) {
			if (args.length == 0) throw new $CacheError('Cannot cache the function with the given parameters; 1 parameter is required');
			let key;
			try {
				let tmpArgs = args.map((item) => {
					let result = /HTML[a-zA-Z0-9]{1,}Element/.exec(item.constructor.name);
					if (result !== null) {
						item = item.constructor.name+item.innerHTML;
					}
					return JSON.stringify(item)
				});
				key = JSON.stringify(tmpArgs);
				if (cache.has(key)) return cache.get(key);
			} catch {
				throw new $InvalidParams('Got an unexpected error while handling the parameters...')
			}
			
			let res = fn.call(this, ...args);
			cache.set(key, res);
			if (debug) console.log(cache);
			return res;
		}
	}	
}
