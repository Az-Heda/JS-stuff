# DragNDrop

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/DragNDrop/dnd.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/DragNDrop/dnd.js"></script>
```

## Start

This class starts automatically, by searching all of the tags with the attribute `movable`

```html
```js
<body>
	<div movable>Hi</div>
</body>
```

## Add tag to DragNDrop class
```js
let item = document.getElementById('myid');
DragNDrop.add(item);
```

- Before:
	```html
	<body>
		<div movable>Hi</div>
		<div id="myid"> I'm new</div>
	</body>
	```
- After:
	```html
	<body>
		<div movable>Hi</div>
		<div id="myid" movable> I'm new</div>
	</body>
	```


## Snapping to a grid
You can set the grid size:
```js
DragNDrop.grid = 50; // grid with squares with width="50px" and height="50px"
```


## Remove the element from the class
You can remove the attribute, but it's better if you call the class method
```js
DragNDrop.remove(element);
```