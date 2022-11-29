"use strict";

const http = require("http");
const fs = require("fs");
const zlib = require("zlib");

const server = http.createServer((req, res) => {
	const filename = req.headers.filename;
	console.log("File request received: " + filename);

	req
		.pipe(zlib.createGunzip()) // 새로운 Gunzip 객체를 생성
		.pipe(fs.createWriteStream(filename))
		.on("finish", () => {
			res.writeHead(201, { "Content-Type": "text/plain" });
			res.end("That's it\n");
			console.log(`File saved: ${filename}`);
		});
});

server.listen(3000, () => console.log("Listening"));
