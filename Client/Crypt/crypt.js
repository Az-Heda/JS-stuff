class UUID {
	static #_UUIDGenerated = [];
	static get() {
		let uuid = window.crypto.randomUUID();
		return (this.#_UUIDGenerated.push(uuid), uuid);
	}

	static get histoy() {
		return this.#_UUIDGenerated;
	}
}

class Crypt_RSA {
	static #_encryptionName = 'RSA-OAEP';
	static #_hashAlgorithm = 'SHA-256';
	static #_publicKeyFormat = 'spki';
	static #_privateKeyFormat = 'pkcs8' ;
	static #_modulusLength = 1024 * 4;
	static #_isExtractable = true;
	static #_publicKey = null;
	static #_privateKey = null;
	
	/**
	 * @async
	 * @param {boolean} autoSet __Default__: `false`
	 * @param  {...Function} cb List of the callback functions to call once the keys are generated
	 * @returns {{ publicKey: string, privateKey: string }} Object with publicKey and privateKey just generated
	 */
	static async generateKeys(autoSet=false, ...cb) {
		cb = this.#_callbackHandler(cb);
		return new Promise(async(resolve) => {
			const algorithm = {
				name: this.#_encryptionName,
				hash: this.#_hashAlgorithm,
				modulusLength: this.#_modulusLength,
				publicExponent: new Uint8Array([1, 0, 1]),
			};
			const keyUsage = ['encrypt', 'decrypt'];
			let keys = await window.crypto.subtle.generateKey(algorithm, this.#_isExtractable, keyUsage)
			let keysToExport = await this.#_export(keys);
			if (autoSet) {
				this.#_publicKey = keysToExport.publicKey;
				this.#_privateKey = keysToExport.privateKey;
			}
			for (const f of cb) { f(keysToExport); }
			resolve(keysToExport);
		});
	}

	/**
	 * @description Clear out the current set of public/private keys and returns it
	 * @returns {{ publicKey: string, privateKey: string }} Old pair of public/private keys
	 */
	static clearKeys() {
		let oldPublic, oldPrivate;
		[oldPublic, this.#_publicKey] = [this.#_publicKey, null];
		[oldPrivate, this.#_privateKey] = [this.#_privateKey, null];
		return { publicKey: oldPublic, privateKey: oldPrivate }
	}

	/**
	 * @async
	 * @description This function will take 1 string as an input and returns a promise once the string is hashed with RSA
	 * @param {string} text String to encode with the `Public Key`
	 * @param  {...Function} cb List of the callback functions to call once the text is encrypted
	 * @returns {Promise<string | undefined>} Encoded string for the given text
	 */
	static async encrypt(text, ...cb) {
		cb = this.#_callbackHandler(cb);
		return new Promise(async (resolve) => {
			try {
				const pub = await this.#_importPublicKey();
				const encrypted = await this.#_encryptRSA(pub, new TextEncoder().encode(text));
				const encryptedBase64 = window.btoa(this.#_ab2str(encrypted));
				const txt = encryptedBase64.replace(/(.{64})/g, '$1\n');
				for (const f of cb) { f(txt); }
				resolve(txt); 
			} catch(err) {	
				// throw new Error(err);
				resolve(undefined);
			}
		})
	}

	/**
	 * @async
	 * @description This function will take 1 hashed string as an input and returns a promise once the string is unhashed successfully
	 * @param {string} text String to decode with the `Private Key`
	 * @param  {...Function} cb List of the callback functions to call once the text is decrypted
	 * @returns {Promise<string | undefined>} Encoded string for the given text
	 */
	static async decrypt(enctext, ...cb) {
		cb = this.#_callbackHandler(cb);
		return new Promise(async (resolve) => {
			try {
				const priv = await this.#_importPrivateKey();
				const txt = await this.#_decryptRSA(priv, this.#_str2ab(window.atob(enctext)));
				for (const f of cb) { f(txt); }
				resolve(txt)
			} catch(err) {
				// throw new Error(err);
				resolve(undefined);
			}
		})
	}

	/**
	 * @async
	 * @returns {Promise<CryptoKey>} Public key to use for the text encryption
	 */
	static async #_importPublicKey() {
		let algorithm = { name: this.#_encryptionName, hash: this.#_hashAlgorithm };
		let keyUsage = ['encrypt'];
		return await window.crypto.subtle.importKey(this.#_publicKeyFormat, this.#_getSpkiDer(), algorithm,  this.#_isExtractable, keyUsage)
	}

	/**
	 * @async
	 * @returns {Promise<CryptoKey>} Private key to use for the text decryption
	 */
	static async #_importPrivateKey() {
		let algorithm = { name: this.#_encryptionName, hash: this.#_hashAlgorithm };
		let keyUsage = ['decrypt'];
		return await window.crypto.subtle.importKey(this.#_privateKeyFormat, this.#_getPkcs8Der(), algorithm,  this.#_isExtractable, keyUsage);
	}

	/**
	 * @async
	 * @param {CryptoKey} key Key to use for the encryption
	 * @param {string} text Text to encode
	 * @returns {string} Text encrypted with the given key
	 */
	static async #_encryptRSA(key, text) {
		return await window.crypto.subtle.encrypt({ name: this.#_encryptionName }, key, text)
	}

	/**
	 * @async
	 * @param {CryptoKey} key Key to use for the decryption
	 * @param {ArrayBuffer} enctext Text to decrypt (in an ArrayBuffer)
	 * @returns {string} Text decrypted
	 */
	static async #_decryptRSA(key, enctext) {
		return new TextDecoder().decode(await window.crypto.subtle.decrypt({ name: this.#_encryptionName }, key, enctext));
	}

	/**
	 * @returns {ArrayBuffer} Public key body
	 */
	static #_getSpkiDer() {
		const pemHeader = '-----BEGIN PUBLIC KEY-----';
		const pemFooter = '-----END PUBLIC KEY-----';
		let pemContents = this.#_publicKey.substring(pemHeader.length, this.#_publicKey.length - pemFooter.length);
		let binaryDerString = window.atob(pemContents);
		return this.#_str2ab(binaryDerString);
	}

	/**
	 * @returns {ArrayBuffer} Private key body
	 */
	static #_getPkcs8Der(){
		const pemHeader = '-----BEGIN PRIVATE KEY-----';
		const pemFooter = '-----END PRIVATE KEY-----';
		var pemContents = this.#_privateKey.substring(pemHeader.length, this.#_privateKey.length - pemFooter.length);
		var binaryDerString = window.atob(pemContents);
		return this.#_str2ab(binaryDerString); 
	}

	/**
	 * @param {string} str String to convert in an ArrayBuffer
	 * @returns {ArrayBuffer} Array Buffer of the given string
	 */
	static #_str2ab(str) {
		const buff = new ArrayBuffer(str.length);
		const buffView = new Uint8Array(buff);
		for (let i = 0; i < str.length; i ++) {
			buffView[i] = str.charCodeAt(i);
		}
		return buff;
	}

	/**
	 * @param {ArrayBuffer} buff ArrayBuffer to convert into a string
	 * @returns {string} String of the given ArrayBuffer
	 */
	static #_ab2str(buff) {
		return String.fromCharCode.apply(null, new Uint8Array(buff));
	}

	/**
	 * @param {CryptoKey} key Public key to export
	 * @returns {string} Public key body
	 */
	static async #_exportPublicKey(key) {
		const exported = await window.crypto.subtle.exportKey(this.#_publicKeyFormat, key);
		const exportedAsString = this.#_ab2str(exported);
		const exportedAsBase64 = window.btoa(exportedAsString);
		const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
		return Promise.resolve(pemExported)
	}

	/**
	 * @param {CryptoKey} key Private key to export
	 * @returns {string} Private key body
	 */
	static async #_exportPrivateKey(key) {
		const exported = await window.crypto.subtle.exportKey(this.#_privateKeyFormat, key);
		const exportedAsString = this.#_ab2str(exported);
		const exportedAsBase64 = window.btoa(exportedAsString);
		const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
		return Promise.resolve(pemExported)
	}

	/**
	 * @param {{ publicKey: CryptoKey, privateKey: CryptoKey }} keyPair Public/Private keys to convert into strings
	 * @returns {{ publicKey: string, privateKey: string }} Public/Private keys in string format
	 */
	static async #_export(keyPair) {
		return new Promise(async(resolve) => {
			const pubKey = await this.#_exportPublicKey(keyPair.publicKey);
			const prvKey = await this.#_exportPrivateKey(keyPair.privateKey);
			resolve({ publicKey: pubKey, privateKey: prvKey });
		})
	}

	/**
	 * @param {array<Function>} cb Array with all of the possible callbacks
	 * @returns {array<Function>} Array with all of the valid callbacks
	 */
	static #_callbackHandler(cb) {
		if (cb == null || typeof cb == 'function') {
			cb = [ cb ];
		}
		return cb.filter(f => f !== null && typeof f == 'function');
	}
	

	static get formats() { return { publicKey: this.#_publicKeyFormat, privateKey: this.#_privateKeyFormat }}
	static get encryption() { return this.#_encryptionName }
	static get hashAlgorithm() { return this.#_hashAlgorithm }
	static get publicKey() { return this.#_publicKey; }
	static get privateKey() { return this.#_privateKey; }

	static set publicKey(k) { return (this.#_publicKey = k, this.#_publicKey === k); }
	static set privateKey(k) { return (this.#_privateKey = k, this.#_privateKey === k); }
}

(async() => {
	const s = 'This text was encrypted, and now your\'re reading it once it has been decrypted! 🐳';
	await Crypt_RSA.generateKeys(true);
	const e = await Crypt_RSA.encrypt(s, console.info);
	const d = await Crypt_RSA.decrypt(e, console.info)
	console.info('Is the same message? ', s === d )
	Crypt_RSA.clearKeys();
})();