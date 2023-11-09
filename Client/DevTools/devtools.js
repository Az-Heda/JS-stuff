class DevToolsInfo {
	// https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/workerStart
	static get pageInfo() {
		return JSON.parse(JSON.stringify(window.performance.getEntriesByType('navigation')));
	}

	static get getResources() {
		const resources = window.performance.getEntriesByType('resource');
		if (resources) {
			const rs = JSON.parse(JSON.stringify(resources));
			const handShake = [
				...rs.map((item) => {
					return {
						url: item.name,
						size: item.decodedBodySize,
						duration: item.duration,
						entryType: item.entryType,
						type: item.initiatorType,
						protocol: item.nextHopProtocol,
						HTTPCode: item.responseStatus,
						timing: {
							startFetching: item.fetchStart,
							connection: item.connectEnd - item.connectStart,
							domainLookup: item.domainLookupEnd - item.domainLookupStart,
							response: item.responseEnd - item.responseStart,
							description: {
								startFetching: 'milliseconds between the loading of the page and the resource response with all of the bytes',
								connection: 'Time needed to establish a response with the server',
								domainLookup: 'Time needed to the server to lookup the domain',
								response: 'Time needed to receive all of the bytes of the request',
							}
						},
					}
				})
			]
			return handShake;
		}
		return resources;
	}

	static get sizeUsed() {
		const perf = window.performance.memory;
		return {
			'jsHeapSizeLimit': { sizeRaw: perf.jsHeapSizeLimit, size: this.#_formatBytes(perf.jsHeapSizeLimit), desc: 'The maximum size of the heap that is available to the context' },
			'totalJSHeapSize': { sizeRaw: perf.totalJSHeapSize, size: this.#_formatBytes(perf.totalJSHeapSize), desc: 'The total allocated heap size' },
			'usedJSHeapSize': { sizeRaw: perf.usedJSHeapSize, size: this.#_formatBytes(perf.usedJSHeapSize), desc: 'The currently active segment of JS heap' },
		}
	}

	static get timing() {
		return Object.assign({}, ...Object.entries(window.performance.timing.toJSON()).map((i) => { return { [i[0]]: new Date(i[1]).toISOString().substr(11, 12) } }))
	}

	/**
	 * @param {*} parse 
	 * @returns {int|string}
	 */
	static timeConnected(parse=false) {
		return [
			performance.now(),
			new Date(performance.now()).toISOString().substr(11,12)
		][(parse) ? 1 : 0];
	}

	/**
	 * @param {int} bytes 
	 * @param {int} decimals 
	 * @returns {string}
	 */
	static #_formatBytes (bytes, decimals=2) {
		if (!+bytes) return '0 Bytes';
		const k = 1024;
		const dm = (decimals < 0) ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
	}
}


function sum(a, b) {
	return a + b;
}

async function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms, ms);
	})
}

const MySum = new Proxy(sleep, {
	apply(MyCustomFunction, that, args) {
		const result = Reflect.apply(MyCustomFunction, that, args);
		result.then((ms) => { console.log(`Ho aspettato`, { ms }) })
		return result;
	}
});