"use strict";

module.exports = class OnlineState {
	constructor(failsafeSocket) {
		this.failsafeSocket = failsafeSocket;
	}

	send(data) {
		// 소켓에 데이터 쓰기
		this.failsafeSocket.socket.write(data);
	}

	// 오프라인 상태 때 대기한 모든 테이터를 소켓이 씀
	// 그 이후 이벤트 수신
	activate() {
		this.failsafeSocket.queue.forEach((data) => {
			this.failsafeSocket.socket.write(data);
		});
		this.failsafeSocket.queue = [];

		this.failsafeSocket.socket.once("error", () => {
			this.failsafeSocket.changeState("offline");
		});
	}
};
