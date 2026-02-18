"use strict";
/**
 * InScript Runtime Module Index
 * Exports runtime engine, canvas API, and input API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputAPICode = exports.getCanvasAPICode = exports.getRuntimeEngineCode = void 0;
exports.getAllRuntimeCode = getAllRuntimeCode;
var engine_1 = require("./engine");
Object.defineProperty(exports, "getRuntimeEngineCode", { enumerable: true, get: function () { return engine_1.getRuntimeEngineCode; } });
var canvas_1 = require("./canvas");
Object.defineProperty(exports, "getCanvasAPICode", { enumerable: true, get: function () { return canvas_1.getCanvasAPICode; } });
var input_1 = require("./input");
Object.defineProperty(exports, "getInputAPICode", { enumerable: true, get: function () { return input_1.getInputAPICode; } });
function getAllRuntimeCode() {
    // Import all runtime code generators
    const { getRuntimeEngineCode } = require('./engine');
    const { getCanvasAPICode } = require('./canvas');
    const { getInputAPICode } = require('./input');
    return `
${getRuntimeEngineCode()}

${getCanvasAPICode()}

${getInputAPICode()}
`;
}
//# sourceMappingURL=index.js.map