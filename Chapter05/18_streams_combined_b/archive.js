"use strict";

const fs = require("fs");
const combine = require("multipipe");
const compressAndEncryptStream =
	require("./combinedStreams").compressAndEncrypt;

// combine 안의 에러를 전부 처리
combine(
	fs
		.createReadStream(process.argv[3])
		.pipe(compressAndEncryptStream(process.argv[2]))
		.pipe(fs.createWriteStream(process.argv[3] + ".gz.enc"))
).on("error", (err) => {
	//this error may come from any stream in the pipeline
	console.log(err);
});
