/**
 * Parser for InScript
 * Converts tokens into an Abstract Syntax Tree (AST)
 */
import { Token } from "../types/tokens";
import * as AST from "../types/ast";
export declare class ParseError extends Error {
    constructor(message: string, token: Token);
}
export declare class Parser {
    private tokens;
    private current;
    constructor(tokens: Token[]);
    /**
     * Parse tokens into AST
     */
    parse(): AST.Program;
    /**
     * Parse a statement
     */
    private parseStatement;
    /**
     * Parse game declaration
     */
    private parseGameDeclaration;
    /**
     * Parse asset declaration
     */
    private parseAssetDeclaration;
    /**
     * Parse event handler (on init, on update, etc)
     */
    private parseEventHandler;
    /**
     * Parse variable declaration
     */
    private parseVariableDeclaration;
    /**
     * Parse function declaration
     */
    private parseFunctionDeclaration;
    /**
     * Parse class declaration
     */
    private parseClassDeclaration;
    /**
     * Parse block statement
     */
    private parseBlockStatement;
    /**
     * Parse if statement
     */
    private parseIfStatement;
    /**
     * Parse match statement
     */
    private parseMatchStatement;
    /**
     * Parse while statement
     */
    private parseWhileStatement;
    /**
     * Parse for statement
     */
    private parseForStatement;
    /**
     * Parse loop statement
     */
    private parseLoopStatement;
    /**
     * Parse return statement
     */
    private parseReturnStatement;
    /**
     * Parse expression statement
     */
    private parseExpressionStatement;
    /**
     * Parse expression (assignment is lowest precedence)
     */
    private parseExpression;
    /**
     * Parse assignment expression
     */
    private parseAssignment;
    /**
     * Parse ternary expression (? :)
     */
    private parseTernary;
    /**
     * Parse logical OR
     */
    private parseOr;
    /**
     * Parse logical AND
     */
    private parseAnd;
    /**
     * Parse equality
     */
    private parseEquality;
    /**
     * Parse comparison
     */
    private parseComparison;
    /**
     * Parse addition and subtraction
     */
    private parseAdditive;
    /**
     * Parse multiplication, division, modulo
     */
    private parseMultiplicative;
    /**
     * Parse unary expressions
     */
    private parseUnary;
    /**
     * Parse postfix expressions (member access, function calls)
     */
    private parsePostfix;
    /**
     * Parse primary expressions
     */
    private parsePrimary;
    /**
     * Parse function expression
     */
    private parseFunctionExpression;
    /**
     * Parse function parameters
     */
    private parseParameters;
    /**
     * Parse type annotation
     */
    private parseTypeAnnotation;
    /**
     * Parse function arguments
     */
    private parseArguments;
    /**
     * Helper: check if current token is of given type
     */
    private check;
    /**
     * Helper: match one or more token types
     */
    private match;
    /**
     * Helper: consume a token or throw error
     */
    private consume;
    /**
     * Helper: advance to next token
     */
    private advance;
    /**
     * Helper: get current token
     */
    private peek;
    /**
     * Helper: get next token
     */
    private peekNext;
    /**
     * Helper: get previous token
     */
    private previous;
    /**
     * Helper: check if at end of tokens
     */
    private isAtEnd;
    /**
     * Helper: consume statement end (semicolon or newline or brace)
     */
    private consumeStatementEnd;
    /**
     * Helper: create error
     */
    private error;
}
//# sourceMappingURL=parser.d.ts.map