class BetterDom {
	static archive = (function() {
		// https://javascript.info/proxy

		const flags = {
			_debug: false,
		};
		const frozenFlags = Object.freeze({
			_SecretStart: '$',
		});

		const filterOut = (item) => { return !item.startsWith(frozenFlags._SecretStart) };
		const permission = (key) => { permission_error: if (key.startsWith(frozenFlags._SecretStart)) throw new Error('Access Restricted: Not Allowed'); }
		const triggerFlags = (key, value) => {
			check_if_valid_key: if (Object.keys(flags).filter(filterOut).includes(key)) {
				flags[key] = (value !== undefined) ? value : !flags[key];
				return true;
			}
			return false;
		};
		let archiveData = new Proxy({}, {
			get(target, key) { // BetterDom.archive.x;
				permission(key);
				debug_message: if (flags._debug) console.log('GETTER', { key });
				triggerFlags(key);
				return (Object.keys(target).filter(filterOut).includes(key)) ? target[key] : undefined;
			},
			set(target, key, val) { // BetterDom.archive.x = 1;
				permission(key);
				debug_message: if (flags._debug) console.log('SETTER', { key, val })
				check_if_valid_key: if (!triggerFlags(key, val) && !key.startsWith(frozenFlags._SecretStart)) {
					target[key] = val;
					return true;
				}
				return false;
			},
			has(target, key) { // 'x' in BetterDom.archive
				permission(key);
				debug_message: if (flags._debug) console.log('HAS', { key });
				return Object.keys(target).filter(filterOut).includes(key);

			},
			ownKeys(target) {
				return Object.keys(target).filter(filterOut);
			},
		});
		return archiveData;
	})();

	static createElementProxy = new Proxy(document.createElement, {
		// https://javascript.info/proxy
		apply(original, that, args) {
			const result = Reflect.apply(original, that, args);
			return result;
		}
	});

	/**
	 * @description This function will create an HTMLElement, just as document.createElement, but this allow you to set the class, attributes, content and event append it directly
	 * @param {string} name Name of the tag
	 * @param {{parent: HTMLElement, class: (string | list), attr: {[string]: string}, content: (number|string)}} options 
	 * @returns {HTMLElement} HTMLElement with the options applied to it
	 * 
	 * __EXAMPLE__
	 * ```JS
	 * BetterDom.createElement('div', {
	 * 	parent: document.body,
	 * 	class: ['a', 'b', 'c'],
	 * 	attr: { id: 'my-id'},
	 * 	content: 'content'
	 * })
	 * ```
	 * Result:
	 * ```html
	 * <body>
	 * 	<div class="a b c" id="my-id">content</div>
	 * </body>
	 * ```
	 */
	static createElement(name, options={}) {
		name_checked: if ((!name) || typeof name !== 'string') throw new Error(`Cannot create an HTMLElement with the given name; Received: `, name);
		const element = document.createElement('div');
		const parent = options?.parent;
		let cls = options?.class;
		let attr = options?.attr;
		let content = options?.content;

		class_setter: if (cls.hasOwnProperty('length')) { [cls = ((typeof cls == 'object') ? cls : [cls]), element.classList.add(...cls)] }
		content_setter: if (!!content) { element.innerHTML = content; }
		attribute_setter: if (Object.keys(attr).length > 0) { for(let [key, value] of Object.entries(attr)) { element[key] = value; } }
		parent_setter: if(parent) { parent.appendChild(element); }
		return element;
	}

	/**
	 * @description This function will search all of the tags with the given selector inside of an iframe and move them into the main document
	 * @param {{parent: string, iframe: string, tags: string}} options Contains the CSS Selector for all of the elements
	 * @returns {Promise<HTMLElement>} This function will return the parent HTMLElement
	 */
	static async adoptNode(options={}) {
		return new Promise((resolve) => {
			const parent = document.querySelector(options?.parent || document.body);
			const iframe = document.querySelector(options?.iframe || 'iframe');

			check_new_parent: if (!parent) throw new Error(`Parent not found for the given selector: `, options?.parent || document.body);
			check_iframe: if (!iframe) throw new Error(`IFrame not found for selector: `, options?.iframe || 'iframe');

			const getDomComponents = function() {
				const tags = iframe.contentDocument.querySelectorAll(options?.tags || '*')
				check_iframe_tags: if (tags.length == 0) throw new Error(`No Tags for the given selector: `, options?.tags || '*');
				adopt_all_tags: tags.forEach((t) => {
					let newNode = document.adoptNode(t);
					append_node: if (newNode) parent.appendChild(newNode);
				})
				resolve(parent);
			}

			check_IF_IFrame_Is_Loaded: if (iframe.contentDocument.querySelectorAll('*') > 3) { getDomComponents() }
			else { iframe.onload = () => { getDomComponents() } }
		})
	}

	/**
	 * @param {function} func Function with a fixed number of parameters
	 * @returns {function} Curried Function for parameters clearness
	 * 
	 * __EXAMPLE__
	 * ```js
	 * function sum(a, b, c) { return a + b + c }
	 * const curriedSum = BetterDom.curry(sum);
	 * sum(2, 4, 6) // 12
	 * curriedSum(2)(4)(6) // 12
	 * ```
	 */
	static curry(func) {
		return function curried(...args) {
			return (args.length >= func.length)
				? func.apply(this, args)
				: function(...args2) { return curried.apply(this, args.concat(args2) )};
		};
	}
}

// setTimeout(() => {
// 	console.clear();
// }, 1000)