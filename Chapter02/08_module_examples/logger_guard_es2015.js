"use strict";

const LoggerConstructor = require("./logger_constructor");

function Logger(name) {
	// 생성자가 new 연산자 를 사용하여 호출되었는지 여부를 감지 (node 6이상)
	if (!new.target) {
		return new LoggerConstructor(name);
	}
	this.name = name;
}

module.exports = Logger;
