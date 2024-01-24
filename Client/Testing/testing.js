class Testing {
	static failure(title, message) {
		return this.logger('error', title, message);
	}

	static success(title, message) {
		return this.logger('success', title, message);
	}

	static warning(title, message) {
		return this.logger('warning', title, message);
	}

	static info(title, message) {
		return this.logger('info', title, message);
	}

	static assert(condition, title) {
		if (condition) return this.success(title, 'prova');
		return this.failure(title, 'Assert failed');
	}

	static assertEqual(actual, expected, title) {
		if (actual == expected) return this.success(title);
		if (JSON.stringify(actual) == JSON.stringify(expected)) return this.success(title);
		return this.failure(title, `Assert failed: \`${actual}\` is not equal to \`${expected}\``);
	}

	static assertNotEqual(actual, expected, title) {
		if (actual == expected) return this.failure(title, `Assert failed: \`${actual}\` is equal to \`${expected}\``);
		if (JSON.stringify(actual) == JSON.stringify(expected)) return this.failure(title);
		return this.success(title);
	}

	static assertLess(actual, expected, title) {
		if (actual < expected) return this.success(title);
		return this.failure(title, `Assert failed: \`${actual}\` is higher or equal to \`${expected}\``);
	}

	static assertLessThan(actual, expected, title) {
		if (actual <= expected) return this.success(title);
		return this.failure(title, `Assert failed: \`${actual}\` is higher than \`${expected}\``);
	}

	static assertGreater(actual, expected, title) {
		if (actual > expected) return this.success(title);
		return this.failure(title, `Assert failed: \`${actual}\` is lower or equal to \`${expected}\``);
	}

	static assertGreaterThan(actual, expected, title) {
		if (actual >= expected) return this.success(title);
		return this.failure(title, `Assert failed: \`${actual}\` is lower than \`${expected}\``);
	}

	static contains(array, value, title) {
		if (!Array.isArray(array)) return this.failure(title, `Assert failed: \`${array}\` is not an array`);
		if (array.includes(value)) return this.success(title);
		return this.failure(title, `Assert failed: Array of ${array.length} elements does not inclue \`${value}\``);
	}

	static pattern(pattern, string, title) {
		// TODO this funciton
		if (pattern.exec(string) !== null) return this.success(title);
		return this.failure(title, `Pattern "${pattern}" failed for string: "${string}"`);
	}

	static benchmark(title, fn, thisArgs = null, ...args) {
		let times = [10, 100, 1000, 10000, 100000, 1000000];
		for (let t of times) {
			let start = performance.now();
			fn.apply(thisArgs, args);
			let end = performance.now();
			this.success(`${title}: Time needed for ${t.toLocaleString()} cycles: ${end - start}ms`);
		}
	}


	/*******************************/


	static logger(status, title, message) {
		let colorsForClient = {
			error: '#ef4444',
			success: '#a3e635',
			warning: '#facc15',
			info: '#60a5fa'
		}
		let colorsForServer = {
			// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
			error: `\x1b[1m\x1b[31m [{$}] \x1b[0m`,
			warning: '\x1b[1m\x1b[33m [{$}] \x1b[0m',
			success: '\x1b[1m\x1b[32m [{$}] \x1b[0m',
			info: '\x1b[1m\x1b[36m [{$}] \x1b[0m',
		}

		let text = title + ((message) ? `\n\t${message}` : '');
		if (typeof window !== 'undefined') {
			if (Object.keys(colorsForClient).includes(status)) {
				let styles = Object.entries({
					'color': colorsForClient[status],
					'padding': '2px 10px',
					'font-weight': 'bold',
				}).map(i => i.join(': ')).join('; ');
				console.log(`%c[${status.toUpperCase()}]`, styles, text)
			}
		}
		else {
			if (Object.keys(colorsForServer).includes(status)) {
				console.log(`${colorsForServer[status].replace('{$}', status.toUpperCase())}`, text)
			}
		}
	}
}


if (typeof module !== 'undefined') {
	module.exports = Testing;
}

// Testing.logger('error', 'my error');
// Testing.logger('warning', 'my warning');
// Testing.logger('success', 'my success');
// Testing.logger('info', 'my info');

// let start = performance.now();
// let myArr = [...new Array(1e5).keys()].map(i => Math.random());
// console.log(`Array created in ${performance.now() - start}ms`)

// function sum(array) {
// 	let sum = array.reduce((o, i) => o * i, 1);
// 	return sum;
// }

// function molt(array) {
// 	return array.reduce((o, i) => o + i, 1);
// }

// Testing.benchmark('sum', sum, null, myArr)