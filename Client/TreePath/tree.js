function TreePath () {
	let err = new Error();
	let { stack } = err;
	let fp = stack.split(' ')
	.filter((_, i) => {
		return 	i > 2 && (stack.split(' ')[i-1] == 'at' || stack.split(' ')[i - 2] == 'at')
	})
	.map((i) => {
		return i.split('/').splice(-1)[0]
	})
	fp = fp.splice(2)
	if (fp.length % 2 == 0) {
		let fo = {};
		for(let p = 0; p < fp.length; p += 2) {
			let tv = fp[p+1];
			'()\n'.split('').forEach((c) => {
				tv = tv.replaceAll(c, '');
			})
			let parts = tv.split(':')
			fo[fp[p]] = { file: parts[0], row: +parts[1], col: +parts[2] };
		}
		console.log(fo)
		return fo;
	}
	return {};
}