"use strict";

const EventEmitter = require("events").EventEmitter;

class SubsetSumDefer extends EventEmitter {
	constructor(sum, set) {
		super();
		this.sum = sum;
		this.set = set;
		this.totalSubsets = 0;
	}

	// 이를 사용하여 _combine() 호출을 연기
	_combineInterleaved(set, subset) {
		// 실행증인 combine 수
		this.runningCombine++;

		// 실행 중단 및 중단한 것을 큐의 I/O 이벤트 뒤에 대기시킴
		setImmediate(() => {
			this._combine(set, subset);
			if (--this.runningCombine === 0) {
				this.emit("end");
			}
		});
	}

	// 동기식
	_combine(set, subset) {
		for (let i = 0; i < set.length; i++) {
			let newSubset = subset.concat(set[i]);
			// 이를 사용하여 재귀 -> 지연된 재귀로 변경
			this._combineInterleaved(set.slice(i + 1), newSubset);
			this._processSubset(newSubset);
		}
	}

	_processSubset(subset) {
		console.log("Subset", ++this.totalSubsets, subset);
		const res = subset.reduce((prev, item) => prev + item, 0);
		if (res == this.sum) {
			this.emit("match", subset);
		}
	}

	start() {
		this.runningCombine = 0;
		this._combineInterleaved(this.set, []);
	}
}

module.exports = SubsetSumDefer;
