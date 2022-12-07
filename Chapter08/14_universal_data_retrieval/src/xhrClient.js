"use strict";

const Axios = require("axios");

// 브라우저 또는 웹 서버에서 코드를 실행중인지 확인
const baseURL =
	typeof window !== "undefined" ? "/api" : "http://localhost:3001";
const xhrClient = Axios.create({ baseURL });

module.exports = xhrClient;
