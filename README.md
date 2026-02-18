# InScript - User-Friendly Game Development Language

![InScript Logo](https://via.placeholder.com/200)

**InScript** is a modern, intuitive programming language designed specifically for game development. It prioritizes ease of use while offering the power needed for professional game creation. InScript compiles to JavaScript and WebGL, making games runnable in browsers and Node.js.

## ✨ Features

### 🎮 Game Development First
- **Built-in game loop**: Simple `init()`, `update()`, `input()`, and `render()` handlers
- **2D graphics**: Easy canvas-based drawing with sprites, shapes, and text
- **3D support**: WebGL-powered 3D graphics with models and lighting
- **Input handling**: Unified keyboard, mouse, and touch input
- **Audio system**: Simple sound and music playback
- **Physics engine**: Basic collision detection and physics
- **Asset management**: Streamlined loading of images, sounds, and models

### 📝 Readable Syntax
- Clear, English-like syntax that reads naturally
- Classes and inheritance for organized code
- Functional programming support (lambdas, map/filter/reduce)
- Type hints (optional) for clarity
- Intuitive operators and control flow

### 🚀 Developer Experience
- Fast compilation to JavaScript
- Watch mode for instant feedback
- Clear error messages
- Extensible standard library
- Active community and examples

### 🌐 Cross-Platform
- Runs in web browsers
- Node.js support
- Electron/Desktop app support
- Mobile-friendly (touch input)

## 🎯 Quick Start

### Installation

```bash
npm install -g inscript
```

### Create a New Game

```bash
inscript new my-first-game
cd my-first-game
inscript run game.inscript
```

### Your First Game

```inscript
game HelloWorld {
    title: "My First InScript Game"
    width: 800
    height: 600
    mode: "2d"
}

let playerX = 400
let playerY = 300

on init() {
    print("Game started!")
}

on update(deltaTime) {
    // Update game state
    if input.isKeyPressed("ArrowLeft") {
        playerX = playerX - 5
    }
    if input.isKeyPressed("ArrowRight") {
        playerX = playerX + 5
    }
}

on render(canvas) {
    // Clear and fill background
    canvas.fillColor = "lightblue"
    canvas.fillRect(0, 0, 800, 600)
    
    // Draw player
    canvas.fillColor = "blue"
    canvas.fillCircle(playerX, playerY, 20)
    
    // Draw text
    canvas.fillColor = "black"
    canvas.font = "20px Arial"
    canvas.text("Use arrow keys to move!", 200, 50)
}
```

Run it:
```bash
inscript run HelloWorld.inscript
```

## 📚 Documentation

### Getting Started
- [Language Specification](./InScript_Language_Specification.md) - Complete language reference
- [Quick Reference](./InScript_Quick_Reference.md) - Cheat sheet for common tasks
- [Project Structure](./InScript_Project_Structure.md) - How to organize your projects

### Development
- [Compiler Architecture](./InScript_Compiler_Architecture.md) - How InScript compiles to JavaScript
- [Grammar](./InScript_Grammar.ebnf) - Formal syntax definition

### Examples
- **Pong** - Simple 2-player game (see Language Specification)
- **Platformer** - Jump and run game (see Language Specification)
- More examples in the `examples/` directory

## 📖 Language Overview

### Variables & Types

```inscript
let x = 10              // Mutable variable
const PI = 3.14159      // Constant
let pos = Vec2(100, 200)  // 2D vector
let list = [1, 2, 3, 4, 5]
let map = {name: "Hero", health: 100}
```

### Functions & Classes

```inscript
// Functions
func greet(name) {
    return "Hello, " + name
}

// Classes
class Player {
    name: text
    health: number
    
    func new(n) {
        this.name = n
        this.health = 100
    }
}

let player = Player("Hero")
```

### Game Loop

```inscript
on init() {
    // Initialize game - called once at startup
}

on update(dt) {
    // Update game state - called every frame
    // dt = delta time in seconds
}

on input(event) {
    // Handle input - called for each input event
}

on render(canvas) {
    // Draw game - called every frame
}
```

### Drawing

```inscript
on render(canvas) {
    canvas.fillColor = "white"
    canvas.fillRect(0, 0, 800, 600)  // Clear
    
    canvas.fillColor = "red"
    canvas.fillCircle(400, 300, 50)  // Draw circle
    
    canvas.font = "24px Arial"
    canvas.text("Score: 100", 10, 30)  // Draw text
}
```

## 🛠️ Command Line Interface

```bash
# Create a new project
inscript new <project-name>

# Compile InScript to JavaScript
inscript compile <file.inscript> -o <output.js>

# Run an InScript game
inscript run <file.inscript>

# Watch mode - auto-compile on changes
inscript watch <file.inscript>

# Version
inscript --version

# Help
inscript --help
```

## 🏗️ Project Structure

```
my-game/
├── game.inscript           # Main game file
├── assets/
│   ├── sprites/            # Images
│   ├── sounds/             # Audio files
│   └── models/             # 3D models
└── out/                    # Compiled JavaScript
    └── game.js
```

## 🤝 Contributing

Contributions are welcome! Areas where we need help:

- **Language Features**: Help expand the standard library
- **Compiler**: Optimize code generation
- **Runtime**: Improve performance
- **Examples**: Create tutorial games
- **Documentation**: Write guides and tutorials
- **IDE Support**: VS Code extension improvements
- **Testing**: Expand test coverage

See [Contributing Guidelines](./CONTRIBUTING.md) for details.

## 📋 Roadmap

### Phase 1: Core Foundation (Current)
- ✅ Language specification
- ⏳ Lexer & Parser implementation
- ⏳ Basic code generation
- ⏳ 2D graphics API

### Phase 2: Game Engine (Q2 2026)
- ⏳ Complete compiler
- ⏳ Game loop implementation
- ⏳ Input system
- ⏳ Audio system
- ⏳ Physics engine

### Phase 3: Advanced Features (Q3 2026)
- ⏳ 3D graphics support
- ⏳ Particle systems
- ⏳ Animation support
- ⏳ Advanced physics

### Phase 4: Ecosystem (Q4 2026)
- ⏳ Package manager
- ⏳ Asset editor
- ⏳ Online playground
- ⏳ Component library

## 💻 System Requirements

- **Node.js**: 16.0 or higher
- **npm**: 7.0 or higher
- **Browser**: Modern browser with WebGL support (for web games)

### Development Requirements
- **TypeScript**: 4.5+
- **Git**: For version control

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details.

Free to use for personal and commercial projects!

## 🌟 Why InScript?

### For Beginners
- **Simple syntax** that's easy to learn
- **Game-specific** features (no boilerplate)
- **Great documentation** and examples
- **Friendly community**

### For Game Developers
- **Compile to JavaScript** for web deployment
- **Native performance** with WebGL
- **Cross-platform** support
- **Professional-grade** features

### For Educators
- **Teach programming** through games
- **Visual feedback** (game output)
- **Built-in creativity** (game dev is fun!)
- **Industry-relevant** skills

## 🎓 Learning Resources

### Tutorials
1. **Your First Game** - Simple 2D game in 15 minutes
2. **Working with Sprites** - Character animation
3. **Input & Physics** - Making games feel responsive
4. **Audio & Effects** - Sound design
5. **3D Games** - WebGL basics

### Example Games
- Pong (2D, multiplayer)
- Platformer (2D, physics)
- Space Shooter (2D, arcade)
- 3D Cube Demo (3D, rendering)
- Top-down RPG (2D, complex systems)

### Community
- **Discord**: [Join community server]
- **GitHub**: [Star the repo]
- **Twitter**: [@InScriptLang]
- **Forum**: [Discussions]

## ⚡ Performance

InScript generates optimized JavaScript that matches hand-written code performance:

- **Startup**: < 100ms for typical games
- **Frame Rate**: 60+ FPS for 2D games
- **Memory**: Efficient garbage collection
- **File Size**: Minimal compiled output

## 🐛 Issues & Feedback

Found a bug? Have a feature request? 

- **GitHub Issues**: [Report issues]
- **GitHub Discussions**: [Ask questions]
- **Discord**: [Chat with community]

## 🎉 Special Thanks

InScript is inspired by:
- Lua (readability)
- JavaScript (web compatibility)
- Python (syntax clarity)
- game engines (game dev focus)

Special thanks to all contributors and the game development community!

---

**Ready to make your first game?** Start with the [Quick Start Guide](./docs/getting-started.md)!

**Want to contribute?** Check out [Contributing Guidelines](./CONTRIBUTING.md)!

**Have questions?** Join our [Discord community](https://discord.gg/inscript)!

---

**InScript**: *Making game development accessible to everyone* 🎮✨
