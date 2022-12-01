"use strict";

const profiler = require("./profiler");

function getRandomArray(len) {
	const p = profiler(`Generating a ${len} items long array`);
	p.start();
	const arr = [];
	for (let i = 0; i < len; i++) {
		arr.push(Math.random());
	}
	p.end();
}

getRandomArray(1e6);
console.log("Done");

// export NODE_ENV=development; node profilerTest
// Timer "Generating a 1000000 items long array" took 0 seconds and 16428541 nanoseconds.
