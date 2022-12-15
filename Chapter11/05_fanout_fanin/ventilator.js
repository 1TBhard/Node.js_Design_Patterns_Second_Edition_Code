"use strict";

const zmq = require("zmq");
const variationsStream = require("variations-stream");
const alphabet = "abcdefghijklmnopqrstuvwxyz";
const batchSize = 10000;
const maxLength = process.argv[2];
const searchHash = process.argv[3];

// push 소켓을 만들고 포트에 바인딩
const ventilator = zmq.socket("push");
ventilator.bindSync("tcp://*:5016");

let batch = [];
variationsStream(alphabet, maxLength)
	.on("data", (combination) => {
		batch.push(combination);

		if (batch.length === batchSize) {
			const msg = { searchHash: searchHash, variations: batch };
			ventilator.send(JSON.stringify(msg));
			batch = [];
		}
	})
	.on("end", () => {
		//send remaining combinations
		const msg = { searchHash: searchHash, variations: batch };
		ventilator.send(JSON.stringify(msg));
	});
