"use strict";

/* 결과를 캐시하여 효율을 올린 코드 */

const totalSales = require("./totalSales");

const queues = {};

// 캐시 객체
const cache = {};

module.exports = function totalSalesBatch(item, callback) {
	const cached = cache[item];

	// 맨 처음 원하는 요청의 결과가 캐싱됬는지 확인
	if (cached) {
		console.log("Cache hit");
		return process.nextTick(callback.bind(null, null, cached));
	}

	if (queues[item]) {
		console.log("Batching operation");
		return queues[item].push(callback);
	}

	queues[item] = [callback];

	// 캐시된 결과는 30초 후에 무효화
	totalSales(item, (err, res) => {
		if (!err) {
			cache[item] = res;
			setTimeout(() => {
				delete cache[item];
			}, 30 * 1000); //30 seconds expiry
		}

		const queue = queues[item];
		queues[item] = null;
		queue.forEach((cb) => cb(err, res));
	});
};
