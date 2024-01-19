const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function checkJSDocs(...args) {
	return new Promise((resolve, reject) => {
		exec('jsdoc --version', (err, stdout, stderr) => {
			// if (err) throw err;
			// if (stderr) throw stderr;

			[resolve, reject][+(stdout.length == 0)]({ args, stdout, stderr, err });
		})
	})
}

function generateDocs({ args }) {
	let fpath = args[0];
	if (!path.isAbsolute(fpath)) {
		fpath = path.resolve(fpath);
	}
	fpath = path.normalize(fpath)
	const template = path.join(__dirname, 'node_modules', 'clean-jsdoc-theme');
	const command = `jsdoc "${fpath}" -t "${template}"`
	console.log({fpath, template, command});
}


console.clear();
process.chdir(__dirname);
const fp = path.join('Client', 'Crypt', 'crypt.js')
checkJSDocs(fp).then(generateDocs).catch(console.error);