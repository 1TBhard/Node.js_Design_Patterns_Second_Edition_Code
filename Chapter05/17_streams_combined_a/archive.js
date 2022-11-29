"use strict";

const fs = require("fs");
const compressAndEncryptStream =
	require("./combinedStreams").compressAndEncrypt;

fs.createReadStream(process.argv[3])
	.pipe(compressAndEncryptStream(process.argv[2]))
	.pipe(fs.createWriteStream(process.argv[3] + ".gz.enc"))
	.on("error", (err) => {
		// .pipe(fs.createWriteStream(process.argv[3] + ".gz.enc")) 의 에러만 처리한다.
		console.log(err);
	});
