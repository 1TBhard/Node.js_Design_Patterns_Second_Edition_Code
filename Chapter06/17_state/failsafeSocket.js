"use strict";

const OfflineState = require("./offlineState");
const OnlineState = require("./onlineState");

class FailsafeSocket {
	constructor(options) {
		this.options = options;
		this.queue = [];
		this.currentState = null;
		this.socket = null;
		// 오프라인, 온라인일때 상태 구분위해서
		this.states = {
			offline: new OfflineState(this),
			online: new OnlineState(this),
		};
		this.changeState("offline");
	}

	// 상태변경
	changeState(state) {
		console.log("Activating state: " + state);
		this.currentState = this.states[state];
		// 상태의 activate 실행
		this.currentState.activate();
	}

	// 소켓 함수를 위임(state 따라서 동작 달라짐)
	send(data) {
		this.currentState.send(data);
	}
}

module.exports = (options) => {
	return new FailsafeSocket(options);
};
