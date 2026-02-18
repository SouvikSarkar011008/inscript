/**
 * Full Compilation Pipeline Test
 */

import Compiler from "./compiler";

const exampleCode = `
// Game Configuration
game HelloWorld {
    title: "Hello InScript"
    width: 800
    height: 600
    mode: "2d"
}

// Asset Declaration
assets {
    image player = "sprites/player.png"
    audio bgm = "music/background.mp3"
}

// Variable Declarations
let score = 0
const GRAVITY = 9.8

// Function Definition
func calculateDamage(baseAttack, defenseMultiplier) {
    let damage = baseAttack * (1 - defenseMultiplier)
    return damage
}

// Class Definition
class Player {
    name: text
    health: number = 100
    position: text
    
    func new(playerName) {
        this.name = playerName
        this.health = 100
    }
    
    func takeDamage(amount) {
        this.health = this.health - amount
        if this.health < 0 {
            this.health = 0
        }
    }
}

// Event Handlers
on init() {
    print("Game initialized")
    let player = Player("Hero")
}

on update(deltaTime) {
    score = score + 1
}

on input(event) {
    if event.type == "keydown" {
        match event.key {
            "ArrowUp" => print("Pressed Up")
            default => print("Other key")
        }
    }
}

on render(canvas) {
    canvas.fillColor = "white"
    canvas.fillRect(0, 0, 800, 600)
}
`;

console.log("=== InScript Full Compilation Test ===\n");

const compiler = new Compiler();
const result = compiler.compile(exampleCode);

console.log("\n=== Compilation Result ===");
console.log(`Status: ${result.success ? "✅ SUCCESS" : "❌ FAILED"}`);
console.log(`Errors: ${result.errors.length}`);
console.log(`Warnings: ${result.warnings.length}`);

if (result.success && result.output) {
  console.log(`\n📄 Generated JavaScript Output (first 50 lines):\n`);
  const lines = result.output.split("\n");
  const preview = lines.slice(0, 50).join("\n");
  console.log(preview);
  
  if (lines.length > 50) {
    console.log(`\n... (${lines.length - 50} more lines)`);
  }
  
  console.log(`\n✅ Total output size: ${result.output.length} bytes`);
} else {
  console.log("\n❌ Compilation failed!");
  result.errors.forEach((err) => {
    console.error(`  - ${err.message}`);
  });
}
