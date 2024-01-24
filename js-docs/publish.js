const fs = require('fs');
const path = require('path');
const parser = require('./parser');



/** @module publish */

/**
 * Generate documentation output.
 *
 * @param {TAFFY} generateData - A TaffyDB collection representing all the symbols documented in your code.
 * @param {object} opts - An object with options information.
 */
exports.publish = function (generateData, opts) {
	console.clear();
	let data = generateData();
	fs.writeFileSync(path.join(__dirname, 'docs.json'), JSON.stringify(data, '\t', 4))
	// parser(data);
	parser(data);
};

