"use strict";

const ticker = require("./ticker");

const cb = (tickCount) => console.log(tickCount, "TICK");

// ticker.on("tick", cb);
// ticker.emit('something', {}); <-- This will fail
// require('events').prototype.emit.call(ticker, 'someEvent', {}); <-- This workaround will instead work
require("events").prototype.emit.call(ticker, "someEvent", {});
