# MySocket

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/Socket/socket.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/Socket/socket.js"></script>
```

## Usage

### Initialize
```js
const socket = new MySocket('ws://127.0.0.1:5500')
```

### Send data
```js
socket.send('<name>', { value: 'Object to send' })
```

### Get request history
```js
console.log(socket.history)	
```

### Add events
```js
socket.on('open',    () => { console.info('Connection is now open') });
socket.on('close',   () => { console.info('Connection closed') });

socket.on('message', (data) => { console.log(data) });
socket.on('error',   (err) => { console.error(err) });
```