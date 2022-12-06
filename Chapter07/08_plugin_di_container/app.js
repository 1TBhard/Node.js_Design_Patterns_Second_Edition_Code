"use strict";

/* DI 컨테이너
- 부모 어플리케이션이 어떤 종속성이 필요하는지 몰라도 됨
- 단점: 각 플러그인이 잠재적으로 모든 서비스에 액세스하여 캡슐화와 통제가 줄어듦
  - 이를 해결하기 위해 플러그인에 공개하려는 서비스만 등록하는 별도의 DI 컨테이너를 만듦
*/

const express = require("express");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const http = require("http");

const app = (module.exports = express());
app.use(bodyParser.json());

const diContainer = require("./lib/diContainer")();

// di 컨테이너에 의존성 등록
diContainer.register("dbName", "example-db");
diContainer.register("tokenSecret", "SHHH!");
diContainer.register("app", app);
diContainer.factory("db", require("./lib/db"));
diContainer.factory("authService", require("./lib/authService"));
diContainer.factory("authController", require("./lib/authController"));

// 플러그인 초기화
diContainer.inject(require("authsrv-plugin-logout"));

const authController = diContainer.get("authController");

app.post("/login", authController.login);
app.get("/checkToken", authController.checkToken);

app.use(errorHandler());
http.createServer(app).listen(3000, () => {
	console.log("Express server started");
});
