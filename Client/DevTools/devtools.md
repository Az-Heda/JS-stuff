# DevToolsInfo

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/DevTools/devtools.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/DevTools/devtools.js"></script>
```

## Usage

### DevToolsInfo.pageInfo
```js
console.log(DevToolsInfo.pageInfo)
>>> {
    "url": "<html-page-url>",
    "size": <size-bytes>,
    "duration": <duration>,
    "entryType": "navigation",
    "type": "navigation",
    "protocol": "<http protocol>",
    "HTTPCode": <http-code>,
    "timing": {
        "startFetching": <time>,
        "connection": <time>,
        "domainLookup": <time>,
        "response": <time>,
        "description": { ... }
    }
}
```

### DevToolsInfo.getResources
```js
console.log(DevToolsInfo.getResources);
>>> [
    {
        "url": "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
        "size": 89795,
        "duration": 29.5,
        "entryType": "resource",
        "type": "script",
        "protocol": "h3",
        "HTTPCode": 0,
        "timing": { ... },
	}
    {
        "url": "https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/DevTools/devtools.js",
        "size": 3643,
        "duration": 10,
        "entryType": "resource",
        "type": "script",
        "protocol": "http/1.1",
        "HTTPCode": 200,
        "timing": { ... },
	},
	{ ... }
]
```

### DevToolsInfo.sizeUsed
```js
console.log(DevToolsInfo.sizeused);
>>> {
    "jsHeapSizeLimit": { "sizeRaw": 4294705152, "size": "4 GB"   , "desc": "..." },
    "totalJSHeapSize": { "sizeRaw": 5554438,    "size": "5.3 MB" , "desc": "..." },
    "usedJSHeapSize":  { "sizeRaw": 4514898,    "size": "4.31 MB", "desc": "..." },
}
```

### DevToolsInfo.timing
```js
console.log(DevToolsInfo.timing);
>>> {
    "connectStart": <timestamp>,
    "navigationStart": <timestamp>,
    "secureConnectionStart": <timestamp>,
    "fetchStart": <timestamp>,
    "domContentLoadedEventStart": <timestamp>,
    "responseStart": <timestamp>,
    "domInteractive": <timestamp>,
    "domainLookupEnd": <timestamp>,
    "responseEnd": <timestamp>,
    "redirectStart": <timestamp>,
    "requestStart": <timestamp>,
    "unloadEventEnd": <timestamp>,
    "unloadEventStart": <timestamp>,
    "domLoading": <timestamp>,
    "domComplete": <timestamp>,
    "domainLookupStart": <timestamp>,
    "loadEventStart": <timestamp>,
    "domContentLoadedEventEnd": <timestamp>,
    "loadEventEnd": <timestamp>,
    "redirectEnd": <timestamp>,
    "connectEnd": <timestamp>,
}
```

### DevToolsInfo.timeConnected(\<boolean\>=false)
Returns how much time passed since the page was fully loaded
```js
console.log(DevToolsInfo.timeConnected());
>>> 67202.39999999851
console.log(DevToolsInfo.timeConnected(false));
>>> 67202.39999999851
console.log(DevToolsInfo.timeConnected(true));
>>> 00:01:07.202
```