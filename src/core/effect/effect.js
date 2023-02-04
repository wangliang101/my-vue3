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
  text: 'hello, wliang',
  ok: true
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
  // 主要是为了收集哪些deps与当前的effectFn有关，从而解决切分支cleanup
  activeEffect.deps.push(deps);
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

  const effectsToRun = new Set(deps);
  effectsToRun && effectsToRun.forEach(fn => fn());
};

// 定义副作用函数
function effect(fn) {
  const effectFn = () => {
    cleapup(effectFn);
    // 当 effectFn 执行的时候，将其设置为当前激活的副作用函数
    activeEffect = effectFn;
    fn();
  };

  // effectFn.deps用来存储所有与该副作用函数相关的依赖集合
  effectFn.deps = [];
  // 执行该副作用函数
  effectFn();
}

function cleapup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    // deps是所有和effectFn相关的依赖集合
    const deps = effectFn.deps[i];
    // 删除集合中的effectFn
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

effect(() => {
  document.body.innerText = obj.ok ? obj.text : 'not';
  console.log('effect 1');
});

// effect(() => {
//   document.body.innerText = `${obj.text} 2`;
//   console.log('effect 2');
// });

// 定时器修改值
// setTimeout(() => {
//   obj.text = 'hello, vue';
// }, 1000);

setTimeout(() => {
  obj.ok = false;
}, 3000);

window.bucket = bucket;
window.obj = obj;
