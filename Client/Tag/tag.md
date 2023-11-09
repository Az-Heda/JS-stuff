# Tag

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/Tag/tag.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/Tag/tag.js"></script>
```

## Usage
* Every method is chainable

### Create a new tag
```js
let t = new Tag('div');
```

## Methods

### .text(\<string\>) and .html(\<string\>)
```js
t.text('This is the content with pure text')
t.html('<h1>This is the content of the text with html</h1>')
```

### .addClass(...\<string\>) and .removeClass(...\<string\>)
```js
t = new Tag('div').text('Hi')

t.addClass('container', 'c1', 'c2')
console.log(t.node);
>>> <div class="container c1 c2">Hi</div>

t.removeClass('c1')
console.log(t.node)
>>> <div class="container c2">Hi</div>
```

### .addAttr(\<string\>, \<string\>)
```js
t.text('Hi').addAttr('id', 'welcome')
>>> <div id="welcome">Hi</div>
```

### .appendTo(\<HTMLElement\>)
Javascript:
```js
t.text('Hello world!').appendTo(document.body)
```
HTML:
```html
<body>
	...
	<div>Hello world!</div>
</body>
```

### .swap(\<HTMLElement\>)
```js
let div1 = new Tag('div').text('Hello').appendTo(document.body);
let div2 = new Tag('div').text('World').appendTo(document.body);
```
```html
<body>
	...
	<div>Hello</div>
	<div>World</div>
</body>
```

```js
div1.swap(div2.node);
```

```html
<body>
	...
	<div>World</div>
	<div>Hello</div>
</body>
```

### .event(\<string\>, \<function\>)
```js
const t = new Tag('form')
	.event('submit', (event) => { event.preventDefault() })

// Same as

t.addEventListener('submit', (event) => { event.preventDefault() });
```

### .hide() and .show()
* .hide() set "display: none" to the element
* .show() remove "display: none" from the element