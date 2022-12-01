"use strict";

const Config = require("./config");
const strategies = require("./strategies");

// Config 에 json
const jsonConfig = new Config(strategies.json);
jsonConfig.read("samples/conf.json");
// "book": { "nodejs": "design patterns" } 세팅
jsonConfig.set("book.nodejs", "design patterns");
jsonConfig.save("samples/conf_mod.json");

// Config 에 ini
const iniConfig = new Config(strategies.ini);
iniConfig.read("samples/conf.ini");
iniConfig.set("book.nodejs", "design patterns");
iniConfig.save("samples/conf_mod.ini");
