"use strict";

// 동기식으로 조합을 생성하여 매우 느림

const EventEmitter = require("events").EventEmitter;

class SubsetSum extends EventEmitter {
	constructor(sum, set) {
		super();
		this.sum = sum;
		this.set = set;
		this.totalSubsets = 0;
	}

	// 동기식
	_combine(set, subset) {
		for (let i = 0; i < set.length; i++) {
			let newSubset = subset.concat(set[i]);
			this._combine(set.slice(i + 1), newSubset);
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
		this._combine(this.set, []);
		this.emit("end");
	}
}

module.exports = SubsetSum;
