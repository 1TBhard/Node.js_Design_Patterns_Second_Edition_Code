"use strict";

// tcp 연결 및 json 사용할 수 있게 하는 lib
const jot = require("json-over-tcp");

module.exports = class OfflineState {
	constructor(failsafeSocket) {
		this.failsafeSocket = failsafeSocket;
	}

	// 데이터를 큐에 푸시
	send(data) {
		this.failsafeSocket.queue.push(data);
	}

	// 서버의 연결 재시도, 500ms 마다 반복
	activate() {
		const retry = () => {
			setTimeout(() => this.activate(), 500);
		};

		this.failsafeSocket.socket = jot.connect(
			this.failsafeSocket.options,
			() => {
				this.failsafeSocket.socket.removeListener("error", retry);
				this.failsafeSocket.changeState("online");
			}
		);
		this.failsafeSocket.socket.once("error", retry);
	}
};
