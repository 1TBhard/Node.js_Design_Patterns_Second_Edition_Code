const fs = require("fs");
const split = require("split");
const request = require("request");
const through = require("through2");

fs.createReadStream(process.argv[2])
	.pipe(split())
	.pipe(
		through.obj(function (url, enc, done) {
			if (!url) return done();

			request.head(url, (err, response) => {
				const data = `${url} is ${err ? "down" : "up"}\n`;

				this.push(data);
				done();
			});
		})
	)
	.pipe(fs.createWriteStream("results.txt"))
	.on("finish", () => {
		console.log("All urls were checked");
	});
