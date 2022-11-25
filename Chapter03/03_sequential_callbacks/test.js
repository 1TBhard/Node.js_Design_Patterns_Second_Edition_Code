"use strict";

function asyncOperation(callback) {
	process.nextTick(callback);
}

function task1(callback) {
	console.log("task_1 start");
	asyncOperation(() => {
		task2(callback);
	});
	console.log("task_1 end");
}

function task2(callback) {
	console.log("task_2 start");
	asyncOperation(() => {
		task3(callback);
	});
	console.log("task_2 end");
}

function task3(callback) {
	console.log("task_3 start");
	asyncOperation(() => {
		callback(); //finally executes the callback
	});
	console.log("task_3 end");
}

task1(() => {
	//executed when task1, task2 and task3 are completed
	console.log("tasks 1, 2 and 3 executed");
});

// ===== 실행 결과 =====
// task_1 start
// task_1 end
// task_2 start
// task_2 end
// task_3 start
// task_3 end
// tasks 1, 2 and 3 executed
