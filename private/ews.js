const express = require('express');
const cors = require('cors');

const ctx = (() => {
	let archive = {
		permission: {
			addWithHas: true
		}
	}

	return new Proxy(archive, {
		get(target, key) { // ctx.<key>
			return (Object.keys(target).includes(key)) ? target[key] : undefined;
		},
		set(target, key, value) { // ctx.<key> = <value>
			if (!key.startsWith('#_')) {
				target[key] = value;
			}
			return target[key] == value;
		},
		has(target, key) { // <variable> in ctx
			if (this.target.permission.addWithHas && key.constructor.name === 'Array' && key.length == 2) {
				target[key[0]] = key[1];
			}
			return Object.keys(target).includes(key);
		},
		ownKeys(target) { // Object.keys(ctx) || Object.getOwnPropertyNames(ctx)
			return Object.keys(target);
		}
	})
})();


class ews {
	#_functions = {};
	#_serverStarted = false;

	constructor(host, port) {
		['#_host', host] in ctx;
		this.#_readonly('host', host);
		this.#_readonly('port', port);

		this.#_readonly('app', express());
		this.#_readonly('server', this.app.listen(this.port, this.host, this.logger))
		
		this.#_init();
	}


	route(path, methods, callback) {
		if (methods.constructor.name === 'String') {
			methods = [methods];
		}
		methods = methods.map(m => m.toLowerCase());

		for (const method of methods) {
			if (['get', 'post'].includes(method)) {
				this.app[method](path, (req, res) => { callback(req, res, ctx) });
			}
		}
	}

	#_init() {
		for (const [fname, fbody] of Object.entries(this.#_functions)) {
			this.#_readonly(fname, fbody);
		}
	}

	#_readonly(name, value, cb=null) {
		Object.defineProperty(this, name, {
			value,
			writable: false,
			configurable: false,
		});
		if (typeof cb === 'function') {
			cb(this[name]);
		}
	}

	get started() { return this.#_serverStarted }
}
