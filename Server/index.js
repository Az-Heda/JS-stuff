const fs = require('fs');
const path = require('path');

console.clear();

function get() {
	let obj = {};
	const filelist = fs.readdirSync(__dirname).map((item) => { return path.join(__dirname, item) });
	for (let pos = 0; pos < filelist.length; pos ++) {
		if (!filelist[pos].endsWith('_.js') && !filelist[pos].endsWith('index.js')) {
			let files = fs.readdirSync(filelist[pos]);
			let endpoint = path.join(filelist[pos], files.filter((item) => { return item.split('.').splice(-1)[0] == 'js'})[0].replace('.js', ''));
			let endpointName = filelist[pos].replaceAll('\\', '/').split('/').splice(-1)[0];
			obj[endpointName] = require('.'+endpoint.substr(__dirname.length).replaceAll('\\', '/'));
		}
	}
	return obj
}
module.exports = get();