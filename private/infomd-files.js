const fs = require('fs');
const path = require('path');

const idir = 'Client/DevTools';

// console.log({ idir })

function saveFile(data, filename) {
	fs.writeFile(filename, JSON.stringify(data, '\t', 4), () => {
		// console.log('File salvato!');
	});
}

function getJSFile(p) {
	let files = fs.readdirSync(p).map((item) => { return path.join(p, item).replaceAll('\\', '/')});
	return files.filter((item) => { return item.split('.').splice(-1)[0] == 'js'})[0]
}

function MDCreator(p, data) {
	const title = {
		h1: (t) => { return `# ${t}`},
		h2: (t) => { return `## ${t}`},
		h3: (t) => { return `### ${t}`},
		h4: (t) => { return `#### ${t}`},
		h5: (t) => { return `##### ${t}`},
		h6: (t) => { return `###### ${t}`},
	}
	let lines = [];
	if (Object.keys(data.old).includes('$class')) {
		lines.push(title.h1(data.old['$class'].replace(' {', '')));
	}
	let originals = Object.entries(data.old)
		.filter((item) => { return !item[0].startsWith('$')})
		.map((item) => { return item[1] });
	data.new.forEach((el, i) => {
		lines.push(title.h3(el));
		originals[i].split('\n').forEach((line) => {
			line = line.replaceAll('/**', '').replaceAll('*/', '')
			const addLine = () => { lines.push(((line[2] == '@') ? line : line.substr(1)).trim()) }
			if (line.trim().length >= 4) {
				addLine();
			} else if (line.trim().length <= 1) { lines.push('\n')}
		});
		lines.push('\n')
	})

	fs.writeFile(path.join(p, `Auto-${p.replaceAll('\\', '/').split('/').splice(-1)[0]}.md`), lines.join('\n'), () => {});
}

function writeMD(p, data) {
	const isClass = Object.keys(data).includes('$class');
	const className = (isClass) ? /([a-zA-Z0-9_]{1,})( \{)/.exec(data['$class'])[1] : null;
	const variableSection = '\\<variable\\>';
	const functionName = /[a-zA-Z0-9#_]{1,}\([a-zA-Z0-9,.= \(\)]{0,}\)/;
	let functions = Object.keys(data)
	.filter((item) => { return !item.startsWith('$') })
	.map((item) => {
		const functionParser = (finit) => {
			let tmp = /\([a-zA-Z0-9_.=, ]{0,}\)/.exec(finit)[0];
			const params = tmp.substr(1, tmp.length - 2).split(', ').map((i) => {
				const p = `\{[a-zA-Z0-9_., \<\>\'\|\(\)]{1,}\} ${i}`;
				let type = (RegExp(p).exec(data[item]) || ['{null}'])[0];
				[ ['{', '\\<'], ['}', '\\>'], ['(', '' ], [')', '' ], ].forEach((c) => {
					type = type.replaceAll(c[0], c[1]);
				})
				return type;
			});
			const baseName = finit.replace(/\([a-zA-Z0-9_., ]{1,}\)/, '');
			const doesReturnSomething = data[item].indexOf('@returns') > -1;
			let text = `${baseName}(${params.join(', ')})`
			if (doesReturnSomething) {
				const returnType = /@returns \{[a-zA-Z0-9_,| \<\>]{1,}\}/.exec(data[item])[0].replace('@returns ', '');
				text += ` -> ${returnType.substr(1, returnType.length - 2)}`
			}
			return text;
		};
		let name = functionName.exec(item)[0];
		return  (name.startsWith('constructor')) ? `${variableSection} = new ${functionParser(name).replace('constructor', className)}` :
				(item.startsWith('static get ') && isClass) ? `${className}.${name.replace('()', '')}` : 
				(item.startsWith('static set ') && isClass) ? `${className}.${name.split('(')[0]} = ${variableSection}` : 
				(item.startsWith('static ') && isClass) ? `${className}.${functionParser(name)}` :
				(item.startsWith('get ') && isClass) ? `${variableSection}.${name.replace('()', '')}` : 
				(item.startsWith('set ') && isClass) ? `${variableSection}.${name.split('(')[0]} = ${variableSection}` : 
				`${variableSection}.${functionParser(name)}`;
	});
	let newObject = {
		old: data,
		new: functions,
	};
	MDCreator(p, newObject);
	saveFile(newObject, 'tmp.json')
}

function parser(p) {
	let file = getJSFile(p);
	content = Buffer.from(fs.readFileSync(file)).toString();
	let lines = content.split('\n');
	let wasPreviousValid = false;
	let obj = {};
	let tempStorage = [];
	checkLines: for (let x = 0; x < lines.length; x ++) {
		let line = lines[x].trim();
		if (line.startsWith('class')) {
			obj['$class'] = line.trim();
		}
		if (line.startsWith('/**') || line.startsWith('*')) {
			tempStorage.push(line);
			wasPreviousValid = true;
		} else if (wasPreviousValid) {
			obj[line] = tempStorage.join('\n');
			tempStorage = [];
			wasPreviousValid = false;
		}
	}
	if (Object.keys(obj).length > 0) {
		writeMD(p, obj);
	}
}



console.clear();
parser(idir);

const clientDir = 'Client';

// fs.readdir(clientDir, (err, files) => {
// 	errorCheck: if (err) throw err;
// 	files = files.map((file) => { return path.join(clientDir, file)});
// 	console.log(files);
// 	fileReader: for (let p = 0; p < files.length; p ++) {
// 		let currentDir = files[p];
// 		let currentFiles = fs.readdirSync(currentDir)
// 			.map((file) => { return path.join(currentDir, file)})
// 			.filter((file) => { return file.split('.').splice(-1)[0] == 'js'});
// 		if (currentFiles.length > 0) {
// 			ignoreError: try {
// 				parser(currentDir);
// 			} catch {
// 				console.log(currentDir);
// 			}
// 		}
// 	}
// })