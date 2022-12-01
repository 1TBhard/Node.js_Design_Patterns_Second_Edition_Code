"use strict";

// 객체 리터럴을 이용한 프록시
function createProxy(subject) {
	return {
		//proxied method
		hello: () => subject.hello() + " world!",

		//delegated method
		goodbye: () => subject.goodbye.apply(subject, arguments),
	};
}

module.exports = createProxy;
