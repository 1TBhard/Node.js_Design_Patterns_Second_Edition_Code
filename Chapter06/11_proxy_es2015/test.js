"use strict";

const scientist = {
	name: "nikola",
	surname: "tesla",
};

const uppercaseScientist = new Proxy(scientist, {
	// Object 의 get을 가로채어 해당 동작 실행하게 된다.
	get: (target, property) => target[property].toUpperCase(),
});

console.log(uppercaseScientist.name, uppercaseScientist.surname); // NIKOLA TESLA
