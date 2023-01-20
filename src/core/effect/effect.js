/**
 * 设计并实现一个完整的响应系统,
 * 本次设计暂只考虑两个问题： 1: 多个target  2: data仅有一层 3.同一个data key被多个effect读取 4.同一个effect读取一个data key
 */

// 设置一个容器，放我们副作用函数
const bucket = new WeakMap();
// 设置一个全局变量，用于存储被注册的副作用函数
let activeEffect;

// 定义一个数据结构，下边会通过定时器修改其中的数据，然后通过修改引发dom的重新渲染
const data = {
  text: 'hello, wliang'
};

const obj = new Proxy(data, {
  get: function (target, key) {
    console.log('get fn', target, key);
    track(target, key);
    return target[key];
  },
  set: function (target, key, newValue) {
    target[key] = newValue;
    console.log('set fn', target);
    trigger(target, key);
  }
});

/**
 * 封装track(跟踪)函数，用来在get时追踪变化
 * @param {*} target
 * @param {*} key
 * @returns
 */
const track = (target, key) => {
  // 如果没有副作用函数，就直接返回
  if (!activeEffect) return;

  // 获取依赖的map，其结构为map => {key: effect}
  let depsMap = bucket.get(target);

  // 如果没有获取到当前target的map，则给它新建一个
  if (!depsMap) {
    // depsMap = new Map();
    // bucket.set(target, depsMap);
    bucket.set(target, (depsMap = new Map()));
  }

  // 根据key从depsMap中获取deps, 其结构为set => [fn]
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }

  // 将副作用函数添加进bucket中
  deps.add(activeEffect);
};

/**
 * set的时候，调用trigger函数出发effect回调
 * @param {*} target
 * @param {*} key
 * @returns
 */
const trigger = (target, key) => {
  // 数据被修改时，找到所有在读取时注册的函数，然后重新执行
  const depsMap = bucket.get(target);
  // 没有被注册函数时，直接return
  if (!depsMap) return;
  const deps = depsMap.get(key);
  deps && deps.forEach(fn => fn());
};

// 此函数现在仅用于注册
function effect(fn) {
  activeEffect = fn;
  fn();
}

effect(() => {
  document.body.innerText = obj.text;
  console.log('effect 1');
});

effect(() => {
  document.body.innerText = `${obj.text} 2`;
  console.log('effect 2');
});

// 定时器修改值
setTimeout(() => {
  obj.text = 'hello, vue';
}, 1000);

setTimeout(() => {
  obj.noExist = 'hello, react';
}, 3000);

window.bucket = bucket;
window.data = data;
console.log('xxx', bucket);

/**
 * 为什么bucket要使用weakMap
 * 因为weakmap的键是弱引用，不影响垃圾回收
 */
const map = new Map();
const weakMap = new WeakMap();

(function () {
  const foo = { foo: 1 };
  const bar = { bar: 2 };

  map.set(foo, 1);
  weakMap.set(bar, 2);
})();

setTimeout(() => {
  console.log('1111', map);
  console.log('2222', weakMap);
}, 3000);
