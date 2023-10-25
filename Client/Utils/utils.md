<h1>Util functions</h1>

## Fast import
```html
<script src="https://raw.githubusercontent.com/Az-Heda/JS-stuff/master/Utils/utils.js"></script>
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
String.prototype.capitalize () -> [string]
</h2>

```js
console.log('hello'.capitalize());
>>> Hello 

console.log('world'.capitalize());
>>> World 

console.log('hello world'.capitalize());
>>> Hello World 
```

<hr/>
<h2>
Object.prototype.sort () -> [object]
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

console.log(testObject.sort())
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