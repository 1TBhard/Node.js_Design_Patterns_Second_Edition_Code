"use strict";

const request = require("request");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const utilities = require("./utilities");

function spider(url, callback) {
	const filename = utilities.urlToFilename(url);
	fs.exists(filename, (exists) => {
		if (!exists) {
			console.log(`Downloading ${url}`);

			// 파일을 찾을 수 없는 경우 다운
			request(url, (err, response, body) => {
				if (err) {
					callback(err);
				} else {
					// 저장할 디렉토리 있는지 확인
					mkdirp(path.dirname(filename), (err) => {
						if (err) {
							callback(err);
						} else {
							fs.writeFile(filename, body, (err) => {
								// http 응당의 내용을 파일 시스템에 저장
								if (err) {
									callback(err);
								} else {
									callback(null, filename, true);
								}
							});
						}
					});
				}
			});
		} else {
			callback(null, filename, false);
		}
	});
}

// process.argv[2]: 명령어에서 2번째 인자
// 명령어) node index.js 2번째_인자
spider(process.argv[2], (err, filename, downloaded) => {
	if (err) {
		console.log(err);
	} else if (downloaded) {
		console.log(`Completed the download of "${filename}"`);
	} else {
		console.log(`"${filename}" was already downloaded`);
	}
});
