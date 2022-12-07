"use strict";

const path = require("path");

// webpack 버전 1의 구성요소이다.
module.exports = {
	entry: path.join(__dirname, "src", "main.js"),
	output: {
		path: path.join(__dirname, "dist"),
		filename: "bundle.js",
	},
	module: {
		loaders: [
			{
				test: path.join(__dirname, "src"),
				loader: "babel-loader",
				query: {
					presets: ["es2015"],
				},
			},
		],
	},
};
