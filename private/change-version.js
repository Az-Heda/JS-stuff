const fs = require('fs');

console.clear();

async function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms, ms);
	})
}

fs.readFile('package.json', async(err, data) => {
	if (err) throw err;
	data = JSON.parse(Buffer.from(data).toString());
	data.version = (+(data.version.replaceAll('.', '')) + 1).toString().split('').join('.');
	fs.writeFileSync('package.json', JSON.stringify(data, ' ', 4))
	await sleep(5000);
});