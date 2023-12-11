const expressListEndpoints = require('express-list-endpoints');
const express = require('express');
const cors = require('cors');
const colors = require('colors');
const vhost = require('vhost'); // https://expressjs.com/en/resources/middleware/vhost.html

colors.enable();

const ctx = (() => {
	let archive = {
		$default: {
			showLog: true,
			logLevel: 100,
			fpathMaxFunctionCount: 2,
			fpathJoinCharacter: '>',
		},
		$permission: {
			addWithHas: true
		},
	}
	return new Proxy(archive, {
		get(target, key) { // ctx.<key> | ctx['<key>']
			return (Object.keys(target).includes(key)) ? target[key] : undefined;
		},
		set(target, key, value) { // ctx.<key> = <value>
			if (!key.startsWith('$')) {
				target[key] = value;
				console.log('Added')
			}
			return Object.keys(target).includes(key);
		},
		has(target, key) { // <variable> in ctx
			try {
				let tempList = JSON.parse(key.replace(new RegExp('(?<key>[a-zA-Z1-9]{1,}),(?<value>[a-zA-Z1-9]{1,})'), '["$<key>", "$<value>"]'));
					if (target.$permission.addWithHas && tempList.length == 2) {
						let [k, v] = tempList;
						target[`$_${k}`] = v;
						return Object.keys(target).includes(k);
					}
			} catch {}
			return Object.keys(target).includes(key);
		},
		ownKeys(target) { // Object.keys(ctx) || Object.getOwnPropertyNames(ctx)
			return Object.keys(target);
		},
		deleteProperty(_, k) {
			return !k.startsWith('$')
		},
	})
})();


class ews {
	#_functions = {};
	#_serverStarted = false;
	#_endpointlist = [];

	constructor(host, port) {
		['host', host] in ctx;
		['port', port] in ctx;
		this.#_readonly('url', `http://${host}:${port}`);
		this.#_readonly('$_host', host);
		this.#_readonly('$_port', port);

		// this.#_readonly('app', express());
		this.app = { default: express() };
		this.app.default.use(cors());
				
		this.#_init();
	}

	async start() {
		// this.route('/*', ['get', 'post'], (_, res) => { res.send('Page not found')});
		let host = this.$_host;
		let port = this.$_port;
		let startFunction = () => {
			this.#_readonly('server', this.app.default.listen(port, host, () => {
				this.#_serverStarted = true;
			}))
		}
		startFunction.apply(this, startFunction);
		this.#_getFPath();
	}


	route(path, methods, callback, subdomain=null, customLoggerTitle='Routing') {
		if (methods.constructor.name === 'String') {
			methods = [methods];
		}
		methods = methods.map(m => m.toLowerCase());

		for (const method of methods) {
			if (['get', 'post'].includes(method)) {
				this.#_endpointlist.push({method, path});
				this.app[(subdomain !== null && Object.keys(this.app).includes(subdomain)) ? subdomain : 'default'][method](path, (req, res) => {
					this.#_writeLog(`Code ${res.statusCode}: ${req.vhost.host+req.url}`, '', 1, 2)
					callback(req, res, ctx)
				});
				this.#_writeLog(customLoggerTitle, `[${method.toUpperCase().brightBlue}] ${this.url+path}`, this.#_getFPath(), 1)
			}
		}
	}

	routeStatic(url, path) {
		for (let m of ['GET']) {
			this.#_writeLog('Static', `[${m.brightBlue}] ${this.url+url+'/<filename>'}`, this.#_getFPath(), 1);
		}
		this.app.default.use(url, express.static(path))
	}

	redirect(from, to, methods=['get']) {
		let f = (req, res) => { res.redirect(307, to) };
		this.route(from, methods, f, null, 'Redirect');
	}

	addSubdomain(subdmn) {
		// this.app.push(express());
		this.app[subdmn] = express();
		this.#_writeLog('Subdomain', `Subdomain open at "${`http:${subdmn}`.brightBlue}:${this.$_port}"`, this.#_getFPath(), 2)
		this.app.default.use(vhost(subdmn, this.app[subdmn]));
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

	#_getFPath() {
		let e = new Error('init fpath').stack;
		e = e.split('\n');
		e.shift();
		e = e
		.map((i) => { return i.trim().split(' ') })
		.filter((i) => { return i.length === 3; })
		.map((i) => {
			i.shift();
			return i;
		})
		.filter((i) => { return !i[1].startsWith('(node:') })
		.filter((_, i) => { return i > 0 })
		.map((i) => {
			i[0] = i[0].replaceAll('.<anonymous>', '');
			i[1] = i[1].replace(/\((.*):(\d+):(\d+)\)/g, '$1|$2|$3').split('|')[1]
			return i.join(':');
		});
		
		if (e.length < ctx.$default.fpathMaxFunctionCount) {
			return e.reverse().join(ctx.$default.fpathJoinCharacter);
		}
		return e.splice(0, ctx.$default.fpathMaxFunctionCount).reverse().join(ctx.$default.fpathJoinCharacter)
	}

	#_writeLog(title, text, fn=null, currentLogLevel=0) {
		if (ctx.$default.showLog) {
			let dt = new Date(Date.now());
			let parts = [
				`${dt.getHours()}`.padStart(2, 0),
				`${dt.getMinutes()}`.padStart(2, 0),
				`${dt.getSeconds()}`.padStart(2, 0) + '.' + `${dt.getMilliseconds()}`.padStart(2, 0),
			];
			let ct = parts.join(':');
			let titleText = `[${this.constructor.name.brightYellow}:${title.brightRed}`;
			if (fn === null) {
				fn = this.#_getFPath();
			}
			if (typeof fn == 'string') {
				titleText += ` | ${`${fn}()`.brightGreen}`
			}
			titleText += ` | ${ct.brightCyan}] `;
			if (ctx.$default.logLevel >= currentLogLevel) {
				console.log(titleText + text)
			}
		}
	}

	get started() { return this.#_serverStarted }
	get endpoints() { return this.#_endpointlist };
}

// module.exports = ews;

let s = new ews('127.0.0.1', 80);
// console.log(s.server)
s.addSubdomain('api.localhost');
s.addSubdomain('test.localhost');
s.addSubdomain('admin.localhost');
s.addSubdomain('docs.localhost');
s.routeStatic('/static', '../../Client/');
s.redirect('/redirect', '/page', ['get']);
s.route('/', 'get', (req, res) => { res.send('Page 1') })
s.route('/page', 'get', (req, res) => { res.send('Page 2') })
s.route(/(page-[0-9]{1,2}\/*)/, ['get', 'post'], (req, res) => { res.send('Page idk') }, 'test.localhost')
s.route('/admin', 'get', (req, res) => { res.send('Hi admin') }, 'admin.localhost');
s.start();
