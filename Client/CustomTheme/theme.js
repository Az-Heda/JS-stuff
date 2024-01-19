class ThemeError extends Error {
	constructor(msg) {
		super(msg);
		this.name = this.constructor.name;
	}
}

class CustomTheme {
	#_colors = [];
	#_rules = {};
	#_cssID = 'CT_Theme';
	#_attrBase = 'ct_';
	get colors() { return this.#_colors };

	constructor(themeName) {
		this.tname = `${this.#_attrBase}_${themeName.toLowerCase()}`;
	}

	addColor(...colors) {
		const hexPattern = /((#[a-fA-F0-9]{6})|(#[a-fA-F0-9]{3}))/;
		const rgbPattern = /(rgb)\([0-9]{1,3},( )?[0-9]{1,3},( )?[0-9]{1,3}\)/;
		const rgbaPattern = /(rgba)\([0-9]{1,3},( )?[0-9]{1,3},( )?[0-9]{1,3},( )?[0-9]{0,}(.[0-9]{1,})?\)/;
		colors = colors.filter((c) => {
			const isHex = hexPattern.exec(c) != null;
			const isRgb = rgbPattern.exec(c) != null;
			const isRgba = rgbaPattern.exec(c) != null;
			return isHex || isRgb || isRgba;
		}).map((c) => { return c.toUpperCase() });
		this.#_colors.push(...colors);
		return this.colors;
	}

	addRule(rules) {
		const kmap = {
			b: 'background-color: $c;',
			c: 'color: $c;',
			bi: 'background-color: $c !important;',
			ci: 'color: $c !important',
		};
		for (let [selector, value] of Object.entries(rules)) {
			let colors = this.colors;
			selector = (selector == 'body') ? `${selector}[${this.tname}]` : `body[${this.tname}] ${selector}`;
			let cssRule = `${selector} {\n$values$\n}`;
			cssRule = cssRule.replace('$values$', Object.entries(value)
			.filter((item) => {
				return item[0] in kmap;
			})
			.map((item) => {
				return `\t${kmap[item[0]].replaceAll('$c', (item[1] in colors) ? colors[item[1]] : item[1])}`
			}).join('\n'));
			this.#_rules[selector] = cssRule;
		}
	}

	activate() {
		for (let attr of Object.values(document.body.attributes)) {
			console.log(attr.name)
			if (attr.name.startsWith(this.#_attrBase) && attr.name != this.tname) {
				document.body.removeAttribute(attr.name);
			}
		}
		if (!document.body.hasAttribute(this.tname)) {
			document.body.setAttribute(this.tname, '')
		}

		this.#_setCSSFile()
	}

	#_setCSSFile() {
		let tag = this.#_getStyle();
		const tf = 'textContent';
		tag[tf] = '';
		for (let [key, value] of Object.entries(this.#_rules)) {
			tag[tf] += value+'\n';
		}
	}

	#_getStyle() {
		let style1 = document.getElementById(this.#_cssID)
		let style2 = document.createElement('style');
		if (style1 == null) {
			style2.setAttribute('id', this.#_cssID)
			document.head.append(style2);
			return style2;
		}
		return style1
	}
}