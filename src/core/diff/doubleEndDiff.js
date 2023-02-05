import { patch, unmount, insert } from './utils';

/**
 * 双端diff
 * @param {*} n1
 * @param {*} n2
 * @param {*} container
 */
const patchKeyedChildren = (n1, n2, container) => {
  const oldChildren = n1.children;
  const newChildren = n2.children;

  // 获取四个索引值
  let oldStartIdx = 0;
  let oldEndIdx = oldChildren.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newChildren.length - 1;

  // 四个索引值指向的vnode
  let oldStartVNode = oldChildren[oldStartIdx];
  let oldEndVNode = oldChildren[oldEndIdx];
  let newStartVNode = newChildren[newStartIdx];
  let newEndVNode = newChildren[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 在双端匹配没有匹配上的时候，会用新的startVNode在旧的里边找，如果找到了，则会把oldChildren对应位置置为undefined
    if (!oldStartVNode) {
      oldStartVNode = oldChildren[++oldStartIdx];
    } else if (!oldEndVNode) {
      oldEndVNode = oldChildren[--oldEndIdx];
    } else if (oldStartVNode.key === newStartVNode.key) {
      // 如果首和首相等，则说明位置没有变，仅需要打补丁
      patch(oldStartVNode, newStartVNode, container);
      // 更新索引及对应的VNode
      oldStartVNode = oldChildren[++oldStartIdx];
      newStartVNode = newChildren[++newStartIdx];
    } else if (oldEndVNode.key === newEndVNode.key) {
      // 如果尾和尾相等，则说明位置没有变，仅需要打补丁
      patch(oldEndVNode, newEndVNode, container);
      // 更新索引及对应的VNode
      oldEndVNode = oldChildren[--oldEndIdx];
      newEndVNode = newChildren[--newEndIdx];
    } else if (oldStartVNode.key === newEndVNode.key) {
      // 打补丁
      patch(oldStartVNode, newEndVNode, container);
      // 如果oldChildren中的第一个是newChildre最后一个,则需要把oldChildren的第一个移到最后
      insert(oldStartVNode.el, container, oldEndVNode.el.nextSibling);
      // 更新索引及对应VNode
      newEndVNode = newChildren[--newEndIdx];
      oldStartVNode = oldChildren[++oldStartIdx];
    } else if (oldEndVNode.key === newStartVNode.key) {
      // 打补丁
      patch(oldEndVNode, newStartVNode, container);
      // 如果oldChildren的最后一个是newChildren的第一个，则需要把oldChildren的第一个移到开始
      insert(oldEndVNode.el, container, oldStartVNode.el);
      // 更新索引及对应VNode
      oldEndVNode = oldChildren[--oldEndIdx];
      newStartVNode = newChildren[++newStartIdx];
    } else {
      // 如果双端匹配没有找到，需要从newChildren中取出第一个，去oldChildren中进行匹配
      const idxInOld = oldChildren.findIndex(node => node.key === newStartVNode.key);
      if (idxInOld > 0) {
        // 需要移动到节点
        const vnodeToMove = oldChildren[idxInOld];
        // 打补丁
        patch(vnodeToMove, newStartVNode, container);
        // 如果找到了，说明oldIdx对应的VNode已经移动到首位
        insert(vnodeToMove.el, container, oldStartVNode.el);
        // 将oldChildren的对应位置，置为undefinde
        oldChildren[idxInOld] = undefined;
      } else {
        // 没有找到，则说明是新增节点，则挂载到对应位置
        const anchor = oldStartVNode.el;
        patch(null, newStartVNode, container, anchor);
      }
      // 更新索引及对应VNode
      newStartVNode = newChildren[++newStartIdx];
    }
  }

  if (oldEndIdx < oldStartIdx && newStartIdx <= newEndIdx) {
    // 这种情况说明newChildren中有节点没有被遍历到，需要将未被遍历到到节点新增
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      // 使用oldStartVNode才能保证不论新增遗留节点在最上/最下，放置的位置是正确的
      patch(null, newChildren[i], container, oldStartVNode.el);
    }
  } else if (newStartIdx > newEndIdx && oldStartIdx <= oldEndIdx) {
    // 这种情况说明旧的节点还有没有匹配上的，则需要把没有匹配的节点卸载
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      unmount(oldChildren[i]);
    }
  }
};

export default patchKeyedChildren;
