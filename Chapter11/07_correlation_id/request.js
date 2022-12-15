"use strict";

const uuid = require("node-uuid");

module.exports = (channel) => {
	const idToCallbackMap = {}; // 들어오는 메시지를 기다리기 위한 해시맵

	channel.on("message", (message) => {
		const handler = idToCallbackMap[message.inReplyTo];
		if (handler) {
			handler(message.data);
		}
	});

	return function sendRequest(req, callback) {
		const correlationId = uuid.v4();

		idToCallbackMap[correlationId] = callback;
		channel.send({
			type: "request",
			data: req,
			id: correlationId,
		});
	};
};
