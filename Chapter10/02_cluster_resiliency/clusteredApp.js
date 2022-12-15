"use strict";

const cluster = require("cluster");
const os = require("os");

if (cluster.isMaster) {
	// CPU 코어에 대한 정보를 포함하는 객체 배열을 반환
	const cpus = os.cpus().length;
	for (let i = 0; i < cpus; i++) {
		cluster.fork();
	}

	cluster.on("exit", (worker, code) => {
		if (code != 0) {
			console.log("Worker crashed. Starting a new worker");
			cluster.fork();
		}
	});
} else {
	require("./app");
}
