"use strict";

const net = require("net");
const fs = require("fs");

function demultiplexChannel(source, destinations) {
	let currentChannel = null;
	let currentLength = null;
	source
		.on("readable", () => {
			let chunk;

			if (currentChannel === null) {
				// 1B 만큼 읽음, 채널 식별자
				chunk = source.read(1);
				currentChannel = chunk && chunk.readUInt8(0);
			}

			if (currentLength === null) {
				// 4B 만큼 읽음, 데이터 길이
				chunk = source.read(4);
				currentLength = chunk && chunk.readUInt32BE(0);
				if (currentLength === null) {
					return;
				}
			}

			// 데이터를 읽음
			chunk = source.read(currentLength);
			if (chunk === null) {
				return;
			}

			console.log("Received packet from: " + currentChannel);

			// 채널에 데이터 쓰기
			destinations[currentChannel].write(chunk);
			currentChannel = null;
			currentLength = null;
		})
		.on("end", () => {
			// 모든 채널 종료
			destinations.forEach((destination) => destination.end());
			console.log("Source channel closed");
		});
}

net
	.createServer((socket) => {
		// stdout.log 에 대한 스트림 생성(파일도 생성)
		const stdoutStream = fs.createWriteStream("stdout.log");
		// stderr.log 에 대한 스트림 생성(파일도 생성)
		const stderrStream = fs.createWriteStream("stderr.log");
		demultiplexChannel(socket, [stdoutStream, stderrStream]);
	})
	.listen(3000, () => console.log("Server started"));
