"use strict";

const { Level } = require("level");
const sublevel = require("level-sublevel");

module.exports = function (dbName) {
	return sublevel(new Level(dbName, { valueEncoding: "json" }));
};
