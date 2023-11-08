class wrapper {
	static funcs = [];

	static get getName() {
		return this.name
	}

	static add(name) {
		this.funcs.push(name);
	}
	// const e = (new Error(text)).stack;
	// const fname = /at [a-zA-Z0-9]{1,100}/.exec(e)[0].split(' ')[1]

	static start(name) {
		fetch(`${document.currentScript.getAttribute('src')}`)
		.then((res) => res.text())
		.then((data) => {
			let lines = data.split('\n').map((item) => { return item.replaceAll('\t', '').replaceAll('\n', '').replaceAll('\r', '')})
			for (let pos = 0; pos < lines.length; pos ++) {
				let line = lines[pos];
				if (line.startsWith(`${this.name}.add('${name}')`) || line.startsWith(`${this.name}.add("${name}")`)) {
					const functionName = /^function\s+([\w\$]+)\s*\(/.exec(lines[pos+1]);
					if (functionName.length > 1) {
						this.setCallback(window[functionName[1]])
					}
				}
			}
		})
		.catch(console.error);
	}

	static setCallback(wfunc, funcs) {
		let values = [];
		if (funcs?.before) {
			values.push(funcs.before());
		}
		values.push(wfunc());
		if (funcs?.after) {
			values.push(funcs.after());
		}
		return values;
	}
}




wrapper.add('idk')
function prova() {
	console.log('Prova è stata chiamata!');
}


wrapper.start('idk')
