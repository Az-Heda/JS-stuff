# MyImport

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/Import/import.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/Import/import.js"></script>
```

## Usage

-	CSS
	```js
	await MyImport.css('<css module name>')
	```
-	JavaScript
	```js
	await MyImport.js('<js module name>')
	```

## Valid modules:

### CSS
- bootstrap
- CustomTheme
- fontawesome
- gridjs
- leaflet
- MyGrid

### JS
- animejs
- animejsmin
- apexchart
- bootstrap
- chartjs
- danfojs
- fusejs
- gridjs
- jquery
- leaflet
- p5
- p5sound
- socketio
- sweetalert


### How to get the list with JavaScript:
```js
MyImport.list('link');
MyImport.list('script');
```