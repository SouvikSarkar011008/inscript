"use strict";
/**
 * InScript Standard Library Index
 * Exports all standard library modules
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StdlibRegistry = void 0;
exports.getAllStdlibCode = getAllStdlibCode;
__exportStar(require("./math"), exports);
__exportStar(require("./vector"), exports);
__exportStar(require("./string"), exports);
__exportStar(require("./array"), exports);
const math_1 = require("./math");
const vector_1 = require("./vector");
const string_1 = require("./string");
const array_1 = require("./array");
function getAllStdlibCode() {
    return `
// ===== InScript Standard Library =====

${(0, math_1.getMathRuntimeCode)()}

${(0, vector_1.getVectorRuntimeCode)()}

${(0, string_1.getStringRuntimeCode)()}

${(0, array_1.getArrayRuntimeCode)()}

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
exports.StdlibRegistry = {
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
//# sourceMappingURL=index.js.map