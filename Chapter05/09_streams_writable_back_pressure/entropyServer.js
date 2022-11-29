"use strict";

const Chance = require("chance");
const chance = new Chance();

require("http")
	.createServer((req, res) => {
		res.writeHead(200, { "Content-Type": "text/plain" });

		function generateMore() {
			// 95% 확률로 진행
			while (chance.bool({ likelihood: 95 })) {
				// `false` if the stream wishes for the calling code to wait for the `'drain'` event to be emitted before continuing to write additional data; otherwise `true`.
				// 내부 버퍼가 가득차있는지(drain 상태인지 확인)
				const shouldContinue = res.write(
					// 데이터 덩어리를 1B ~ 16KB 로
					chance.string({ length: 16 * 1024 - 1 })
				);

				if (!shouldContinue) {
					console.log("Backpressure");
					return res.once("drain", generateMore);
				}
			}
			res.end("\nThe end...\n", () => console.log("All data was sent"));
		}
		generateMore();
	})
	.listen(8080, () => console.log("Listening on http://localhost:8080"));
