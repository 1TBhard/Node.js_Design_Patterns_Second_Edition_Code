"use strict";

function* twoWayGenerator() {
	const what = yield null;
	console.log("Hello " + what);
}

const twoWay = twoWayGenerator();
twoWay.next(); // yield null 을 실행후 대기
twoWay.next("world");

// 실행결과
// Hello world
