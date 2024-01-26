const fs = require('fs');
const path = require('path');
const ews = require('./../Server/routing/ews');

console.clear();

function hostPage(req, res) {
	fs.readFile('docs-out.json', (err, data) => {
		if (err) throw err;
		data = JSON.parse(Buffer.from(data).toString());

		fs.readFile(path.join('website', 'index.html'), (err, html) => {
			if (err) throw err;

			html = Buffer.from(html).toString();
			html = html.replaceAll('\'$PLACEHOLDER\'', JSON.stringify(data));
			html = Buffer.from(html);

			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.write(html);
			res.end();
		});
	})
}

const sd = 'docs.localhost';

let server = new ews('localhost', 80);
server.addSubdomain(sd);

server.route('/', 'GET', hostPage, sd);
server.routeStatic('/assets', './website/assets', sd);
server.start();