const BetterDom = Object.freeze({
	createElement: new Proxy(document.createElement, {
		apply(original, that, args) {
			const result = Reflect.apply(original, that, args);
			return result;
		}
	}),
});