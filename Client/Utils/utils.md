<h1>Utils functions</h1>

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/Utils/utils.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/Utils/utils.js"></script>
```

<h2>
map(<br/>
	&emsp;&emsp; n : [number],<br/>
	&emsp;&emsp; start1 : [number],<br/>
	&emsp;&emsp; stop1 : [number],<br/>
	&emsp;&emsp; start2 : [number],<br/>
	&emsp;&emsp; stop2 : [number]<br/>
) -> [number]
</h2>
<p>Number mapping from one range to another</p>

```js
console.log(map(1, 0, 2, 0, 200))
>>> 100

console.log(map(45, 0, 100, 0, 200000))
>>> 90000

console.log(map(0.2, -1, 1, 0, 100))
>>> 60
```
<hr/>
<h2>
encode (<br/>
	&emsp;&emsp; str : [string]<br/>
	&emsp;&emsp; separator : [string] = '|'<br/>
) -> [string]
</h2>

```js
console.log(encode('Hello'))
>>> 72|101|108|108|111

console.log(encode('World'))
>>> 87|111|114|108|100
```

<hr/>
<h2>
decode (<br/>
	&emsp;&emsp; str : [string]<br/>
	&emsp;&emsp; separator : [string] = '|'<br/>
) -> [string]
</h2>

```js
console.log(decode('72|101|108|108|111'))
>>> Hello 

console.log(decode('87|111|114|108|100'))
>>> World
```

<hr/>
<h2>
randomizeArray (<br/>
	&emsp;&emsp; arr : [array]<br/>
) -> [array]
</h2>

```js
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

console.log(randomizeArray(arr))
>>> [7, 5, 4, 8, 6, 3, 1, 9, 2]

console.log(randomizeArray(arr))
>>> [2, 9, 1, 6, 7, 4, 3, 5, 8]
```

<hr/>
<h2>
deepCopy (<br/>
	&emsp;&emsp; item : [list | object]<br/>
) -> [list | object]
</h2>
<p>This functions return a deep copy of the list or object passed as input</p>

```js
const i1 = [1, 2, 3];
const i2 = { 'a': 1, 'b': 2 };

console.log(deepCopy(i1))
>>> [1, 2, 3]

console.log(deepCopy(i2))
>>> { 'a': 1, 'b': 2 }
```

<hr/>
<h2>
IDFromString (<br/>
	&emsp;&emsp; str : [string | number]<br/>
) -> [number]
</h2>

```js
const val1 = 'text 1';
const val2 = 'text 2';

console.log(IDFromString(val1));
>>> 2496759382

console.log(IDFromString(val1)); // Same seed and string = same output
>>> 2496759382

console.log(IDFromString(val2));
>>> 2762155513
```

<hr/>
<h2>
String.prototype.hashSeed (<br/>
	&emsp;&emsp; seed : [number]<br/>
) -> [number]
</h2>

```js
console.log('text 1'.hashSeed(0));
>>> 4543038772014369

console.log('text 1'.hashSeed(1));
>>> 651049560224390

console.log('text 2'.hashSeed(0));
>>> 4889523576064477

console.log('text 2'.hashSeed(1));
>>> 8769174024021426

console.log('text 2'.hashSeed(1)); // Same seed and string = same output
>>> 8769174024021426

```

<hr/>
<h2>
capitalize (<br/>
	&emsp;&emsp; str : [string]<br/>
) -> [string]
</h2>

```js
console.log(capitalize('hello'));
>>> Hello 

console.log(capitalize('world'));
>>> World 

console.log(capitalize('hello world'));
>>> Hello World 
```

<hr/>
<h2>
sortObject (<br/>
	&emsp;&emsp;obj [object]<br/>
) -> [object]
</h2>

```js
const testObject = {
	name: 'name-object',
	status: 'fulfilled',
	id: 'test-id',
	r: 0,
	g: 255,
	b: 0,
	done: true
}

console.log(sortObject(testObject))
>>> {
	b: 0,
	done: true,
	g: 255,
	id: "test-id",
	name: "name-object",
	r: 0,
	status: "fulfilled"
}
```

<hr/>
<h2>
getElementByAttribute (<br/>
	&emsp;&emsp; attr : [string]<br/>
	&emsp;&emsp; value : [string | number]<br/>
	&emsp;&emsp; root : [HTMLElement] = document.body<br/>
) -> [Array[HTMLElement]]
</h2>

```html
<div data-type="number">
<script>
	console.log(getElementByAttribute('data-type', 'number', document.body))
	>>> div
</script>
```

<hr/>
<h2>
logMessage (<br/>
	&emsp;&emsp; title : [string]<br/>
	&emsp;&emsp; text : [any]<br/>
	&emsp;&emsp; styles : [object] = {}<br/>
) -> [Void]
</h2>

```js
logMessage('title', 'text', { 'color': '#F00' });
logMessage('title', 'text', { 'color': '#000', 'background-color': '#0A0', 'padding': '5px' });
```