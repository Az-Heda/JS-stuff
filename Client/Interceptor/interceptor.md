# interceptor

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/Interceptor/interceptor.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/Interceptor/interceptor.js"></script>
```

This function will change the functions:
- console.log
- console.info
- console.warn
- console.error

#### Warning
The log in the console, by default is disabled once you import this module.

If you want to re-enable it:
```js
window['INTERCEPTOR_KEYS']['0_console'] = true;
```

#### Originals
To call the original functions set

`window['INTERCEPTOR_KEYS']['0_enable_default_functions']` to `true`
```js
window['INTERCEPTOR_KEYS']['0_enable_default_functions'] = true;
```

## Setup

With a target function:
```js
function cb(...v) { console.dir(v) }
window['0_target'].set(cb)
```

With a HTML element
```html
<body>
	<div id="out"></div>
</body>
```
```js
window['0_target'].set(document.querySelector('#out'));
```

## Usage

```js
console.log(1, 2, 3)
console.info('Info text')
console.warn('Warning text')
console.error('Error text')
```