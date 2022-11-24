"use strict";

const EventEmitter = require("events").EventEmitter;
const fs = require("fs");

function findPattern(files, regex) {
	const emitter = new EventEmitter();
	files.forEach(function (file) {
		fs.readFile(file, "utf8", (err, content) => {
			// emit(event, listener): 새 이벤트를 생성 및 listener에 전달할 인자를 보냄
			if (err) return emitter.emit("error", err);

			emitter.emit("fileread", file);
			let match;
			if ((match = content.match(regex)))
				match.forEach((elem) => emitter.emit("found", file, elem));
		});
	});
	return emitter;
}

// on(event, listener): event에 대한 리스너 등록
findPattern(["fileA.txt", "fileB.json"], /hello \w+/g)
	.on("fileread", (file) => console.log(file + " was read"))
	.on("found", (file, match) =>
		console.log('Matched "' + match + '" in file ' + file)
	)
	.on("error", (err) => console.log("Error emitted: " + err.message));
