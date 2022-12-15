"use strict";

const zmq = require("zmq");
const crypto = require("crypto");

// 공급기에 연결되어 작업을 수신
const fromVentilator = zmq.socket("pull");

// 결과를 전달하기 위해 수집자에게 송신
const toSink = zmq.socket("push");

fromVentilator.connect("tcp://localhost:5016");
toSink.connect("tcp://localhost:5017");

fromVentilator.on("message", (buffer) => {
	const msg = JSON.parse(buffer);
	const variations = msg.variations;

	variations.forEach((word) => {
		console.log(`Processing: ${word}`);
		const shasum = crypto.createHash("sha1");
		shasum.update(word);
		const digest = shasum.digest("hex");
		if (digest === msg.searchHash) {
			console.log(`Found! => ${word}`);
			toSink.send(`Found! ${digest} => ${word}`);
		}
	});
});
