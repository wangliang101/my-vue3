import patchChildren from './simpleDiff';
import { oldVnode1, newVnode1 } from './data';

patchChildren(oldVnode1, newVnode1, oldVnode1);

console.log('简单DIFF', oldVnode1);
