"use strict";

const pify = require("pify"); // promise 적용하기 위한 lib
const totalSales = pify(require("./totalSales"));

const cache = {};
module.exports = function totalSalesPromises(item) {
	if (cache[item]) {
		// 캐시 확인
		return cache[item];
	}

	cache[item] = totalSales(item) // 프로미스 사용
		.then((res) => {
			// 30초 후 캐시무효화
			setTimeout(() => {
				delete cache[item];
			}, 30 * 1000);
			return res;
		})
		.catch((err) => {
			delete cache[item];
			throw err;
		});

	return cache[item];
};
