"use strict";

const fromArray = require("from2-array");
const through = require("through2");
const fs = require("fs");

function concatFiles(destination, files, callback) {
	const destStream = fs.createWriteStream(destination);
	fromArray
		.obj(files) // readable 스트림 생성
		.pipe(
			through.obj((file, enc, done) => {
				const src = fs.createReadStream(file);
				// readable stream 이 emit 되지 않도록 함
				src.pipe(destStream, { end: false });
				src.on("end", done); // 소스 파일의 내용이 destStream으로 전달 된 경우
			})
		)
		.on("finish", () => {
			// 모든 파일이 처리된 후 destStream 종료
			destStream.end();
			callback();
		});
}

module.exports = concatFiles;
