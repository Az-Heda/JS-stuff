class MySocket {
	/**
	 * @param {str} url Url with protocol web socket
	 * @returns {MySocket}
	 * 
	 * __Example__
	 * ```js
	 * new WebSocket('ws://localhost:5500')
	 * new WebSocket('ws://127.0.0.1:8000')
	 * ```
	 */
	constructor(url) {
		this.url = url;
		this.socket = new WebSocket(this.url);
		this.history = [];
	}

	/**
	 * @param {('message' | 'error' | 'close' | 'open')} type 
	 * @param {function} f
	 */
	on(type, f) {
		const valid = ['message', 'error', 'close', 'open'];
		if (valid.includes(type)) {
			this.socket.addEventListener(type, (type !== 'message') ?
				f :
				(event) => { f(JSON.parse(event.data)) }
			);
		}
	}

	/**
	 * @param {str} name 
	 * @param {object} o 
	 */
	send(name, o) {
		let data = Object.assign({ _id: name }, { ...o });
		this.history.push(data);
		this.socket.send(JSON.stringify(data));
	}
}