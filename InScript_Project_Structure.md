# InScript Project Structure & Development Guide

## Recommended Directory Structure

```
inscript/
├── README.md                    # Project overview
├── LICENSE                      # Open source license
├── package.json                 # NPM configuration
├── tsconfig.json               # TypeScript configuration
│
├── src/
│   ├── compiler/
│   │   ├── index.ts            # Compiler entry point
│   │   ├── lexer.ts            # Tokenization
│   │   ├── parser.ts           # AST generation
│   │   ├── semantic.ts         # Type checking & validation
│   │   ├── codegen.ts          # JavaScript generation
│   │   └── optimizer.ts        # Optimization passes
│   │
│   ├── runtime/
│   │   ├── index.ts            # Runtime initialization
│   │   ├── game-engine.ts      # Game loop & lifecycle
│   │   ├── canvas-api.ts       # 2D canvas wrapper
│   │   ├── webgl-api.ts        # 3D WebGL wrapper
│   │   ├── input.ts            # Input handling
│   │   ├── audio.ts            # Audio system
│   │   ├── physics.ts          # Physics engine
│   │   └── assets.ts           # Asset loading & management
│   │
│   ├── stdlib/
│   │   ├── math.ts             # Math utilities
│   │   ├── vectors.ts          # Vec2, Vec3 classes
│   │   ├── strings.ts          # String functions
│   │   ├── arrays.ts           # Array functions
│   │   └── utils.ts            # General utilities
│   │
│   ├── cli/
│   │   ├── index.ts            # Command-line interface
│   │   └── commands/
│   │       ├── compile.ts      # compile command
│   │       ├── run.ts          # run command
│   │       ├── new.ts          # new project command
│   │       └── watch.ts        # watch mode command
│   │
│   └── types/
│       ├── ast.ts              # AST type definitions
│       ├── tokens.ts           # Token types
│       ├── ir.ts               # Intermediate representation types
│       └── game.ts             # Game-related types
│
├── tests/
│   ├── compiler/
│   │   ├── lexer.test.ts
│   │   ├── parser.test.ts
│   │   └── codegen.test.ts
│   │
│   ├── runtime/
│   │   ├── game-engine.test.ts
│   │   ├── physics.test.ts
│   │   └── input.test.ts
│   │
│   └── integration/
│       ├── full-compilation.test.ts
│       └── game-execution.test.ts
│
├── examples/
│   ├── pong/
│   │   ├── game.inscript       # Main game file
│   │   ├── assets/
│   │   │   └── sounds/
│   │   └── README.md
│   │
│   ├── platformer/
│   │   ├── game.inscript
│   │   ├── assets/
│   │   └── README.md
│   │
│   ├── 3d-demo/
│   │   ├── game.inscript
│   │   └── models/
│   │
│   └── hello-world/
│       └── game.inscript
│
├── docs/
│   ├── getting-started.md       # Quick start guide
│   ├── language-reference.md    # Full API documentation
│   ├── game-dev-guide.md        # Game development patterns
│   ├── tutorials/
│   │   ├── 01-your-first-game.md
│   │   ├── 02-working-with-sprites.md
│   │   ├── 03-input-and-physics.md
│   │   ├── 04-audio-and-effects.md
│   │   └── 05-3d-games.md
│   │
│   └── api/
│       ├── canvas.md            # Canvas API reference
│       ├── input.md             # Input API reference
│       ├── audio.md             # Audio API reference
│       ├── physics.md           # Physics reference
│       └── math.md              # Math utilities reference
│
├── tools/
│   ├── vscode-extension/        # VS Code syntax highlighting
│   │   ├── package.json
│   │   ├── syntaxes/
│   │   │   └── inscript.tmLanguage.json
│   │   └── language-configuration.json
│   │
│   └── playground/              # Online playground
│       ├── index.html
│       ├── compiler.js
│       └── runtime.js
│
└── build/
    ├── compiler.js             # Compiled compiler
    ├── runtime.js              # Compiled runtime
    └── std.js                  # Compiled standard library
```

## Build & Development Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- TypeScript 4.5+

### Installation

```bash
# Clone the repository
git clone https://github.com/inscript-lang/inscript.git
cd inscript

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm run test

# Start development mode
npm run dev
```

### Development Commands

```bash
# Watch TypeScript files and recompile
npm run watch

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format

# Build documentation
npm run docs:build
```

## CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/ci.yml`)

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16, 18, 20]
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
  
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm publish
```

## Configuration Files

### `package.json` Template

```json
{
  "name": "inscript",
  "version": "0.1.0",
  "description": "User-friendly game development language",
  "main": "build/compiler.js",
  "bin": {
    "inscript": "build/cli/index.js"
  },
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts",
    "dev": "npm run watch & npm run test:watch",
    "docs:build": "typedoc src --out docs/api"
  },
  "dependencies": {},
  "devDependencies": {
    "typescript": "^4.9.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "typedoc": "^0.23.0"
  }
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

## Running Your First InScript Game

### Step 1: Create a project

```bash
inscript new hello-world
cd hello-world
```

### Step 2: Write a simple game (`game.inscript`)

```inscript
game HelloWorld {
    title: "Hello World"
    width: 800
    height: 600
    mode: "2d"
}

let message = "Hello, InScript!"
let x = 100
let y = 100

on init() {
    // Game initialization
}

on update(dt) {
    // Update game state
    x = x + 50 * dt
}

on input(event) {
    // Handle input
}

on render(canvas) {
    canvas.fillColor = "white"
    canvas.fillRect(0, 0, 800, 600)
    
    canvas.fillColor = "black"
    canvas.font = "24px Arial"
    canvas.text(message, x, y)
}
```

### Step 3: Compile and run

```bash
inscript compile game.inscript -o out/game.js
inscript run game.inscript
```

Or in watch mode:

```bash
inscript watch game.inscript
```

## Documentation Standards

### Code Comments

```typescript
/**
 * Tokenizes InScript source code into a stream of tokens.
 * 
 * @param source - The InScript source code string
 * @returns Array of tokens with metadata
 * @throws {LexicalError} If invalid characters are encountered
 */
function lex(source: string): Token[] {
    // Implementation
}
```

### Commit Messages

```
feat: Add Vec3 support for 3D games
fix: Resolve memory leak in sprite renderer
docs: Add physics system tutorial
test: Improve compiler error test coverage
refactor: Simplify AST visitor pattern
chore: Update dependencies
```

## Testing Strategy

### Unit Tests

```typescript
describe('Lexer', () => {
    it('should tokenize variable declaration', () => {
        const tokens = lex('let x = 10');
        expect(tokens).toHaveLength(5);
        expect(tokens[0].type).toBe('KEYWORD');
        expect(tokens[0].value).toBe('let');
    });
});
```

### Integration Tests

```typescript
describe('Full Compilation', () => {
    it('should compile and execute hello world', async () => {
        const source = `
            game HelloWorld {
                title: "Test"
                width: 100
                height: 100
            }
            
            let output = []
            on init() {
                output.push("initialized")
            }
        `;
        
        const result = await compile(source);
        expect(result.success).toBe(true);
    });
});
```

## Contributing Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - See LICENSE file for details

## Community & Support

- **Discord**: [InScript Community Server]
- **GitHub Issues**: [Report bugs]
- **Discussions**: [Ask questions]
- **Twitter**: [@InScriptLang]
