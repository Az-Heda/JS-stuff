const fs = require('fs');
const path = require('path');

console.clear();

const inputDir = 'Client/';
const outputDir = '.vscode/';

let allData = {};

async function readFile(file) {
	const fname = file.replaceAll('\\', '/').split('/').at(-1).split('.')[0];
	let content = Buffer.from(fs.readFileSync(file)).toString().split('\n').map(i => i.trim());
	let codeHeader = content.indexOf('```html')
	let tag = content[codeHeader + 1]
	allData[`Import ${fname}`] = {
		"scope": "html",
		"prefix": `!az_${(tag.trim().startsWith('<script')) ? 'js' : 'css'}_import_${fname}`,
		"body": [
			tag,
			"$0"
		],
		"description": `Import module ${fname.toUpperCase()}`
	}
	return Promise.resolve(tag);
}

async function getImport(d) {
	return new Promise(resolve => {
		if (fs.lstatSync(d).isDirectory()) {
			fs.readdir(d, async (err, files) => {
				if (err) throw err;
				let md = files.filter(i => i.endsWith('.md')).map(i => path.join(d, i));
				if (md.length > 0) {
					resolve(await readFile(md[0]));
				}
				else resolve(md);
			})
		} else {
			resolve(null);
		}
	})
}

fs.readdir(inputDir, async (err, files) => {
	if (err) throw err;
	files = files.filter(fn => !fn.startsWith('_')).map(fn => path.join(inputDir, fn))
	for (let file of files) {
		await getImport(file);
	}
	fs.writeFileSync(path.join(outputDir, 'Imports.code-snippets'), JSON.stringify(allData, '\t', 4));
})