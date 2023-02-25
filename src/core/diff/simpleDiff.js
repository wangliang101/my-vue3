import { patch, unmount, insert } from './utils';

const patchChildren = (n1, n2, container) => {
  if (typeof n2.children === 'string') {
    // 暂时不考虑
  } else if (Array.isArray(n2.children)) {
    // 新旧children
    const oldChildren = n1.children;
    const newChildren = n2.children;

    const oldLen = oldChildren.length;
    const newLen = newChildren.length;

    // // 在不考虑key的情况下
    // const commonLen = Math.min(oldLen, newLen);
    // // 对新旧节点打补丁
    // for (let i = 0; i < commonLen; i++) {
    //   patch(oldChildren[i], newChildren[i]);
    // }
    // // 如果newLen > commonLen, 则对新增节点进行挂载
    // if (newLen > commonLen) {
    //   for (let i = commonLen; i < newLen; i++) {
    //     patch(null, newChildren[i], container);
    //   }
    // }
    // // 如果oldLen > commonLen, 则卸载oldChildre其余节点
    // if (oldLen > commonLen) {
    //   for (let i = commonLen; i < oldLen; i++) {
    //     unmount(oldChildren[i]);
    //   }
    // }

    // 加key的情况下
    // 用来存储在寻找过程中，遇到的最大索引值（oldChildren中的索引）
    let lastIndex = 0;
    for (let i = 0; i < newLen; i++) {
      const newVnode = newChildren[i];

      // 定义一个变量。来存储当前的newVnode是否在旧的节点中被找到
      let find = false;
      for (let j = 0; j < oldLen; j++) {
        const oldVnode = oldChildren[j];
        if (newVnode.key === oldVnode.key) {
          patch(oldVnode, newVnode, container);
          if (j < lastIndex) {
            // 如果当前找到的节点在oldchildren中的索引值小于最大索引值 lastIndex,
            // 说明该节点需要进行移动
            const preVnode = newChildren[i - 1];

            // 如果preVnode不存在，说明他是第一个阶段，不需要移动
            if (preVnode) {
              // 由于我们要将newVnode对应的真实DOM节点移动到preVnode对应的真实DOM后
              // 所以我们获取newVnode对应的真实DOM节点的下一个节点作为锚点
              const anchor = preVnode.el.nextSibling;
              insert(newVnode.el, container, anchor);
            }
          } else {
            lastIndex = j;
          }
          break;
        }
      }

      // 如果当前newVnode没有被找到,也就说明此节点为新增节点
      if (!find) {
        const preVnode = newChildren[i - 1];
        let anchor = null;
        if (preVnode) {
          // 如果当前节点有一个node节点，则使用它的下一个兄弟节点作为锚点
          anchor = preVnode.el.nextSibling;
        } else {
          // 如果没有，则使用container的第一个节点作为锚点
          anchor = container.firstChild;
        }
        // 如果anchor没找到，则 newNode 将被插入到子节点的末尾
        patch(null, newVnode, container, anchor);
      }
    }

    // 完成上一步操作后，遍历一下旧的节点，看哪些需要卸载
    for (let i = 0; i < oldChildren.length; i++) {
      // 拿旧的节点在新的节点中找
      const has = newChildren.find(vnode => vnode.key === oldChildren[i]);

      if (!has) {
        unmount(oldChildren[i]);
      }
    }
  } else {
    // 省略
  }
};

export default patchChildren;
