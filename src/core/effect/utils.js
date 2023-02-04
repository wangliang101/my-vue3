/**
 * 为什么bucket要使用weakMap
 * 因为weakmap的键是弱引用，不影响垃圾回收
 */
// const map = new Map();
// const weakMap = new WeakMap();

// (function () {
//   const foo = { foo: 1 };
//   const bar = { bar: 2 };

//   map.set(foo, 1);
//   weakMap.set(bar, 2);
// })();

// setTimeout(() => {
//   console.log('1111', map);
//   console.log('2222', weakMap);
// }, 3000);
