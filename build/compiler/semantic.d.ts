/**
 * Semantic Analyzer for InScript
 * Validates AST, performs type checking, and builds symbol table
 */
import * as AST from "../types/ast";
export interface Symbol {
    name: string;
    type: "variable" | "function" | "class" | "parameter";
    valueType?: string;
    isDeclared: boolean;
    isInitialized: boolean;
    line: number;
    column: number;
}
export interface Scope {
    parent?: Scope;
    symbols: Map<string, Symbol>;
    isGlobal: boolean;
    isFunction: boolean;
    isLoop: boolean;
}
export declare class SemanticError extends Error {
    constructor(message: string, node: AST.ASTNode);
}
export declare class SemanticAnalyzer {
    private ast;
    private globalScope;
    private currentScope;
    private errors;
    private classTable;
    private functionTable;
    private gameDeclaration;
    constructor(ast: AST.Program);
    /**
     * Perform semantic analysis
     */
    analyze(): {
        valid: boolean;
        errors: SemanticError[];
        ast: AST.Program;
    };
    /**
     * Collect function and class definitions
     */
    private collectDefinitions;
    /**
     * Add built-in functions and classes
     */
    private addBuiltins;
    /**
     * Analyze program
     */
    private analyzeProgram;
    /**
     * Analyze statement
     */
    private analyzeStatement;
    /**
     * Analyze variable declaration
     */
    private analyzeVariableDeclaration;
    /**
     * Analyze function declaration
     */
    private analyzeFunctionDeclaration;
    /**
     * Analyze class declaration
     */
    private analyzeClassDeclaration;
    /**
     * Analyze block statement
     */
    private analyzeBlockStatement;
    /**
     * Analyze if statement
     */
    private analyzeIfStatement;
    /**
     * Analyze match statement
     */
    private analyzeMatchStatement;
    /**
     * Analyze while statement
     */
    private analyzeWhileStatement;
    /**
     * Analyze for statement
     */
    private analyzeForStatement;
    /**
     * Analyze loop statement
     */
    private analyzeLoopStatement;
    /**
     * Analyze return statement
     */
    private analyzeReturnStatement;
    /**
     * Analyze event handler
     */
    private analyzeEventHandler;
    /**
     * Analyze expression
     */
    private analyzeExpression;
    /**
     * Analyze identifier
     */
    private analyzeIdentifier;
    /**
     * Define a symbol in current scope
     */
    private defineSymbol;
    /**
     * Resolve a symbol through scope chain
     */
    private resolveSymbol;
}
//# sourceMappingURL=semantic.d.ts.map