"use strict";

// 프록시 예재

const fs = require("fs");

// object composition 방법으로 프록시 생성
function createLoggingWritable(writableOrig) {
	// writableOrig 의 프로토타입을 proto로 주입
	const proto = Object.getPrototypeOf(writableOrig);

	function LoggingWritable(writableOrig) {
		this.writableOrig = writableOrig;
	}

	LoggingWritable.prototype = Object.create(proto);

	// write() 호출을 가로챔
	LoggingWritable.prototype.write = function (chunk, encoding, callback) {
		if (!callback && typeof encoding === "function") {
			callback = encoding;
			encoding = undefined;
		}
		console.log("Writing ", chunk);

		return this.writableOrig.write(chunk, encoding, function () {
			console.log("Finished writing ", chunk);
			callback && callback();
		});
	};

	// on() 호출을 가로챔
	LoggingWritable.prototype.on = function () {
		return this.writableOrig.on.apply(this.writableOrig, arguments);
	};

	// end() 호출을 가로챔
	LoggingWritable.prototype.end = function () {
		return this.writableOrig.end.apply(this.writableOrig, arguments);
	};

	return new LoggingWritable(writableOrig);
}

const writable = fs.createWriteStream("test.txt");
const writableProxy = createLoggingWritable(writable);

writableProxy.write("First chunk");
writableProxy.write("Second chunk");
writable.write("This is not logged");
writableProxy.end();
