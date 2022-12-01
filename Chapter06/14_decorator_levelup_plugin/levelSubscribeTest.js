"use strict";

// level v5 버전으로 변경

const { Level } = require("level");
const levelSubscribe = require("./levelSubscribe");

let db = new Level(__dirname + "/db", { valueEncoding: "json" });

db = levelSubscribe(db);
db.subscribe(
	{ doctype: "tweet", language: "en" }, // 해당 객체를 listen
	(k, val) => console.log(val) // 리스너
);

db.put("1", { doctype: "tweet", text: "Hi", language: "en" }); // { doctype: 'tweet', text: 'Hi', language: 'en' } 출력
db.put("2", { doctype: "company", name: "ACME Co." });
