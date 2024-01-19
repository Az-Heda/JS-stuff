# Swappable

[Homepage](../../README.md)

## Import
### CDN JSDeliver
```html
<script src="https://cdn.jsdelivr.net/npm/azheda-utils-v2@latest/Client/Swap/swap.js"></script>
```
### Unpkg
```html
<script src="https://unpkg.com/azheda-utils-v2@latest/Client/Swap/swap.js"></script>
```

## Usage
```html
<div id="d1">Swappable</div>
<div id="d2" swap-group='custom group'>Swappable only with same group</div>
<div id="d3" swap-group='custom group'>Swappable only with same group</div>
<script>
	Swappable.add(document.getElementById('d1'));
	Swappable.add(document.getElementById('d2'));
	Swappable.add(document.getElementById('d3'));
</script>
```