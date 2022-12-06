"use strict";

/* 서비스 로케이터
- 플러그인에 무엇이 필요한지 미리 알필요 없음
- 모든 컴포넌트를 해당 플러그인에 노출할 때 좋다.
  - 다른 플러그인에 노출될 수 있다.
*/
module.exports = () => {
	const dependencies = {};
	const factories = {};
	const serviceLocator = {};

	serviceLocator.factory = (name, factory) => {
		factories[name] = factory;
	};

	serviceLocator.register = (name, instance) => {
		dependencies[name] = instance;
	};

	serviceLocator.get = (name) => {
		if (!dependencies[name]) {
			const factory = factories[name];
			dependencies[name] = factory && factory(serviceLocator);
			if (!dependencies[name]) {
				throw new Error("Cannot find module: " + name);
			}
		}
		return dependencies[name];
	};

	// 서비스 로케이터를 반환
	return serviceLocator;
};
