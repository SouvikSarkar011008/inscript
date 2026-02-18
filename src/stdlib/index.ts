/**
 * InScript Standard Library Index
 * Exports all standard library modules
 */

export * from './math';
export * from './vector';
export * from './string';
export * from './array';

import { getMathRuntimeCode } from './math';
import { getVectorRuntimeCode } from './vector';
import { getStringRuntimeCode } from './string';
import { getArrayRuntimeCode } from './array';

export function getAllStdlibCode(): string {
  return `
// ===== InScript Standard Library =====

${getMathRuntimeCode()}

${getVectorRuntimeCode()}

${getStringRuntimeCode()}

${getArrayRuntimeCode()}

// Make Vec2 and Vec3 globally available
global.Vec2 = Vec2;
global.Vec3 = Vec3;

// Merge all stdlib functions into a single namespace
const inscript = {
  ...inscriptMath,
  ...inscriptString,
  ...inscriptArray,
  Vec2,
  Vec3,
};
`;
}

export const StdlibRegistry = {
  math: {
    name: 'Math',
    functions: [
      'sin',
      'cos',
      'tan',
      'asin',
      'acos',
      'atan',
      'atan2',
      'sqrt',
      'pow',
      'abs',
      'floor',
      'ceil',
      'round',
      'min',
      'max',
      'clamp',
      'lerp',
      'distance',
      'distance3d',
      'random',
      'randomInt',
      'randomRange',
      'degrees',
      'radians',
    ],
  },
  vector: {
    name: 'Vector',
    classes: ['Vec2', 'Vec3'],
  },
  string: {
    name: 'String',
    functions: [
      'length',
      'charAt',
      'substring',
      'slice',
      'indexOf',
      'lastIndexOf',
      'includes',
      'startsWith',
      'endsWith',
      'toLowerCase',
      'toUpperCase',
      'trim',
      'split',
      'replace',
      'replaceAll',
      'repeat',
      'reverse',
      'concat',
    ],
  },
  array: {
    name: 'Array',
    functions: [
      'length',
      'push',
      'pop',
      'shift',
      'unshift',
      'get',
      'set',
      'slice',
      'splice',
      'indexOf',
      'includes',
      'join',
      'reverse',
      'sort',
      'filter',
      'map',
      'reduce',
      'forEach',
      'find',
      'findIndex',
      'some',
      'every',
      'concat',
      'flatten',
    ],
  },
};
