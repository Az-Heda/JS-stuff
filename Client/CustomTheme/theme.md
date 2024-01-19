# CustomTheme

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/CustomTheme/theme.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/CustomTheme/theme.js"></script>
```

## Usage

```js
const ct = new CustomTheme('dark-theme');
```

### Add a color palette
```js
ct.addColor('#282a36', '#44475a', '#f8f8f2', '#FA0', ...);
```
or
```js
ct.addColor('#282a36');
ct.addColor('#44475a');
ct.addColor('#f8f8f2');
ct.addColor('#FA0');
```
**Warning**

The colors must follow one of these patterns:
```js
/((#[a-fA-F0-9]{6})|(#[a-fA-F0-9]{3}))/
```
```js
/(rgb)\([0-9]{1,3},( )?[0-9]{1,3},( )?[0-9]{1,3}\)/
```
```js
/(rgba)\([0-9]{1,3},( )?[0-9]{1,3},( )?[0-9]{1,3},( )?[0-9]{0,}(.[0-9]{1,})?\)/
```

### Add CSS Rules
Properties supported for each key are:
| Key |                 Meaning                 |
| :-: | :-------------------------------------- |
| c   | color: \<value\>;                       |
| b   | background-color: \<value\>;            |
| ci  | color: \<value\> !important;            |
| bi  | background-color: \<value\> !important; |

```js
ct.addRule({
	'body,*': { b: 0, ci: 2 }, // Index of the color
	'p': { c: '#FAF' }, // String of the color
})
ct.addRule({ 'div:not(:first-child)': { b: '#000', c: '#0D0'}} )
```

### Activate colors
```js
ct.activate();
```

### CSS Output:
```css
body[ct__dark-theme] body,* {
	background-color: #282A36;
	color: #F8F8F2 !important
}
body[ct__dark-theme] p {
	color: #FAF;
}
body[ct__dark-theme] div:not(:first-child) {
	background-color: #000;
	color: #0D0;
}
```