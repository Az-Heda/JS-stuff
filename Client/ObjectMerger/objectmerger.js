/**
 * @param {object} source 
 * @param {object} replacer 
 * @returns {object}
 */
function Merger(source, replacer) {
	if (!replacer) return source;
	let newObject = {};
	for (let [k, v] of Object.entries(source)) {
		newObject[k] = (v.constructor.name !== 'Object')
			? replacer[k] || v
			: Merger(v, replacer[k]);
	}
	for (let [k, v] of Object.entries(replacer)) {
		if (!Object.keys(newObject).includes(k)) {
			newObject[k] = v;
		}
	}
	return newObject
}