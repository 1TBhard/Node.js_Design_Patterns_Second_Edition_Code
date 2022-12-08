"use strict";

const fork = require("child_process").fork;

class ProcessPool {
	// 파일째로 받음
	constructor(file, poolMax) {
		this.file = file;
		this.poolMax = poolMax;
		this.pool = []; // 사용 준비됨
		this.active = []; // 사용중
		this.waiting = []; // 대기
	}

	acquire(callback) {
		let worker;
		if (this.pool.length > 0) {
			// 사용 준비된 것을 빼서 실행으로 옮김
			worker = this.pool.pop();
			this.active.push(worker);

			return process.nextTick(callback.bind(null, null, worker));
		}

		// 동시성 제한
		if (this.active.length >= this.poolMax) {
			return this.waiting.push(callback);
		}

		// 새로운 프로세스를 만듦
		worker = fork(this.file);
		this.active.push(worker);

		process.nextTick(callback.bind(null, null, worker));
	}

	// 프로세스를 다시 풀에 넣기
	// 이를 통해 프로세스를 중단되지 않고 다시 할당 -> 시간 절약됨
	release(worker) {
		if (this.waiting.length > 0) {
			// 대기큐에서 하나 뺌
			const waitingCallback = this.waiting.shift();

			waitingCallback(null, worker);
		}

		// 실행중인 것에서 worker 제거
		this.active = this.active.filter((w) => worker !== w);

		this.pool.push(worker);
	}
}

module.exports = ProcessPool;
