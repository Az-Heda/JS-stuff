class MyImport {
	static #_libraries = {
		js: {
			jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js',
			bootstrap: 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js',
			sweetalert: 'https://unpkg.com/sweetalert@2.1.2/dist/sweetalert.min.js',
			gridjs: 'https://unpkg.com/gridjs/dist/gridjs.umd.js',
			danfojs: 'https://cdn.jsdelivr.net/npm/danfojs@1.1.2/lib/bundle.min.js',
		},
		css: {
			bootstrap: 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css',
			fontawesome: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
			gridjs: 'https://unpkg.com/gridjs/dist/theme/mermaid.min.css',
		}
	};

	static js(name) {
		if (!Object.keys(this.#_libraries.js).includes(name)) { return null; }
		let tag = document.createElement('script');
		tag.setAttribute('src', this.#_libraries.js[name]);
		console.log(document.currentScript);
		document.currentScript.parentElement.insertBefore(tag, document.currentScript);
	}

	static css(name) {
		if (!Object.keys(this.#_libraries.css).includes(name)) { return null; }
		let tag = document.createElement('link');
		tag.setAttribute('href', this.#_libraries.css[name]);
		document.currentScript.parentElement.insertBefore(tag, document.currentScript);
	}

	static get css() {
		return Object.keys(this.#_libraries.css);
	}

	static get css() {
		return Object.keys(this.#_libraries.css);
	}
}