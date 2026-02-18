# Getting Started with InScript Development

This guide helps you set up and start developing the InScript language itself (not for game development, but for creating InScript as a language/compiler).

## Table of Contents
1. [Setup](#setup)
2. [Architecture Overview](#architecture-overview)
3. [Building Blocks](#building-blocks)
4. [Your First Contribution](#your-first-contribution)
5. [Testing](#testing)
6. [Debugging](#debugging)

---

## Setup

### Prerequisites

```bash
# Check Node.js version (require 16+)
node --version

# Check npm version (required 7+)
npm --version
```

### Clone & Install

```bash
git clone https://github.com/inscript-lang/inscript.git
cd inscript
npm install
```

### Initial Build

```bash
npm run build
```

### Verify Installation

```bash
npm test
node build/cli/index.js --version
```

---

## Architecture Overview

InScript compilation has 6 main stages:

```
Source Code (.inscript)
    ↓
Lexer (Tokenization)        [lexer.ts]
    ↓
Parser (AST Building)        [parser.ts]
    ↓
Semantic Analyzer             [semantic.ts]
    ↓
IR Generator                 [ir-gen.ts]
    ↓
Code Generator               [codegen.ts]
    ↓
JavaScript Output
```

Each stage is independent and testable. Let's understand each:

### Stage 1: Lexer

**File**: `src/compiler/lexer.ts`
**Input**: Source code string
**Output**: Array of tokens

**Token Structure**:
```typescript
interface Token {
    type: "KEYWORD" | "IDENTIFIER" | "NUMBER" | "STRING" | ...
    value: string
    line: number
    column: number
    length: number
}
```

**Example**:
```
Input:  "let x = 10"
Output: [
    {type: "KEYWORD", value: "let", ...},
    {type: "IDENTIFIER", value: "x", ...},
    {type: "OPERATOR", value: "=", ...},
    {type: "NUMBER", value: "10", ...}
]
```

### Stage 2: Parser

**File**: `src/compiler/parser.ts`
**Input**: Token stream
**Output**: Abstract Syntax Tree (AST)

**AST Node Structure**:
```typescript
interface ASTNode {
    type: string  // "VariableDeclaration", "FunctionCall", etc.
    [key: string]: any  // Type-specific properties
}
```

**Example AST**:
```
{
    type: "Program",
    body: [
        {
            type: "VariableDeclaration",
            kind: "let",
            id: {type: "Identifier", name: "x"},
            init: {type: "Literal", value: 10}
        }
    ]
}
```

### Stage 3: Semantic Analyzer

**File**: `src/compiler/semantic.ts`
**Input**: AST
**Output**: Type-annotated AST + Symbol Table

**Tasks**:
- Type inference and checking
- Scope analysis
- Variable resolution
- Function signature validation

### Stage 4: IR Generation

**File**: `src/compiler/ir-gen.ts`
**Input**: Semantic AST
**Output**: Intermediate Representation

**IR Example**:
```
LOAD_CONST 10
STORE_VAR "x"
LOAD_VAR "x"
CALL print
```

### Stage 5: Code Generation

**File**: `src/compiler/codegen.ts`
**Input**: IR
**Output**: JavaScript code

**Example**:
```javascript
let x = 10;
print(x);
```

---

## Building Blocks

### 1. Token Types

```typescript
// src/types/tokens.ts
enum TokenType {
    // Literals
    NUMBER = "NUMBER",
    STRING = "STRING",
    IDENTIFIER = "IDENTIFIER",
    
    // Keywords
    LET = "LET",
    CONST = "CONST",
    FUNCTION = "FUNCTION",
    CLASS = "CLASS",
    IF = "IF",
    FOR = "FOR",
    WHILE = "WHILE",
    
    // Operators
    PLUS = "PLUS",
    MINUS = "MINUS",
    MULTIPLY = "MULTIPLY",
    DIVIDE = "DIVIDE",
    ASSIGN = "ASSIGN",
    
    // Punctuation
    LPAREN = "LPAREN",
    RPAREN = "RPAREN",
    LBRACE = "LBRACE",
    RBRACE = "RBRACE",
    SEMICOLON = "SEMICOLON",
    
    // Special
    EOF = "EOF",
    NEWLINE = "NEWLINE"
}
```

### 2. AST Node Types

```typescript
// src/types/ast.ts

// Program (root)
interface ProgramNode {
    type: "Program"
    body: StatementNode[]
}

// Variable Declaration
interface VariableDeclaration {
    type: "VariableDeclaration"
    kind: "let" | "const" | "var"
    id: Identifier
    init?: Expression
}

// Function Declaration
interface FunctionDeclaration {
    type: "FunctionDeclaration"
    id: Identifier
    params: Parameter[]
    body: BlockStatement
    returnType?: Type
}

// Class Declaration
interface ClassDeclaration {
    type: "ClassDeclaration"
    id: Identifier
    superClass?: Identifier
    body: ClassBody
}

// Variable/Function/Class Name
interface Identifier {
    type: "Identifier"
    name: string
}

// Expressions
interface BinaryExpression {
    type: "BinaryExpression"
    left: Expression
    operator: string  // "+", "-", "==", etc.
    right: Expression
}

interface CallExpression {
    type: "CallExpression"
    callee: Expression
    arguments: Expression[]
}

interface Literal {
    type: "Literal"
    value: number | string | boolean | null
}

// Statements
interface BlockStatement {
    type: "BlockStatement"
    body: StatementNode[]
}

interface IfStatement {
    type: "IfStatement"
    test: Expression
    consequent: StatementNode
    alternate?: StatementNode
}

interface ForStatement {
    type: "ForStatement"
    left: Identifier
    right: Expression
    body: StatementNode
}

interface ReturnStatement {
    type: "ReturnStatement"
    argument?: Expression
}
```

### 3. Lexer Example

```typescript
// src/compiler/lexer.ts
class Lexer {
    source: string
    position: number = 0
    line: number = 1
    column: number = 1
    tokens: Token[] = []
    
    constructor(source: string) {
        this.source = source
    }
    
    tokenize(): Token[] {
        while (this.position < this.source.length) {
            this.skipWhitespace()
            if (this.position >= this.source.length) break
            
            const char = this.peek()
            
            // Keywords and identifiers
            if (this.isLetter(char)) {
                this.readIdentifierOrKeyword()
            }
            // Numbers
            else if (this.isDigit(char)) {
                this.readNumber()
            }
            // Strings
            else if (char === '"' || char === "'") {
                this.readString()
            }
            // Operators
            else {
                this.readOperator()
            }
        }
        
        this.tokens.push({type: "EOF", value: "", ...})
        return this.tokens
    }
    
    private peek(): string {
        return this.source[this.position]
    }
    
    private advance(): string {
        const char = this.peek()
        this.position++
        if (char === '\n') {
            this.line++
            this.column = 1
        } else {
            this.column++
        }
        return char
    }
    
    private isLetter(c: string): boolean {
        return /[a-zA-Z_]/.test(c)
    }
    
    private isDigit(c: string): boolean {
        return /[0-9]/.test(c)
    }
}
```

### 4. Parser Example

```typescript
// src/compiler/parser.ts
class Parser {
    tokens: Token[]
    current: number = 0
    
    constructor(tokens: Token[]) {
        this.tokens = tokens
    }
    
    parse(): ProgramNode {
        const statements: StatementNode[] = []
        
        while (!this.isAtEnd()) {
            statements.push(this.parseStatement())
        }
        
        return {
            type: "Program",
            body: statements
        }
    }
    
    private parseStatement(): StatementNode {
        // Check current token
        if (this.match("LET", "CONST", "VAR")) {
            return this.parseVariableDeclaration()
        }
        if (this.match("FUNCTION")) {
            return this.parseFunctionDeclaration()
        }
        if (this.match("IF")) {
            return this.parseIfStatement()
        }
        if (this.match("LBRACE")) {
            return this.parseBlockStatement()
        }
        
        return this.parseExpressionStatement()
    }
    
    private parseVariableDeclaration(): VariableDeclaration {
        const kind = this.previous().value
        const name = this.consume("IDENTIFIER", "Expected variable name")
        this.consume("ASSIGN", "Expected '='")
        const init = this.parseExpression()
        this.consumeStatementEnd()
        
        return {
            type: "VariableDeclaration",
            kind,
            id: {type: "Identifier", name: name.value},
            init
        }
    }
    
    private parseExpression(): Expression {
        return this.parseAssignment()
    }
    
    private parseAssignment(): Expression {
        let expr = this.parseOr()
        
        if (this.match("ASSIGN")) {
            const value = this.parseAssignment()
            return {
                type: "AssignmentExpression",
                left: expr,
                right: value
            }
        }
        
        return expr
    }
    
    private match(...types: string[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance()
                return true
            }
        }
        return false
    }
    
    private check(type: string): boolean {
        if (this.isAtEnd()) return false
        return this.peek().type === type
    }
    
    private advance(): Token {
        if (!this.isAtEnd()) this.current++
        return this.previous()
    }
    
    private peek(): Token {
        return this.tokens[this.current]
    }
    
    private previous(): Token {
        return this.tokens[this.current - 1]
    }
    
    private isAtEnd(): boolean {
        return this.peek().type === "EOF"
    }
}
```

### 5. Code Generator Example

```typescript
// src/compiler/codegen.ts
class CodeGenerator {
    ast: ProgramNode
    output: string = ""
    indent: number = 0
    
    constructor(ast: ProgramNode) {
        this.ast = ast
    }
    
    generate(): string {
        for (const statement of this.ast.body) {
            this.output += this.generateStatement(statement)
        }
        return this.output
    }
    
    private generateStatement(node: StatementNode): string {
        switch (node.type) {
            case "VariableDeclaration":
                return this.generateVariableDeclaration(node)
            case "FunctionDeclaration":
                return this.generateFunctionDeclaration(node)
            case "IfStatement":
                return this.generateIfStatement(node)
            case "BlockStatement":
                return this.generateBlockStatement(node)
            default:
                return ""
        }
    }
    
    private generateVariableDeclaration(node: VariableDeclaration): string {
        let code = `${node.kind} ${node.id.name}`
        if (node.init) {
            code += ` = ${this.generateExpression(node.init)}`
        }
        code += ";\n"
        return code
    }
    
    private generateExpression(expr: Expression): string {
        if (expr.type === "Literal") {
            const lit = expr as Literal
            if (typeof lit.value === "string") {
                return `"${lit.value}"`
            }
            return String(lit.value)
        }
        
        if (expr.type === "BinaryExpression") {
            const bin = expr as BinaryExpression
            return `${this.generateExpression(bin.left)} ${bin.operator} ${this.generateExpression(bin.right)}`
        }
        
        return ""
    }
}
```

---

## Your First Contribution

### Example: Add a new built-in function

Let's add a `abs()` function to the standard library:

**Step 1**: Update token types (if needed)
- Already have `IDENTIFIER`, no changes needed

**Step 2**: Add to standard library

```typescript
// src/stdlib/math.ts
StdLib.register({
    name: "abs",
    parameters: ["x"],
    returnType: "number",
    implementation: (x: number) => Math.abs(x)
})
```

**Step 3**: Write tests

```typescript
// tests/stdlib/math.test.ts
describe("Math functions", () => {
    it("should calculate absolute value", () => {
        const source = `
            let x = abs(-5)
            print(x)
        `
        const result = compile(source)
        expect(result.output).toBe("5")
    })
})
```

**Step 4**: Run tests

```bash
npm test
```

---

## Testing

### Test Structure

```typescript
// tests/compiler/lexer.test.ts
describe("Lexer", () => {
    it("should tokenize a variable declaration", () => {
        const lexer = new Lexer("let x = 10")
        const tokens = lexer.tokenize()
        
        expect(tokens[0].type).toBe("LET")
        expect(tokens[1].type).toBe("IDENTIFIER")
        expect(tokens[1].value).toBe("x")
        expect(tokens[2].type).toBe("ASSIGN")
        expect(tokens[3].type).toBe("NUMBER")
        expect(tokens[3].value).toBe("10")
    })
    
    it("should handle strings with escapes", () => {
        const lexer = new Lexer(`"Hello\nWorld"`)
        const tokens = lexer.tokenize()
        
        expect(tokens[0].type).toBe("STRING")
        expect(tokens[0].value).toBe("Hello\nWorld")
    })
})
```

### Running Tests

```bash
# All tests
npm test

# Specific test file
npm test -- lexer.test.ts

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

---

## Debugging

### Debug with Node Inspector

```bash
node --inspect-brk build/compiler/index.js game.inscript
```

Then open `chrome://inspect` in Chrome.

### Logging in Code

```typescript
// src/compiler/parser.ts
private parseStatement(): StatementNode {
    console.log("Parsing statement:", this.peek().value)
    // ... rest of code
}
```

### Print AST

```typescript
// Create a utility to pretty-print AST
function printAST(node: ASTNode, indent: number = 0): void {
    const prefix = "  ".repeat(indent)
    console.log(`${prefix}${node.type}`)
    
    for (const key in node) {
        if (key === "type") continue
        const value = node[key]
        if (Array.isArray(value)) {
            value.forEach(item => {
                if (item && typeof item === "object" && "type" in item) {
                    printAST(item, indent + 1)
                }
            })
        } else if (value && typeof value === "object" && "type" in value) {
            printAST(value, indent + 1)
        }
    }
}

// Usage
const ast = parser.parse()
printAST(ast)
```

### Debug Compiled Output

```typescript
// src/compiler/codegen.ts

// Print generated code line by line
const output = codegen.generate()
console.log("Generated JavaScript:")
console.log("---")
console.log(output)
console.log("---")
```

---

## Next Steps

1. **Read the full specs**: [Language Specification](./InScript_Language_Specification.md)
2. **Understand the grammar**: [EBNF Grammar](./InScript_Grammar.ebnf)
3. **Study the architecture**: [Compiler Architecture](./InScript_Compiler_Architecture.md)
4. **Explore examples**: Check the `examples/` directory
5. **Join the community**: [Discord server]
6. **Pick an issue**: [GitHub Issues]

---

## FAQ

**Q: Where do I start implementing the lexer?**
A: Start with keywords (let, const, if, for) and simple operators. Test each token type.

**Q: How do I handle operator precedence?**
A: Use recursive descent parsing with appropriate function nesting. Lower precedence operators parsed at higher levels.

**Q: What if I find a bug in my code generation?**
A: Write a test first that reproduces the bug, then fix it. This ensures it doesn't happen again.

**Q: How do I optimize the compiler?**
A: Profile with `--prof`, identify bottlenecks, then optimize. Begin with lexer optimization.

---

Happy coding! 🎮✨
