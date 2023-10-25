# MyStorage

## Usage

### Check if localStorage is enable
```js
console.log(MyStorage.isStorageEnable);
>>> true|false
```

### Add an item to localStorage
```js
MyStorage.add('<key>', '<value>');
```

### Get an item from localStorage
```js
MyStorage.get('<key>');
```

### Remove an item from localStorage
```js
MyStorage.remove('<key>');
```

### Clear all from localStorage
```js
MyStorage.clear();
```

### Check if a key is inside of localStorage
```js
MyStorage.hasKey('<key>');
```

### Add an item to localStorage that expires after a set amount of time
```js
const expr = 86400000; // 1 day in milliseconds
MyStorage.setCookie('<key>', '<value>', expr);
```

### Get an item from localStorage cheking if it has expired
```js
MyStorage.getCookie('<key>');
```



### Personalize
## Change the default expiry time of the cookies
```js 
MyStorage.#_defaultExpr = 60000; // 1 minute in milliseconds
```