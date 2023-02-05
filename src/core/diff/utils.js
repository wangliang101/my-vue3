/**
 * 打补丁的方法
 * @param {*} oldNode 旧节点，入如果为null, 则说明需要挂载
 * @param {*} newNode  新节点
 * @param {*} container 容器
 * @param {*} anchor 如果是新增节点，需要挂载的锚点
 */
const patch = (oldNode, newNode, container, anchor) => {
  // if()
  console.log('打补丁', oldNode, newNode, container, anchor);
};

/**
 * 卸载函数
 * @param {*} node
 * @param {*} container
 */
const unmount = node => {
  console.log(`从cotainer中移除node`, node);
};

/**
 * 插入/移动节点
 * @param {*} node
 * @param {*} container
 * @param {*} anchor
 */
const insert = (node, container, anchor) => {
  console.log(`insert`, node, container, anchor);
};

export { patch, unmount, insert };
