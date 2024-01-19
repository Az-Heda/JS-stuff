class DevToolsInfo {
	// https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/workerStart
	/**
	 * @returns {object} Return some information about the page
	 * @data_structure
	 * 
	 * - url: string,
	 * - size: int,
	 * - duration: int,
	 * - entryType: int,
	 * - type: string,
	 * - protocol: string,
	 * - httpCode: int,
	 * - timing: {
	 * - - startFetching: int,
	 * - - connection: int,
	 * - - domainLookup: int,
	 * - - response: int,
	 * - - description: {
	 * - - - startFetching: string,
	 * - - - connection: string,
	 * - - - domainLookup: string,
	 * - - - response: string
	 * - - }
	 * - }
	 * }
	 */
	static get pageInfo() {
		const rs = JSON.parse(JSON.stringify(window.performance.getEntriesByType('navigation')))[0];
		return {
			url: rs.name,
			size: rs.decodedBodySize,
			duration: rs.duration,
			entryType: rs.entryType,
			type: rs.initiatorType,
			protocol: rs.nextHopProtocol,
			HTTPCode: rs.responseStatus,
			timing: {
				startFetching: rs.fetchStart,
				connection: rs.connectEnd - rs.connectStart,
				domainLookup: rs.domainLookupEnd - rs.domainLookupStart,
				response: rs.responseEnd - rs.responseStart,
				description: {
					startFetching: 'milliseconds between the loading of the page and the resource response with all of the bytes',
					connection: 'Time needed to establish a response with the server',
					domainLookup: 'Time needed to the server to lookup the domain',
					response: 'Time needed to receive all of the bytes of the request',
				}
			},
		}
	}

	/**
	 * @returns {Array<object>} Returns the informations about all of the requests sent by the page
	 * @data_structure
	 * 
	 * - url: string,
	 * - size: int,
	 * - duration: int,
	 * - entryType: int,
	 * - type: string,
	 * - protocol: string,
	 * - httpCode: int,
	 * - timing: {
	 * - - startFetching: int,
	 * - - connection: int,
	 * - - domainLookup: int,
	 * - - response: int,
	 * - - description: {
	 * - - - startFetching: string,
	 * - - - connection: string,
	 * - - - domainLookup: string,
	 * - - - response: string
	 * - - }
	 * - }
	 * }
	 */
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

	/**
	 * @no_docs
	 * @returns {{jsHeapSizeLimit: {}, totalJSHeapSize: {}, usedJSHeapSize: {}}}
	 */
	static get sizeUsed() {
		const perf = window.performance.memory;
		return {
			'jsHeapSizeLimit': { sizeRaw: perf.jsHeapSizeLimit, size: this.#_formatBytes(perf.jsHeapSizeLimit), desc: 'The maximum size of the heap that is available to the context' },
			'totalJSHeapSize': { sizeRaw: perf.totalJSHeapSize, size: this.#_formatBytes(perf.totalJSHeapSize), desc: 'The total allocated heap size' },
			'usedJSHeapSize': { sizeRaw: perf.usedJSHeapSize, size: this.#_formatBytes(perf.usedJSHeapSize), desc: 'The currently active segment of JS heap' },
		}
	}

	static get timing() {
		return Object.assign({}, ...Object.entries(window.performance.timing.toJSON())
			.map((i) => {
				return {
					[i[0]] : i[1]
				}
			})
		)
	}

	/**
	 * @param {boolean} parse Specify wheather you want this function to return an integer or a string formatted
	 * @returns {int | string} Returns the milliseconds or the time in HH:MM:SS.FFF since the last page reload
	 */
	static timeConnected(parse) {
		if (!parse) { parse = false; }
		return [
			performance.now(),
			new Date(performance.now()).toISOString().substr(11,12)
		][(parse) ? 1 : 0];
	}

	/**
	 * @no_docs
	 * @param {int} bytes Number of bytes to convert into KB, MB, GB etc
	 * @param {int} decimals How many decimal can have the output number
	 * @returns {string} Bytes converted into KB, MB, GB etc
	 */
	static #_formatBytes(bytes, decimals=2) {
		if (!+bytes) return '0 Bytes';
		const k = 1024;
		const dm = (decimals < 0) ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
	}
}