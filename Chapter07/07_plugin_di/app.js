"use strict";

/* 의존성 주입
- 플러그인 공유를 잘 제어할 수 있음
- 과도한 확장에 대해 캡슐화가 잘됨
- 단점: 플러그인이 필요로 하는 서비스를 알아야함(주입하려 것을 미리 알아야함)
*/

const Express = require("express");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const http = require("http");

const app = (module.exports = new Express());
app.use(bodyParser.json());

const dbFactory = require("./lib/db");
const authServiceFactory = require("./lib/authService");
const authControllerFactory = require("./lib/authController");

const db = dbFactory("example-db");
const authService = authServiceFactory(db, "SHHH!");
const authController = authControllerFactory(authService);

//initialize plugin
require("authsrv-plugin-logout")(app, authService, db);

app.post("/login", authController.login);
app.get("/checkToken", authController.checkToken);

app.use(errorHandler());
http.createServer(app).listen(3000, () => {
	console.log("Express server started");
});
