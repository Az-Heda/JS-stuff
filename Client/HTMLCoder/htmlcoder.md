# HTMLCoder

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/HTMLCoder/htmlcoder.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/HTMLCoder/htmlcoder.js"></script>
```

## Usage

### Save

HTML page (Example)
```html
<div id="container">
	<div class="card">
		<div class="card-header">
			<h4>Card header</h4>
		</div>
		<div class="card-body">
			<p>Card body</p>
		</div>
	</div>
</div>
```

Javascript
```js
(async() => {
	let element = document.getElementById('container');
	console.log(await HTMLCoder.save(element));
})();
```
Output:

`H4sIAAAAAAAACq2QsQ7CMAxEfwXdHDamrPwCG2VwE0MjVSlKXASK-HcSIRBTlZbKU-TLvfMluHjgu0CfqY-sIHSBhnU3KJBIcO0oHKETnM0LM3gh5zngqWA619vAHvqYvj4SxmxTdOzzE41vpEz-kOphpqcYC4-CnY36B7btmOyC86ap3Q6VfvucYfPJcPo1nLq2Wri4lnawj5VLuc7q5B1g3UaqZEX0Al20rqknAwAA`


### Load

You just need to pass the previous output as a string into HTMLCoder.load (you can even use strings generated from other HTML Files) and you will get the exact structure of the HTMLElement, all of the child nodes and the attribute for all of them

```js
let code = 'H4sIAAAAAAAACq2QsQ7CMAxEfwXdHDamrPwCG2VwE0MjVSlKXASK-HcSIRBTlZbKU-TLvfMluHjgu0CfqY-sIHSBhnU3KJBIcO0oHKETnM0LM3gh5zngqWA619vAHvqYvj4SxmxTdOzzE41vpEz-kOphpqcYC4-CnY36B7btmOyC86ap3Q6VfvucYfPJcPo1nLq2Wri4lnawj5VLuc7q5B1g3UaqZEX0Al20rqknAwAA';

(async() => {
	console.log(await HTMLCoder.load(code));
})();
```

Output: 

```html
<div id="container">
	<div class="card">
		<div class="card-header">
			<h4>Card header</h4>
		</div>
		<div class="card-body">
			<p>Card body</p>
		</div>
	</div>
</div>
```