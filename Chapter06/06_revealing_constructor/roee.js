"use strict";

const EventEmitter = require("events");

module.exports = class Roee extends EventEmitter {
	constructor(executor) {
		super();
		const emit = this.emit.bind(this);
		// Roee.emit() 사용 불가
		this.emit = undefined;
		executor(emit);
	}
};
