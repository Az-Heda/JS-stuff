class Notify {
	static #_isLoggerEnabled = true;
	static #_status = 2;
	static #_level = 0;
	static #_loggerStatus = {
		'info': { bg: '#3b82f6', color: '#000000' },
		'success': { bg: '#a3e635', color: '#000000' },
		'warning': { bg: '#facc15', color: '#000000' },
		'error': { bg: '#ef4444', color: '#000000' },
		'primary': { bg: '#C084FC', color: '#000000' },
	};

	/**
	 * Ask for permission to write notifications to the user
	 * @returns 
	 */
	static async permission() {
		return new Promise((resolve, reject) => {
			// if (!this.isEnabled) throw new Error('Notifications are not enabled')
			if (this.isEnabled) {
				const handlePermission = (p) => {
					this.#_status = 1;
					switch (p) {
						case 'granted':
							this.#_status = 0;
							resolve('Notification\'s are allowed');
							break;
						case 'denied':
							reject('Notifications\'s are denied');
							break;
						default:
							reject('Unknow notification\'s permission status');
							break;
					}
				}
				Notification.requestPermission().then(handlePermission).catch(() => { reject('Cannot ask for permission') });
			}
			else {
				this.#_status = 2;
				reject('Notifications are not allowed');
			}
		})
	}

	/**
	 * @param {string} title Title of the notification
	 * @param {string} text Text of the notification
	 * @param {{onclick: Function|undefined, onclose: Function|undefined, onshow: Function|undefined, onerror: Function|undefiend}} cbs Some callback to be called in the notification stages
	 * @param {{ image: string, silent: boolean }} options Some options to give the user a better experience
	 * @returns {Notification}
	 */
	static send(title, text, cbs = {}, options = {}) {
		console.log({ status: this.#_status });
		if (this.#_status !== 0) return this.logger('Permission error, cannot send a notification', 'error', 2);

		const n = new Notification(title, {
			body: text,
			image: options?.image,
			silent: (options?.silent !== undefined) ? options?.silent : true
		})

		n.onclick = () => {
			this.logger('Notification cliccked', 'info', 0);
			if (Object.keys(cbs).includes('onclick')) cbs.onclick();
		}

		n.onclose = () => {
			this.logger('Notification closed', 'info', 0);
			if (Object.keys(cbs).includes('onclose')) cbs.onclose();
		}

		n.onshow = () => {
			this.logger('Notification sent', 'info', 0);
			if (Object.keys(cbs).includes('onshow')) cbs.onshow();
		}

		n.onerror = () => {
			this.logger('Notification error', 'error', 1);
			if (Object.keys(cbs).includes('onerror')) cbs.onerror();
		}
		return n;
	}

	/**
	 * @param {string} text Text to write on console
	 * @param {string} status Status type for the error
	 * @param {Number} lv Error level, this will ignore the log message if the level is higher than the current level
	 */
	static logger(text, status, lv = 1) {
		if (!this.#_isLoggerEnabled) return;
		if (lv < this.#_level) return;
		if (!Object.keys(this.#_loggerStatus).includes(status)) return;

		const styles = Object.entries({
			'padding': '2px 10px',
			'line-height': '100%',
			'font-weight': 'bold',
			'background-color': this.#_loggerStatus[status].bg,
			'color': this.#_loggerStatus[status].color,
		}).map(i => i.join(':')).join('; ')

		console.log(`%cNotify_Logger_${status.toUpperCase()}`, styles, text)
	}


	/**
	 * @param {string} name Name of the new status for the logger
	 * @param {string} bg HEX of the background color
	 * @param {string} color HEX of the text color
	 */
	static addStatusToLogger(name, bg, color) {
		this.#_loggerStatus[name] = { bg, color };
	}

	static get status() {
		return [
			'Allowed',
			'Denied',
			'Not allowed',
		][this.#_status];
	}

	static get isEnabled() {
		return 'Notification' in window;
	}

	static get level() {
		return this.#_level;
	}

	static set level(newLevel) {
		if (typeof +newLevel == 'number' && !window.isNaN(+newLevel)) {
			this.#_level = +newLevel;
		}
		return this.#_level;
	}
}


window.addEventListener('load', async () => {
	await Notify.permission()
	// .then((m) => Notify.logger(m, 'success', 1))
	// .catch((e) => Notify.logger(e, 'error', 1));

	// setTimeout(() => {
	// 	Notify.send('Notification title', 'Notification body', {
	// 		onclick: () => { console.log('Chiamata onclick') },
	// 		onclose: () => { console.log('Chiamata onclose') },
	// 		onshow: () => { console.log('Chiamata onshow') },
	// 		onerror: () => { console.log('Chiamata onerror') },
	// 	}, {
	// 		silent: true
	// 	})
	// }, 3000)
});