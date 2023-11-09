const fs = require('fs');
const path = require('path');

console.clear();

let lines = [];
let baseDirs = ['Client', 'Server'];
let files = baseDirs.map((item) => {
	return fs.readdirSync(item)
	.map((i) => {
		return path.join(item, i).replaceAll('\\', '/')
	}).filter((ef) => {
		return fs.lstatSync(ef).isDirectory()
	})
});

files = files[0].concat(files[1])

function generate(fname) {
	lines.push(`# JS Tools \n`)
	baseDirs.forEach((dir) => {
		lines.push(`\n# ${dir}\n`)
		files.filter((item) => {
			return item.startsWith(dir);
		}).forEach((f, i) => {
			let allf = fs.readdirSync(f)
			let md = allf.filter((item) => { return item.split('.').splice(-1)[0].toLowerCase() == 'md'})
			.map((item) => { return path.join(f, item).replaceAll('\\', '/'); });
			console.log(md);
			lines.push(`${i+1}. [${f.split('/')[1]}](${md[0]})`)
		})
	})
	fs.writeFileSync(fname, lines.join('\n'))
}


generate('README.md');