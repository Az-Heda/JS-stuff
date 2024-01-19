

class Signal {
	static #_flag_Added =   'A';
	static #_flag_Changed = 'C';
	static #_flag_Deleted = 'D';

	constructor(...callbacks) {
		callbacks = callbacks.filter(i => typeof i == 'function');
		let _v = {};
		return new Proxy(_v, this.#_handler(callbacks));
	}

	#_handler(callbacks) {
		const flags = this.constructor.flags;
		let privateChar = '$';
		return {
			get(target, key) {
				let tempTarget = Object.keys(target).filter(i => !i.startsWith(privateChar));
				if (tempTarget.includes(key)) {
					return target[key];
				}
				return undefined;
			},
			set(target, key, value) {
				if (!key.startsWith(privateChar)) {
					let exists = Object.keys(target).includes(key);
					target[key] = value;
					for (const cb of callbacks) {
						cb(key, value, (!exists) ? Object.keys(flags)[0] : Object.keys(flags)[1]);
					}
				}
				return undefined;
			},
			deleteProperty(target, key) {
				if (Object.keys(target).includes(key) && !key.startsWith(privateChar)) {
					cbdata = [];
					for (const cb of callbacks) {
						cddata.push(cb(key, target[key], Object.keys(flags)[2]))
					}
					return cbdata;
				}
				return false;
			},
			has(target, key) {
				return Object.keys(target).filter(i => !i.startsWith(privateChar)).includes(key);
			},
			ownKeys: (target) => {
				let keys = Object.entries(target);
				return keys.map(i => i[0]);
			},
		}
	}

	static get flags() {
		return {
			[this.#_flag_Added]  : 'Added',
			[this.#_flag_Changed]: 'Changed',
			[this.#_flag_Deleted]: 'Deleted',
		}
	}
}