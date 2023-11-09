class Color {
	static #_darkThemeClass = 'dark-theme';
	static #_currentTheme = 'light';
	static #_colors = {
		'light': { text: '#000000' },
		'dark': { text: '#FFFFFF' },
	}
	static get textColorLightTheme() { return '#000000' };
	static get textColorDarkTheme()  { return '#FFFFFF' };

	static get isDarkTheme() { return document.body.classList.contains(this.#_darkThemeClass) }

	/**
	 * @returns {String} Color to be applied on the text based of the current theme (light or dark)
	 */
	static get textColor() {
		this.#_currentTheme = (document.body.classList.contains(this.#_darkThemeClass)) ? 'dark' : 'light';
		return this.#_colors[this.#_currentTheme].text;
	}

	/**
	 * @param {String} color1 First hex color to blend (the one you get with percentage=0)
	 * @param {String} color2 Second hex color to blend (the one you get with percentage=1)
	 * @param {float} percentage Percentage of mixing between the 2 colors
	 * @return {String} Hex color
	 */
	static blend(color1, color2, percentage) {
		const int_to_hex = function(num) {
			let hex = Math.round(num).toString(16);
			return (hex.length == 1) ? '0'+hex : hex;
		}

		if (color1.length != 4 && color1.length != 7)
			throw new Error('colors must be provided as hexes');
		if (color2.length != 4 && color2.length != 7)
			throw new Error('colors must be provided as hexes');
		if (percentage > 1 || percentage < 0)
			throw new Error('percentage must be between 0 and 1');

		if (color1.length == 4)
			color1 = color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
		else
			color1 = color1.substring(1);
		if (color2.length == 4)
			color2 = color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
		else
			color2 = color2.substring(1);

		color1 = [parseInt(color1[0] + color1[1], 16), parseInt(color1[2] + color1[3], 16), parseInt(color1[4] + color1[5], 16)];
		color2 = [parseInt(color2[0] + color2[1], 16), parseInt(color2[2] + color2[3], 16), parseInt(color2[4] + color2[5], 16)];
		let color3 = [
			(1 - percentage) * color1[0] + percentage * color2[0],
			(1 - percentage) * color1[1] + percentage * color2[1],
			(1 - percentage) * color1[2] + percentage * color2[2]
		];
		color3 = '#' + int_to_hex(color3[0]) + int_to_hex(color3[1]) + int_to_hex(color3[2]);
		return color3;
	}

	/**
	 * @param {String} hexColor Hex color to invert
	 * @returns {String} Hex color
	 */
	static invert(hexColor) {
		if (hexColor.length != 4 && hexColor.length != 7)
			throw new Error('Color must be provided as a hex');
		if (hexColor.length == 4)
			hexColor = '#' + hexColor[1] + hexColor[1] + hexColor[2] + hexColor[2] + hexColor[3] + hexColor[3];
		let colors = hexColor.split('');
		let newColor = '#';
		colors.shift();
		for (let p = 0; p < colors.length; p += 2) {
			let c = colors[p] + colors[p+1];
			let nc = (Math.abs(parseInt(c, 16) - 255)).toString(16)
			newColor += (nc.length == 1) ? '0'+nc : nc
		}
		return newColor.toUpperCase();
	}

	/**
	 * @param {String} hexColor Hex color to invert
	 * @returns {String} Hex color
	 */
	static invertIfDarkTheme(hexColor) {
		return (!this.isDarkTheme) ? hexColor : this.invert(hexColor);
	}

	/**
	 * @param {String} hexColor Hex color to transform to RGB
	 * @returns {Array<r,g,b>} RGB Value of the given hex
	 */
	static hex2rgb(hex) {
		if (hex.length != 4 && hex.length != 7)
			throw new Error('colors must be provided as hexes');
		let vals = hex.split('');
		let newVals = [];
		vals.shift();
		for (let x = 0; x < vals.length; x += (vals.length == 6) ? 2 : 1) {
			newVals.push(parseInt(vals[x] + ((vals.length == 6) ? vals[x+1] : ''), 16));
		}
		return newVals;
	}

	/**
	 * 
	 * @param {int} r R value for the color
	 * @param {int} g G value for the color
	 * @param {int} b B value for the color
	 * @returns {String} Hex color from the given RGB values
	 */
	static rgb2hex(r, g, b) {
		if (!(r >= 0 && r <= 255)) { throw new Error(`Red value must be between 0 and 255, received ${r}`); }
		if (!(g >= 0 && g <= 255)) { throw new Error(`Green value must be between 0 and 255, received ${g}`); }
		if (!(b >= 0 && b <= 255)) { throw new Error(`Blue value must be between 0 and 255, received ${b}`); }
		let hex = [r, g, b].map((item) => { return item.toString(16) }).map((item) => { return (item.length == 1) ? '0'+item : item })
		return ('#' + hex.join('')).toUpperCase();
	}

	/**
	 * @param {String} color Hex of the color 
	 * @param {float} percentage Percentage of Brightness/Shade to apply (positive for brightness, negative for shade)
	 * @returns {String} Hex color with the given filter
	 */
	static shade(color, percentage) {
		if (!(percentage >= -1 && percentage <= 1)) { throw new Error('Percentage must be between -1 and 1')}
		if (percentage > 0) {
			return this.blend(color, '#FFFFFF', percentage);
		}
		if (percentage < 0) {
			return this.blend(color, '#000000', Math.abs(percentage));
		}
		return color;
	}
}