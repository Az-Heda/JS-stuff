class MySpeechRecognition {
	/**
	 * @param {string} l Language for the initialization
	 * @returns {MySpeechRecognition}
	 */
	constructor(l) {
		this.callbacks = [];
		this.srf = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (this.srf) {
			this.sr = new this.srf()
			this.sr.continuous = false;
			this.sr.lang = this.#_getLanguage(l);
			this.sr.interimResults = false;
			this.sr.maxAlternatives = 1;

			this.sr.onresult = (evt) => {
				this.callbacks.forEach((c) => { c(evt); });
			}
		}
		else {
			throw new Error('Speech Recognition is not enabled on your device');
		}
	}

	/**
	 * @param {...function} ...callback Set all of the callbacks to call once the the SpeechRecognition has a result
	 */
	addCallback(...callback) {
		callback.forEach((cb) => {
			if (typeof cb === 'function') {
				this.callbacks.push(cb);
			}
		});
	}

	/**
	 * Start the Speech Recognition 
	 */
	start() {
		this.sr.start();
	}

	/**
	 * @returns {Array<string>} List of supported languages
	 */
	static getSupportedLanguages() {
		return [ 'italiano', 'english' ];
	}

	#_getLanguage(l=null) {
		if (l === null) { l = 'english' }
		switch(l) {
			case 'italiano':
				return 'it-IT';
			case 'english':
				return 'en-EN';
			default:
				throw new Error(`Language "${l}" is not supported yet`);
		}
	}
}