"use strict";
/**
 * Semantic Analyzer for InScript
 * Validates AST, performs type checking, and builds symbol table
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticAnalyzer = exports.SemanticError = void 0;
class SemanticError extends Error {
    constructor(message, node) {
        super(`Semantic Error at L${node.line}:C${node.column}: ${message}`);
    }
}
exports.SemanticError = SemanticError;
class SemanticAnalyzer {
    constructor(ast) {
        this.errors = [];
        this.classTable = new Map();
        this.functionTable = new Map();
        this.gameDeclaration = null;
        this.ast = ast;
        this.globalScope = {
            parent: undefined,
            symbols: new Map(),
            isGlobal: true,
            isFunction: false,
            isLoop: false,
        };
        this.currentScope = this.globalScope;
    }
    /**
     * Perform semantic analysis
     */
    analyze() {
        // First pass: collect definitions
        this.collectDefinitions();
        // Second pass: analyze nodes
        this.analyzeProgram();
        return {
            valid: this.errors.length === 0,
            errors: this.errors,
            ast: this.ast,
        };
    }
    /**
     * Collect function and class definitions
     */
    collectDefinitions() {
        // Add built-in functions
        this.addBuiltins();
        for (const stmt of this.ast.body) {
            if (stmt.type === "FunctionDeclaration") {
                const funcDecl = stmt;
                this.functionTable.set(funcDecl.id.name, funcDecl);
                this.defineSymbol({
                    name: funcDecl.id.name,
                    type: "function",
                    isDeclared: true,
                    isInitialized: true,
                    line: funcDecl.line,
                    column: funcDecl.column,
                });
            }
            else if (stmt.type === "ClassDeclaration") {
                const classDecl = stmt;
                this.classTable.set(classDecl.id.name, classDecl);
                this.defineSymbol({
                    name: classDecl.id.name,
                    type: "class",
                    isDeclared: true,
                    isInitialized: true,
                    line: classDecl.line,
                    column: classDecl.column,
                });
            }
            else if (stmt.type === "GameDeclaration") {
                this.gameDeclaration = stmt;
            }
        }
    }
    /**
     * Add built-in functions and classes
     */
    addBuiltins() {
        const builtins = [
            // Core functions
            "print",
            "typeof",
            "isNull",
            "isNumber",
            "isText",
            "isList",
            "input",
            // Math functions
            "sin",
            "cos",
            "tan",
            "asin",
            "acos",
            "atan",
            "atan2",
            "sqrt",
            "pow",
            "abs",
            "floor",
            "ceil",
            "round",
            "min",
            "max",
            "clamp",
            "lerp",
            "distance",
            "distance3d",
            "random",
            "randomInt",
            "randomRange",
            "degrees",
            "radians",
            // String functions
            "length",
            "charAt",
            "substring",
            "slice",
            "indexOf",
            "lastIndexOf",
            "includes",
            "startsWith",
            "endsWith",
            "toLowerCase",
            "toUpperCase",
            "trim",
            "split",
            "replace",
            "replaceAll",
            "repeat",
            "reverse",
            "concat",
            // Array functions
            "push",
            "pop",
            "shift",
            "unshift",
            "get",
            "set",
            "splice",
            "join",
            "filter",
            "map",
            "reduce",
            "forEach",
            "find",
            "findIndex",
            "some",
            "every",
            "flatten",
        ];
        // Add built-in functions
        for (const name of builtins) {
            this.defineSymbol({
                name,
                type: "function",
                isDeclared: true,
                isInitialized: true,
                line: 0,
                column: 0,
            });
        }
        // Add built-in objects and helpers
        const builtinObjects = ["Canvas", "Input", "game", "loadImage"];
        for (const name of builtinObjects) {
            this.defineSymbol({
                name,
                type: "variable",
                isDeclared: true,
                isInitialized: true,
                line: 0,
                column: 0,
            });
        }
        // Add built-in classes
        const builtinClasses = ["Vec2", "Vec3", "Point"];
        for (const className of builtinClasses) {
            // Add to classTable (using a dummy declaration)
            this.classTable.set(className, {
                type: "ClassDeclaration",
                id: { type: "Identifier", name: className, line: 0, column: 0 },
                superClass: undefined,
                body: {
                    type: "ClassBody",
                    members: [],
                    line: 0,
                    column: 0,
                },
                line: 0,
                column: 0,
            });
            // Also add to symbols
            this.defineSymbol({
                name: className,
                type: "class",
                isDeclared: true,
                isInitialized: true,
                line: 0,
                column: 0,
            });
        }
    }
    /**
     * Analyze program
     */
    analyzeProgram() {
        for (const stmt of this.ast.body) {
            try {
                this.analyzeStatement(stmt);
            }
            catch (error) {
                if (error instanceof SemanticError) {
                    this.errors.push(error);
                }
            }
        }
    }
    /**
     * Analyze statement
     */
    analyzeStatement(stmt) {
        switch (stmt.type) {
            case "VariableDeclaration":
                this.analyzeVariableDeclaration(stmt);
                break;
            case "FunctionDeclaration":
                this.analyzeFunctionDeclaration(stmt);
                break;
            case "ClassDeclaration":
                this.analyzeClassDeclaration(stmt);
                break;
            case "BlockStatement":
                this.analyzeBlockStatement(stmt);
                break;
            case "ExpressionStatement":
                this.analyzeExpression(stmt.expression);
                break;
            case "IfStatement":
                this.analyzeIfStatement(stmt);
                break;
            case "MatchStatement":
                this.analyzeMatchStatement(stmt);
                break;
            case "WhileStatement":
                this.analyzeWhileStatement(stmt);
                break;
            case "ForStatement":
                this.analyzeForStatement(stmt);
                break;
            case "LoopStatement":
                this.analyzeLoopStatement(stmt);
                break;
            case "ReturnStatement":
                this.analyzeReturnStatement(stmt);
                break;
            case "EventHandlerDeclaration":
                this.analyzeEventHandler(stmt);
                break;
        }
    }
    /**
     * Analyze variable declaration
     */
    analyzeVariableDeclaration(stmt) {
        // Check if variable already defined in current scope
        if (this.currentScope.symbols.has(stmt.id.name)) {
            throw new SemanticError(`Variable '${stmt.id.name}' already declared in this scope`, stmt);
        }
        // Analyze initialization
        if (stmt.init) {
            this.analyzeExpression(stmt.init);
        }
        // Define symbol
        this.defineSymbol({
            name: stmt.id.name,
            type: "variable",
            isDeclared: true,
            isInitialized: !!stmt.init,
            line: stmt.line,
            column: stmt.column,
        });
    }
    /**
     * Analyze function declaration
     */
    analyzeFunctionDeclaration(stmt) {
        // Create new scope for function
        const functionScope = {
            parent: this.currentScope,
            symbols: new Map(),
            isGlobal: false,
            isFunction: true,
            isLoop: false,
        };
        const previousScope = this.currentScope;
        this.currentScope = functionScope;
        // Add parameters to scope
        for (const param of stmt.params) {
            this.defineSymbol({
                name: param.id.name,
                type: "parameter",
                isDeclared: true,
                isInitialized: true,
                line: param.line,
                column: param.column,
            });
        }
        // Analyze function body
        this.analyzeBlockStatement(stmt.body);
        this.currentScope = previousScope;
    }
    /**
     * Analyze class declaration
     */
    analyzeClassDeclaration(stmt) {
        // Check superclass
        if (stmt.superClass) {
            if (!this.classTable.has(stmt.superClass.name)) {
                throw new SemanticError(`Superclass '${stmt.superClass.name}' not found`, stmt);
            }
        }
        // Create new scope for class
        const classScope = {
            parent: this.currentScope,
            symbols: new Map(),
            isGlobal: false,
            isFunction: false,
            isLoop: false,
        };
        const previousScope = this.currentScope;
        this.currentScope = classScope;
        // Analyze class members
        for (const member of stmt.body.members) {
            if (member.type === "ClassProperty") {
                const prop = member;
                this.defineSymbol({
                    name: prop.key.name,
                    type: "variable",
                    isDeclared: true,
                    isInitialized: !!prop.value,
                    line: prop.line,
                    column: prop.column,
                });
            }
            else if (member.type === "ClassMethod") {
                const method = member;
                const methodScope = {
                    parent: this.currentScope,
                    symbols: new Map(),
                    isGlobal: false,
                    isFunction: true,
                    isLoop: false,
                };
                // Add 'this' to method scope
                methodScope.symbols.set("this", {
                    name: "this",
                    type: "variable",
                    isDeclared: true,
                    isInitialized: true,
                    line: member.line,
                    column: member.column,
                });
                const prevScope = this.currentScope;
                this.currentScope = methodScope;
                // Add parameters
                for (const param of method.params) {
                    this.defineSymbol({
                        name: param.id.name,
                        type: "parameter",
                        isDeclared: true,
                        isInitialized: true,
                        line: param.line,
                        column: param.column,
                    });
                }
                // Analyze method body
                this.analyzeBlockStatement(method.body);
                this.currentScope = prevScope;
            }
        }
        this.currentScope = previousScope;
    }
    /**
     * Analyze block statement
     */
    analyzeBlockStatement(stmt) {
        // Create new scope for block
        const blockScope = {
            parent: this.currentScope,
            symbols: new Map(),
            isGlobal: false,
            isFunction: this.currentScope.isFunction,
            isLoop: this.currentScope.isLoop,
        };
        const previousScope = this.currentScope;
        this.currentScope = blockScope;
        // Analyze statements in block
        for (const statement of stmt.body) {
            this.analyzeStatement(statement);
        }
        this.currentScope = previousScope;
    }
    /**
     * Analyze if statement
     */
    analyzeIfStatement(stmt) {
        this.analyzeExpression(stmt.test);
        this.analyzeStatement(stmt.consequent);
        if (stmt.alternate) {
            this.analyzeStatement(stmt.alternate);
        }
    }
    /**
     * Analyze match statement
     */
    analyzeMatchStatement(stmt) {
        this.analyzeExpression(stmt.discriminant);
        for (const caseClause of stmt.cases) {
            if (caseClause.test) {
                this.analyzeExpression(caseClause.test);
            }
            this.analyzeStatement(caseClause.consequent);
        }
    }
    /**
     * Analyze while statement
     */
    analyzeWhileStatement(stmt) {
        this.analyzeExpression(stmt.test);
        const prevScope = this.currentScope;
        this.currentScope = {
            ...this.currentScope,
            isLoop: true,
        };
        this.analyzeStatement(stmt.body);
        this.currentScope = prevScope;
    }
    /**
     * Analyze for statement
     */
    analyzeForStatement(stmt) {
        this.analyzeExpression(stmt.right);
        const loopScope = {
            parent: this.currentScope,
            symbols: new Map(),
            isGlobal: false,
            isFunction: this.currentScope.isFunction,
            isLoop: true,
        };
        const previousScope = this.currentScope;
        this.currentScope = loopScope;
        // Define loop variable
        this.defineSymbol({
            name: stmt.left.name,
            type: "variable",
            isDeclared: true,
            isInitialized: true,
            line: stmt.line,
            column: stmt.column,
        });
        this.analyzeStatement(stmt.body);
        this.currentScope = previousScope;
    }
    /**
     * Analyze loop statement
     */
    analyzeLoopStatement(stmt) {
        const prevScope = this.currentScope;
        this.currentScope = {
            ...this.currentScope,
            isLoop: true,
        };
        this.analyzeStatement(stmt.body);
        this.currentScope = prevScope;
    }
    /**
     * Analyze return statement
     */
    analyzeReturnStatement(stmt) {
        if (!this.currentScope.isFunction) {
            throw new SemanticError("return outside of function", stmt);
        }
        if (stmt.argument) {
            this.analyzeExpression(stmt.argument);
        }
    }
    /**
     * Analyze event handler
     */
    analyzeEventHandler(stmt) {
        const handlerScope = {
            parent: this.currentScope,
            symbols: new Map(),
            isGlobal: false,
            isFunction: true,
            isLoop: false,
        };
        const previousScope = this.currentScope;
        this.currentScope = handlerScope;
        // Add parameters
        for (const param of stmt.params) {
            this.defineSymbol({
                name: param.id.name,
                type: "parameter",
                isDeclared: true,
                isInitialized: true,
                line: param.line,
                column: param.column,
            });
        }
        // Analyze handler body
        this.analyzeBlockStatement(stmt.body);
        this.currentScope = previousScope;
    }
    /**
     * Analyze expression
     */
    analyzeExpression(expr) {
        switch (expr.type) {
            case "Identifier":
                this.analyzeIdentifier(expr);
                break;
            case "BinaryExpression":
                const binExpr = expr;
                this.analyzeExpression(binExpr.left);
                this.analyzeExpression(binExpr.right);
                break;
            case "UnaryExpression":
                const unaryExpr = expr;
                this.analyzeExpression(unaryExpr.argument);
                break;
            case "CallExpression":
                const callExpr = expr;
                this.analyzeExpression(callExpr.callee);
                for (const arg of callExpr.arguments) {
                    this.analyzeExpression(arg);
                }
                break;
            case "MemberExpression":
                const memberExpr = expr;
                this.analyzeExpression(memberExpr.object);
                if (memberExpr.computed) {
                    this.analyzeExpression(memberExpr.property);
                }
                break;
            case "ArrayExpression":
                const arrExpr = expr;
                for (const elem of arrExpr.elements) {
                    if (elem)
                        this.analyzeExpression(elem);
                }
                break;
            case "ObjectExpression":
                const objExpr = expr;
                for (const prop of objExpr.properties) {
                    this.analyzeExpression(prop.value);
                }
                break;
            case "NewExpression":
                const newExpr = expr;
                if (newExpr.callee.type === "Identifier") {
                    const className = newExpr.callee.name;
                    if (!this.classTable.has(className)) {
                        throw new SemanticError(`Class '${className}' not found`, expr);
                    }
                }
                for (const arg of newExpr.arguments) {
                    this.analyzeExpression(arg);
                }
                break;
            case "ConditionalExpression":
                const condExpr = expr;
                this.analyzeExpression(condExpr.test);
                this.analyzeExpression(condExpr.consequent);
                this.analyzeExpression(condExpr.alternate);
                break;
            case "FunctionExpression":
                const funcExpr = expr;
                const exprFuncScope = {
                    parent: this.currentScope,
                    symbols: new Map(),
                    isGlobal: false,
                    isFunction: true,
                    isLoop: false,
                };
                const prevScope = this.currentScope;
                this.currentScope = exprFuncScope;
                for (const param of funcExpr.params) {
                    this.defineSymbol({
                        name: param.id.name,
                        type: "parameter",
                        isDeclared: true,
                        isInitialized: true,
                        line: param.line,
                        column: param.column,
                    });
                }
                this.analyzeBlockStatement(funcExpr.body);
                this.currentScope = prevScope;
                break;
        }
    }
    /**
     * Analyze identifier
     */
    analyzeIdentifier(expr) {
        const symbol = this.resolveSymbol(expr.name);
        if (!symbol) {
            throw new SemanticError(`Identifier '${expr.name}' is not defined`, expr);
        }
    }
    /**
     * Define a symbol in current scope
     */
    defineSymbol(symbol) {
        if (this.currentScope.symbols.has(symbol.name)) {
            const existing = this.currentScope.symbols.get(symbol.name);
            throw new SemanticError(`Symbol '${symbol.name}' already defined at L${existing.line}:C${existing.column}`, symbol);
        }
        this.currentScope.symbols.set(symbol.name, symbol);
    }
    /**
     * Resolve a symbol through scope chain
     */
    resolveSymbol(name) {
        let scope = this.currentScope;
        while (scope) {
            if (scope.symbols.has(name)) {
                return scope.symbols.get(name);
            }
            scope = scope.parent;
        }
        return null;
    }
}
exports.SemanticAnalyzer = SemanticAnalyzer;
//# sourceMappingURL=semantic.js.map