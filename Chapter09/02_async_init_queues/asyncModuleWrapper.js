"use strict";

/* 호출된 모든 작업 요청을 큐에 넣고 초기화
초기화가 다 되면 큐에서 원래의 비동기 모듈에 위임

커맨드, 상태, 프록시를 활용하여 구현함
*/

const asyncModule = require("./asyncModule");

// The wrapper
const asyncModuleWrapper = module.exports;
asyncModuleWrapper.initialized = false;
asyncModuleWrapper.initialize = function () {
	activeState.initialize.apply(activeState, arguments);
};

asyncModuleWrapper.tellMeSomething = function () {
	activeState.tellMeSomething.apply(activeState, arguments);
};

// The state to use when the module is not yet initialized
let pending = [];

// 커맨드 객체
let notInitializedState = {
	initialize: function (callback) {
		asyncModule.initialize(function () {
			asyncModuleWrapper.initalized = true;
			activeState = initializedState;

			pending.forEach(function (req) {
				// 원래의 매서드 실생
				asyncModule[req.method].apply(null, req.args);
			});
			pending = [];

			callback();
		});
	},

	tellMeSomething: function (callback) {
		// 대기 큐에 삽입
		return pending.push({
			// 실행 메서드 지정
			method: "tellMeSomething",
			args: arguments,
		});
	},
};

// The state to use when the module is initialized
let initializedState = asyncModule;

// Set the initial state to the notInitializedState
let activeState = notInitializedState;
