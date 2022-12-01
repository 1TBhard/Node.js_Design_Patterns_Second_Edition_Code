"use strict";

// object-composition 방법
// 모든 메서드를 수동으로 위임
function createProxy(subject) {
	const proto = Object.getPrototypeOf(subject);

	function Proxy(subject) {
		this.subject = subject;
	}

	Proxy.prototype = Object.create(proto);

	// proxied method
	Proxy.prototype.hello = function () {
		return this.subject.hello() + " world!";
	};

	// 메서드 위임
	Proxy.prototype.goodbye = function () {
		return this.subject.goodbye.apply(this.subject, arguments);
	};

	return new Proxy(subject);
}

module.exports = createProxy;
