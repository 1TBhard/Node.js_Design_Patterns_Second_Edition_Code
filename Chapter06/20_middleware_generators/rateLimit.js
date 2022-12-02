"use strict";

const lastCall = new Map();

module.exports = function* (next) {
	console.log(`IP: ${this.ip}`);
	console.log(lastCall);
	// inbound
	const now = new Date();

	// 초당 2개 이상의 요청에 응답 x
	if (
		lastCall.has(this.ip) &&
		now.getTime() - lastCall.get(this.ip).getTime() < 1000
	) {
		return (this.status = 429); // Too Many Requests
	}

	// 실행이 일시중지되어 다른 미들웨어들이 순차적으로 진행
	yield next;

	// outbound
	lastCall.set(this.ip, now);
	this.set("X-RateLimit-Reset", now.getTime() + 1000);
};
