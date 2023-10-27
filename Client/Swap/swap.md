# Swappable

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