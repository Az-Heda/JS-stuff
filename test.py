from sanic import Sanic, Request, response
import json

app = Sanic(__name__)

jsfunc = """
async function readData() {
	const response = await fetch('/stream', { method: 'POST', body: JSON.stringify([...Array(10000).keys()]) });
	const reader = response.body.getReader();
	const decoder = new TextDecoder()
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			// Do something with last chunk of data then exit reader
			return;
		}
		// Otherwise do something here to process current chunk
		console.log(decoder.decode(value))
	}
}
"""


@app.get("/")
def homepage(request: Request):
	return response.html(f"<script>{jsfunc}</script>")


@app.post("/stream", stream=True)
async def handler(request: Request):
	body = ""
	while (frag := await request.stream.read()) != None:
		body += frag.decode("utf-8")

	args = json.loads(body)

	response = await request.respond(
		content_type="application/json",
	)

	for i in range(0, len(body), 1):
		await response.send(body[i : i + 1])

	await response.eof()

if __name__ == '__main__':
	app.run(port=7788)