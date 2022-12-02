"use strict";

const jot = require("json-over-tcp");
const server = jot.createServer({ port: 1972 });
server.on("connection", (socket) => {
	socket.on("data", (data) => {
		console.log("Client data", data);
	});
});

server.listen(1972, () => console.log("Started"));
