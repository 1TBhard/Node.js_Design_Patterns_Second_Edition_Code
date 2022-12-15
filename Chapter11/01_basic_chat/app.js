"use strict";

const WebSocketServer = require("ws").Server;

//static file server
const server = require("http").createServer(
	// http 서버 및 정적 파일 제공
	require("ecstatic")({ root: `${__dirname}/www` })
);

const wss = new WebSocketServer({ server: server }); // 웹소켓서버
wss.on("connection", (ws) => {
	console.log("Client connected");
	ws.on("message", (msg) => {
		// 메시지 브로드 캐스트
		console.log(`Message: ${msg}`);
		broadcast(msg);
	});
});

// 브로드 캐스트
function broadcast(msg) {
	wss.clients.forEach((client) => {
		client.send(msg);
	});
}

server.listen(process.argv[2] || 8080);
