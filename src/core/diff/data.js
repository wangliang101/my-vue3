const oldVnode1 = {
  type: 'div',
  children: [
    { type: 'p', children: '1' },
    { type: 'p', children: '2' },
    { type: 'p', children: '3' }
  ]
};

const newVnode1 = {
  type: 'div',
  children: [
    { type: 'p', children: '4' },
    { type: 'p', children: '5' },
    { type: 'p', children: '6' }
  ]
};

const newVnode2 = {
  type: 'div',
  children: [
    { type: 'div', children: '4' },
    { type: 'div', children: '5' },
    { type: 'div', children: '6' }
  ]
};

export { oldVnode1, newVnode1, newVnode2 };
