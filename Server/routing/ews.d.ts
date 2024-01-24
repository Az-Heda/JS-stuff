export as namespace ews;

// Error classes
declare class CallbackNotValid extends Error { constructor(message: string) }
declare class PathNotValid extends Error { constructor(message: string) }
declare class NotExistingSubdomains extends Error { constructor(message: string) }
declare class MissingParameters extends Error { constructor(message: string) }
declare class SocketError extends Error { constructor(message: string) }
declare class UnknownError extends Error { constructor(message: string) }

// Type declaration 
declare type validMethods = ('GET' | 'POST');
declare type httpMethods = validMethods | Array<validMethods>;
declare type subdomain = string | null;


// Class EWS
export declare class ews {
	/**
	 * @description Initialize the class using the HOST and PORT given
	 * @param {string} host Host of the server
	 * @param {int} port Port number
	 * @throws {MissingParameters} if host or port is missing
	 */
	constructor(
		host: string,
		port: number
	);

	/**
	 * @async
	 * @description Starts the web server
	 */
	start(): Promise<boolean>;


	/**
	 * @description Setup a route to a specific url, with the given methods and, eventually, link it to a specific subdomain
	 * @param {string} path Url to bind to a specific callback
	 * @param {httpMethods} methods Methods allowed for this bind.
	 * @param {Function | array<Function>} callback Function or functions to use as a callback/middleware
	 * 
	 * If 2 functions are passed, the first one is the middleware, and the second one is the callback
	 * @param { string | null} subdomain Subdomain to build the Url path, if omitted, the path will be mounted on the main app
	 * @param {string} customLoggerTitle Name used by the logger
	 */
	route(
		path: string,
		methods: httpMethods,
		callback: Function | Array<Function>,
		subdomain: string | null,
		customLoggerTitle: string | 'Routing'
	): void;


	/**
	 * @description Link a folder to an url, so you can access all of the files
	 * @param {string} url Url to link the choosen folder
	 * @param {string} path path of the directory to serve as static
	 * @param {string | null} subdomain Subdomain to build the Url path, if omitted, the path will be mounted on the main app
	 */
	routeStatic(
		url: string,
		path: string,
		subdomain: string | null
	): void;


	/**
	 * @description Create an endpoint used only for redirecting the user to another url
	 * @param {string} from Url to set as a redirect endpoint
	 * @param {string} to Url to be redirected once visited the `from` url
	 * @param {string | array<string>} methods Methods allowed for this bind.
	 * @param {string | null} subdomain Subdomain to build the Url path, if omitted, the path will be mounted on the main app
	 */
	redirect(
		from: string,
		to: string,
		methods: httpMethods,
		subdomain: string | null
	): void;

	/**
	 * @description Add a subdomain to the server, so you can divide the endpoints into various subdomains, you access a subdomain by going a the url: <subdomain>.localhost/<endpoint>
	 * @param {string} subdmn Name of the subdomain to set
	 */
	addSubdomain(
		subdmn: string
	): void;

	/**
	 * @description Enable Socket.IO Connection. To import it, just copy & paste this: `<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>`
	 * @param {string} dir Directory that contains all of the message files
	 * @param {boolean} debugMessage Enable console logging
	 * @returns {boolean} Return true if socket are prepared correctly
	 */
	enableSocket(
		dir: string,
		debugMessage: boolean
	): boolean;


	public get started(): boolean;
	public get endpoints(): Array<{ method: validMethods, path: string }>
	public get errors(): {
		CallbackNotValid: CallbackNotValid,
		PathNotValid: PathNotValid,
		NotExistingSubdomains: NotExistingSubdomains,
		MissingParameters: MissingParameters,
		SocketError: SocketError,
		UnknownError: UnknownError,
	}
}