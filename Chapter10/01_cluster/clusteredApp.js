"use strict";

const cluster = require("cluster");
const os = require("os");

if (cluster.isMaster) {
	// CPU 코어에 대한 정보를 포함하는 객체 배열을 반환
	const cpus = os.cpus().length;
	for (let i = 0; i < cpus; i++) {
		// 현재 프로세스를 forking
		cluster.fork();
	}
} else {
	require("./app");
}
