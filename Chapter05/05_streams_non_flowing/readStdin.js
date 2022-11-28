"use strict";

process.stdin
	// 1. readable 이벤트에 리스너 등록
	.on("readable", () => {
		let chunk;
		console.log("New data available");

		// 청크를 반복적으로 읽음, utf8 으로 인코딩
		while ((chunk = process.stdin.read().setEncoding("utf8")) !== null) {
			console.log(`Chunk read: (${chunk.length}) "${chunk.toString()}"`);
		}
	})
	.on("end", () => process.stdout.write("End of stream"));
