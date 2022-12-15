"use strict";

const cluster = require("cluster");
const os = require("os");

if (cluster.isMaster) {
	const cpus = os.cpus().length;
	for (let i = 0; i < cpus; i++) {
		cluster.fork();
	}

	// 오류 코로 종료되면 새로운 worker 생성
	cluster.on("exit", (worker, code) => {
		if (code != 0 && !worker.exitedAfterDisconnect) {
			console.log("Worker crashed. Starting a new worker");
			cluster.fork();
		}
	});

	process.on("SIGUSR2", () => {
		console.log("Restarting workers");
		const workers = Object.keys(cluster.workers);

		function restartWorker(i) {
			if (i >= workers.length) return;

			const worker = cluster.workers[workers[i]];

			console.log(`Stopping worker: ${worker.process.pid}`);
			// 작업자를 정상적으로 중지
			worker.disconnect();

			worker.on("exit", () => {
				// 정상적인 종료면 return
				if (!worker.suicide) return;

				// 새로운 프로세스 생성
				const newWorker = cluster.fork();

				newWorker.on("listening", () => {
					restartWorker(i + 1);
				});
			});
		}

		restartWorker(0);
	});
} else {
	require("./app");
}
9;
