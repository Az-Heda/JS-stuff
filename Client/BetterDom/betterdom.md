# BetterDom

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/BetterDom/betterdom.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/BetterDom/betterdom.js"></script>
```

## Usage
### BetterDom.archive
Used to store values
```js
BetterDom.archive.a = 1;
BetterDom.archive.b = 'string';
betterDom.archive.c = [1, 2, 3]

console.log(Object.keys(BetterDom.archive));
>>> ['a', 'b', 'c']

console.log(BetterDom.archive.c);
>>> [1, 2, 3]

console.log('a' in BetterDom.archive);
>>> true
```

### Activate Debugging Messages
```js
BetterDom.archive._debug = true || false;
BetterDom.archive._debug; // This will switch the debug mode (on and off)
```


### BetterDom.createElement
- With BetterDom
	```js
	let tag = BetterDom.createElement('div', {
		class: ['class1', 'class2'],
		attr: { id: 'test' },
		parent: document.body,
		content: 'My div'
	});
	```
	Result:
	```html
	<body>
		...
		<div class="class1 class2" id="test">My div</div>
	</body>
	```
- Without BetterDom
	```js
	let tag = document.createElement('div');
	tag.setAttribute('id', 'test');
	tag.classList.add('class1', 'class2');
	tag.innerHTML = 'My div'
	document.body.appendChild(tag);
	```

### BetterDom.adoptNode
Transfer HTMLElement from inside an iframe into the main #document
```js
await BetterDom.adoptNode({
	parent: '#new-parent',
	iframe: '#iframe',
	tags: '#target'
})
```
Before:
```html
<body>
	<div id="new-parent"></div>
	<iframe id="iframe">
		#document
		<html>
			...
			<body>
				...
				<div id="target">My inner div</div>
			</body>
		</html>
	</iframe>
</body>
```
After:
```html
<body>
	<div id="new-parent">
		<div id="target">My inner div</div>
	</div>
	<iframe id="iframe">
		#document
		<html>
			...
			<body>
				...
			</body>
		</html>
	</iframe>
</body>
```


### BetterDom.curry
```js
function sum(a, b, c) {
	return a + b + c;
}

let curriedSum = BetterDom.curry(sum);
sum(1, 2, 3); // 6
curriedSum(1)(2)(3) // 6;

let x = curriedSum(1);
x(2)(3) // 6;

let x = curriedSum(1);
let y = x(2);
y(3) // 6
```