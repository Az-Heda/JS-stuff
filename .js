async function* readData() {
	const response = await fetch('/stream', { method: 'POST', body: JSON.stringify([...Array(50).keys()]) });
	const reader = response.body.getReader();
	const decoder = new TextDecoder()
	while (true) {
		const { done, value } = await reader.read();
		if (done) return;
		yield decoder.decode(value);
	}
}

(async () => {
	let gen = readData();
	for await (let v of gen) {
		console.log(v);
	}
})()