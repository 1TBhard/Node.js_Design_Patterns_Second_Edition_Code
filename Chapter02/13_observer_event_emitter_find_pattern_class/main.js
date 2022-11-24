"use strict";

const EventEmitter = require("events").EventEmitter;
const fs = require("fs");

class FindPattern extends EventEmitter {
	constructor(regex) {
		super();
		this.regex = regex;
		this.files = [];
		// 이벤트 리스너 등록전에 emit한 이벤트는 감지 되지 않는다.
		// this.emit("fileRead", '파일')
	}

	addFile(file) {
		this.files.push(file);
		// 체이닝을 위해 this 를 반환
		return this;
	}

	find() {
		this.files.forEach((file) => {
			fs.readFile(file, "utf8", (err, content) => {
				if (err) {
					// 에러이므로 return 해서 종료
					return this.emit("error", err);
				}

				this.emit("fileread", file);

				let match;
				if ((match = content.match(this.regex))) {
					match.forEach((elem) => this.emit("found", file, elem));
				}
			});
		});
		return this;
	}
}

const findPatternObject = new FindPattern(/hello \w+/);
findPatternObject
	.addFile("fileA.txt")
	.addFile("fileB.json")
	// 이벤트가 나중에 등록되도 되는 것인가, 앞에 하든 뒤에 하든 됨!!
	.find()
	.on("found", (file, match) =>
		console.log(`Matched "${match}" in file ${file}`)
	)
	.on("error", (err) => console.log(`Error emitted ${err.message}`));
