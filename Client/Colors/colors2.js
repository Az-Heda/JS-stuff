class Color {
	/**
	 * @description Convert an RGB color to HEX
	 * @param {int} r Red value of the color
	 * @param {int} g Green Value of the color
	 * @param {int} b Blue value of the color
	 * @returns {string} Hex color
	 */
	static rgb2hex(r, g, b) {
		return `#${[r.toString(16), g.toString(16), b.toString(16)].map((i) => i.padStart(2, '0')).join('')}`
	}

	/**
	 * @description Check and format an HEX number in a way it's like #123 -> #112233;
	 * @param {string} hex HEX color
	 * @returns {string} A Better formatted HEX
	 * @throws {Error} If the color is not an HEX
	 */
	static hexFull(hex) {
		if (hex.length == 9) return hex;
		if (hex.length == 7) return hex;
		if (hex.length == 4 || hex.length == 5) {
			hex = hex.replace('#', '');
			hex = hex.split('').reduce((a, b) => {
				return (hex.length == 3 || hex.length == 4) ? a + (b+b) : a + b; 
			}, '');
			return '#'+hex;
		}
		throw new Error(`Error: ${hex} is not a hex like color`)
	}

	/**
	 * @description Convert an HEX color into an RGB one
	 * @param {string} hex HEX color
	 * @returns {array<r,g,b>} [R, G, B] for the given HEX color
	 */
	static hex2rgb(hex) {
		let c = this.hexFull(hex).replace('#', '');
		let oc = [];
		for (let p of c) {
			if (oc.length > 0 && oc[oc.length - 1].length == 1) {
				oc[oc.length - 1] += p;
			}
			else {
				oc.push(p);
			}
		}
		return oc.map(i => parseInt(i, 16))
	}

	/**
	 * @description Convert an HEX into an sRGB one
	 * @param {string} hex HEX Color
	 * @returns {array<r,g,b>} RGB rappresentation of the given hex color (in sRGB format)
	 */
	static hex2srgb(hex) {
		const gamma = (c) => { return Math.pow(c, 1/2.2); };
		let c = this.hexFull(hex);
		let rgb = this.hex2rgb(c).map(i => i / 255).map(gamma);
		return rgb;
	}

	/**
	 * @description Calculate the relative luminance for the given color
	 * @param {string} hex HEX Color
	 * @returns {float} Float number for the given color luminance (0 -> Black; 1 -> White)
	 */
	static luminance(hex) {
		// https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
		let [ R, G, B ] = Color.hex2srgb(hex);
		R = (R <= 0.03928) ? R / 12.92 : ((R + 0.055) / 1.055)**2.4;
		G = (G <= 0.03928) ? G / 12.92 : ((G + 0.055) / 1.055)**2.4;
		B = (B <= 0.03928) ? B / 12.92 : ((B + 0.055) / 1.055)**2.4;
		return 0.2126 * R + 0.7152 * G + 0.0722 * B;
	}

	/**
	 * @description Calculate the contrast for the 2 colors
	 * @param {string} c1 HEX background color
	 * @param {string} c2 HEX text color
	 * @returns {float} contrast ratio, ideal number is higher than 7
	 */
	static contrast(c1, c2) {
		const [ r1, g1, b1 ] = this.hex2rgb(c1);
		const [ r2, g2, b2 ] = this.hex2rgb(c2);

		const L1 = this.luminance(c1);
		const L2 = this.luminance(c2);

		const condition = (r1 + g1 + b1) > (r2 + g2 + b2);

		return (condition)
			? (L1 + .05) / (L2 + .05)
			: (L2 + .05) / (L1 + .05)
	}

	/**
	 * @description Calculate all of the given colors contrast on a specific background, and returns them in order with the contrast ratio
	 * @param {string} bg HEX background color
	 * @param  {...string} colors HEX text colors
	 * @returns {array<{color: string, ratio: float}>} Array with the color and their ratio with on the given background (ordered by ratio from higher to lower)
	 */
	static rankContrast(bg, ...colors) {
		let data = [];
		for(const color of colors) {
			let ratio = this.contrast(bg, color);
			data.push({ color, ratio });
		}
		return data.sort((a, b) => { return (a.ratio < b.ratio) ? 1 : (a.ratio > b.ratio) ? -1 : 0})
	}

	/**
	 * @param {*} bg 
	 * @param  {...any} colors 
	 * @returns 
	 */
	static bestContrast(bg, ...colors) {
		return this.rankContrast(bg, ...colors)[0].color;
	}

	/**
	 * @description Convert an RGB color into an HSL one
	 * @param {number} r Red value of the color
	 * @param {number} g Green Value of the color
	 * @param {number} b Blue value of the color
	 * @returns {array<h,s,l>} Same color in HSL format
	 */
	static rgb2hsl(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;

		let cmin = Math.min(r, g, b);
		let cmax = Math.max(r, g, b);
		let delta = cmax - cmin;
		let h = 0;
		let s = 0;
		let l = 0;
		
		if (delta == 0) { h = 0 }
		else if (cmax == r) { h = ((g - b) / delta) % 6 }
		else if (cmax == g) { h = (b - r) / delta + 2; }
		else { h = (r - g) / delta + 4 }

		h = Math.round(h * 60);
		if (h < 0) { h += 360 }

		l = (cmax + cmin) / 2;
		s = (delta == 0) ? 0 : delta / (1 - Math.abs(2 * l - 1));
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);
		
		return [h, s, l]
	}

	/**
	 * @description Convert a HEX color into the HSL one
	 * @param {string} hex Color HEX
	 * @returns {array<h,s,l>} Color HSL
	 */
	static hex2hsl(hex) {
		let rgb = this.hex2rgb(hex);
		return this.rgb2hsl(...rgb)
	}

	/**
	 * @description Convert an HSL color into a RGB one
	 * @param {number} h Hue
	 * @param {number} s Saturation
	 * @param {number} l Lightness
	 * @returns {array<r,g,b>} Color RGB
	 */
	static hsl2rgb(h, s, l) {
		s /= 100;
		l /= 100;
		let c = (1 - Math.abs(2 * l - 1)) * s;
		let x = c * (1 - Math.abs((h / 60) % 2 - 1));
		let m = l - c/2;
		let r = 0;
		let g = 0;
		let b = 0;
		if (0 <= h && h < 60) { r = c; g = x; b = 0; }
		else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
		else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
		else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
		else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
		else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
		r = Math.round((r + m) * 255);
		g = Math.round((g + m) * 255);
		b = Math.round((b + m) * 255);
		return [r, g, b]
	}

	/**
	 * @description Convert an HSL color into an HEX one
	 * @param {number} h Hue
	 * @param {number} s Saturation
	 * @param {number} l Lightness
	 * @returns {string} Color HEX
	 */
	static hsl2hex(h, s, l) {
		let rgb = this.hsl2rgb(h, s, l);
		return this.rgb2hex(...rgb)
	}

	/**
	 * @description Returns the opposite color in HEX from the given input
	 * @param {string|array<r,g,b>|array<h,s,l>} color Color to invert 
	 * @param {('hex' | 'rgb' | 'hsl')} format Color format
	 * @returns {string} Inverted HEX color
	 */
	static invert(color, format='hex') {
		let hexColor = this.#_getHex(color, format);
		let rgb = this.hex2rgb(hexColor).map(i => Math.abs(i - 255));
		return this.rgb2hex(...rgb)
	}

	/**
	 * @description Blend 2 colors together
	 * @param {string} color1 HEX color to blend
	 * @param {string} color2 HEX color to blend
	 * @param {int|float} percentage Percentage of the color blending (0: is the same as the first color, 1 is the same as the second one)
	 * @returns {string} Color blended in HEX format
	 */
	static blend(color1, color2, percentage) {
		if (color1.length != 4 && color1.length != 7) { throw new Error('colors must be provided as hexes'); }
		if (color2.length != 4 && color2.length != 7) { throw new Error('colors must be provided as hexes'); }
		if (percentage > 1 || percentage < 0) { throw new Error('percentage must be between 0 and 1'); }

		color1 = this.hex2rgb(color1);
		color2 = this.hex2rgb(color2);

		let color3 = [
			(1 - percentage) * color1[0] + percentage * color2[0],
			(1 - percentage) * color1[1] + percentage * color2[1],
			(1 - percentage) * color1[2] + percentage * color2[2],
		].map(num => Math.round(num).toString(16).padStart(2, '0'));
		return this.rgb2hex(...color3);
	}

	/**
	 * @description Show the color in console, one with a white text and the other with a black text
	 * @param {string|array<r,g,b>|array<h,s,l>} color Color to invert 
	 * @param {('hex' | 'rgb' | 'hsl')} format Color format
	 */
	static logColor(color, format='hex') {
		let hexColor = this.#_getHex(color, format);
		const consoleColor = (c) => {
			const common = 'padding: 15px 100px; font-size: 20px; text-align: center;';
			const s1 = `${common} background-color: ${c}; color: #FFF; border-right: 1px solid #FFF;`
			const s2 = `${common} background-color: ${c}; color: #000; border-left: 1px solid #000;`
			console.log(`%c${c}%c${c}`, s1, s2);
		}
		consoleColor(hexColor);
	}

	/**
	 * @description Return a converter object which can convert the given color into HEX, RGB, HSL and invert it
	 * @param {string|array<r,g,b>|array<h,s,l>} color Color to invert 
	 * @param {('hex' | 'rgb' | 'hsl')} format Color format
	 * @returns {object} 
	 */
	static converter(color, format='hex') {
		let c = this.#_getHex(color, format);
		let rgb = this.hex2rgb(c);
		let hsl = this.hex2hsl(c);
		let inv = this.invert(c);
		let obj = {
			get hex() { return c },
			get rgb() { return rgb },
			get hsl() { return hsl },
			get invert() { return inv },
		}
		return obj;
	}

	static #_getHex(color, format) {
		let hexColor = '';
		switch(format) {
			case 'rgb':
				hexColor = this.rgb2hex(...color);
				break;
			case 'hsl': 
				hexColor = this.hsl2hex(...color);
				break;
			case 'hex':
				hexColor = this.hexFull(color);
				break;
			default:
				break;
		}
		return hexColor;
	}
}

console.warn(Color.contrast('#123546', '#000000'))
console.warn(Color.contrast('#123546', '#FFFFFF'))
console.info(Color.rankContrast('#374151', '#c084fc',  '#22d3ee',  '#10b981',  '#d1d5db',  '#3b82f6',  '#a3e635',  '#facc15',  '#ef4444'))
console.info(Color.bestContrast('#374151', '#c084fc',  '#22d3ee',  '#10b981',  '#d1d5db',  '#3b82f6',  '#a3e635',  '#facc15',  '#ef4444'))


function getCombinations(bg, data) {
	let combinations = (arr=Array.from('123456789ABCDE')) => {
		return [].concat(...arr.map(v1 => [].concat(...arr.map(v2 => arr.map(v3 => '#'+v1+v2+v3)))));
	}
	let v = combinations();
	setTimeout(() => {
		console.log(Color.rankContrast(bg, ...v))
	}, 100);
    return Color.bestContrast(bg, ...v)
}

const c = '#22d3ee';
Color.logColor(c);
Color.logColor(getCombinations(c), 'hex')