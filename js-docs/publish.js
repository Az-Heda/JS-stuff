const fs = require('fs');
const path = require('path');

/** @module publish */

function htmlGenerator(lines) {
	return '';
}

/**
 * Generate documentation output.
 *
 * @param {TAFFY} generateData - A TaffyDB collection representing
 *                       all the symbols documented in your code.
 * @param {object} opts - An object with options information.
 */
exports.publish = function(generateData, opts) {
    // do stuff here to generate your output files
	let data = generateData();
	let lastClass = '';
	let lines = {};

	const ff = (i) => {
		return !(i?.undocumented) || i?.kind == 'member';
	}
	fs.writeFileSync(path.join(__dirname, 'out2.json'), JSON.stringify(data._items.filter(ff), '\t', 4))
	for (let item of data._items) {

		if (item.kind == 'class') {
			lastClass = item.name;
			let odir = path.join(__dirname, 'autodocs', item.name);
			if (!fs.existsSync(odir)) {
				fs.mkdirSync(odir, { recursive: true });
			}
			lines[item.name] = { index: path.join(odir, 'index.html'), lines: [] };
		}
		if (item?.memberof == lastClass) {
			lines[item?.memberof].lines.push(item.longname);
		}
	}

	for (let [k, v] of Object.entries(lines)) {
		console.log(v);
		fs.writeFileSync(v.index, htmlGenerator(v.lines))
	}
};

