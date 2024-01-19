# Signal

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/Signal/signal.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/Signal/signal.js"></script>
```

## Usage

Prepare the callbacks
```js
function f1(...v) { console.log(...v) }
function f2(...v) { console.warn(...v) }
function f3(...v) { console.error(...v) }
```

Create the signal variable:
```js
let s = new Signal(f1, f2, f3);
```

You can treat the variable `s` as a normal object, but the callbacks are called whenever you set a new value, change or delete an old one

```js
console.log(s.test);
>>> undefined

s.test = true;

console.log(s.test);
>>> true
```

### Flags
When the callback is called, the 3rd parameter is the flag letter:
- A: Added
- C: Changed
- D: Deleted