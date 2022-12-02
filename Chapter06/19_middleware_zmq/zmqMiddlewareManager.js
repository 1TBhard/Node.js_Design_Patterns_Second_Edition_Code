"use strict";

module.exports = class ZmqMiddlewareManager {
	constructor(socket) {
		this.socket = socket;
		this.inboundMiddleware = [];
		this.outboundMiddleware = [];

		socket.on("message", (message) => {
			// message 이벤트에 대한 새로운 리스너 연결 및 새 메지시 수신시작
			this.executeMiddleware(this.inboundMiddleware, {
				data: message,
			});
		});
	}

	send(data) {
		const message = {
			data: data,
		};
		this.executeMiddleware(this.outboundMiddleware, message, () => {
			this.socket.send(message.data);
		});
	}

	use(middleware) {
		if (middleware.inbound) {
			// 목록의 끝으로 푸시
			this.inboundMiddleware.push(middleware.inbound);
		}
		if (middleware.outbound) {
			// 목록의 처음으로 푸시
			this.outboundMiddleware.unshift(middleware.outbound);
		}
	}

	executeMiddleware(middleware, arg, finish) {
		function iterator(index) {
			if (index === middleware.length) {
				return finish && finish();
			}
			middleware[index].call(this, arg, (err) => {
				if (err) {
					return console.log("There was an error: " + err.message);
				}
				iterator.call(this, ++index);
			});
		}

		iterator.call(this, 0);
	}
};
