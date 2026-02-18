"use strict";
/**
 * Simple Compilation Test
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compiler_1 = __importDefault(require("./compiler"));
const simpleCode = `
let x = 10

func add(a, b) {
    return a + b
}

class MyClass {
    value: number = 5
}

game Test {
    title: "Test"
    width: 800
}

on init() {
    print("Hello")
}
`;
console.log("=== InScript Simple Compilation Test ===\n");
const compiler = new compiler_1.default();
const result = compiler.compile(simpleCode);
console.log("\n=== Result ===");
console.log(`Status: ${result.success ? "✅ SUCCESS" : "❌ FAILED"}`);
console.log(`Errors: ${result.errors.length}`);
if (result.errors.length > 0) {
    result.errors.forEach((err) => {
        console.error(`❌ ${err.message}`);
    });
}
if (result.success && result.output) {
    console.log("\n✅ Generated JavaScript:\n");
    console.log(result.output);
}
//# sourceMappingURL=test-simple.js.map