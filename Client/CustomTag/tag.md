# CustomTag

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/CustomTags/tag.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/CustomTags/tag.js"></script>
```

## WARNING
The custom tag name __MUST__ include -:

*Examples*
- Valid: `header-title`, `custom-tag`, `custom-tag`
- Not valid: `book`, `card`, `film`

## Usage
HTML
```html
<body>
	<say-hi name="Vincent"></say-hi>
</body>
```
JavaScript
```js
new CustomTag('say-hi', function(tag) {
	tag.innerHTML = `<p>Hi ${this.getAttribute('name')}</p>`;
});
```