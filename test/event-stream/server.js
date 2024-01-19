const app        = require('express')();
const index_html = require('path').join(__dirname, 'index.html');

app.get('/', (req, res) => {
    res.sendFile(index_html);
});

app.get('/data', (req, res) => {
    res.header('Cache-Control', 'no-cache');
    res.header('Content-Type', 'text/event-stream');
	setInterval(() => {
		res.write(`x: ${new Date().toISOString(2).split('T').join(' - ').replace('Z', '')}\n\n`), 100;
	});
});

app.listen('7000');