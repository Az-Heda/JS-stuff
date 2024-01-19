class CustomTable {
	get defaultConfig() {
		return Object.freeze({
			search: false,
			pagination: false,
			pagination_itemPerPage: 10,
			darkTheme: false,
			classes: Object.freeze({
				table: 'custom-table',

				thead: 'custom-table-head',
				tbody: 'Custom-table-body',
				tfoot: 'custom-table-foot',

				theadrows: 'custom-table-head-row',
				tbodyrows: 'custom-table-body-row',
				tfootrows: 'custom-table-foot-row',

				theadcell: 'custom-table-head-row-cell',
				tbodycell: 'custom-table-body-row-cell',
				tfootcell: 'custom-table-foot-row-cell',

				tfootleftcell: 'custom-table-foot-left',
				tfootrightcell: 'custom-table-foot-right',
			})
		});
	}
	/**
	 * @param {object} config.data
	 */
	constructor(config={}, parent=null) {
		this.config = config;
		this.container = document.createElement('div');
		this.container.style.display = 'flex'
		this.element = document.createElement('table');
		this.thead = document.createElement('thead');
		this.tbody = document.createElement('tbody');
		this.tfoot = document.createElement('tfoot');
		if (this.config?.darkTheme !== null) {
			if (this.config?.darkTheme) {
				this.element.setAttribute('darkTheme', '');
			}
		}
		this.element.classList.add(...[this.defaultConfig.classes.table, this.config?.classes?.table || null].filter((i) => { return i !== null }))
		this.thead.classList.add(...[this.defaultConfig.classes.thead, this.config?.classes?.thead || null].filter((i) => { return i !== null }))
		this.tbody.classList.add(...[this.defaultConfig.classes.tbody, this.config?.classes?.tbody || null].filter((i) => { return i !== null }))
		this.tfoot.classList.add(...[this.defaultConfig.classes.tfoot, this.config?.classes?.tfoot || null].filter((i) => { return i !== null }))

		this.data = config?.data || [];
		
		this.container.appendChild(this.element);
		this.element.appendChild(this.thead);
		this.element.appendChild(this.tbody);
		this.element.appendChild(this.tfoot);

		if (this.data.length == 0) {
			throw new Error('Data is missing')
		}

		if (parent !== null) {
			this.render(parent);
		}
	}


	render(parent) {
		parent = (typeof parent === 'string') ? document.querySelector(parent) : parent;
		if (this.#_checkConstructorName(parent, /(HTML[a-zA-Z]{1,})Element/)) {
			this.parent = parent;
			this.parent.appendChild(this.container);
			this.#_insertData();
		}
	}

	#_setHeader(page=-1) {
		if ('search' in this.config || this.defaultConfig.search) {
			console.log('Seach required');
		}
		let tr = document.createElement('tr');
		tr.classList.add(...[this.defaultConfig.classes.theadrows, this.config?.classes?.theadrows || null].filter((i) => { return i !== null }))
		for (let key of Object.keys(this.orientation)) {
			let th = document.createElement('th');
			th.classList.add(...[this.defaultConfig.classes.theadcell, this.config?.classes?.theadcell || null].filter((i) => { return i !== null }))
			th.innerText = key;
			tr.appendChild(th);
		}
		this.thead.innerHTML = '';
		this.thead.appendChild(tr);
		this.#_setBody(page);
	}

	#_setBody(page=-1) {
		this.tbody.innerHTML = '';
		let pageBB = this.#_getPageBB(page);
		console.log(pageBB)
		for (let pos = pageBB.min; pos < pageBB.max; pos ++) {
			let row = document.createElement('tr');
			row.classList.add(...[this.defaultConfig.classes.tbodyrows, this.config?.classes?.tbodyrows || null].filter((i) => { return i !== null }))
			for (let k of Object.keys(this.orientation)) {
				if (pos in this.orientation[k]) {
					let cell = document.createElement('td');
					cell.classList.add(...[this.defaultConfig.classes.tbodycell, this.config?.classes?.tbodycell || null].filter((i) => { return i !== null }))
					cell.innerHTML = this.orientation[k][pos];
					if (this.orientation[k][pos] === null) {
						cell.classList.add('empty')
					}
					row.appendChild(cell);
				}
			}
			this.tbody.appendChild(row);
		}
		this.#_setFooter(page);
	}

	#_setFooter(page=-1) {
		this.tfoot.innerHTML = '';
		let tr = document.createElement('tr');
		tr.classList.add(...[this.defaultConfig.classes.tfootrows, this.config?.classes?.tfootrows || null].filter((i) => { return i !== null }))
		
		let td = document.createElement('td');
		td.classList.add(...[this.defaultConfig.classes.tfootcell, this.config?.classes?.tfootcell || null].filter((i) => { return i !== null }))
		
		let left = document.createElement('div');
		let right = document.createElement('div');

		left.classList.add(...[this.defaultConfig.classes.tfootleftcell, this.config?.classes?.tfootleftcell || null].filter((i) => { return i !== null }))
		right.classList.add(...[this.defaultConfig.classes.tfootrightcell, this.config?.classes?.tfootrightcell || null].filter((i) => { return i !== null }))

		let pageBB = this.#_getPageBB(page);
		let pageSelector = document.createElement('select');

		for (let pn = 0; pn < this.#_getTotPages(); pn ++) {
			let option = document.createElement('option');
			if (pn+1 == page) {
				option.setAttribute('selected', '')
			}
			option.value = pn+1;
			option.innerText = `Pagina ${pn+1}`;
			pageSelector.appendChild(option);
		}

		pageSelector.onchange = () => {
			this.#_changePage(pageSelector)
		};

		left.innerText = `Showing from ${pageBB.min+1} to ${pageBB.max} of ${this.data.length}`;
		right.appendChild(pageSelector);

		td.appendChild(left);
		td.appendChild(right);

		td.setAttribute('colspan', 1000)

		tr.appendChild(td);
		this.tfoot.appendChild(tr);
	}

	#_changePage(select) {
		let page = +select.value;
		this.#_setHeader(page);
	}

	#_getTotPages() {
		let itemPerPage = this.config?.pagination_itemPerPage || this.defaultConfig.pagination_itemPerPage;
		return Math.ceil(this.data.length / itemPerPage);
	}

	#_getPageBB(page) {
		let itemPerPage = this.config?.pagination_itemPerPage || this.defaultConfig.pagination_itemPerPage;
		if (page < 1) return { min: 0, max: this.data.length }
		if (page > Math.ceil(this.data.length / itemPerPage)) return this.#_getPageBB(page-1);
		return {
			min: (page-1) * itemPerPage,
			max: (page) * itemPerPage
		}
	}

	
	#_insertData() {
		let keys = [...new Set(this.data.map(i => Object.keys(i)).flat(1)) ];
		// console.log(keys);
		let orientation = {};
		for (let d of this.data) {
			for (let k of keys) {
				if (!(k in orientation)) {
					orientation[k] = [];
				}
				if (!(k in d)) {
					d[k] = null;
				}
			}
			d = this.#_sortObject(d);
			// console.log(d);
			for (let ks of Object.keys(d)) {
				orientation[ks].push(d[ks]);
			}
		}
		console.log(orientation)
		this.orientation = orientation;
		this.#_setHeader(1);
	}

	#_checkConstructorName(val, pattern) {
		return pattern.exec(val) !== null;
	}

	#_sortObject(obj) {
		const keys = Object.keys(obj);
		let newObject = {};
		keys.sort();
		for (let i = 0; i < keys.length; i++) {
			let k = keys[i];
			newObject[k] = obj[k];
		}
		return newObject;
	};
}