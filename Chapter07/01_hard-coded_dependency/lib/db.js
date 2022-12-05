"use strict";

const { Level } = require("level");
const sublevel = require("level-sublevel");

// db에 개별 섹션을만들고 질의를 할 수 있게함
module.exports = sublevel(new Level("example-db", { valueEncoding: "json" }));
