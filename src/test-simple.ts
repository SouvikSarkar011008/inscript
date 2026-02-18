/**
 * Simple Compilation Test
 */

import Compiler from "./compiler";

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

const compiler = new Compiler();
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
