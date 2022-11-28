"use strict";

// 제네레이터
function* fruitGenerator() {
	yield "apple";
	yield "orange";
	return "watermelon";
}

const newFruitGenerator = fruitGenerator();

// next() 실행시 done flag 와 value 반환
console.log(newFruitGenerator.next());
console.log(newFruitGenerator.next());
console.log(newFruitGenerator.next());

// 실행결과
// { value: 'apple', done: false }
// { value: 'orange', done: false }
// { value: 'watermelon', done: true }
