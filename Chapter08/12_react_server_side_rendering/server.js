"use strict";

const http = require("http");
const Express = require("express");
const React = require("react");
const ReactDom = require("react-dom/server");
const Router = require("react-router");
const routesConfig = require("./src/routesConfig");

const app = new Express();
const server = new http.Server(app);

app.set("view engine", "ejs");

// 라우터와 match되는 페이지 보냄
app.get("*", (req, res) => {
	Router.match(
		{ routes: routesConfig, location: req.url },
		(error, redirectLocation, renderProps) => {
			if (error) {
				res.status(500).send(error.message);
			} else if (redirectLocation) {
				// 302 리다이렉션, 브라우저가 새 대상으로 이동하게 알림
				res.redirect(302, redirectLocation.pathname + redirectLocation.search);
			} else if (renderProps) {
				// html 코드를 브라우저로 전송
				let markup = ReactDom.renderToString(
					<Router.RouterContext {...renderProps} />
				);
				res.render("index", { markup });
			} else {
				// match되는 것 없는 경우
				res.status(404).send("Not found");
			}
		}
	);
});

server.listen(3000, (err) => {
	if (err) {
		return console.error(err);
	}
	console.info("Server running on http://localhost:3000");
});
