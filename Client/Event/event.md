# MyEvent

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/Event/event.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/Event/event.js"></script>
```

## Usage

### Binding an event
```html
<div id="test"></div>
<script>
	const callback = (...x) => {
		console.log(x);
		return 'Done!';
	};
	MyEvent.bind('test', '<Event_Name>', callback);
</script>
```

### Emit an event
```js
const params = [ 1, 2, 3 ];
const result = MyEvent.emit('<Event_Name>', ...params); // This will execute all of the callbacks with the given event name for every element
>>> [1, 2, 3]

console.log(result);
>>> [ 'Done!' ]
```


### Unbind an event
```js
MyEvent.unbind('<HTML_Element_ID>', '<Event_Name>')
```


### Get event list
```js
console.log(MyEvent.events);
>>> [
	'<Event_Name_1>',
	'<Event_Name_2>'
]
```