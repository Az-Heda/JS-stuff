class Logger {
	static #_status = {
		'default': { bg: '#C084FC', color: '#000000' }
	};
	static #_level = 0

	// static default(text, lv = 1) {
	// 	if (lv <= this.#_level) return;
	// 	console.log(`%cLogger.${this.#_prepareName('default', false)} - ${this.#_getDate()}`, this.#_getStyles('#C084FC', '#000000'), text);
	// }

	static basicSetup() {
		this.add('info', '#3b82f6');
		this.add('success', '#a3e635');
		this.add('warning', '#facc15');
		this.add('error', '#ef4444');
		this.add('LBlue', '#8be9fd');
		this.add('pink', '#ff79c6');
		this.add('Cyan', '#10b981');
		this.add('purple', '#C084FC');
	}

	static add(name, bg, color = '#000000') {
		if (!this.validateColor(bg)) throw new Error(`BG color is not valid`);
		if (!this.validateColor(color)) throw new Error(`BG color is not valid`);
		this.#_status[name] = { bg, color };
		Object.defineProperty(this, this.#_prepareName(name, false), {
			value: (text, lv = 1) => {
				if (lv <= this.#_level) return;
				console.log(`%cLogger.${this.#_prepareName(name, true)} - ${this.#_getDate()}`, this.#_getStyles(bg, color), text);
			},
			// writable: false,
			// configurable: false,
		})
	}

	static #_getDate() {
		let d = new Date();
		let h = d.getHours().toString().padStart(2, 0);
		let m = d.getMinutes().toString().padStart(2, 0);
		let s = d.getSeconds().toString().padStart(2, 0);
		let ms = d.getMilliseconds().toString().padStart(3, 0);
		return `${h}:${m}:${s}.${ms}`;
	}

	static #_prepareName(name, pad=false) {
		let maxLength = (!pad) ? name.length : Object.keys(this.status).reduce((n, o) => Math.max(n, o.length), 0);
		return (name.substr(0, 1).toUpperCase() + name.substr(1).toLowerCase()).padEnd(maxLength, ' ');
	}

	static #_getStyles(bg, color) {
		if (!this.validateColor(bg)) throw new Error(`BG color is not valid`);
		if (!this.validateColor(color)) throw new Error(`BG color is not valid`);
		return Object.entries({
			'padding': '5px 20px',
			'line-height': '100%',
			'font-weight': 'bold',
			'background-color': bg,
			'color': color,
		}).map(i => i.join(':')).join('; ')
	}

	static validateColor(hex) {
		hex = hex.replace('#', '');
		return (hex.length == 3 || hex.length == 6);
	}

	static get status() {
		return this.#_status;
	}

	static get level() {
		return this.#_level;
	}

	static set level(lv) {
		if (typeof +lv == 'number' && !window.isNaN(+lv)) {
			this.#_level = +lv;
		}
		return this.#_level;
	}
}
