const expressListEndpoints = require('express-list-endpoints');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const colors = require('colors');
const vhost = require('vhost'); // https://expressjs.com/en/resources/middleware/vhost.html
const fs = require('fs');
const socket = require('socket.io');
const PATH = require('path');

colors.enable();

class CallbackNotValid extends Error {
	/**
	 * @description Throw an Error that means you miss some function parameters
	 * @param {string} message Error message to show
	 */
	constructor(message) {
		super();
		this.name = this.constructor.name;
		this.message = message;
	}
}

class PathNotValid extends Error {
	/**
	 * @description Throw an Error that means you miss some function parameters
	 * @param {string} message Error message to show
	 */
	constructor(message) {
		super();
		this.name = this.constructor.name;
		this.message = message;
	}
}

class NotExistingSubdomains extends Error {
	/**
	 * @description Throw an Error that means you miss some function parameters
	 * @param {string} message Error message to show
	 */
	constructor(message) {
		super();
		this.name = this.constructor.name;
		this.message = message;
	}
}

class MissingParameters extends Error {
	/**
	 * @description Throw an Error that means you miss some function parameters
	 * @param {string} message Error message to show
	 */
	constructor(message) {
		super();
		this.name = this.constructor.name;
		this.message = message;
	}
}

class SocketError extends Error {
	/**
	 * @description Throw an Error that means you miss some function parameters
	 * @param {string} message Error message to show
	 */
	constructor(message) {
		super();
		this.name = this.constructor.name;
		this.message = message;
	}
}

