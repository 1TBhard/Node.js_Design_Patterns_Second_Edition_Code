"use strict";

const ini = require("ini");

// 개별 전략
module.exports.json = {
	deserialize: (data) => JSON.parse(data),
	serialize: (data) => JSON.stringify(data, null, "  "),
};

// 개별 전략
module.exports.ini = {
	deserialize: (data) => ini.parse(data),
	serialize: (data) => ini.stringify(data),
};
