class MyImport {
	static #_libraries = {
		js: {
			// Utils
			jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js',
			bootstrap: 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js',
			sweetalert: 'https://unpkg.com/sweetalert@2.1.2/dist/sweetalert.min.js',
			socketio: 'https://cdn.socket.io/4.7.2/socket.io.min.js',
			fusejs: 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0',
			
			// Dataframe
			danfojs: 'https://cdn.jsdelivr.net/npm/danfojs@1.1.2/lib/bundle.min.js',
			
			// Rendering
			d3: 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js',
			p5: [
				'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.js',
				'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/addons/p5.sound.min.js',
			],
			leaflet: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
			
			// Animation
			animejs: 'https://raw.githubusercontent.com/juliangarnier/anime/master/lib/anime.js',
			animejsmin: 'https://raw.githubusercontent.com/juliangarnier/anime/master/lib/anime.min.js',
			
			// Charts
			chartjs: 'https://cdn.jsdelivr.net/npm/chart.js',
			apexchart: 'https://cdn.jsdelivr.net/npm/apexcharts',
			gridjs: 'https://unpkg.com/gridjs/dist/gridjs.umd.js',
		},
		css: {
			bootstrap: 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css',
			fontawesome: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
			gridjs: 'https://unpkg.com/gridjs/dist/theme/mermaid.min.css',
			leaflet: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
			MyGrid: 'https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/_css/grid.css',
			CustomTheme: 'https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/_css/theme.css',
		}
	};
	
	static list(l) {
		return Object.keys(this.#_libraries).includes(l) ? Object.keys(this.#_libraries[l]) : undefined;
	}

	static async js(name) {
		const key = 'js';
		return new Promise(async resolve => {
			if (!Object.keys(this.#_libraries[key]).includes(name)) { return null; }
			let tempSpace = (typeof this.#_libraries[key][name] == 'string') ? [ this.#_libraries[key][name] ] : this.#_libraries[key][name];
			for (let lib of tempSpace) {
				await this.#_setTag('js', lib);
			}
			resolve(tempSpace);
		})
	}

	static async css(name) {
		const key = 'css';
		return new Promise(async resolve => {
			if (!Object.keys(this.#_libraries[key]).includes(name)) { return null; }
			let tempSpace = (typeof this.#_libraries[key][name] == 'string') ? [ this.#_libraries[key][name] ] : this.#_libraries[key][name];
			for (let lib of tempSpace) {
				await this.#_setTag('css', lib);
			}
			resolve(tempSpace);
		});
	}

	static async custom(l, ...urls) {
		if (!['js', 'css'].includes(l)) throw new Error(`Language is not valid, accepted: "js" or "css", received: "${l}"`)
		return new Promise(async resolve => {
			for (let lib of urls) {
				await this.#_setTag(l, lib);
			}
			resolve(urls);
		})
	}

	static async all(...l) {
		const sortFunction = (a, b) => (a == 'css' || b == 'css') ? (a == 'css') ? -1 : (b == 'css') ? 1 : 0 : 0;
		l = l.sort(sortFunction);
		let valid = [ ...Object.keys(this.#_libraries).sort(sortFunction)];
		if (l.length == 0) { l = valid }
		if (typeof l == 'string') { l = [ l ] }
		for (let lang of l) {
			if (!valid.includes(lang)) throw new Error(`Language is not valid, accepted: ${valid.map(i => `"${i}"`).join(', ').split('').reverse().join('').replace(',', 'RO ').split('').reverse().join('')}`)
			for (let k of Object.keys(this.#_libraries[lang])) {
				let urls = this.#_libraries[lang][k];
				if (typeof urls === 'string') {
					urls = [ urls ];
				}
				for (let url of urls) {
					await this.#_setTag(lang, url);
				}
			}
		}
	}

	static async #_setTag(l, url) {
		const [tag, attr, rel] = [['script', 'src', null], ['link', 'href', 'stylesheet'], [null, null]][(l === 'js') ? 0 : (l === 'css') ? 1 : 2];
		if (!['script', 'link'].includes(tag)) throw new Error(`Tag not valid`);
		if (!['href', 'src'].includes(attr)) throw new Error(`Attribute not valid`);
		return new Promise(resolve => {
			const t = document.createElement(tag);
			if (rel) { t.setAttribute('rel', 'stylesheet'); }
			t.setAttribute(attr, url);
			document.head.appendChild(t, document.currentScript);
			t.onload = () => { resolve(t); }
		})
	}
}