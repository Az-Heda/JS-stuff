class Search {
	static import() {
		if (typeof window['Fuse'] === 'undefined') {
			let tag = document.createElement('script');
			tag.setAttribute('src', 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0');
			document.head.appendChild(tag);
		}
	}

	// https://www.fusejs.io/api/options.html
	static defaultValus = {
		includeScore: true,
		isCaseSensitive: false,
		minMatchCharLength: 1,
		shouldSort: true,
		findAllMatches: true,
		threshold: 0.6,
		useExtendedSearch: false,
	}

	get default() {
		return this.constructor.defaultValus;
	}

	constructor(arr, options={}) {
		this.config = {
			includeScore: (Object.keys(options).includes('isCaseSensitive')) ? options.includeScore : this.default.includeScore,
			isCaseSensitive: (Object.keys(options).includes('isCaseSensitive')) ? options.isCaseSensitive : this.default.isCaseSensitive ,
			findAllMatches: (Object.keys(options).includes('findAllMatches')) ? options.findAllMatches : this.default.findAllMatches,
			useExtendedSearch: (Object.keys(options).includes('useExtendedSearch')) ? options.useExtendedSearch : this.default.useExtendedSearch,
			minMatchCharLength: options?.minMatchCharLength || this.default.minMatchCharLength,
			shouldSort: options?.shouldSort || this.default.shouldSort,
			threshold: options?.threshold || this.default.threshold,
			keys: this.#_validateKeys(options?.keys || []),
		}
		this.fuse = new Fuse(arr, this.config);
	}

	search(q) {
		let results = this.fuse.search(q).map(i => (i.score = 1 - i.score, i));
		return results;
	}

	*searchGenerator(q) {
		let results = this.search(q);
		for (let result of results) {
			yield result;
		}
	}

	#_validateKeys(keys, weight=1, autoList=true) {
		switch(keys.constructor.name) {
			case 'Array':
				let darr = [];
				for (let item of keys) {
					if (item.constructor.name == 'String') {
						darr.push({ name: item, weight });
					}
					else if (item.constructor.name == 'Array') {
						if (item.length > 0 && item.length <= 2 && typeof item[0] == 'string') {
							darr.push({
								name: item[0],
								weight: (item.length !== 2) ? weight : (typeof item[1] !== 'number') ? weight : item[1],
							})
						}
					}
				}
				return darr;
			case 'String':
				return (autoList) ? [{ name: keys, weight }] : { name: keys, weight };
			case 'Object':
				return [keys];
			default:
				throw new Error('Key is in the front format');
			}
	}
}

window.addEventListener('load', () => { Search.import() });




// let arr = [
// 	{ title: 'The eminence in shadow', order: 'abcd', genre: ['isekai', 'op mc'] },
// 	{ title: 'Dr Stone', order: 'cdef', genre: ['science'] },
// 	{ title: 'Fate Series', order: 'efgh', genre: ['action', 'fantasy', 'time'] },
// 	{ title: '86: Eighty Sixth', order: 'ghij', genre: ['war', 'fight', 'mecha'] },
// 	{ title: 'My Instant Death Ability Is So Overpowered', order: 'ijkl', genre: ['isekai', 'op mc'] },
// ]

// setTimeout(() => {
// 	let s = new Search(arr, { keys: [
// 		['title', 2],
// 		['genre', 0.1],
// 	]})
// 	for (let row of s.searchGenerator('s')) {
// 		console.log(JSON.stringify(row));
// 	}
// 	window['s'] = s;
// }, 100)