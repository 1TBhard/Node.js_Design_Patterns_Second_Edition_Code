"use strict";

const fnArgs = require("parse-fn-args");

module.exports = () => {
	const dependencies = {};
	const factories = {};
	const diContainer = {};

	diContainer.factory = (name, factory) => {
		factories[name] = factory;
	};

	diContainer.register = (name, dep) => {
		dependencies[name] = dep;
	};

	diContainer.get = (name) => {
		if (!dependencies[name]) {
			const factory = factories[name];

			// 로케이터와 다른점
			dependencies[name] = factory && diContainer.inject(factory);
			if (!dependencies[name]) {
				throw new Error("Cannot find module: " + name);
			}
		}
		return dependencies[name];
	};

	// 로케이터와 다른점
	diContainer.inject = (factory) => {
		// 인자들의 목록을 추출하여 인자들의 목록츨 추출
		const args = fnArgs(factory).map(function (dependency) {
			return diContainer.get(dependency);
		});

		// 해당 종속성 인스턴스에 매핑
		return factory.apply(null, args);
	};

	return diContainer;
};
