# Search

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/Search/searchstring.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/Search/searchstring.js"></script>
```

## Usage

```js
let s = new Search(array, options)
```

### Default options:
| name | value |
| :--- | :---: |
| includeScore | `true` |
| isCaseSensitive | `false` |
| minMatchCharLength | `1` |
| shouldSort | `true` |
| findAllMatches | `true` |
| threshold | `0.6` |
| useExtendedSearch | `false` |


## Search
```js
const query = '<my search query>'
```

## Normal

```js
console.log(s.search(query));
```

## Generator
```js
for (let result of s.searchGenerator(query)) {
	console.log(result);
}
```