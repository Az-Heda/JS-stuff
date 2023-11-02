function map(n, start1, stop1, start2, stop2) {
	return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}


function encode(str, separator = '|') {
	let newString = [];
	for (let pos = 0; pos < str.length; pos++) {
		let lett = str.charCodeAt(pos);
		newString.push(lett);
	}
	return newString.join(separator);
};

function decode(str, separator='|') {
	return String.fromCharCode(...this.split(separator));
}

function randomizeArray(arr) {
	let currentIndex = arr.length;
	let randomIndex;
	while (0 != currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
	}
	return arr;
}


function deepCopy(item) {
	return structuredClone(item);
	return JSON.parse(JSON.stringify(item));
}

function IDFromString(str) {
	let thisString = `${str}`;
	var len = thisString.length;
	let code = 0;
	for (let i = 0; i < len; ++i) {
		code += thisString.charCodeAt(i);
		code += (code << 10);
		code ^= (code >> 6);
	}
	code += (code << 3);
	code ^= (code >> 11);
	code += (code << 15);
	return Math.floor(Math.abs(code));
}

function hashSeed(str, seed = 0) {
	let h1 = 0xdeadbeef ^ seed;
	let h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761)
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
	h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
	h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};


function capitalize(str) {
	const arr = str.split(" ");
	for (var i = 0; i < arr.length; i++) {
		arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
	}
	const str2 = arr.join(" ");
	return str2;
};


function sortObject(obj) {
	const keys = Object.keys(obj);
	let newObject = {};
	keys.sort();
	for (let i = 0; i < keys.length; i++) {
		let k = keys[i];
		newObject[k] = obj[k];
	}
	return newObject;
};


function getElementByAttribute(attr, value, root) {
	root = root || document.body;
	if(root.hasAttribute(attr) && root.getAttribute(attr) == value) {
		return root;
	}
	let children = root.children;
	let elements = [];
	for(let i = children.length; i--; ) {
		let element = getElementByAttribute(attr, value, children[i]);
		if(element) {
			elements.push(element);
		}
	}
	return elements;
}

function logMessage(title, text, styles={}) {
	const stringPairings = {
		'blue': ['#007bff', '#000'],
		'indigo': ['#6610f2', '#fff'],
		'purple': ['#6f42c1', '#fff'],
		'pink': ['#e83e8c', '#000'],
		'red': ['#dc3545', '#000'],
		'orange': ['#fd7e14', '#000'],
		'yellow': ['#ffc107', '#000'],
		'green': ['#28a745', '#000'],
		'teal': ['#20c997', '#000'],
		'cyan': ['#17a2b8', '#000'],
		'white': ['#fff', '#000'],
		'black': ['#000', '#fff'],
		'gray': ['#6c757d', '#fff'],
		'darkgray': ['#343a40', '#fff'],
		'primary': ['#007bff', '#000'],
		'secondary': ['#6c757d', '#fff'],
		'success': ['#28a745', '#000'],
		'info': ['#17a2b8', '#000'],
		'warning': ['#ffc107', '#000'],
		'warn': ['#ffc107', '#000'],
		'danger': ['#dc3545', '#000'],
		'light': ['#f8f9fa', '#000'],
		'dark': ['#343a40', '#fff'],
	}
	if (typeof styles == 'string') {
		styles = (Object.keys(stringPairings).includes(styles)) ? { 'background-color': stringPairings[styles][0], color: stringPairings[styles][1] } : {};
	}
	const css = {
		'background-color': 'transparent',
		'padding': '5px 10px',
		'font-weight': 'bold',
		'text-transform': 'uppercase',
		...styles
	}
	console.log(`%c[${title}]`, Object.entries(css).map((item) => { return item.join(': ') }).join('; '), text);
}