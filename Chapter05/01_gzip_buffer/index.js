"use strict";

// 버퍼 api 사용한 Gzipping(압축)
const fs = require("fs");
const zlib = require("zlib");

const file = process.argv[2];

fs.readFile(file, (err, buffer) => {
	zlib.gzip(buffer, (err, buffer) => {
		fs.writeFile(file + ".gz", buffer, (err) => {
			console.log("File successfully compressed");
		});
	});
});

// node index.js ./README.txt 명령어 사용해야됨
