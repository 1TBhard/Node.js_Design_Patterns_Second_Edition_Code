"use strict";

let main = (() => {
	var _ref = _asyncToGenerator(function* () {
		const html = yield getPageHtml("http://google.com");
		console.log(html);
	});

	return function main() {
		return _ref.apply(this, arguments);
	};
})();

function _asyncToGenerator(fn) {
	return function () {
		var gen = fn.apply(this, arguments);
		return new Promise(function (resolve, reject) {
			function step(key, arg) {
				try {
					var info = gen[key](arg);
					var value = info.value;
				} catch (error) {
					reject(error);
					return;
				}
				if (info.done) {
					resolve(value);
				} else {
					return Promise.resolve(value).then(
						function (value) {
							step("next", value);
						},
						function (err) {
							step("throw", err);
						}
					);
				}
			}
			return step("next");
		});
	};
}

const request = require("request");

function getPageHtml(url) {
	return new Promise((resolve, reject) => {
		request(url, (error, response, body) => {
			resolve(body);
		});
	});
}

main();
console.log("Loading...");
