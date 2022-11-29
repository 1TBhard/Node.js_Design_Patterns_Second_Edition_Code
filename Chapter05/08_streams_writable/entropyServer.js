"use strict";

const Chance = require("chance");
const chance = new Chance();

require("http")
	.createServer((req, res) => {
		res.writeHead(200, { "Content-Type": "text/plain" });

		// 5% 확률로 종료
		while (chance.bool({ likelihood: 95 })) {
			// 임의의 문자열 스트림에 작성
			res.write(chance.string() + "\n");
		}

		// 스트림 종료, 스트림에 쓸 최종 문자열 전달
		res.end("\nThe end...\n");
		// finsh 이벤트 리스너 등록, 모든 데이터가 하위 소켓에 플러시 될 때 발생
		res.on("finish", () => console.log("All data was sent"));
	})
	.listen(8080, () => console.log("Listening on http://localhost:8080"));
