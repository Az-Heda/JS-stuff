# Loader

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/Loader/loader.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/Loader/loader.js"></script>
```

## Usage
```js
Loader.tagInBody // -> true|false
Loader.cssInBody // -> true|false
```

```js
Loader.darkTheme = true  // -> Setting all the colors for dark theme
Loader.darkTheme = false // [DEFAULT] -> Setting all the colors for light theme

Loader.themeColor // -> Return the color schema of the current theme
```

```js
Loader.append // -> Add the loader and the style to the body
Loader.remove // -> Remove both loader and style from the body
```

## Private values
```js
console.log(Loader.#_tag) // -> HTMLElement of the loader
>>> <div></div>
console.log(Loader.#_css) // -> HTMLElement of the styles for the loader
>>> <style></style>
console.log(Loader.#_theme) // -> Current active theme
>>> 'light' | 'dark'
console.log(Loader.#_size) // -> Size of the loader
>>> { w: 40, h: 40 }
console.log(Loader.#_className) // -> Cube class name (auto generated)
>>> 'cube-1698220670655'
console.log(Loader.#_colors) // -> Colors of the loader for both themes
>>> {
	'light': { border: '#000000', background: '#00000040' },
	'dark': { border: '#ffffff', background: '#ffffff40' }
}
console.log(Loader.#_sides) // -> Array with the 6 sides of the cube
>>> [div.side, div.side, div.side, div.side, div.side, div.side]
```