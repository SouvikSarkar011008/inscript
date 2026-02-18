/**
 * Code Generator for InScript
 * Converts AST to JavaScript code
 */
import * as AST from "../types/ast";
export declare class CodeGenerator {
    private ast;
    private output;
    private indentLevel;
    private indentString;
    constructor(ast: AST.Program);
    /**
     * Generate JavaScript code from AST
     */
    generate(): string;
    /**
     * Generate statement
     */
    private generateStatement;
    /**
     * Generate variable declaration
     */
    private generateVariableDeclaration;
    /**
     * Generate function declaration
     */
    private generateFunctionDeclaration;
    /**
     * Generate class declaration
     */
    private generateClassDeclaration;
    /**
     * Generate game declaration
     */
    private generateGameDeclaration;
    /**
     * Generate asset declaration
     */
    private generateAssetDeclaration;
    /**
     * Generate block statement
     */
    private generateBlockStatement;
    /**
     * Generate expression statement
     */
    private generateExpressionStatement;
    /**
     * Generate if statement
     */
    private generateIfStatement;
    /**
     * Generate match statement (converted to switch)
     */
    private generateMatchStatement;
    /**
     * Generate while statement
     */
    private generateWhileStatement;
    /**
     * Generate for statement (for...of in JavaScript)
     */
    private generateForStatement;
    /**
     * Generate loop statement (infinite loop)
     */
    private generateLoopStatement;
    /**
     * Generate return statement
     */
    private generateReturnStatement;
    /**
     * Generate event handler
     */
    private generateEventHandler;
    /**
     * Generate expression
     */
    private generateExpression;
    /**
     * Generate literal
     */
    private generateLiteral;
    /**
     * Generate binary expression
     */
    private generateBinaryExpression;
    /**
     * Generate unary expression
     */
    private generateUnaryExpression;
    /**
     * Generate call expression
     */
    private generateCallExpression;
    /**
     * Generate member expression
     */
    private generateMemberExpression;
    /**
     * Generate array expression
     */
    private generateArrayExpression;
    /**
     * Generate object expression
     */
    private generateObjectExpression;
    /**
     * Generate function expression
     */
    private generateFunctionExpression;
    /**
     * Generate new expression
     */
    private generateNewExpression;
    /**
     * Generate conditional expression
     */
    private generateConditionalExpression;
    /**
     * Helper: emit text
     */
    private emit;
    /**
     * Helper: emit indentation
     */
    private emitIndent;
    /**
     * Helper: increase indentation
     */
    private indent;
    /**
     * Helper: decrease indentation
     */
    private dedent;
    /**
     * Get runtime helper functions
     */
    private getRuntimeHelpers;
}
//# sourceMappingURL=codegen.d.ts.map