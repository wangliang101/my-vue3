import { patch, unmount, insert } from './utils';

// 获取最长子序列函数
const lis = () => {
  return null;
};

const patchKeyedChildren = (n1, n2, container) => {
  const oldChildren = n1.children;
  const newChildren = n2.children;

  // 预处理
  // 处理新旧子节点的头部可复用节点
  let j = 0;
  let oldVNode = oldChildren[j];
  let newVNode = newChildren[j];
  while (oldVNode.key === newVNode.key) {
    // 打补丁
    patch(oldVNode, newVNode, container);

    // 更新VNode
    j++;
    oldVNode = oldChildren[j];
    newVNode = newChildren[j];
  }

  // 处理新旧节点尾部可复用节点, 因为新旧子节点长度可能不一致，所以需要定义两个变量
  let oldEnd = oldChildren.length - 1;
  let newEnd = newChildren.length - 1;

  oldVNode = oldChildren[oldEnd];
  newVNode = newChildren[newEnd];

  while (oldVNode.key === newVNode.key) {
    // 打补丁
    patch(oldVNode, newVNode, container);

    // 更新VNode
    oldEnd--;
    newEnd--;
    oldVNode = oldChildren[oldEnd];
    newVNode = newChildren[newEnd];
  }

  // 预处理结束后
  if (j > oldEnd && j <= newEnd) {
    // 如果新子节点有剩余
    // 获取锚点id
    let anchorIdx = newEnd + 1;
    // 获取锚点node，如果
    let anchor = anchorIdx === newChildren.length ? newChildren[anchorIdx].el : null;
    while (j <= newEnd) {
      // 挂载
      patch(null, newChildren[j++], container, anchor);
    }
  } else if (j > newEnd && j <= oldEnd) {
    // 如果旧节点有剩余，则需要卸载
    while (j <= oldEnd) {
      unmount(oldChildren[j++]);
    }
  } else {
    // 如果新旧节点均有剩余
    // 构造source数组
    const count = newEnd - j + 1;
    let source = new Array(count);
    source.fill(-1);

    // 新旧子节点的起始index
    const oldStart = j;
    const newStart = j;
    let pos = 0;
    let moved = false;

    // 构建新子节点的{key: index} 对象
    const keyIndex = {};
    for (let i = newStart; i < newEnd; i++) {
      keyIndex[newChildren[i].key] = i;
    }

    // 保存已被处理过的旧子节点数
    let patched = 0;
    // 填充source
    for (let i = oldStart; i <= oldEnd; i++) {
      oldVNode = oldChildren[i];
      if (patched <= count) {
        const k = keyIndex[oldVNode.key];
        if (k !== undefined) {
          // 打补丁
          newVNode = newChildren[i];
          patch(oldVNode, newVNode, container);
          patched++;
          source[k - newStart] = i;
          if (k < pos) {
            moved = true;
          } else {
            pos = k;
          }
        } else {
          // 没有找到，卸载
          unmount(oldChildren[i]);
        }
      } else {
        // 处理数已等于新子节点数，其余卸载
        unmount(oldChildren[i]);
      }
    }

    // 如果需要移动
    if (moved) {
      const seq = lis(source);

      let s = seq.length - 1;
      let i = count - 1;

      for (i; i >= 0; i--)
        if (source[i] === -1) {
          // 这种情况属于新增
          const pos = i + newStart;
          const newVNode = newChildren[pos];

          // 获取锚点的索引
          const newPos = pos + 1;
          // 锚点
          const anchor = newPos < newChildren.length ? newChildren[newPos] : null;
          // 挂载
          patch(null, newVNode, container, anchor);
        } else if (seq[s] !== i) {
          // 这种情况需要移动
          const pos = i + newStart;
          const newVNode = newChildren[pos];

          // 获取锚点的索引
          const newPos = pos + 1;
          // 锚点
          const anchor = newPos < newChildren.length ? newChildren[newPos] : null;
          // 挂载
          insert(newVNode, container, anchor);
        } else {
          // 当 i === seq[j] 时，说明该位置的节点不需要移动
          // 并让 s 指向下一个位置
          s--;
        }
    }
  }
};

export default patchKeyedChildren;
