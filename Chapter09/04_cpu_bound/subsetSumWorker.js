"use strict";

const SubsetSum = require("./subsetSum");

// 부모 프로세스의 메시지 수신을 시작
process.on("message", (msg) => {
	const subsetSum = new SubsetSum(msg.sum, msg.set);

	subsetSum.on("match", (data) => {
		process.send({ event: "match", data: data });
	});

	subsetSum.on("end", (data) => {
		process.send({ event: "end", data: data });
	});

	subsetSum.start();
});
