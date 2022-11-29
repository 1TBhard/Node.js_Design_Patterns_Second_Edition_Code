"use strict";

const fs = require("fs");
const zlib = require("zlib");
const http = require("http");
const path = require("path");

const file = process.argv[2];
const server = process.argv[3];

const options = {
	hostname: server,
	port: 3000,
	path: "/",
	method: "PUT",
	headers: {
		filename: path.basename(file),
		"Content-Type": "application/octet-stream",
		"Content-Encoding": "gzip",
	},
};

const req = http.request(options, (res) => {
	console.log("Server response: " + res.statusCode);
});

// pipe: 입출력으로 리다이렉트
fs.createReadStream(file)
	.pipe(zlib.createGzip()) // 새로운 Gunzip 객체를 생성
	.pipe(req)
	.on("finish", () => {
		console.log(`File ${file} successfully sent`);
	});
