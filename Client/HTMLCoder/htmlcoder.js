class HTMLCoder {
	static #_compressionMethod = 'gzip';

	/**
	 * @param {HTMLElement} htmlElement HTML element to start the recursion, this function will reach every child of this HTMLElement
	 * @returns {string} Code to copy the element structure
	 */
	static async save(htmlElement, start=true) {
		const obj = { isText: false };
		if (/(HTML[a-zA-Z]{1,}Element)/.exec(htmlElement.constructor.name)) {
			obj.tag = htmlElement.tagName.toLowerCase();
			obj.attributes = {};
			obj.children = [];
			Array.from(htmlElement.attributes).forEach((a) => { obj.attributes[a.name] = a.value; });
			for (let c of Array.from(htmlElement.childNodes)) { obj.children.push(await this.save(c, false)) }
			if (Object.keys(obj.attributes).length === 0) { delete obj.attributes; }
			if (obj.children.length === 0) { delete obj.children; }
			return (start) ? this.#_arrayBufferToBase64Url(await this.#_compress(JSON.stringify(obj))) : Promise.resolve(obj);
		}
		else if (htmlElement.constructor.name === 'Text') {
			obj.isText = true;
			obj.content = htmlElement.data;
			return obj;
		}
		return {};
	}

	/**
	 * @param {string} b64 String of the saved HTMLElement
	 * @returns {HTMLElement} HTMLElement associated with the given input string
	 */
	static async load(b64, parent=null) {
		let data = this.#_base64UrlToArrayBuffer(b64);
		let htmlElement = JSON.parse(await this.#_decompress(data));
		return Promise.resolve(this.#_tagParser(htmlElement, parent))
	}


	static #_tagParser(htmlElements, parent=null) {
		if (!htmlElements.isText) {
			console.log(htmlElements)
			let tag = document.createElement(htmlElements.tag)
			for (const [k, v] of Object.entries(htmlElements?.attributes || {})) { tag.setAttribute(k, v); }
			for (let [_, cv] of Object.entries(htmlElements.children || {})) { this.#_tagParser(cv, tag); }
			if (parent !== null) { parent.appendChild(tag); }
			return tag;
		}
		else {
			let tn = document.createTextNode(htmlElements?.content || '');
			if (parent !== null) { parent.appendChild(tn); }
			return tn;
		}
	}

	static #_compress(string) {
		const byteArray = new TextEncoder().encode(string);
		const cs = new CompressionStream(this.#_compressionMethod);
		const writer = cs.writable.getWriter();
		writer.write(byteArray);
		writer.close();
		return new Response(cs.readable).arrayBuffer();
	}

	static #_decompress(byteArray) {
		const cs = new DecompressionStream(this.#_compressionMethod);
		const writer = cs.writable.getWriter();
		writer.write(byteArray);
		writer.close();
		return new Response(cs.readable).arrayBuffer().then(function (arrayBuffer) {
			return new TextDecoder().decode(arrayBuffer);
		});
	}

	static #_arrayBufferToBase64Url(arrayBuffer) {
		let base64Url = window.btoa(String.fromCodePoint(...new Uint8Array(arrayBuffer)));
		base64Url = base64Url.replaceAll('+', '-');
		base64Url = base64Url.replaceAll('/', '_');
		return base64Url;
	}

	static #_base64UrlToArrayBuffer(base64Url) {
		let base64 = base64Url.replaceAll('-', '+');
		base64 = base64.replaceAll('_', '/');
		const binaryString = window.atob(base64);
		const length = binaryString.length;
		const bytes = new Uint8Array(length);
		for (let i = 0; i < length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes.buffer;
	}
}