"use strict";

const level = require("level");
const timestamp = require("monotonic-timestamp");
const JSONStream = require("JSONStream");
const amqp = require("amqplib");
const db = level("./msgHistory");

require("http")
	.createServer((req, res) => {
		res.writeHead(200);
		db.createValueStream().pipe(JSONStream.stringify()).pipe(res);
	})
	.listen(8090);

let channel, queue;
amqp
	.connect("amqp://localhost") // 브로커 연결
	.then((conn) => conn.createChannel())
	.then((ch) => {
		channel = ch;
		return channel.assertExchange("chat", "fanout"); // 'chat' 이라는 팬아웃 교환기 생성
	})
	.then(() => channel.assertQueue("chat_history")) // 대기열 생성
	.then((q) => {
		queue = q.queue;
		return channel.bindQueue(queue, "chat"); // 생성한 교환기에 대기열을 바인딩
	})
	.then(() => {
		return channel.consume(queue, (msg) => {
			// 대기열의 메시지 수신
			const content = msg.content.toString();

			console.log(`Saving message: ${content}`);

			// 타임스탬프를 사용하여 날짜별로 정렬 및 저장
			db.put(timestamp(), content, (err) => {
				if (!err) channel.ack(msg);
			});
		});
	})
	.catch((err) => console.log(err));
