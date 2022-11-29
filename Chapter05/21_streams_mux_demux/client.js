"use strict";

/* 패킷을 만들어 보내는 예제
패킷 = 채널_식별자(1B) + 데이터_길이(4B) + 데이터
*/

const child_process = require("child_process");
const net = require("net");

function multiplexChannels(sources, destination) {
	let totalChannels = sources.length;

	for (let i = 0; i < sources.length; i++) {
		// non-flowing 모드로 스트림을 읽도록함
		sources[i]
			.on("readable", function () {
				let chunk;

				while ((chunk = this.read()) !== null) {
					// 보낼 패킷
					const outBuff = new Buffer(1 + 4 + chunk.length);

					// 채널 식별자 1B
					outBuff.writeUInt8(i, 0);
					// 데이터 길이 4B
					outBuff.writeUInt32BE(chunk.length, 1);
					chunk.copy(outBuff, 5);
					console.log("Sending packet to channel: " + i);
					// 준비된 캐킷을 대상 스트림에 기록
					destination.write(outBuff);
				}
			})
			.on("end", () => {
				// 모든 소스 스트림이 끝날때까지 확인
				if (--totalChannels === 0) {
					destination.end();
				}
			});
	}
}

const socket = net.connect(3000, () => {
	// fork(): 새 Node.js 프로세스를 생성
	// { silent: true } : 하위의 stdin, stdout, stderr 이 상위로 파이프되는 경우
	const child = child_process.fork(process.argv[2], process.argv.slice(3), {
		silent: true,
	});

	// 자식 프로세스의 stdout, stderr을 취해 소켓으로 멀티플렉싱
	multiplexChannels([child.stdout, child.stderr], socket);
});
