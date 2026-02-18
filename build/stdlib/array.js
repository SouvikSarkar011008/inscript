"use strict";
/**
 * InScript Array Standard Library
 * Provides array manipulation utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayStdlib = void 0;
exports.getArrayRuntimeCode = getArrayRuntimeCode;
exports.ArrayStdlib = {
    name: 'Array',
    functions: {
        length: {
            params: ['arr'],
            description: 'Get array length',
        },
        push: {
            params: ['arr', 'value'],
            description: 'Add element to end',
        },
        pop: {
            params: ['arr'],
            description: 'Remove and return last element',
        },
        shift: {
            params: ['arr'],
            description: 'Remove and return first element',
        },
        unshift: {
            params: ['arr', 'value'],
            description: 'Add element to beginning',
        },
        get: {
            params: ['arr', 'index'],
            description: 'Get element at index',
        },
        set: {
            params: ['arr', 'index', 'value'],
            description: 'Set element at index',
        },
        slice: {
            params: ['arr', 'start', 'end'],
            description: 'Extract subarray',
        },
        splice: {
            params: ['arr', 'start', 'deleteCount', '...items'],
            description: 'Insert/remove elements',
        },
        indexOf: {
            params: ['arr', 'value'],
            description: 'Find index of value',
        },
        includes: {
            params: ['arr', 'value'],
            description: 'Check if array contains value',
        },
        join: {
            params: ['arr', 'separator'],
            description: 'Join array into string',
        },
        reverse: {
            params: ['arr'],
            description: 'Reverse array in place',
        },
        sort: {
            params: ['arr'],
            description: 'Sort array in place',
        },
        filter: {
            params: ['arr', 'callback'],
            description: 'Create filtered array',
        },
        map: {
            params: ['arr', 'callback'],
            description: 'Create mapped array',
        },
        reduce: {
            params: ['arr', 'callback', 'initial'],
            description: 'Reduce array to single value',
        },
        forEach: {
            params: ['arr', 'callback'],
            description: 'Iterate over array',
        },
        find: {
            params: ['arr', 'callback'],
            description: 'Find first matching element',
        },
        findIndex: {
            params: ['arr', 'callback'],
            description: 'Find index of first matching element',
        },
        some: {
            params: ['arr', 'callback'],
            description: 'Check if any element matches',
        },
        every: {
            params: ['arr', 'callback'],
            description: 'Check if all elements match',
        },
        concat: {
            params: ['arr', '...arrays'],
            description: 'Concatenate arrays',
        },
        flatten: {
            params: ['arr', 'depth'],
            description: 'Flatten nested array',
        },
    },
};
function getArrayRuntimeCode() {
    return `
const inscriptArray = {
  length: (arr) => Array.isArray(arr) ? arr.length : 0,
  push: (arr, value) => {
    if (Array.isArray(arr)) arr.push(value);
    return arr;
  },
  pop: (arr) => Array.isArray(arr) ? arr.pop() : undefined,
  shift: (arr) => Array.isArray(arr) ? arr.shift() : undefined,
  unshift: (arr, value) => {
    if (Array.isArray(arr)) arr.unshift(value);
    return arr;
  },
  get: (arr, index) => Array.isArray(arr) ? arr[index] : undefined,
  set: (arr, index, value) => {
    if (Array.isArray(arr)) arr[index] = value;
    return arr;
  },
  slice: (arr, start, end) => {
    if (!Array.isArray(arr)) return [];
    return end !== undefined ? arr.slice(start, end) : arr.slice(start);
  },
  splice: (arr, start, deleteCount, ...items) => {
    if (!Array.isArray(arr)) return [];
    return arr.splice(start, deleteCount, ...items);
  },
  indexOf: (arr, value) => Array.isArray(arr) ? arr.indexOf(value) : -1,
  includes: (arr, value) => Array.isArray(arr) ? arr.includes(value) : false,
  join: (arr, separator = ',') => Array.isArray(arr) ? arr.join(separator) : '',
  reverse: (arr) => {
    if (Array.isArray(arr)) arr.reverse();
    return arr;
  },
  sort: (arr) => {
    if (Array.isArray(arr)) arr.sort();
    return arr;
  },
  filter: (arr, callback) => Array.isArray(arr) ? arr.filter(callback) : [],
  map: (arr, callback) => Array.isArray(arr) ? arr.map(callback) : [],
  reduce: (arr, callback, initial) => {
    if (!Array.isArray(arr)) return initial;
    return initial !== undefined ? arr.reduce(callback, initial) : arr.reduce(callback);
  },
  forEach: (arr, callback) => {
    if (Array.isArray(arr)) arr.forEach(callback);
  },
  find: (arr, callback) => Array.isArray(arr) ? arr.find(callback) : undefined,
  findIndex: (arr, callback) => Array.isArray(arr) ? arr.findIndex(callback) : -1,
  some: (arr, callback) => Array.isArray(arr) ? arr.some(callback) : false,
  every: (arr, callback) => Array.isArray(arr) ? arr.every(callback) : true,
  concat: (arr, ...arrays) => {
    if (!Array.isArray(arr)) return [];
    return arr.concat(...arrays);
  },
  flatten: (arr, depth = 1) => {
    if (!Array.isArray(arr)) return [];
    return depth > 0 ? arr.reduce((acc, val) => 
      acc.concat(Array.isArray(val) ? inscriptArray.flatten(val, depth - 1) : val), []) : arr;
  },
};
`;
}
//# sourceMappingURL=array.js.map