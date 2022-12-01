"use strict";

// 객체 증강(Object augmentation)
// 대상을 수정하는 프록시이다.
function createProxy(subject) {
	const helloOrig = subject.hello;
	subject.hello = () => helloOrig.call(this) + " world!";

	return subject;
}

module.exports = createProxy;
