"use strict";

module.exports = () => {
	const dependencies = {};
	const factories = {};
	const serviceLocator = {};

	// 이름을 해당 팩토리와 연결
	serviceLocator.factory = (name, factory) => {
		factories[name] = factory;
	};

	// 이름을 인스턴스와 직접 연관
	serviceLocator.register = (name, instance) => {
		dependencies[name] = instance;
	};

	// 컴포넌트 검색
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

	return serviceLocator;
};
