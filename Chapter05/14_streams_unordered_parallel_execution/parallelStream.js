"use strict";

const stream = require("stream");

class ParallelStream extends stream.Transform {
	constructor(userTransform) {
		// 객체 모드 활성화
		super({ objectMode: true });
		this.userTransform = userTransform;
		this.running = 0;
		this.terminateCallback = null;
	}

	_transform(chunk, enc, done) {
		this.running++;
		this.userTransform(
			chunk,
			enc,
			this._onComplete.bind(this),
			this.push.bind(this)
		);
		done();
	}

	// 스트림이 끝나기 직전에 호출
	_flush(done) {
		// 끝내지 않은 작업 있는 경우 종료작업 보류
		if (this.running > 0) {
			this.terminateCallback = done;
		} else {
			done();
		}
	}

	// 비동기 작업 완료될 때마다 호출
	_onComplete(err) {
		this.running--;
		if (err) {
			return this.emit("error", err);
		}
		if (this.running === 0) {
			this.terminateCallback && this.terminateCallback();
		}
	}
}

module.exports = ParallelStream;
