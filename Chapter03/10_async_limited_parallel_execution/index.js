"use strict";

const request = require("request");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const async = require("async");
const utilities = require("./utilities");

// 제한된 병렬 실행
var downloadQueue = async.queue((taskData, callback) => {
	spider(taskData.link, taskData.nesting - 1, callback);
}, 2);

function spiderLinks(currentUrl, body, nesting, callback) {
	if (nesting === 0) {
		return process.nextTick(callback);
	}
	const links = utilities.getPageLinks(currentUrl, body);
	if (links.length === 0) {
		return process.nextTick(callback);
	}
	let completed = 0,
		hasErrors = false;
	links.forEach(function (link) {
		let taskData = { link: link, nesting: nesting };
		downloadQueue.push(taskData, (err) => {
			if (err) {
				hasErrors = true;
				return callback(err);
			}
			if (++completed === links.length && !hasErrors) {
				callback();
			}
		});
	});
}

function saveFile(filename, contents, callback) {
	mkdirp(path.dirname(filename), (err) => {
		if (err) {
			return callback(err);
		}
		fs.writeFile(filename, contents, callback);
	});
}

function download(url, filename, callback) {
	console.log(`Downloading ${url}`);
	request(url, (err, response, body) => {
		if (err) {
			return callback(err);
		}
		saveFile(filename, body, (err) => {
			if (err) {
				return callback(err);
			}
			console.log(`Downloaded and saved: ${url}`);
			callback(null, body);
		});
	});
}

let spidering = new Map();
function spider(url, nesting, callback) {
	if (spidering.has(url)) {
		return process.nextTick(callback);
	}
	spidering.set(url, true);

	const filename = utilities.urlToFilename(url);
	fs.readFile(filename, "utf8", function (err, body) {
		if (err) {
			if (err.code !== "ENOENT") {
				return callback(err);
			}

			return download(url, filename, function (err, body) {
				if (err) {
					return callback(err);
				}
				spiderLinks(url, body, nesting, callback);
			});
		}

		spiderLinks(url, body, nesting, callback);
	});
}

spider(process.argv[2], 1, (err) => {
	if (err) {
		console.log(err);
		process.exit();
	} else {
		console.log("Download complete");
	}
});
