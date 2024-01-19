const fs = require('fs');
const path = require('path');

console.clear();

let lines = [];
let baseDirs = [['Client', ''], ['Server', '(__BETA__)']];
let files = baseDirs.map((item) => {
	return fs.readdirSync(item[0])
	.map((i) => {
		return path.join(item[0], i).replaceAll('\\', '/')
	}).filter((ef) => {
		return fs.lstatSync(ef).isDirectory()
	})
});

files = files[0].concat(files[1])

function generate(fname) {
	let linesAdded = 0;
	lines.push(`# JS Tools \n`)
	baseDirs.forEach((dir, i) => {
		if (i == 1) return;
		lines.push(`\n# ${dir[0]} ${dir[1]}\n`)
		files.filter((item) => {
			return item.startsWith(dir[0]);
		}).forEach((f, i) => {
			let allf = fs.readdirSync(f)
			allf.sort();
			console.log(allf);
			let md = allf.filter((item) => { return item.split('.').splice(-1)[0].toLowerCase() == 'md'})
			.map((item) => { return path.join(f, item).replaceAll('\\', '/'); });
			console.log(md);
			if (md.length > 0) {
				lines.push(`${++linesAdded}. [${f.split('/')[1]}](${md[0]})`)
			} else {
				// lines.push(`${i+1}. ${f.split('/')[1]} (__Not vlaid__)`)
			}
		})
		if (dir[0] == 'Server') {
			// let package = JSON.parse(Buffer.from(fs.readFileSync('package.json')).toString())
			// lines.push('\n');
			// lines.push('### Server side dependencies:')
			// for (let [k, v] of Object.entries(package.dependencies)) {
			// 	lines.push(`- ${k} @${v}`)
			// }
		}
	})
	fs.writeFileSync(fname, lines.join('\n'))
}


generate('README.md');