# InScript Compiler Architecture

## Overview

The InScript compiler is a multi-stage transpiler that converts InScript source code into optimized JavaScript with WebGL/Canvas rendering support.

## Pipeline

```
Source Code (.inscript)
    ↓
[Lexical Analysis] → Tokens
    ↓
[Syntax Analysis] → Abstract Syntax Tree (AST)
    ↓
[Semantic Analysis] → Type Checking & Validation
    ↓
[IR Generation] → Intermediate Representation
    ↓
[Code Generation] → JavaScript
    ↓
[Optimization] → Minification/Tree-shaking
    ↓
JavaScript Output
```

## Stage 1: Lexical Analysis (Lexer)

**Purpose**: Convert raw source code into a stream of tokens.

**Components**:
- Character scanner
- Token recognizer
- Whitespace/comment handler

**Output**: Token stream with metadata (type, value, line, column)

**Example**:
```
Input:  let x = 42;
Output: [
  {type: "KEYWORD", value: "let", line: 1, col: 1},
  {type: "IDENTIFIER", value: "x", line: 1, col: 5},
  {type: "OPERATOR", value: "=", line: 1, col: 7},
  {type: "NUMBER", value: "42", line: 1, col: 9},
  {type: "SEMICOLON", value: ";", line: 1, col: 11}
]
```

## Stage 2: Syntax Analysis (Parser)

**Purpose**: Build an Abstract Syntax Tree (AST) from tokens using grammar rules.

**Algorithm**: Recursive descent parser with lookahead

**Output**: AST nodes representing program structure

**Example AST Node**:
```javascript
{
  type: "VariableDeclaration",
  kind: "let",
  identifier: "x",
  init: {
    type: "Literal",
    value: 42,
    valueType: "number"
  }
}
```

## Stage 3: Semantic Analysis

**Purpose**: Validate code semantics and build symbol table.

**Tasks**:
- Type checking
- Variable scope validation
- Function signature matching
- Class inheritance validation
- Asset reference validation

**Output**: Annotated AST with type information

## Stage 4: Intermediate Representation (IR)

**Purpose**: Platform-neutral representation before code generation.

**IR Format**: Linear instruction stream or control flow graph

**Benefits**:
- Easier optimization
- Better error reporting
- Potential for multiple backend targets

## Stage 5: Code Generation

**Purpose**: Convert IR to JavaScript.

### 5.1 Variable Declaration
```inscript
let x = 10
const PI = 3.14159
```

Compiles to:
```javascript
let x = 10;
const PI = 3.14159;
```

### 5.2 Function Declaration
```inscript
func add(a, b) {
    return a + b
}
```

Compiles to:
```javascript
function add(a, b) {
    return a + b;
}
```

### 5.3 Class Declaration
```inscript
class Player {
    name: text
    health: number
    
    func new(name) {
        this.name = name
        this.health = 100
    }
}
```

Compiles to:
```javascript
class Player {
    constructor(name) {
        this.name = name;
        this.health = 100;
    }
}
```

### 5.4 Game Loop
```inscript
game MyGame {
    title: "My Game"
    width: 800
    height: 600
}

on init() { /* ... */ }
on update(dt) { /* ... */ }
on input(event) { /* ... */ }
on render(canvas) { /* ... */ }
```

Compiles to:
```javascript
class InScriptGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.running = false;
        this.lastFrameTime = 0;
    }
    
    init() { /* ... */ }
    update(deltaTime) { /* ... */ }
    handleInput(event) { /* ... */ }
    render() { /* ... */ }
    
    start() {
        this.running = true;
        this.lastFrameTime = performance.now();
        this.gameLoop = setInterval(() => this.tick(), 16);
    }
    
    tick() {
        const now = performance.now();
        const deltaTime = (now - this.lastFrameTime) / 1000;
        this.lastFrameTime = now;
        
        this.update(deltaTime);
        this.render();
    }
}

const game = new InScriptGame();
game.start();
```

### 5.5 2D Rendering
```inscript
on render(canvas) {
    canvas.fillColor = "red"
    canvas.fillRect(10, 10, 100, 100)
}
```

Compiles to:
```javascript
render() {
    this.ctx.fillStyle = "#FF0000";
    this.ctx.fillRect(10, 10, 100, 100);
}
```

### 5.6 3D Rendering (WebGL)
```inscript
on render(camera) {
    cube.render(camera)
}
```

Compiles to:
```javascript
render() {
    const gl = this.glContext;
    // WebGL shader setup
    // Model matrix, view matrix, projection matrix
    gl.useProgram(shader);
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertexBuffer);
    gl.drawElements(gl.TRIANGLES, cube.indexCount, gl.UNSIGNED_INT, 0);
}
```

## Stage 6: Optimization

### Techniques:
- **Dead code elimination**: Remove unreachable code
- **Constant folding**: Evaluate constants at compile time
- **Inlining**: Inline small functions
- **Tree shaking**: Remove unused exports
- **Minification**: Reduce code size

### Example:
```inscript
const PI = 3.14159
let area = PI * 5 * 5
```

Optimizes to:
```javascript
let area = 78.53975;  // PI * 5 * 5 is computed at compile time
```

## Implementation Roadmap

### Phase 1: Core Compiler
1. **Lexer** (250 lines)
   - Token types
   - Keyword recognition
   - Number/string parsing

2. **Parser** (800 lines)
   - Expression parsing
   - Statement parsing
   - Error recovery

3. **Code Generator** (500 lines)
   - JavaScript output
   - Source maps

### Phase 2: Game Runtime
1. **Game Engine** (1000 lines)
   - Game loop
   - Canvas API wrapper
   - Input handling

2. **2D Graphics API** (300 lines)
   - Shape drawing
   - Sprite rendering
   - Text rendering

### Phase 3: Advanced Features
1. **3D Support** (1500 lines)
   - WebGL initialization
   - Shader management
   - 3D math library

2. **Physics Engine** (800 lines)
   - Rectangle/circle collision
   - Vector physics

3. **Asset Loading** (400 lines)
   - Image loading
   - Audio loading
   - Font loading

### Phase 4: Tooling
1. **VS Code Extension**
2. **Debugger**
3. **Package Manager**

## Error Handling

### Lexical Errors
```
Line 5, Column 12: Unexpected character '@'
```

### Syntax Errors
```
Line 8: Expected ')' but found 'identifier'
  |  function test(a, b {
  |                        ^
```

### Type Errors
```
Line 12: Cannot assign 'text' to 'number'
  |  let x: number = "hello"
  |                   ^^^^^^^
```

### Runtime Errors
```
ReferenceError: 'player' is not defined
  at game.js:45:12
```

## Performance Considerations

1. **Compilation Speed**: Optimize parser for quick compilation
2. **Generated Code Size**: Minimize JavaScript output
3. **Runtime Performance**: Generated code should match handwritten JavaScript
4. **Memory Usage**: Efficient AST representation

## Testing Strategy

Test coverage across all compilation stages:
- **Lexer tests**: Token generation
- **Parser tests**: AST construction
- **Semantic tests**: Type checking
- **Code generation tests**: Output validation
- **Integration tests**: Full compilation pipeline
- **Game tests**: Actual game execution

## Future Enhancements

1. **Compilation Targets**:
   - WebAssembly (WASM)
   - Native C/C++
   - Python

2. **Advanced Optimization**:
   - JIT compilation
   - SIMD operations
   - Parallel execution

3. **Distributed Compilation**:
   - Remote compilation
   - Incremental compilation
   - Distributed testing
