# Crypt

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/Crypt/crypt.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/Crypt/crypt.js"></script>
```

## Content:
- [UUID](#uuid)
- [Crypt_RSA](#crypt-rsa)


# UUID

Random UUID generator:
```js
console.log(UUID.get())
>>> '8c8c2fbf-dd68-4b88-8443-f94a617ecdb1'
```	

# Crypt RSA

## Public/Private key generator

```js
(async() => {
	let { publicKey, privateKey } = await Crypt_RSA.generateKeys();
	console.log(publicKey);
	>>> '-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAz7GYd0OsCETgCv+kXvVYnuaztcwQnWOJtTFRhQq2B4L1cn33edsT4yt/h5dZa0evlfWw+kIgr2m/NSB4MgFqxItPjeWnjzZPhjIA6gurAeUMSrVLqY882IgaM0lGmGHKew5Y5pramqn212r1TbMbC3PlQiMsvvV6lYkg3+5H1zNUr1ZIV7jRWBc3z1fISfPTyddV9s17sg8ofLMSrFAicgdE+F3UBXuHf7r279YqFjv3WjxQps+klR+H18v+440lVPFqYAH46lt3nZ0ZUtnVv2wctAaBXO09/yyT16cvsDwIBBGpdQcxsoZ/wXz8fXTK4WMjODScKT7OC8fJ07lZbZBkiG46KIMJpHiOo8A58IdZRIuzeQSSPPZgH8iP4cKwJGKLaqT9aQPy5+daT0qOpa2ucgpONlazE8ZEsqdSr/cWvQiRvzgNHlG+hq+9AEvpI05/eDLaZEUuSmkGE5tJmGaJhVW7t+DYgt8MKzaWDCJ9GPSSqWc2d4aYCF40NoRWH3nfYRk59PTB0z79ys4+a3R27OhxeJRFGsdl2dhOmGvHiR9z46tZGjwox7luGsGLOY8DB8zYFYkqRiwjC8OrZYK2u1BW+u4qTKYGGDJaU4ImZIZwtA2lVT+k6NVIdon1DhtHXVG0KwtsI8u8v6Gp4MEF9yY7BB0OklMrUuoacD0CAwEAAQ==\n-----END PUBLIC KEY-----'
	console.log(privateKey)
	>>> '-----BEGIN PRIVATE KEY-----\n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\n-----END PRIVATE KEY-----'
})();
```

## Set Public/Private keys
If you don't have them and you want to generate them, you can setup the keys by doing:
```js
await Crypt_RSA.generateKeys(true);
// The parameter `true`, sets the generated keys up automatically
```

If you already have the keys, you can set them with: 
```js
Crypt_RSA.publicKey  = '< your public  key >';
Crypt_RSA.privateKey = '< your private key >';
```

## Clear keys
To clear the previous set of keys, you can use:
```js
console.log(Crypt_RSA.clearKeys());
>>> { publicKey: '<old public key>', privateKey: '<old private key>' }

console.log(Crypt_RSA.publicKey);
>>> null
console.log(Crypt_RSA.privateKey);
>>> null
```

## Encrypt text
__Warning__: to use this function you need to setup both `public` and `private` keys first

```js
let s = 'My text message';
```

Versions:
- async/await:
	```js
	(async() => {
		let s_encrypt = await Crypt_RSA.encrypt(s);
		console.log(s_encrypt);
	})();
	```
- callback/s:
	```js
	Crypt_RSA.encrypt(s, console.log)
	```
- both:
	```js
	(async() => {
		let s_encrypt = await Crypt_RSA.encrypt(s, console.log);
	})();
	```

Output on console:
```
>>> e+JGXm7eYcq88YZbJcRWxhwCBoxHpMtRV54nnb86mQXwCUH3Uy1vP372OyqHXs3c
>>> PglWZ7yAuF569IwcndOB6YXiDopL4JWnGm6fzjXMQtF7BJFJ9+9K3L7HnbRLoC/I
>>> CA7JiuqU2Ca67Ix5NTHpiKKK0hFZ3UCMTA22sA1mTWAg9PSjKBga9tdMo7V2buhk
>>> +sUnCXgiA564eUoJRdRKEZG8MykaEcwLUjCMd8iyKZH2Ek/hpHVb7j5VGs/rZ/Ik
>>> 6faDWAA9r26X/NocivlYVbQeSTVyTmiPPgqn6+EBTXYzUSlaTCpuTWkcymECgfIY
>>> c8cFt0i8vbYL7lJLzN9/F2EawcPLwn3I22DLwywgi9fmqo8NE8Sn7Sp05Eioajud
>>> b1xuzL8bKymy2i2I1k2K4RVNe0Xuu82wqCCP3MyZGx+3ups8kqL7ePNIIZq1TT1R
>>> c1a+iDDOWhwccZ0OldFHPlp24Ky5/bKFV38JI2dNiFNySJQczKIHgmZs6WJ21tyY
>>> hIz9PgrOp1F3+UB7ScamW2SKJIT3OqsmUTxMYKuQRYYJLy1KWUBTBxyfrKiJwcS4
>>> Nmp1qQGsM1BTJ0oYUoKbivrKuhOTQNeSoIXlR5f+Nba9L8EvzlAyzuSRtosIRknm
>>> nNtZL3YvWYdUY2Q4SvcPVbxYTaLOP3NwsILajoVxybk=
```
 

## Decrypt text
__Warning__: to use this function you need to setup both `public` and `private` keys first

Versions:
- async/await:
	```js
	(async() => {
		let s_decrypt_ = await Crypt_RSA.decrypt(s);
		console.log(s_decrypt_);
	})();
	```
- callback/s:
	```js
	Crypt_RSA.decrypt(s, console.log)
	```
- both:
	```js
	(async() => {
		let s_decrypt_ = await Crypt_RSA.decrypt(s, console.log);
	})();
	```

Output on console: 
```
>>> My text message
```