"use strict";
/**
 * Test Parser
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("./compiler/lexer");
const parser_1 = require("./compiler/parser");
const source = `
let x = 10
const name = "InScript"

func add(a, b) {
    return a + b
}

class Player {
    name: text
    health: number = 100
    
    func new(playerName) {
        this.name = playerName
    }
}

game MyGame {
    title: "InScript Game"
    width: 800
    height: 600
}

on init() {
    print("Game initialized")
}

on update(dt) {
    x = x + 1
}

on render(canvas) {
    canvas.fillColor = "black"
}
`;
try {
    const lexer = new lexer_1.Lexer(source);
    const tokens = lexer.tokenize();
    console.log("✅ Lexer completed!");
    console.log(`Total tokens: ${tokens.length}`);
    const parser = new parser_1.Parser(tokens);
    const ast = parser.parse();
    console.log("✅ Parser completed!");
    console.log(`Total AST nodes: ${ast.body.length}`);
    // Print AST structure
    console.log("\n=== AST Structure ===");
    ast.body.forEach((node, i) => {
        console.log(`${i + 1}. ${node.type}`);
    });
    console.log("\n✅ Parser test completed successfully!");
}
catch (error) {
    console.error("❌ Error:", error);
}
//# sourceMappingURL=test-parser.js.map