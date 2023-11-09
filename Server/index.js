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
			let endpointName = filelist[pos];
			console.log(endpointName)
			// obj[endpointName] = require('.'+endpoint.substr(__dirname.length).replaceAll('\\', '/'));
			// const requirePath = `./${filelist[pos].split('.')[0]}/${fs.readdirSync(path.join(__dirname, filelist[pos]))}`;
			// console.log(requirePath);
			// obj[filelist[pos].split('.')[0]] = require(requirePath);
		}
	}
	return obj
}
module.exports = get();

// module.exports = {
// 	DownloadFile: require('./DownloadFile/downloadFile'),
// 	WebServer: require('./WebServer/webserver'),
// 	Sleep: require('./Sleep/sleep'),
// };