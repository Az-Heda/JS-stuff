# Merger

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/ObjectMerger/objectmerger.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/ObjectMerger/objectmerger.js"></script>
```

## Usage


```js
const obj1 = { a: 1, b: 2, c: 3 };
const obj2 = { c: 4, d: 5, e: 6 };
console.log(Merger(obj1, obj2));
>>> { 'a': 1, 'b': 2, 'c': 4, 'd': 5, 'e': 6 }
```

```js
const obj1 = { options: { a: 1, b: 2}, debug: false  };
const obj2 = { options: { c: 3 }, debug: true  };
console.log(Merger(obj1, obj2));
>>> { 'options': { 'a': 1, 'b': 2, 'c': 3 }, 'debug': true }
```