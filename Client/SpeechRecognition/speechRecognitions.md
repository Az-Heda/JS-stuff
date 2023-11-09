# MySpeechRecognition

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/SpeechRecognition/speechrecognition.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/SpeechRecognition/speechrecognition.js"></script>
```

## Usage
```js
const sr = new MySpeechRecognition('<language>');
```

### Add some callback functions
```js
const fns = [
	(e) => { ... },
	(e) => { ... },
	...
]
sr.addCallback(...fns);
```
AND / OR
```js
sr.addCallback((e) => { ... });
sr.addCallback((e) => { ... });
sr.addCallback((e) => { ... });
```

### Start speech recognition
Once this function stops recording the voice, **ALL** of the callbacks will be called with the result of the Speech Recognition
```js
sr.start();
```

### Supported languages
```js
MySpeechRecognition.getSupportedLanguages();
```