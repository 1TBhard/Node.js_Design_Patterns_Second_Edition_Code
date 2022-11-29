"use strict";

const fs = require("fs");
const combine = require("multipipe");
const decryptAndDecompress = require("./combinedStreams").decryptAndDecompress;

// combine 안의 에러를 전부 처리
combine(
	fs
		.createReadStream(process.argv[3])
		.pipe(decryptAndDecompress(process.argv[2]))
		.pipe(fs.createWriteStream(process.argv[3] + ".txt"))
).on("error", (err) => {
	//this error may come from any stream in the pipeline
	console.log(err);
});
