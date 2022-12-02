"use strict";

module.exports.json = () => {
	return {
		inbound: function (message, next) {
			// 역직렬화
			message.data = JSON.parse(message.data.toString());
			next();
		},
		outbound: function (message, next) {
			// 직렬화
			message.data = new Buffer(JSON.stringify(message.data));
			next();
		},
	};
};
