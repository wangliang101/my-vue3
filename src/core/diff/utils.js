const patch = (oldNode, newNode, container) => {
  // if()
  console.log('打补丁', oldNode, newNode, container);
};

// 卸载函数
const unmount = (node, container) => {
  console.log(`从cotainer中移除node`, node, container);
};

// 插入节点
const insert = () => {
  console.log(`insert`);
};

export { patch, unmount, insert };
