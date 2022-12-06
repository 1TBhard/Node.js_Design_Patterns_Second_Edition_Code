"use strict";

// 익명 즉시실행 함수
// root: 전역 네임스페이스 객체(window)
(function (root, factory) {
	// AMD를 현재 시스템에서 사용 가능?
	if (typeof define === "function" && define.amd) {
		define(["mustache"], factory);
	} else if (
		// CommonJS 환경인지 확인 (node의 export 유무로 확인)
		typeof module === "object" &&
		typeof module.exports === "object"
	) {
		var mustache = require("mustache");
		module.exports = factory(mustache);
	} else {
		// AMD, CommonJS 가 아닌 경우, UmdModule 로 등록
		root.UmdModule = factory(root.Mustache);
	}
})(this, function (mustache) {
	var template = "<h1>Hello <i>{{name}}</i></h1>";
	mustache.parse(template);

	return {
		sayHello: function (toWhom) {
			return mustache.render(template, { name: toWhom });
		},
	};
});
