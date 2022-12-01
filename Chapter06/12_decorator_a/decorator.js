"use strict";

// 데코레이터 예재

function decorate(component) {
	const proto = Object.getPrototypeOf(component);

	function Decorator(component) {
		this.component = component;
	}

	Decorator.prototype = Object.create(proto);

	// 새 메서드
	Decorator.prototype.greetings = function () {
		return "Hi!";
	};

	// 메서드 위임
	Decorator.prototype.hello = function () {
		return this.component.hello.apply(this.component, arguments);
	};

	return new Decorator(component);
}

class Greeter {
	hello(subject) {
		return `Hello ${subject}`;
	}
}

const decoratedGreeter = decorate(new Greeter());
console.log(decoratedGreeter.hello("world")); // uses original method
console.log(decoratedGreeter.greetings()); // uses new method
