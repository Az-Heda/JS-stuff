import websockets
import asyncio
import json

class WSType:
	def send (value : str):
		""" Send a string the the user id """

class MyWebSockets:
	def __init__(self, host : str ='127.0.0.1', port : int =8765):
		self.callbacks : dict = {}
		self.host : str = host
		self.port : int = port
	
	def addCallback(self, name: str, f):
		if name is not None:
			self.callbacks[name] = f

	def removeCallback(self, name : str):
		self.callbacks.pop(name, None)

	def run(self):
		asyncio.run(self._run())

	async def _run(self):
		async with websockets.serve(self.handler, host=self.host, port=self.port):
			await asyncio.Future()

	async def handler(self, ws):
		async for m in ws:
			try:
				d = json.loads(m)
				id = d.pop('_id')
				if id in self.callbacks:
					result = self.callbacks[id](**d)
					await ws.send(result)
			except KeyError:
				pass
			except json.decoder.JSONDecodeError:
				pass


def testEndpoint():
	return 'Message received!'


if __name__ == '__main__':
	print('Socket handler')
	mws : MyWebSockets = MyWebSockets(host='127.0.0.1', port=7789)
	mws.addCallback('test', testEndpoint)
	asyncio.run(mws.run())

