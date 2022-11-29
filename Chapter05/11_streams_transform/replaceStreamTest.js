"use strict";

const ReplaceStream = require("./replaceStream");

const rs = new ReplaceStream("World", "Node.js");
rs.on("data", (chunk) => console.log(chunk.toString()));

rs.write("ABCDEFG");
rs.write("EFG");
rs.end();
// 이후 _flush() 실행
