# RandomNumberGenerator

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/Random/rng.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/Random/rng.js"></script>
```

## Usage

```js
let seed = 17; // This can be any number
const rng = new RandomNumberGenerator(seed)
```

### .nextInt()
```js
console.log(rng.nextInt()); // 1579902326
console.log(rng.nextInt()); // 1084774144
console.log(rng.nextInt()); // 472857344
```

### .nextFloat() 
```js
console.log(rng.nextFloat()); // 0.04755583407709181
console.log(rng.nextFloat()); // 0.8683298234214679
console.log(rng.nextFloat()); // 0.387549877347215
```

### .nextRange(start, end)
```js
console.log(rng.nextRange(50, 100));  // 82
console.log(rng.nextRange(50, 100));  // 88
console.log(rng.nextRange(100, 200)); // 108
```

### .color()
```js
	console.log(rng.color()); // #E3F62B
	console.log(rng.color()); // #392B81
	console.log(rng.color()); // #6F90BA
```

### .choice(array)
```js
let arr = ['Apple', 'Banana', 'Orange', 'Peach', 'Grape'];
console.log(rng.choice(arr)); // Grape
console.log(rng.choice(arr)); // Banana
console.log(rng.choice(arr)); // Grape

```

### .generator(functionName, ...params)
All of the previous functions can be transformed into a generator by doing this
```js
	let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWYZ'.split('');

	let g1 = rng.generator('nextInt');
	let g2 = rng.generator('nextFloat');
	let g3 = rng.generator('nextRange', 1, 1000);
	let g4 = rng.generator('color');
	let g5 = rng.generator('choice', alphabet);

	console.log(g1.next()); // {value: 1348002560, done: false}
	console.log(g2.next()); // {value: 0.7266491654918759, done: false}
	console.log(g3.next()); // {value: 513, done: false}
	console.log(g4.next()); // {value: '#3FABB4', done: false}
	console.log(g5.next()); // {value: 'Z', done: false}
```