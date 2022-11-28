"use strict";

const fs = require("fs");
const path = require("path");

function asyncFlowWithThunks(generatorFunction) {
	function callback(err) {
		if (err) {
			return generator.throw(err);
		}
		const results = [].slice.call(arguments, 1);
		const thunk = generator.next(
			results.length > 1 ? results : results[0]
		).value;

		// thunk.value 가 undefined 가 아닌경우 thunk(callback) 실행
		thunk && thunk(callback);
	}

	const generator = generatorFunction();

	// yield readFileThunk(fileName, "utf8");
	const thunk = generator.next().value;

	thunk && thunk(callback);
}

const readFileThunk = (filename, options) => {
	return (cb) => {
		fs.readFile(filename, options, cb);
	};
};

const writeFileThunk = (filename, options) => {
	return (cb) => {
		fs.writeFile(filename, options, cb);
	};
};

asyncFlowWithThunks(function* () {
	const fileName = path.basename(__filename);
	const myself = yield readFileThunk(fileName, "utf8");
	yield writeFileThunk(`clone_of_${fileName}`, myself);
	console.log("Clone created");
});
