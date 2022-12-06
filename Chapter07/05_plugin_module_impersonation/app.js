"use strict";

/* 
하드코드된 종속성을 사용 
- requrie()을 사용하여 상대, 절대 경로를 사용하여 어플리케이션의 루트 탐색
- require() 사용하여 어플리케이션의 모든 서비스에 쉽게 접근
*/

const Express = require("express");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const http = require("http");

const authController = require("./lib/authController");

const app = (module.exports = new Express());
app.use(bodyParser.json());

// 단순히 플러그인을 require()하면 플러그인 실행됨
require("authsrv-plugin-logout");

app.post("/login", authController.login);
app.get("/checkToken", authController.checkToken);

app.use(errorHandler());
http.createServer(app).listen(3000, () => {
	console.log("Express server started");
});
