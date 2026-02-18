"use strict";
/**
 * Code Generator for InScript
 * Converts AST to JavaScript code
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenerator = void 0;
const engine_1 = require("../runtime/engine");
const canvas_1 = require("../runtime/canvas");
const input_1 = require("../runtime/input");
class CodeGenerator {
    constructor(ast) {
        this.output = "";
        this.indentLevel = 0;
        this.indentString = "  ";
        this.ast = ast;
    }
    /**
     * Generate JavaScript code from AST
     */
    generate() {
        // Add runtime helpers
        this.output += this.getRuntimeHelpers();
        this.output += "\n\n";
        // Generate code for each statement
        for (const stmt of this.ast.body) {
            this.generateStatement(stmt);
        }
        // Add game initialization and event handler registration
        this.output += `

// ===== Game Initialization =====

// Initialize the game engine
game.init("game-canvas");

// Register event handlers if they exist
if (typeof __onInit === "function") {
  game.onInit(__onInit);
}

if (typeof __onUpdate === "function") {
  game.onUpdate(__onUpdate);
}

if (typeof __onRender === "function") {
  game.onRender(__onRender);
}

if (typeof __onInput === "function") {
  game.onInput(__onInput);
}

// Start the game
game.start();
`;
        return this.output;
    }
    /**
     * Generate statement
     */
    generateStatement(stmt, isExpression = false) {
        switch (stmt.type) {
            case "VariableDeclaration":
                this.generateVariableDeclaration(stmt);
                break;
            case "FunctionDeclaration":
                this.generateFunctionDeclaration(stmt);
                break;
            case "ClassDeclaration":
                this.generateClassDeclaration(stmt);
                break;
            case "GameDeclaration":
                this.generateGameDeclaration(stmt);
                break;
            case "AssetDeclaration":
                this.generateAssetDeclaration(stmt);
                break;
            case "BlockStatement":
                this.generateBlockStatement(stmt);
                break;
            case "ExpressionStatement":
                this.generateExpressionStatement(stmt);
                break;
            case "IfStatement":
                this.generateIfStatement(stmt);
                break;
            case "MatchStatement":
                this.generateMatchStatement(stmt);
                break;
            case "WhileStatement":
                this.generateWhileStatement(stmt);
                break;
            case "ForStatement":
                this.generateForStatement(stmt);
                break;
            case "LoopStatement":
                this.generateLoopStatement(stmt);
                break;
            case "ReturnStatement":
                this.generateReturnStatement(stmt);
                break;
            case "BreakStatement":
                this.emit("break;\n");
                break;
            case "ContinueStatement":
                this.emit("continue;\n");
                break;
            case "EventHandlerDeclaration":
                this.generateEventHandler(stmt);
                break;
        }
    }
    /**
     * Generate variable declaration
     */
    generateVariableDeclaration(stmt) {
        const kind = stmt.kind; // let, const, var
        this.emit(`${kind} ${stmt.id.name}`);
        if (stmt.init) {
            this.emit(" = ");
            this.generateExpression(stmt.init);
        }
        this.emit(";\n");
    }
    /**
     * Generate function declaration
     */
    generateFunctionDeclaration(stmt) {
        this.emit(`function ${stmt.id.name}(`);
        for (let i = 0; i < stmt.params.length; i++) {
            if (i > 0)
                this.emit(", ");
            this.emit(stmt.params[i].id.name);
        }
        this.emit(") ");
        this.generateBlockStatement(stmt.body);
        this.emit("\n");
    }
    /**
     * Generate class declaration
     */
    generateClassDeclaration(stmt) {
        this.emit(`class ${stmt.id.name}`);
        if (stmt.superClass) {
            this.emit(` extends ${stmt.superClass.name}`);
        }
        this.emit(" {\n");
        this.indent();
        for (const member of stmt.body.members) {
            if (member.type === "ClassMethod") {
                const method = member;
                if (method.isConstructor) {
                    this.emit("constructor(");
                }
                else {
                    this.emit(`${method.key.name}(`);
                }
                for (let i = 0; i < method.params.length; i++) {
                    if (i > 0)
                        this.emit(", ");
                    this.emit(method.params[i].id.name);
                }
                this.emit(") ");
                this.generateBlockStatement(method.body);
                this.emit("\n");
            }
            else if (member.type === "ClassProperty") {
                const prop = member;
                this.emitIndent();
                this.emit(`${prop.key.name}`);
                if (prop.value) {
                    this.emit(" = ");
                    this.generateExpression(prop.value);
                }
                this.emit(";\n");
            }
        }
        this.dedent();
        this.emitIndent();
        this.emit("}\n");
    }
    /**
     * Generate game declaration
     */
    generateGameDeclaration(stmt) {
        // Store game config as object
        this.emit(`const __gameConfig = {\n`);
        this.indent();
        for (const prop of stmt.properties) {
            this.emitIndent();
            this.emit(`${prop.key.name}: `);
            this.generateExpression(prop.value);
            this.emit(",\n");
        }
        this.dedent();
        this.emitIndent();
        this.emit("};\n\n");
    }
    /**
     * Generate asset declaration
     */
    generateAssetDeclaration(stmt) {
        this.emit("const assets = {\n");
        this.indent();
        for (const asset of stmt.assets) {
            this.emitIndent();
            this.emit(`${asset.id.name}: { type: '${asset.assetType}', path: '${asset.value}' },\n`);
        }
        this.dedent();
        this.emitIndent();
        this.emit("};\n\n");
    }
    /**
     * Generate block statement
     */
    generateBlockStatement(stmt) {
        this.emit("{\n");
        this.indent();
        for (const statement of stmt.body) {
            this.emitIndent();
            this.generateStatement(statement);
        }
        this.dedent();
        this.emitIndent();
        this.emit("}");
    }
    /**
     * Generate expression statement
     */
    generateExpressionStatement(stmt) {
        this.emitIndent();
        this.generateExpression(stmt.expression);
        this.emit(";\n");
    }
    /**
     * Generate if statement
     */
    generateIfStatement(stmt) {
        this.emit("if (");
        this.generateExpression(stmt.test);
        this.emit(") ");
        this.generateStatement(stmt.consequent);
        if (stmt.alternate) {
            this.emit(" else ");
            this.generateStatement(stmt.alternate);
        }
        this.emit("\n");
    }
    /**
     * Generate match statement (converted to switch)
     */
    generateMatchStatement(stmt) {
        this.emit("switch (");
        this.generateExpression(stmt.discriminant);
        this.emit(") {\n");
        this.indent();
        for (const caseStmt of stmt.cases) {
            if (caseStmt.test) {
                this.emitIndent();
                this.emit("case ");
                this.generateExpression(caseStmt.test);
                this.emit(":\n");
            }
            else {
                this.emitIndent();
                this.emit("default:\n");
            }
            this.indent();
            this.emitIndent();
            this.generateStatement(caseStmt.consequent);
            this.emit("break;\n");
            this.dedent();
        }
        this.dedent();
        this.emitIndent();
        this.emit("}\n");
    }
    /**
     * Generate while statement
     */
    generateWhileStatement(stmt) {
        this.emit("while (");
        this.generateExpression(stmt.test);
        this.emit(") ");
        this.generateStatement(stmt.body);
        this.emit("\n");
    }
    /**
     * Generate for statement (for...of in JavaScript)
     */
    generateForStatement(stmt) {
        this.emit(`for (const ${stmt.left.name} of `);
        this.generateExpression(stmt.right);
        this.emit(") ");
        this.generateStatement(stmt.body);
        this.emit("\n");
    }
    /**
     * Generate loop statement (infinite loop)
     */
    generateLoopStatement(stmt) {
        this.emit("while (true) ");
        this.generateStatement(stmt.body);
        this.emit("\n");
    }
    /**
     * Generate return statement
     */
    generateReturnStatement(stmt) {
        this.emit("return");
        if (stmt.argument) {
            this.emit(" ");
            this.generateExpression(stmt.argument);
        }
        this.emit(";\n");
    }
    /**
     * Generate event handler
     */
    generateEventHandler(stmt) {
        const eventName = stmt.event;
        this.emit(`function __on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}(`);
        for (let i = 0; i < stmt.params.length; i++) {
            if (i > 0)
                this.emit(", ");
            this.emit(stmt.params[i].id.name);
        }
        this.emit(") ");
        this.generateBlockStatement(stmt.body);
        this.emit("\n\n");
    }
    /**
     * Generate expression
     */
    generateExpression(expr) {
        switch (expr.type) {
            case "Literal":
                this.generateLiteral(expr);
                break;
            case "Identifier":
                this.emit(expr.name);
                break;
            case "BinaryExpression":
                this.generateBinaryExpression(expr);
                break;
            case "UnaryExpression":
                this.generateUnaryExpression(expr);
                break;
            case "CallExpression":
                this.generateCallExpression(expr);
                break;
            case "MemberExpression":
                this.generateMemberExpression(expr);
                break;
            case "ArrayExpression":
                this.generateArrayExpression(expr);
                break;
            case "ObjectExpression":
                this.generateObjectExpression(expr);
                break;
            case "FunctionExpression":
                this.generateFunctionExpression(expr);
                break;
            case "NewExpression":
                this.generateNewExpression(expr);
                break;
            case "ConditionalExpression":
                this.generateConditionalExpression(expr);
                break;
            case "ThisExpression":
                this.emit("this");
                break;
        }
    }
    /**
     * Generate literal
     */
    generateLiteral(expr) {
        if (typeof expr.value === "string") {
            this.emit(`"${expr.value}"`);
        }
        else if (expr.value === null) {
            this.emit("null");
        }
        else {
            this.emit(String(expr.value));
        }
    }
    /**
     * Generate binary expression
     */
    generateBinaryExpression(expr) {
        this.emit("(");
        this.generateExpression(expr.left);
        this.emit(` ${expr.operator} `);
        this.generateExpression(expr.right);
        this.emit(")");
    }
    /**
     * Generate unary expression
     */
    generateUnaryExpression(expr) {
        if (expr.prefix) {
            this.emit(expr.operator);
        }
        this.generateExpression(expr.argument);
        if (!expr.prefix) {
            this.emit(expr.operator);
        }
    }
    /**
     * Generate call expression
     */
    generateCallExpression(expr) {
        this.generateExpression(expr.callee);
        this.emit("(");
        for (let i = 0; i < expr.arguments.length; i++) {
            if (i > 0)
                this.emit(", ");
            this.generateExpression(expr.arguments[i]);
        }
        this.emit(")");
    }
    /**
     * Generate member expression
     */
    generateMemberExpression(expr) {
        this.generateExpression(expr.object);
        if (expr.computed) {
            this.emit("[");
            this.generateExpression(expr.property);
            this.emit("]");
        }
        else {
            this.emit(".");
            this.generateExpression(expr.property);
        }
    }
    /**
     * Generate array expression
     */
    generateArrayExpression(expr) {
        this.emit("[");
        for (let i = 0; i < expr.elements.length; i++) {
            if (i > 0)
                this.emit(", ");
            if (expr.elements[i]) {
                this.generateExpression(expr.elements[i]);
            }
        }
        this.emit("]");
    }
    /**
     * Generate object expression
     */
    generateObjectExpression(expr) {
        this.emit("{ ");
        for (let i = 0; i < expr.properties.length; i++) {
            if (i > 0)
                this.emit(", ");
            const prop = expr.properties[i];
            if (prop.key.type === "Identifier") {
                this.emit(prop.key.name);
            }
            else {
                this.generateExpression(prop.key);
            }
            this.emit(": ");
            this.generateExpression(prop.value);
        }
        this.emit(" }");
    }
    /**
     * Generate function expression
     */
    generateFunctionExpression(expr) {
        this.emit("function(");
        for (let i = 0; i < expr.params.length; i++) {
            if (i > 0)
                this.emit(", ");
            this.emit(expr.params[i].id.name);
        }
        this.emit(") ");
        this.generateBlockStatement(expr.body);
    }
    /**
     * Generate new expression
     */
    generateNewExpression(expr) {
        this.emit("new ");
        this.generateExpression(expr.callee);
        this.emit("(");
        for (let i = 0; i < expr.arguments.length; i++) {
            if (i > 0)
                this.emit(", ");
            this.generateExpression(expr.arguments[i]);
        }
        this.emit(")");
    }
    /**
     * Generate conditional expression
     */
    generateConditionalExpression(expr) {
        this.emit("(");
        this.generateExpression(expr.test);
        this.emit(" ? ");
        this.generateExpression(expr.consequent);
        this.emit(" : ");
        this.generateExpression(expr.alternate);
        this.emit(")");
    }
    /**
     * Helper: emit text
     */
    emit(text) {
        this.output += text;
    }
    /**
     * Helper: emit indentation
     */
    emitIndent() {
        this.emit(this.indentString.repeat(this.indentLevel));
    }
    /**
     * Helper: increase indentation
     */
    indent() {
        this.indentLevel++;
    }
    /**
     * Helper: decrease indentation
     */
    dedent() {
        this.indentLevel--;
    }
    /**
     * Get runtime helper functions
     */
    getRuntimeHelpers() {
        // Get runtime code from runtime modules
        const engineCode = (0, engine_1.getRuntimeEngineCode)();
        const canvasCode = (0, canvas_1.getCanvasAPICode)();
        const inputCode = (0, input_1.getInputAPICode)();
        // Standard library and runtime helpers
        const runtimeHelpers = `// InScript Runtime Helpers
// Print function
function print(value) {
  console.log(value);
}

// Type checking
function typeof(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

// ===== InScript Standard Library =====

// Math Library
const Math = global.Math || {};

const inscriptMath = {
  sin: (x) => Math.sin(x),
  cos: (x) => Math.cos(x),
  tan: (x) => Math.tan(x),
  asin: (x) => Math.asin(x),
  acos: (x) => Math.acos(x),
  atan: (x) => Math.atan(x),
  atan2: (y, x) => Math.atan2(y, x),
  sqrt: (x) => Math.sqrt(x),
  pow: (base, exp) => Math.pow(base, exp),
  abs: (x) => Math.abs(x),
  floor: (x) => Math.floor(x),
  ceil: (x) => Math.ceil(x),
  round: (x) => Math.round(x),
  min: (...values) => Math.min(...values),
  max: (...values) => Math.max(...values),
  clamp: (value, min, max) => Math.max(min, Math.min(max, value)),
  lerp: (a, b, t) => a + (b - a) * t,
  distance: (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  },
  distance3d: (x1, y1, z1, x2, y2, z2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  },
  random: () => Math.random(),
  randomInt: (min, max) => Math.floor(Math.random() * (max - min)) + min,
  randomRange: (min, max) => min + Math.random() * (max - min),
  degrees: (rad) => rad * (180 / Math.PI),
  radians: (deg) => deg * (Math.PI / 180),
};

// Vec2 - 2D Vector class
class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  multiply(scalar) {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  divide(scalar) {
    if (scalar === 0) throw new Error('Division by zero');
    return new Vec2(this.x / scalar, this.y / scalar);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vec2(0, 0);
    return this.divide(mag);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  distance(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  toString() {
    return \`Vec2(\${this.x}, \${this.y})\`;
  }
}

// Vec3 - 3D Vector class
class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(other) {
    return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  subtract(other) {
    return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  multiply(scalar) {
    return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  divide(scalar) {
    if (scalar === 0) throw new Error('Division by zero');
    return new Vec3(this.x / scalar, this.y / scalar, this.z / scalar);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vec3(0, 0, 0);
    return this.divide(mag);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  cross(other) {
    return new Vec3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }

  distance(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  clone() {
    return new Vec3(this.x, this.y, this.z);
  }

  toString() {
    return \`Vec3(\${this.x}, \${this.y}, \${this.z})\`;
  }
}

// String Library
const inscriptString = {
  length: (str) => String(str).length,
  charAt: (str, index) => String(str).charAt(index),
  substring: (str, start, end) => {
    const s = String(str);
    return end !== undefined ? s.substring(start, end) : s.substring(start);
  },
  slice: (str, start, end) => {
    const s = String(str);
    return end !== undefined ? s.slice(start, end) : s.slice(start);
  },
  indexOf: (str, search) => String(str).indexOf(String(search)),
  lastIndexOf: (str, search) => String(str).lastIndexOf(String(search)),
  includes: (str, search) => String(str).includes(String(search)),
  startsWith: (str, search) => String(str).startsWith(String(search)),
  endsWith: (str, search) => String(str).endsWith(String(search)),
  toLowerCase: (str) => String(str).toLowerCase(),
  toUpperCase: (str) => String(str).toUpperCase(),
  trim: (str) => String(str).trim(),
  split: (str, separator) => {
    const s = String(str);
    return separator === undefined ? [s] : s.split(String(separator));
  },
  replace: (str, search, replacement) => {
    return String(str).replace(String(search), String(replacement));
  },
  replaceAll: (str, search, replacement) => {
    return String(str).replaceAll(String(search), String(replacement));
  },
  repeat: (str, count) => String(str).repeat(Math.floor(count)),
  reverse: (str) => String(str).split('').reverse().join(''),
  concat: (...strs) => strs.map(String).join(''),
};

// Array Library
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
};`;
        return runtimeHelpers + "\n\n" + engineCode + "\n\n" + canvasCode + "\n\n" + inputCode;
    }
}
exports.CodeGenerator = CodeGenerator;
//# sourceMappingURL=codegen.js.map