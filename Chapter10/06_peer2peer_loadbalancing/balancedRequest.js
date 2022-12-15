"use strict";

const http = require("http");

// 미리 서버의 정보를 알고 있음
const servers = [
	{ host: "localhost", port: "8081" },
	{ host: "localhost", port: "8082" },
];

let i = 0;

module.exports = (options, callback) => {
	// 차례로 요청 날림
	i = (i + 1) % servers.length;
	options.hostname = servers[i].host;
	options.port = servers[i].port;

	return http.request(options, callback);
};
