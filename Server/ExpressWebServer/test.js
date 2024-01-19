const ews = require('./ews');

const x = new ews('10.160.4.56', 7654);

let cb0 = (_, res) => { res.status(200).json({ test: true, a: 1, b: 2 }) };
let cb1 = (_, res) => { res.status(200).send('Congrats') };
let cb2 = (req, res) => {
	let a = req.query?.a;
	let b = req.query?.b;
	if (a == undefined || b == undefined) {
		res.status(400).send(`Error:\nValue for ${(a == undefined) ? 'a' : ''} ${(b == undefined) ? 'b' : ''} is missing`);
	}
	else {
		if (!(a == +a && b == +b)) {
			return res.status(500).send('One value is not a number');
		}
		try {
			let sum = +a + +b;
			res.status(200).json({ a: +a, b: +b, sum });
		} catch(err) {
			res.status(500).send(err);
		}
	}
}

let cb3 = (req, res) => {
	const page = req.params?.page;
	if (page == +page && page == parseInt(page)) {
		res.status(200).send(`You're on page ${page}`);
	}
	else {
		res.status(404).send(`Page not found`);
	}
}

let cb4 = (req, res) => {
	let code = req.params?.code || 500;
	let x = new Error('This is an error');
	res.status(+code).send(x.stack);	
}

let cb5 = (req, res) => {
	let x = new Error('This is an error');
	res.status(500).send(x.stack);	
}

let cb6 = (req, res) => {
	res.status(307).redirect(307, '/give_me_plain_text')
}

x.route('/give_me_json', 'get', cb0)
x.route('/give_me_plain_text', 'get', cb1)
x.route('/add', 'get', cb2);
x.route('/page/:page/', 'get', cb3);
x.route('/error/:code', 'get', cb4);
x.route('/error/', 'get', cb5);
x.route('/redirect', 'get', cb6);

x.start();

