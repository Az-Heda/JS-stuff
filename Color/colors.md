# Color

## Usage
```js
Color.textColor // String -> Return an HEX Color for the current theme
```
```js
Color.isDarktheme // Boolean -> wheather the body has the dark theme class (can be personalized)
```



### Blend colors
Blends 2 colors by a percentage
```js
console.log(Color.blend('#FF0000', '#00FF00', 0.5));
>>> #808000
```

### Invert color
Invert the color
```js
console.log(Color.invert('#123123'));
>>> #EEDDCC
```

### HEX to RGB
```js
console.log(Color.hex2rgb('#FFAA00'));
>>> [255, 170, 0]
```

### RGB to HEX
```js
let r = 100;
let g = 50;
let b = 200;
console.log(Color.rgb2hex(r, g, b))
>>> #6432C8
```


### Shade of color
```js
let hexColor = '#FF0000';
console.log(Color.shade(hexColor, 0.2)); // Makes the color 20% lighter
>>> #ff3333
console.log(Color.shade(hexColor, -0.2)); // Makes the color 20% darker
>>> #cc0000
```