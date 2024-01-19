# CheckTime

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/Time/time.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/Time/time.js"></script>
```

## Usage

### Record time
```js
console.log(CheckTime.record());
>>> null
```


```js
console.log(CheckTime.record()); // The second time you call this method it returns the number of milliseconds passed between the 2 calls
>>> <int> 
```

```js
const ms = 15800000
CheckTime.parse(ms);
>>> 04:23:20.000
```