"use strict";

const http = require("http");
const pid = process.pid;
//  서비스 등록을 허용
const consul = require("consul")();
// 시스템의 빈 포트 발견
const portfinder = require("portfinder");
const serviceType = process.argv[2];

portfinder.getPort((err, port) => {
	const serviceId = serviceType + port;
	consul.agent.service.register(
		{
			id: serviceId,
			name: serviceType,
			address: "localhost",
			port: port,
			tags: [serviceType],
		},
		() => {
			const unregisterService = (err) => {
				consul.agent.service.deregister(serviceId, () => {
					process.exit(err ? 1 : 0);
				});
			};

			// 에러, 종료의 경우에 서비스 등록해제
			process.on("exit", unregisterService);
			process.on("SIGINT", unregisterService);
			process.on("uncaughtException", unregisterService);

			http
				.createServer((req, res) => {
					for (let i = 1e7; i > 0; i--) {}
					console.log(`Handling request from ${pid}`);
					res.end(`${serviceType} response from ${pid}\n`);
				})
				.listen(port, () => {
					console.log(`Started ${serviceType} (${pid}) on port ${port}`);
				});
		}
	);
});
