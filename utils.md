# Util functions

<h2>
map(<br/>
	&emsp;&emsp; n : number,<br/>
	&emsp;&emsp; start1 : number,<br/>
	&emsp;&emsp; stop1 : number,<br/>
	&emsp;&emsp; start2 : number,<br/>
	&emsp;&emsp; stop2 : number<br/>
)
</h2>
<p>Number mapping from one range to another</p>

```js
console.log(map(1, 0, 2, 0, 200))
>>> 100
console.log(map(45, 0, 100, 0, 200000))
>>>90000
console.log(map(0.2, -1, 1, 0, 100))
>>> 60
```

<h2>
encode(<br/>
	&emsp;&emsp; <span style="color: #FFAA00">str</span> : string<br/>
	&emsp;&emsp; <span style="color: #FFAA00">separator</span> : string = '|'<br/>
)
</h2>
