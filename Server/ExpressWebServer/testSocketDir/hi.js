

function sayHi(params) {
	const { socket, data, ctx } = params;
	ctx.socket = data;
	socket.emit('response', { data });
}

module.exports = sayHi;