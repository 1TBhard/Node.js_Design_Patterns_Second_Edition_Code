"use strict";

const fs = require("fs");
const split = require("split");
const request = require("request");
const ParallelStream = require("./parallelStream");

// 입력으로 주어진 파일로 부터 readable 스트림 생성
fs.createReadStream(process.argv[2])
	.pipe(split()) // Transform.split(): 라인을 서로 다른 데이터 덩어리로 출력
	.pipe(
		new ParallelStream((url, enc, done, push) => {
			if (!url) return done();
			request.head(url, (err, response) => {
				push(url + " is " + (err ? "down" : "up") + "\n");
				done();
			});
		})
	)
	.pipe(fs.createWriteStream("results.txt")) //[4]
	.on("finish", () => console.log("All urls were checked"));
