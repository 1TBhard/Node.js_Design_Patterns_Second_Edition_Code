"use strict";

const totalSales = require("./totalSales");

const queues = {};
module.exports = function totalSalesBatch(item, callback) {
	// 이미 대열에 있으면 항목에 대한 요청이 실행중
	if (queues[item]) {
		console.log("Batching operation");
		return queues[item].push(callback);
	}

	queues[item] = [callback];

	totalSales(item, (err, res) => {
		// 원래의 totalSales 완료되면 해당 특정 항목에 대한 큐에 모든 콜백 반복 및 작업
		const queue = queues[item];
		queues[item] = null;
		queue.forEach((cb) => cb(err, res));
	});
};
