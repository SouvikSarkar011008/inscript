"use strict";
/**
 * Simple test to verify Lexer works
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("./compiler/lexer");
const source = `
game HelloWorld {
    title: "Hello World"
    width: 800
}

let x = 10
const PI = 3.14159

func greet(name) {
    return "Hello, " + name
}

class Player {
    name: text
    health: number = 100
}

on init() {
    print("Game started!")
}
`;
const lexer = new lexer_1.Lexer(source);
const tokens = lexer.tokenize();
console.log("=== Lexer Test ===");
console.log("Total tokens:", tokens.length);
console.log("\nFirst 20 tokens:");
tokens.slice(0, 20).forEach((token, i) => {
    console.log(`${i + 1}. ${token.type.padEnd(20)} | ${token.value.padEnd(20)} | L${token.line}:C${token.column}`);
});
console.log("\n✅ Lexer test completed successfully!");
//# sourceMappingURL=test-lexer.js.map