class UnknownError extends Error {
	/**
	 * @description Throw an Error that means you miss some function parameters
	 * @param {string} message Error message to show
	 */
	constructor(message) {
		super();
		this.name = this.constructor.name;
		this.message = message;
	}
}

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
			} catch { }
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
	#_docs = [];
	#_enableSockets = [false, null];


	/**
	 * @description Initialize the class using the HOST and PORT given
	 * @param {string} host Host of the server
	 * @param {int} port Port number
	 */
	constructor(host, port) {
		if (host === null || host === undefined) throw new MissingParameters(`"host" is missnig`)
		if (port === null || port === undefined) throw new MissingParameters(`"port" is missnig`)

		['host', host] in ctx;
		['port', port] in ctx;
		this.#_readonly('url', `http://${host}:${port}`);
		this.#_readonly('$_host', host);
		this.#_readonly('$_port', port);

		// this.#_readonly('app', express());
		this.app = { default: express() };
		this.app.default.use(cors({ origin: '*' }));
		this.app.default.use(bodyParser.urlencoded({ extended: true }))
		// this.#_docs = this.#_getDocs();
		this.docsdomain = `admin.localhost`;
		this.#_init();
	}

	/**
	 * @description Starts the Web Server
	 */
	async start() {
		return new Promise(resolve => {
			// this.route('/*', ['get', 'post'], (_, res) => { res.send('Page not found')});
			let host = this.$_host;
			let port = this.$_port;

			let startFunction = () => {
				this.#_readonly('server', this.app.default.listen(port, host, () => {
					this.#_serverStarted = true;
				}))
				if (this.#_enableSockets[0]) {
					this.#_startSockets(...structuredClone(this.#_enableSockets).splice(1))
					resolve(this.#_serverStarted);
				} else {
					resolve(this.#_serverStarted);
				}
			}
			startFunction.apply(this, startFunction);
		});
	}

	/**
	 * @description Setup a route to a specific url, with the given methods and, eventually, link it to a specific subdomain
	 * @param {string} path Url to bind to a specific callback
	 * @param {string | array<string>} methods Methods allowed for this bind.
	 * Supported methods: 
	 * - GET
	 * - POST
	 * @param {Function | array<Function>} callback Function or functions to use as a callback/middleware
	 * 
	 * If 2 functions are passed, the first one is the middleware, and the second one is the callback
	 * @param {string | null} subdomain Subdomain to build the Url path, if omitted, the path will be mounted on the main app
	 * @param {string} customLoggerTitle Name used by the logger
	 * 
	 * @httpcode 200 is the default status code, can be changed in the callback function
	 * @httpcode any if set when you're sending the response
	 */
	route(path, methods, callback, subdomain = null, customLoggerTitle = 'Routing') {
		if (methods.constructor.name === 'String') {
			methods = [methods];
		}
		methods = methods.map(m => m.toLowerCase());
		for (const method of methods) {
			if (['get', 'post'].includes(method)) {
				this.#_endpointlist.push({ method, path });
				let middleware = (req, res, next) => { callback(req, res, next, ctx, this.#_paramParser(req)) }
				let mainFunction = (req, res) => {
					this.#_writeLog(`Code ${res.statusCode}: ${(req?.vhost?.host || this.url) + req.url}`, '', 1, 2)
					callback(req, res, ctx, this.#_paramParser(req));
				}
				switch (callback.constructor.name) {
					case 'Array':
						if (callback.length == 2) {
							this.app[this.#_getSubdomain(subdomain)][method](path, ...[middleware, mainFunction]);
						}
						else {
							throw new CallbackNotValid('Callback parameters not valid, must be a Function or an Array with 2 Functions in it')
						}
						break;
					case 'Function':
						this.app[this.#_getSubdomain(subdomain)][method](path, mainFunction);
						break;
					default:
						break;
				}
				this.#_writeLog(customLoggerTitle, `[${method.toUpperCase().brightBlue}] ${((subdomain == null) ? this.url : subdomain) + path}`, this.#_getFPath(), 1)
			}
		}
	}

	/**
	 * @description Link a folder to an url, so you can access all of the files
	 * @param {string} url Url to link the choosen folder
	 * @param {string} path path of the directory to serve as static
	 * @param {string | null} subdomain Subdomain to build the Url path, if omitted, the path will be mounted on the main app
	 * @httpcode 200 If the requested file is found
	 * @httpcode 404 If the requested file doesn't exists
	 */
	routeStatic(url, path, subdomain = null) {
		for (let m of ['GET']) {
			this.#_writeLog('Static', `[${m.brightBlue}] ${((subdomain === null) ? this.url : 'http://' + subdomain) + url + '/<filename>'}`, this.#_getFPath(), 1);
		}
		if (!fs.existsSync(path)) throw new PathNotValid(`"${path}" is not a valid path`);
		this.app[this.#_getSubdomain(subdomain)].use(url, express.static(path))
	}

	/**
	 * @description Create an endpoint used only for redirecting the user to another url
	 * @param {string} from Url to set as a redirect endpoint
	 * @param {string} to Url to be redirected once visited the `from` url
	  * @param {string | array<string>} methods Methods allowed for this bind.
	 * Supported methods: 
	 * - GET
	 * - POST
	 * @param {string | null} subdomain Subdomain to build the Url path, if omitted, the path will be mounted on the main app
	 * @httpcode 307 The `from` url will give you HTTP Code 307  
	 */
	redirect(from, to, methods = ['get'], subdomain = null) {
		let f = (req, res) => { res.redirect(307, to) };
		this.route(from, methods, f, null, 'Redirect', subdomain);
	}

	/**
	 * @description Add a subdomain to the server, so you can divide the endpoints into various subdomains, you access a subdomain by going a the url: <subdomain>.localhost/<endpoint>
	 * @param {string} subdmn Name of the subdomain to set
	 * 
	 * __Examples__
	 * - api.localhost
	 * - website.localhost
	 */
	addSubdomain(subdmn) {
		this.app[subdmn] = express();
		this.#_writeLog('Subdomain', `Subdomain open at "${`${`http:${subdmn}`}:${this.$_port}`.brightBlue}"`, this.#_getFPath(), 2)
		this.app.default.use(vhost(subdmn, this.app[subdmn]));
	}

	/**
	 * @description Enable Socket.IO Connection.
	 * @description: To import it, just copy & paste this: `<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>`
	 * @param {string} dir Directory that contains all of the message files
	 * @param {boolean} debugMessage Enable console logging
	 * @returns {boolean} Return true if socket are prepared correctly
	 */
	enableSocket(dir, debugMessage = false) {
		const basePath = PATH.join(require.main.path, dir);
		this.#_enableSockets = [true, basePath, debugMessage];
		return this.#_enableSockets[0];
	}

	#_init() {
		for (const [fname, fbody] of Object.entries(this.#_functions)) {
			this.#_readonly(fname, fbody);
		}
	}

	/**
	 * @no_docs
	 * @description Declare a READONLY variable with the given value, and, if needed, call a function passing the new variable
	 * @param {string} name Name of the variable to declare
	 * @param {any} value The value to assign to the READONLY variable
	 * @param {Function} cb Function to call when the value is set
	 */
	#_readonly(name, value, cb = null) {
		Object.defineProperty(this, name, {
			value,
			writable: false,
			configurable: false,
		});
		if (typeof cb === 'function') {
			cb(this[name]);
		}
	}

	/**
	 * @no_docs
	 * @description Allows you to search for the given subdomains in the currently active apps, if not found, this will thrown an NotExistingSubdomains Error
	 * @param {string} subdomain Name of the subdomain your're trying to access
	 * @returns {string} Name of the subdomain/main app
	 */
	#_getSubdomain(subdomain) {
		if (subdomain === null) return 'default';
		if (Object.keys(this.app).includes(subdomain)) {
			return subdomain;
		}
		throw new NotExistingSubdomains(`The subdomain ${subdomain} doesn't exists`);
	}

	/**
	 * @no_docs
	 * @description Enable Socket.IO Connection.
	 * @description: To import it, just copy & paste this: `<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>`
	 * @param {string} dir Directory that contains all of the message files
	 * @param {boolean} debugMessage Enable console logging
	 */
	#_startSockets(dir, debugMessage = false) {
		let io = new socket.Server(this.server, { cors: { origin: '*' } });
		io.on('connection', (sk) => {
			if ((!fs.existsSync(dir)) || fs.lstatSync(dir).isFile()) {
				throw new PathNotValid(`"${dir}" is not a valid path`);
			}
			if (debugMessage) {
				this.#_writeLog('Socket', `New connection with ID ${sk.id.brightMagenta}`, -1, 1);
			}

			fs.readdir(dir, (err, files) => {
				if (err) throw UnknownError(err);
				let fullFiles = files
					.filter((file) => { return file.split('.').at(-1).toLowerCase() == 'js'; })
					.map((i) => { return PATH.join(dir, i) });
				for (let i = 0; i < fullFiles.length; i++) {
					let basename = fullFiles[i].split('.');
					basename = [basename.pop(), basename.join('.')][1];
					let f = require(`./${basename}`);
					if (f.constructor.name == 'Function') {
						sk.on(basename.replaceAll('\\', '/').split('/').at(-1), (data) => {
							f({ socket: sk, io, ctx, data });
						})
					}
				}
			});
		});

		io.on('error', (err) => {
			throw new SocketError(err);
		});
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

	#_paramParser(req) {
		return {
			get: req?.query || {},
			post: req?.body || {},
			url: req?.params || {},
		}
	}

	#_writeLog(title, text, fn = null, currentLogLevel = 0) {
		if (ctx.$default.showLog) {
			let dt = new Date(Date.now());
			let parts = [
				`${dt.getHours()}`.padStart(2, 0),
				`${dt.getMinutes()}`.padStart(2, 0),
				`${dt.getSeconds()}`.padStart(2, 0) + '.' + `${dt.getMilliseconds()}`.padStart(3, 0),
			];
			let ct = parts.join(':');
			let titleText = `[${this.constructor.name.brightYellow}:${title.brightRed}`;
			if (fn === null) {
				fn = this.#_getFPath();
			}
			if (typeof fn == 'string') {
				titleText += ` | ${`${fn.split('').reverse().join('').replace(':', ['(', ')', ':'].reverse().join('')).split('').reverse().join('')}`.brightGreen}`
			}
			titleText += ` | ${ct.brightCyan}] `;
			if (ctx.$default.logLevel >= currentLogLevel) {
				console.log(titleText + text)
			}
		}
	}


	get started() { return this.#_serverStarted }
	get endpoints() { return this.#_endpointlist }
	get errors() { return { CallbackNotValid, PathNotValid, NotExistingSubdomains, MissingParameters } }
}

module.exports = ews;

// console.clear();
// let s = new ews('localhost', 80);

// let subdomains = {
// 	'api': 'api.localhost',
// 	'website': 'website.localhost',
// 	'admin': 'admin.localhost',
// }

// for (let v of Object.values(subdomains)) {
// 	s.addSubdomain(v);
// }

// // s.routeStatic('/static', '../../Client/', subdomains.website);

// // s.redirect('/redirect', '/page', ['get']);

// s.route('/', 'get', (req, res) => { res.send('Page 1<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>') }, subdomains.api)
// s.route('/', 'get', (req, res) => { res.send('Page 1<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>') }, subdomains.website)
// s.route('/', 'get', (req, res) => { res.send('Page 1<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>') }, subdomains.admin)
// // s.route('/page', 'get', (req, res) => { res.send('Page 2') })
// // // s.route(/(page-[0-9]{1,2}\/*)/, ['get', 'post'], (req, res) => { res.send('Page idk') }, 'test.localhost')
// s.route('/admin', 'get', (req, res) => { res.send('Hi admin') }, subdomains.admin);
// // s.enableSocket('./testSocketDir/', null, true);
// s.enableSocket('./testSocketDir/', true);

// s.start();
