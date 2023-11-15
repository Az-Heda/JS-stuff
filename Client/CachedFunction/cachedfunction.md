# CachedFunction

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/CachedFunction/cachedfunction.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/CachedFunction/cachedfunction.js"></script>
```

## Usage

__Example__
```js
function fibonacci(n) {
	return n < 1 ? 0 : n <= 2 ? 1 : fibonacci(n - 1) + fibonacci(n - 2);
}
```


- Without CachedFunction:
	```js
	let start = new Date();
	for (let pos = 0; pos < 50; pos ++) {
	    console.log(fibonacci(pos))
	}
	let diff = new Date().getTime() - start.getTime();
	console.log(diff+'ms');
	>>> 193286ms // 00:03:13.286
	```

- With CachedFunction:
	```js
	fibonacci = new CachedFunction(fibonacci)

	let start = new Date();
	for (let pos = 0; pos < 50; pos ++) {
	    console.log(fibonacci(pos))
	}
	let diff = new Date().getTime() - start.getTime();
	console.log(diff+'ms');
	>>> 2ms // 00:00:00.002
	```

