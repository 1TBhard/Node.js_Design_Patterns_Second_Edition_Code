"use strict";

module.exports = function levelSubscribe(db) {
	// db 객체를 데코레이트
	db.subscribe = (pattern, listener) => {
		// put 연산을 listening
		db.on("put", (key, val) => {
			const match = Object.keys(pattern).every((k) => pattern[k] === val[k]);

			if (match) {
				// 일치하는 항목의 경우 리스너에게 통보
				listener(key, val);
			}
		});
	};

	return db;
};
