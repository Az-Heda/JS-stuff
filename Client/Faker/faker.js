class MyFaker {
	static variableName = '%faker';
	static defaultLang = 'it';
	static seed = Math.floor(Math.random() * Number.MAX_VALUE);
	static defaultConfig = {
		birthdate: {
			min: 18,
			max: 90,
			mode: 'age',
		},
		nearbyGPSCoordinate: {
			isMetric: true,
			origin: [41.89193, 12.51133],
			radius: 750,
		},
		middleNameChance: 0.9,
	}
	
	constructor(options={}) {
		this.defaultLang = this.constructor.defaultLang;
		this.constructor._generateImport(options?.language || options?.lang || this.defaultLang);
	}
	

	async person(sex=null) {
		if (sex == null) sex = ['m', 'f'][Math.floor(Math.random() * 2)];
		sex = (sex.toUpperCase() == 'M') ? 'male' :
			  (sex.toUpperCase() === 'F') ? 'female' :
			  undefined;
		let sexObject = {};			
		let obj = {};
		if (sex !== undefined) sexObject['sex'] = sex;
		if (this.ready || await this.waitUntillIsReady()) {
			obj.firstName = window[this.variable].person.firstName(sex);
			obj.lastName = window[this.variable].person.lastName({ firstName: obj.firstName, ...sexObject });
			const flname = { ...obj };
			obj.middleName = (Math.random() > this.getDefault('middleNameChance')) ? window[this.variable].person.middleName(sex) : null,
			obj.fullName = window[this.variable].person.fullName({ firstName: obj.firstName, lastName: obj.lastName, ...sexObject});
			obj.email = window[this.variable].internet.email({ firstName: obj.firstName.toLowerCase(), lastName: obj.lastName.toLowerCase() });
			obj.birthday = window[this.variable].date.birthdate(this.getDefault('birthday'))
			obj.username = window[this.variable].internet.displayName(flname);
			obj.ip = window[this.variable].internet.ipv4();
			[obj.positionLat, obj.positionLong] = window[this.variable].location.nearbyGPSCoordinate(this.getDefault('nearbyGPSCoordinate'));
		}
		obj.birthday = `${obj.birthday.getFullYear()}-${(obj.birthday.getMonth() + 1).toString().padStart(2, 0)}-${obj.birthday.getDate().toString().padStart(2, 0)}`
		return Promise.resolve(obj);
	}

	async waitUntillIsReady(mstimer=10) {
		return new Promise(resolve => {
			let interv = setInterval(() => {
				if (this.ready) {
					clearInterval(interv);
					resolve(this.ready);
				}
			}, mstimer);
		})
	}

	getDefault(key) {
		const defVals = this.constructor.defaultConfig;
		return (Object.keys(defVals).includes(key)) ? defVals[key] : {};
	}
	
	get ready() {
		return window[this.variable] !== undefined;
	}

	get variable() {
		return this.constructor.variableName;
	}

	static _generateImport(language='it') {
		let supportedLanguages = ['it', 'en', 'de', 'ru'];
		if (!supportedLanguages.includes(language)) throw new Error('Language not valid');
		let tag = document.createElement('script');
		tag.setAttribute('type', 'module');
		tag.innerHTML = `
		import { faker } from 'https://cdn.skypack.dev/@faker-js/faker/locale/${language}';
		window['${this.variableName}'] = faker
		`.replaceAll('\t', '');
		document.head.appendChild(tag);
	}
}