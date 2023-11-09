// class wrapper {
// 	static funcs = [];

// 	static get getName() {
// 		return this.name
// 	}

// 	static set add(name) {
// 		this.funcs.push(name);
// 	}

// 	static get add() { return this; }
// 	// const e = (new Error(text)).stack;
// 	// const fname = /at [a-zA-Z0-9]{1,100}/.exec(e)[0].split(' ')[1]

// 	static get start() {
// 		fetch(`${document.currentScript.getAttribute('src')}`)
// 		.then((res) => res.text())
// 		.then((data) => {
// 			let lines = data.split('\n').map((item) => { return item.replaceAll('\t', '').replaceAll('\n', '').replaceAll('\r', '')})
// 			for (let pos = 0; pos < lines.length; pos ++) {
// 				let line = lines[pos];
// 				if (line.startsWith(`${this.name}.add`)) {
// 					const functionName = /^function\s+([\w\$]+)\s*\(/.exec(lines[pos+1]);
// 					if (functionName.length > 1) {
// 						console.log(functionName[1])
// 						// this.setCallback(window[functionName[1]])
// 					}
// 				}
// 			}
// 		})
// 		.catch(console.error);
// 	}
// }

async function wrapper() {
	const e = (new Error('')).stack;
	const prepareVarsGlobalVars = function() {
		return Object.keys(window).filter((item) => { return item.startsWith('$$') })
	}
	const getFunctionUnderWrapper = function(lines) {
		let matches = [];
		let lastIndex = 0;
		while (true) {
			let m = /:[0-9]{1,10}:/.exec(e.substr(lastIndex));
			if (!!m) {
				lastIndex += m.index+1;
				matches.push(m);
			}
			else { break; }
		}
		const setupAtLine = +(matches.pop()[0]).replaceAll(':', '');
		let importantLines = lines.splice(setupAtLine-1, 2)
		let fname = /^(function )([a-zA-Z0-9_]{1,256})/.exec(importantLines[1]);
		fname = fname[fname.length - 1];
		let f = window[fname];
		return { name: fname, function: f };
	}
	
	fetch(`${document.currentScript.getAttribute('src')}`)
	.then((res) => res.text())
	.then((data) => {
		let lines = data.split('\n').map((item) => { return item.replaceAll('\t', '').replaceAll('\n', '').replaceAll('\r', '')})
		const d = getFunctionUnderWrapper(lines)
		window[`$${d.name}`] = true;
		console.warn(d)
	});
}


wrapper()
function test1(params) {
	console.log('Test 1 function');
	return params
}

wrapper()
function test2() {
	console.log('Test 2 function');
	return false;
}

$$test1
function prova() {
	console.log('Prova function')
}

prova()