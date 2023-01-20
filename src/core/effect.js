/**
 * 设计并实现一个完整的响应系统
 */

const bucket = new Set();

const data = {
  text: 'hello, wliang'
};

const obj = new Proxy(data, {
  get: function (target, key) {
    console.log(111, target, key);
    bucket.add(effect);
    return target[key];
  },
  set: function (target, key, value) {
    target[key] = value;
    console.log(222, target);

    bucket.forEach(fn => fn());
    return true;
  }
});

function effect() {
  document.body.innerText = obj.text;
}

effect();

setTimeout(() => {
  obj.text = 'hello, vue';
}, 1000);
