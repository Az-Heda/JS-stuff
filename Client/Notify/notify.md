# Notify

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/Notify/notify.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/Notify/notify.js"></script>
```

## Usage

### Check if it's available
```js
console.log(Notify.isEnabled)
>>> true | false
```

### Ask for permission manually
```js
await Notify.permission();
```

### Get notification current permission status
```js
console.log(Notify.status);
>>> 'Allowed' | 'Denied' | 'Not allowed'
```

### Get/Set the log level
```js
console.log(Notify.level);
>>> 0

Notify.level = 3;
console.log(Notify.level);
>>> 3
```


### Send a notification
```js
let callbacks = { ... };
let options = { ... };
Notify.send('notification title', 'notification body', callbacks, options)
```

#### Possible options:
|  Name  |  Type   |                                        Description                                        |
| :----: | :-----: | ----------------------------------------------------------------------------------------- |
| image  | string  | URL of the image to send in the notification                                              |
| silent | boolean | Indicate wheather the device should remain silent or not when receiving the notification  |

#### Possible callbacks:
|    Name    | Implemented |                      Description                      |
| :--------: | :---------: | ----------------------------------------------------- |
|  onclick   |     ✅     | It's called when the user click the notification       |
|  onshow    |     ✅     | It's called when the notification is sent to the user  |
|  onerror   |     ✅     | It's called when an error occour with the notification |
|  onclose   |     ❌     | It's called when the user close the notification       |