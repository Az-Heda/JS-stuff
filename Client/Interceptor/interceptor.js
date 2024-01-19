window['INTERCEPTOR_KEYS'] = {
	'0_console': false,
	'0_enable_default_functions': false,
	'0_target': 'Target manager',
	'0_get_proxy': 'Proxy generator',
};

window['0_target'] = {
	_target: null,
	get: function() {
		return this._target;
	},
	set: function(v) {
		this._target = v;
	}
}

window['0_get_proxy'] = (f) => {
	return new Proxy(f, {
		apply(target, that, args) {
			if (window['INTERCEPTOR_KEYS']['0_enable_default_functions']) {
				return f.apply(that, args);
			}
			let currentTarget = window['0_target'].get();
			if (currentTarget !== null) {
				if (currentTarget.constructor.name == 'Function') {
					currentTarget.apply(that, args);
				}
				else if (/(HTML[a-zA-Z]{1,}Element)/.exec(currentTarget.constructor.name) !== null) {
					currentTarget.innerText += '\n'+args.join('\n');
				}
			}

			if (window['INTERCEPTOR_KEYS']['0_console'] || currentTarget === null) {
				target.apply(that, args);
			}
		}
	});
}

console.log = window['0_get_proxy'](console.log);
console.info = window['0_get_proxy'](console.info);
console.warn = window['0_get_proxy'](console.warn);
console.error = window['0_get_proxy'](console.error);

delete window['INTERCEPTOR_KEYS']['0_get_proxy'];
delete window['0_get_proxy'];