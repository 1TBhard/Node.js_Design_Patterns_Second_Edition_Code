"use strict";

const zmq = require("zmq");
const sink = zmq.socket("pull");
sink.bindSync("tcp://*:5017");

// 결과를 수집함
sink.on("message", (buffer) => {
	console.log("Message from worker: ", buffer.toString());
});
