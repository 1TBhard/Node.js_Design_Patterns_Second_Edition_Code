"use strict";

const { Level } = require("level");
const sublevel = require("level-sublevel");

const db = sublevel(new Level("example-db", { valueEncoding: "json" }));
const salesDb = db.sublevel("sales");

module.exports = function totalSales(item, callback) {
	console.log("totalSales() invoked");
	let sum = 0;
	salesDb
		.createValueStream() // 스트림 생성
		.on("data", (data) => {
			if (!item || data.item === item) {
				// 각 판매 값 합산
				sum += data.amount;
			}
		})
		.on("end", () => {
			callback(null, sum);
		});
};
