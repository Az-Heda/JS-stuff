class MySpeechRecognition {
	constructor(l=null) {
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

	addCallback(...callback) {
		callback.forEach((cb) => {
			if (typeof cb === 'function') {
				this.callbacks.push(cb);
			}
		});
	}

	start() {
		this.sr.start();
	}

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