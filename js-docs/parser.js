const fs = require('fs');
const path = require('path');

let lines = [];

function sortObject(obj) {
	const keys = Object.keys(obj);
	let newObject = {};
	keys.sort();
	for (let i = 0; i < keys.length; i++) {
		let k = keys[i];
		newObject[k] = obj[k];
	}
	return newObject;
};

function groupBy(list, key) {
	let outObject = {};
	for (let item of list) {
		if (Object.keys(item).includes(key)) {
			let val = item[key];
			if (Object.keys(outObject).includes(val)) {
				outObject[val].push(item);
			}
			else {
				outObject[val] = [item];
			}
		}
	}
	return outObject;
}

/**
 * @param {InputObject} data 
 */
function parser(data) {
	let items = data._items
		.filter(itemFilter)
		.map(itemParser);

	items = groupBy(items, 'type');
	parserMD(items);
	fs.writeFileSync(path.join(__dirname, 'docs-out.json'), JSON.stringify(items, '\t', 4));
	fs.writeFileSync(path.join(__dirname, 'docs.md'), lines.join('\n'));
}

/**
 * @param {item} item 
 * @returns {itemData}
 */
function itemParser(item) {
	item.longname = item.longname.replace('#', '.#')
	// item = JSON.parse(JSON.stringify(item));
	let outputItem = sortObject({
		name: item?.name,
		longname: item?.longname,
		kind: item?.kind,
		memberof: item?.memberof,
		scope: item?.scope,
		undocumented: item?.undocumented,
		comment: item?.comment,
		filename: item?.meta?.filename,
		path: item?.meta?.path,
		start: item?.meta?.range[0],
		end: item?.meta?.range[1],
		lineno: item?.meta?.lineno,
		columnno: item?.meta?.columnno,
		codeName: item?.meta?.code?.name,
		type: item?.meta?.code?.type,
		params: item?.params,
		paramnames: item?.meta?.code?.paramnames || [],
		returns: item?.returns,
		description: item?.description,
		async: item?.async || false,
	});
	return outputItem;
}

function itemFilter(item) {
	if (item.kind === 'package') return false;
	if (item.name === 'anonymous') return false;
	return true;
}

function parserMD(gdata) {
	let classes = gdata?.ClassDeclaration;
	let methods = gdata?.MethodDefinition;
	if (classes === undefined) return false;
	lines.push(`# JS-Docs parser\n`)
	for (let c of classes) {

		lines.push(`## ${c.longname}\n`);
		// Methods:
		const methodList = methods.filter(m => m.memberof == c.longname && m?.kind !== 'member');
		const getterList = methods.filter(m => m.memberof == c.longname && m?.kind === 'member' && m.paramnames.length == 0);
		const setterList = methods.filter(m => m.memberof == c.longname && m?.kind === 'member' && m.paramnames.length == 1);


		for (let [title, arr] of Object.entries({
			'Methods': methodList,
			'Getters': getterList,
			'Setters': setterList,
		})) {
			if (arr.length > 0) lines.push('\n' + MD.title3(title));
			for (let method of arr) {
				lines.push('\n' + MD.title4(method.name, { prefix: '-' }));
				if (method?.description) lines.push('\n' + method.description);
				if (method?.params.length > 0) lines.push(...MD.paramsTable(method), '');
				lines.push(...MD.returnTable(method?.returns || []), ' ');
				if (method?.async) lines.push('- `async method`')
				if (method?.scope == 'static') lines.push('- `static method`')
			}
			lines.push('\n', '<hr/>')
		}
	}
	if (lines[lines.length - 1] == '<hr/>') lines.pop();
}


const MD = {
	title1: (t, opt = {}) => `# ${opt?.prefix || ''} ${t} ${opt?.suffix || ''}`,
	title2: (t, opt = {}) => `## ${opt?.prefix || ''} ${t} ${opt?.suffix || ''}`,
	title3: (t, opt = {}) => `### ${opt?.prefix || ''} ${t} ${opt?.suffix || ''}`,
	title4: (t, opt = {}) => `#### ${opt?.prefix || ''} ${t} ${opt?.suffix || ''}`,
	title5: (t) => `##### ${t}`,
	bold: (t) => `**${t.trim()}** `,
	italic: (t) => `_${t.trim()}_ `,
	strikethrough: (t) => `~~${t.trim()}~~ `,
	returnTable: (arr) => {
		let parts = [
			'| Return types |',
			'| :----------: |',
		];

		for (let a of arr) {
			for (let t of (a?.type?.names || [])) {
				parts.push(`| ${t} |`)
			}
		}
		return parts;
	},
	paramsTable: (arr) => {
		let parts = [
			'\n',
			MD.title4('Parameters') + '\n',
			'| Name | Type | Default | Description |',
			'| ---- | :--: | :-----: | ----------- |',
		];
		for (let p of (arr?.params || [])) {
			parts.push(`| ${p?.name} | ${p?.type?.names.join(' | ')} | ${p?.defaultvalue || ''} | ${p?.description || ''} |`);
		}
		return parts;
	}
}

module.exports = parser;

