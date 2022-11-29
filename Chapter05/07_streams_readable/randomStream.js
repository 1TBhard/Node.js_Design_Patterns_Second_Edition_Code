"use strict";

const stream = require("stream");
const Chance = require("chance");

const chance = new Chance();

class RandomStream extends stream.Readable {
	constructor(options) {
		super(options);
	}

	// _read() 에 대한 구현체
	_read(size) {
		// chance 를 사용하여 임의의 문자열 생성
		const chunk = chance.string();
		console.log(`Pushing chunk of size: ${chunk.length}`);
		// 내부 읽기 버퍼에 푸시, 문자열을 push하기 때문에 인코딩을 지정(기본값은 null)
		this.push(chunk, "utf8");

		// 5% 확률로 종료
		if (chance.bool({ likelihood: 5 })) {
			// 내부 버퍼에 EOF를 push
			this.push(null);
		}
	}
}

module.exports = RandomStream;
