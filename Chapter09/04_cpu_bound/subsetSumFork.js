"use strict";

const EventEmitter = require("events").EventEmitter;
const ProcessPool = require("./processPool");
const workers = new ProcessPool(__dirname + "/subsetSumWorker.js", 2);

// 자식 프로세스와 통신
class SubsetSumFork extends EventEmitter {
	constructor(sum, set) {
		super();
		this.sum = sum;
		this.set = set;
	}

	start() {
		workers.acquire((err, worker) => {
			// 부모 프로세스에 메시지 보냄
			worker.send({ sum: this.sum, set: this.set });

			// 자식 프로세스에서 생성된 모든 이벤트 발생
			const onMessage = (msg) => {
				if (msg.event === "end") {
					// end 이벤트시 이 핸들러를 제거
					worker.removeListener("message", onMessage);
					// 프로세스 다시 pool 에 넣음(사용 종료된 것 다시 재사용 준비 완료로 변경)
					workers.release(worker);
				}

				// 메시지를 받으면 해당 메시지의 이벤트 발행
				this.emit(msg.event, msg.data);
			};

			// 메시지 수신
			worker.on("message", onMessage);
		});
	}
}

module.exports = SubsetSumFork;
