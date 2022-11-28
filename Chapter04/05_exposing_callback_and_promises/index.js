"use strict";

/*
콜백을 인자로 받으면 콜백을 실행
콜백 인자 없으면 Promise 반환
*/

module.exports = function asyncDivision(dividend, divisor, cb) {
	return new Promise((resolve, reject) => {
		// [1]

		process.nextTick(() => {
			const result = dividend / divisor;
			if (isNaN(result) || !Number.isFinite(result)) {
				const error = new Error("Invalid operands");
				if (cb) {
					cb(error);
				} // [2]
				return reject(error);
			}

			if (cb) {
				cb(null, result);
			} // [3]
			resolve(result);
		});
	});
};
