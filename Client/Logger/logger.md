# logger

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/Logger/logger.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/Logger/logger.js"></script>
```

## Usage

### Level
**ATTENCTION**: The logger will only print on console when the message has a log level higher than the one saved
#### Get the current status level (Default `0`):
```js
console.log(Logger.level);
>>> 0
```

#### Set a new status level
```js
Logger.level = 5;
console.log(Logger.level);
>>> 5
```

### Default logger
```js
Logger.Default('text', level);
```

### Other logger profiles
#### Enable them
```js
Logger.basicSetup();
```
|    name    |                                          color                                         |
|------------|----------------------------------------------------------------------------------------|
|  Info      |  <div style="background-color: #3b82f6; color: #000; font-weight: bold;">#3b82f6</div> |
|  Success   |  <div style="background-color: #a3e635; color: #000; font-weight: bold;">#a3e635</div> |
|  Warning   |  <div style="background-color: #facc15; color: #000; font-weight: bold;">#facc15</div> |
|  Error     |  <div style="background-color: #ef4444; color: #000; font-weight: bold;">#ef4444</div> |
|  Lblue     |  <div style="background-color: #8be9fd; color: #000; font-weight: bold;">#8be9fd</div> |
|  Pink      |  <div style="background-color: #ff79c6; color: #000; font-weight: bold;">#ff79c6</div> |
|  Cyan      |  <div style="background-color: #10b981; color: #000; font-weight: bold;">#10b981</div> |
|  Purple    |  <div style="background-color: #C084FC; color: #000; font-weight: bold;">#C084FC</div> |


### Add a new logger profile
**Warning**: This function will accept the color only in HEX format with 3 or 6 digits like (#000 OR #000000)
**Warning**: You can't declare a profile with a name of an already existing one
```js
let backgroundColor = '#C084FC';
let textColor = '#000000';
Logger.add('profile', backgroundColor, textColor);
```

#### How to use it
```js
let level = 1;
Logger.Profile('Your text part 1');
Logger.Profile('Your text part 2', level)
```

### Get current active proflies:
**Info**: You cannot delete a profile if you delete something off this object

```js
console.log(Logger.status);
>>> {
    "default": { "bg": "#C084FC", "color": "#000000" },
} 
```

```js
Logger.basicSetup();
console.log(Logger.status);
>>> {
    "default": { "bg": "#C084FC", "color": "#000000" },
    "info":    { "bg": "#3b82f6", "color": "#000000" },
    "success": { "bg": "#a3e635", "color": "#000000" },
    "warning": { "bg": "#facc15", "color": "#000000" },
    "error":   { "bg": "#ef4444", "color": "#000000" },
    "LBlue":   { "bg": "#8be9fd", "color": "#000000" },
    "pink":    { "bg": "#ff79c6", "color": "#000000" },
    "Cyan":    { "bg": "#10b981", "color": "#000000" },
    "purple":  { "bg": "#C084FC", "color": "#000000" }
} 
```