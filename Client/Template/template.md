# Templating

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/Template/template.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/Template/template.js"></script>
```

## Usage

```js
let buildFromString = `
<div>
	<h1> Hi $% name %$! </h1>
	<p>$%phrase%$</p>
</div>
`
```

```js
let t = new Templating(buildFromString, {
	name: 'User', 
	phrase: 'Have a nice day' 
})
```
Getting the template
```js
document.body.innerHTML = t.template;
```
```html
<body>
	<div>
		<h1> Hi User! </h1>
		<p>Have a nice day<p>
	</div>
</body>
```

## WARNING
All of the keys of the object used to write the data, __MUST__ follow this RegEx:
```js
/[a-zA-Z0-9_]{1,}/
```
Click [HERE](https://regexr.com/7n8m9) to try online this RegEx
### Regex explanation
* You have to use "__$%__" for starting the placeholder
* You have to use "__%$__" for ending the placeholder
* Doesn't matter how many spaces your're using between the placeholder boundaries and the string inside
* string must use only __letters__ (both uppercase and lowercase are fine), __numbers__ and __underscore__

Valid Examples:
* \$% example_1 %\$
* \$%example_2%\$
* \$%example3%\$
* \$% ExAmle_____4 %\$


### Change template
If data is also setted, this will automatically parse the new template adding the old data
```js
let t = new Templating(...);
t.changeTemplate('...')
```

### Change data
If data is also setted, this will automatically parse the old template adding the new
```js
let t = new Templating(...);
t.changeData('...')
```