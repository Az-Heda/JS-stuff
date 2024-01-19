class Loader {
	static #_tag = document.createElement('div');
	static #_css = document.createElement('style');
	static #_theme = 'light';
	static #_size = { w: 40, h: 40 };
	static #_className = `cube-${Date.now()}`;
	static #_colors = {
		'light': { border: '#000000', background: '#00000040' },
		'dark': { border: '#ffffff', background: '#ffffff40' },
	};
	static #_sides = new Array(6)
	.fill(0)
	.map((_) => {
		let side = document.createElement('div');
		side.classList.add('side');
		this.#_tag.appendChild(side);
		return side;
	});
	
	/**
	 * @param {('light' | 'dark')} themeChecker Set the active theme
	 */
	static set darkTheme(themeChecker=false) {
		return [this.#_theme, this.#_theme = (themeChecker == 0) ? 'light' : 'dark'][0]
	}

	/**
	 * @returns {boolean} Check wheather the Loader's Div element is in the DOM
	 */
	static get tagInBody() {
		return document.body.contains(this.#_tag);
	}

	/**
	 * @returns {boolean} Check wheather the Loader's Style element is in the DOM
	 */
	static get cssInBody() {
		return document.body.contains(this.#_css);
	}
	
	/**
	 * @returns {object} Colors for the current active theme
	 */
	static get themeColor() {
		return this.#_colors[this.#_theme];
	}

	/**
	 * @returns {boolean} Returns true if all of the tags where succesfully removed from the DOM
	 */
	static get remove() {
		if (this.tagInBody) { this.#_tag.remove(); }
		if (this.cssInBody) { this.#_css.remove(); }
		return true;
	}

	/**
	 * @returns {{ tag: HTMLDivElement, style: HTMLStyleElement}} Returns the tags for the loader
	 */
	static get append() {
		this.#_style;
		if (this.#_tag) {
			if (!this.#_tag.classList.contains(this.#_className)) {
				this.#_tag.classList.add(this.#_className);
			}
			if (!this.tagInBody) {
				document.body.appendChild(this.#_tag);
			}
		}
		else {
			throw new Error(`Loader not found`);
		}
		return { tag: this.tagInBody, style: this.cssInBody };
	}

	static get #_style() {
		if (!this.cssInBody) {
			document.body.appendChild(this.#_css);
		}
		this.#_css.innerHTML = `
		/* Animation for Theme: ${this.#_theme} */
		@keyframes AzHedaCubeAnimation {
			0% { transform: rotate(45deg) rotateX(-25deg) rotateY(25deg); }
			50% { transform: rotate(45deg) rotateX(-385deg) rotateY(25deg); }
			100% { transform: rotate(45deg) rotateX(-385deg) rotateY(385deg); }
		}
		  
		.${this.#_className} {
			animation: AzHedaCubeAnimation 2s infinite ease;
			transform-style: preserve-3d;
			width: ${this.#_size.w}px;
			height: ${this.#_size.h}px;
			position: fixed;
			top : calc(50% - ${this.#_size.h / 2}px);
			left: calc(50% - ${this.#_size.w / 2}px);
			z-index: 2147483647;
		}
		
		.${this.#_className} div {
			background-color: ${this.themeColor.background};
			height: 100%;
			position: absolute;
			width: 100%;
			border: 2px solid ${this.themeColor.border};
		}
		
		.${this.#_className} div:nth-of-type(1) { transform: translateZ(-20px) rotateY(180deg); }
		.${this.#_className} div:nth-of-type(2) { transform: rotateY(-270deg) translateX(50%); transform-origin: top right; }
		.${this.#_className} div:nth-of-type(3) { transform: rotateY(270deg) translateX(-50%); transform-origin: center left; }
		.${this.#_className} div:nth-of-type(4) { transform: rotateX(90deg) translateY(-50%); transform-origin: top center; }
		.${this.#_className} div:nth-of-type(5) { transform: rotateX(-90deg) translateY(50%); transform-origin: bottom center; }
		.${this.#_className} div:nth-of-type(6) { transform: translateZ(20px); }`;
	}

}