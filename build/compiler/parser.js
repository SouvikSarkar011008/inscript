"use strict";
/**
 * Parser for InScript
 * Converts tokens into an Abstract Syntax Tree (AST)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.ParseError = void 0;
const tokens_1 = require("../types/tokens");
class ParseError extends Error {
    constructor(message, token) {
        super(`Parse Error at L${token.line}:C${token.column}: ${message}`);
    }
}
exports.ParseError = ParseError;
class Parser {
    constructor(tokens) {
        this.current = 0;
        this.tokens = tokens;
    }
    /**
     * Parse tokens into AST
     */
    parse() {
        const body = [];
        while (!this.isAtEnd()) {
            const stmt = this.parseStatement();
            if (stmt) {
                body.push(stmt);
            }
        }
        return {
            type: "Program",
            body,
            line: 1,
            column: 1,
        };
    }
    /**
     * Parse a statement
     */
    parseStatement() {
        // Game declaration
        if (this.match(tokens_1.TokenType.GAME)) {
            return this.parseGameDeclaration();
        }
        // Assets declaration
        if (this.match(tokens_1.TokenType.ASSETS)) {
            return this.parseAssetDeclaration();
        }
        // Event handler
        if (this.match(tokens_1.TokenType.ON)) {
            return this.parseEventHandler();
        }
        // Variable declaration
        if (this.match(tokens_1.TokenType.LET, tokens_1.TokenType.CONST, tokens_1.TokenType.VAR)) {
            return this.parseVariableDeclaration();
        }
        // Function declaration
        if (this.match(tokens_1.TokenType.FUNC)) {
            return this.parseFunctionDeclaration();
        }
        // Class declaration
        if (this.match(tokens_1.TokenType.CLASS)) {
            return this.parseClassDeclaration();
        }
        // Block statement
        if (this.check(tokens_1.TokenType.LBRACE)) {
            return this.parseBlockStatement();
        }
        // If statement
        if (this.match(tokens_1.TokenType.IF)) {
            return this.parseIfStatement();
        }
        // Match statement
        if (this.match(tokens_1.TokenType.MATCH)) {
            return this.parseMatchStatement();
        }
        // While statement
        if (this.match(tokens_1.TokenType.WHILE)) {
            return this.parseWhileStatement();
        }
        // For statement
        if (this.match(tokens_1.TokenType.FOR)) {
            return this.parseForStatement();
        }
        // Loop statement
        if (this.match(tokens_1.TokenType.LOOP)) {
            return this.parseLoopStatement();
        }
        // Return statement
        if (this.match(tokens_1.TokenType.RETURN)) {
            return this.parseReturnStatement();
        }
        // Break statement
        if (this.match(tokens_1.TokenType.BREAK)) {
            this.consumeStatementEnd();
            return {
                type: "BreakStatement",
                line: this.previous().line,
                column: this.previous().column,
            };
        }
        // Continue statement
        if (this.match(tokens_1.TokenType.CONTINUE)) {
            this.consumeStatementEnd();
            return {
                type: "ContinueStatement",
                line: this.previous().line,
                column: this.previous().column,
            };
        }
        // Expression statement
        return this.parseExpressionStatement();
    }
    /**
     * Parse game declaration
     */
    parseGameDeclaration() {
        const start = this.previous();
        const id = this.consume(tokens_1.TokenType.IDENTIFIER, "Expected game name");
        this.consume(tokens_1.TokenType.LBRACE, "Expected '{' after game name");
        const properties = [];
        while (!this.check(tokens_1.TokenType.RBRACE) && !this.isAtEnd()) {
            const key = this.consume(tokens_1.TokenType.IDENTIFIER, "Expected property name");
            this.consume(tokens_1.TokenType.COLON, "Expected ':' after property name");
            let value;
            if (this.check(tokens_1.TokenType.STRING)) {
                const token = this.advance();
                value = {
                    type: "Literal",
                    value: token.value,
                    raw: token.value,
                    line: token.line,
                    column: token.column,
                };
            }
            else if (this.check(tokens_1.TokenType.NUMBER)) {
                const token = this.advance();
                value = {
                    type: "Literal",
                    value: Number(token.value),
                    raw: token.value,
                    line: token.line,
                    column: token.column,
                };
            }
            else if (this.check(tokens_1.TokenType.IDENTIFIER)) {
                const token = this.advance();
                value = {
                    type: "Identifier",
                    name: token.value,
                    line: token.line,
                    column: token.column,
                };
            }
            else {
                throw this.error("Expected property value");
            }
            properties.push({
                type: "GameProperty",
                key: {
                    type: "Identifier",
                    name: key.value,
                    line: key.line,
                    column: key.column,
                },
                value,
                line: key.line,
                column: key.column,
            });
        }
        this.consume(tokens_1.TokenType.RBRACE, "Expected '}' after game properties");
        return {
            type: "GameDeclaration",
            id: {
                type: "Identifier",
                name: id.value,
                line: id.line,
                column: id.column,
            },
            properties,
            line: start.line,
            column: start.column,
        };
    }
    /**
     * Parse asset declaration
     */
    parseAssetDeclaration() {
        const start = this.previous();
        this.consume(tokens_1.TokenType.LBRACE, "Expected '{' after 'assets'");
        const assets = [];
        while (!this.check(tokens_1.TokenType.RBRACE) && !this.isAtEnd()) {
            let assetType = "image";
            if (this.match(tokens_1.TokenType.IMAGE)) {
                assetType = "image";
            }
            else if (this.match(tokens_1.TokenType.AUDIO)) {
                assetType = "audio";
            }
            else if (this.match(tokens_1.TokenType.FONT)) {
                assetType = "font";
            }
            else if (this.match(tokens_1.TokenType.MODEL)) {
                assetType = "model";
            }
            else {
                throw this.error("Expected asset type (image, audio, font, model)");
            }
            const id = this.consume(tokens_1.TokenType.IDENTIFIER, "Expected asset name");
            this.consume(tokens_1.TokenType.ASSIGN, "Expected '=' after asset name");
            const value = this.consume(tokens_1.TokenType.STRING, "Expected asset path string");
            assets.push({
                type: "AssetDef",
                assetType,
                id: {
                    type: "Identifier",
                    name: id.value,
                    line: id.line,
                    column: id.column,
                },
                value: value.value,
                line: id.line,
                column: id.column,
            });
            // Optional comma
            this.match(tokens_1.TokenType.COMMA);
        }
        this.consume(tokens_1.TokenType.RBRACE, "Expected '}' after assets");
        return {
            type: "AssetDeclaration",
            assets,
            line: start.line,
            column: start.column,
        };
    }
    /**
     * Parse event handler (on init, on update, etc)
     */
    parseEventHandler() {
        const start = this.previous();
        let eventName = "init";
        const token = this.advance();
        if (token.value === "init")
            eventName = "init";
        else if (token.value === "update")
            eventName = "update";
        else if (token.value === "input")
            eventName = "input";
        else if (token.value === "render")
            eventName = "render";
        else {
            throw this.error("Expected event name (init, update, input, render)");
        }
        this.consume(tokens_1.TokenType.LPAREN, "Expected '(' after event name");
        const params = this.parseParameters();
        this.consume(tokens_1.TokenType.RPAREN, "Expected ')' after parameters");
        const body = this.parseBlockStatement();
        return {
            type: "EventHandlerDeclaration",
            event: eventName,
            params,
            body,
            line: start.line,
            column: start.column,
        };
    }
    /**
     * Parse variable declaration
     */
    parseVariableDeclaration() {
        const start = this.previous();
        const kind = start.value;
        const id = this.consume(tokens_1.TokenType.IDENTIFIER, "Expected variable name");
        let typeAnnotation;
        if (this.match(tokens_1.TokenType.COLON)) {
            typeAnnotation = this.parseTypeAnnotation();
        }
        let init;
        if (this.match(tokens_1.TokenType.ASSIGN)) {
            init = this.parseExpression();
        }
        this.consumeStatementEnd();
        return {
            type: "VariableDeclaration",
            kind,
            id: {
                type: "Identifier",
                name: id.value,
                line: id.line,
                column: id.column,
            },
            typeAnnotation,
            init,
            line: start.line,
            column: start.column,
        };
    }
    /**
     * Parse function declaration
     */
    parseFunctionDeclaration() {
        const start = this.previous();
        const id = this.consume(tokens_1.TokenType.IDENTIFIER, "Expected function name");
        this.consume(tokens_1.TokenType.LPAREN, "Expected '(' after function name");
        const params = this.parseParameters();
        this.consume(tokens_1.TokenType.RPAREN, "Expected ')' after parameters");
        let returnType;
        if (this.match(tokens_1.TokenType.DOUBLE_ARROW)) {
            returnType = this.parseTypeAnnotation();
        }
        const body = this.parseBlockStatement();
        return {
            type: "FunctionDeclaration",
            id: {
                type: "Identifier",
                name: id.value,
                line: id.line,
                column: id.column,
            },
            params,
            returnType,
            body,
            line: start.line,
            column: start.column,
        };
    }
    /**
     * Parse class declaration
     */
    parseClassDeclaration() {
        const start = this.previous();
        const id = this.consume(tokens_1.TokenType.IDENTIFIER, "Expected class name");
        let superClass;
        if (this.match(tokens_1.TokenType.EXTENDS)) {
            const superToken = this.consume(tokens_1.TokenType.IDENTIFIER, "Expected superclass name");
            superClass = {
                type: "Identifier",
                name: superToken.value,
                line: superToken.line,
                column: superToken.column,
            };
        }
        this.consume(tokens_1.TokenType.LBRACE, "Expected '{' before class body");
        const members = [];
        while (!this.check(tokens_1.TokenType.RBRACE) && !this.isAtEnd()) {
            const isPrivate = this.match(tokens_1.TokenType.PRIVATE);
            // Constructor (func new)
            if (this.match(tokens_1.TokenType.FUNC)) {
                let methodName;
                let methodToken;
                if (this.match(tokens_1.TokenType.NEW)) {
                    methodName = "new";
                    methodToken = this.previous();
                }
                else {
                    methodToken = this.consume(tokens_1.TokenType.IDENTIFIER, "Expected method name");
                    methodName = methodToken.value;
                }
                this.consume(tokens_1.TokenType.LPAREN, "Expected '(' after method name");
                const params = this.parseParameters();
                this.consume(tokens_1.TokenType.RPAREN, "Expected ')' after parameters");
                let returnType;
                if (this.match(tokens_1.TokenType.DOUBLE_ARROW)) {
                    returnType = this.parseTypeAnnotation();
                }
                const body = this.parseBlockStatement();
                members.push({
                    type: "ClassMethod",
                    key: {
                        type: "Identifier",
                        name: methodName,
                        line: methodToken.line,
                        column: methodToken.column,
                    },
                    params,
                    returnType,
                    body,
                    isPrivate,
                    isConstructor: methodName === "new",
                    line: methodToken.line,
                    column: methodToken.column,
                });
            }
            // Property
            else if (this.check(tokens_1.TokenType.IDENTIFIER)) {
                const propToken = this.advance();
                let typeAnnotation;
                if (this.match(tokens_1.TokenType.COLON)) {
                    typeAnnotation = this.parseTypeAnnotation();
                }
                let value;
                if (this.match(tokens_1.TokenType.ASSIGN)) {
                    value = this.parseExpression();
                }
                members.push({
                    type: "ClassProperty",
                    key: {
                        type: "Identifier",
                        name: propToken.value,
                        line: propToken.line,
                        column: propToken.column,
                    },
                    typeAnnotation,
                    value,
                    line: propToken.line,
                    column: propToken.column,
                });
            }
            else {
                throw this.error("Expected method or property in class");
            }
        }
        this.consume(tokens_1.TokenType.RBRACE, "Expected '}' after class body");
        return {
            type: "ClassDeclaration",
            id: {
                type: "Identifier",
                name: id.value,
                line: id.line,
                column: id.column,
            },
            superClass,
            body: {
                type: "ClassBody",
                members,
                line: start.line,
                column: start.column,
            },
            line: start.line,
            column: start.column,
        };
    }
    /**
     * Parse block statement
     */
    parseBlockStatement() {
        const start = this.consume(tokens_1.TokenType.LBRACE, "Expected '{'");
        const body = [];
        while (!this.check(tokens_1.TokenType.RBRACE) && !this.isAtEnd()) {
            const stmt = this.parseStatement();
            if (stmt) {
                body.push(stmt);
            }
        }
        this.consume(tokens_1.TokenType.RBRACE, "Expected '}'");
        return {
            type: "BlockStatement",
            body,
            line: start.line,
            column: start.column,
        };
    }
    /**
     * Parse if statement
     */
    parseIfStatement() {
        const start = this.previous();
        // Parentheses are optional in InScript
        const hasParens = this.match(tokens_1.TokenType.LPAREN);
        const test = this.parseExpression();
        if (hasParens) {
            this.consume(tokens_1.TokenType.RPAREN, "Expected ')' after if condition");
        }
        const consequent = this.parseStatement() || {
            type: "BlockStatement",
            body: [],
            line: start.line,
            column: start.column,
        };
        let alternate;
        if (this.match(tokens_1.TokenType.ELSE)) {
            alternate = this.parseStatement() || {
                type: "BlockStatement",
                body: [],
                line: start.line,
                column: start.column,
            };
        }
        return {
            type: "IfStatement",
            test,
            consequent,
            alternate,
            line: start.line,
            column: start.column,
        };
    }
    /**
     * Parse match statement
     */
    parseMatchStatement() {
        const start = this.previous();
        const discriminant = this.parseExpression();
        this.consume(tokens_1.TokenType.LBRACE, "Expected '{' after match expression");
        const cases = [];
        while (!this.check(tokens_1.TokenType.RBRACE) && !this.isAtEnd()) {
            if (this.match(tokens_1.TokenType.DEFAULT)) {
                this.consume(tokens_1.TokenType.ARROW, "Expected '=>' after 'default'");
                const consequent = this.parseStatement() || {
                    type: "BlockStatement",
                    body: [],
                    line: this.current,
                    column: 0,
                };
                cases.push({
                    type: "MatchCase",
                    test: null,
                    consequent,
                    line: start.line,
                    column: start.column,
                });
            }
            else {
                const test = this.parseExpression();
                this.consume(tokens_1.TokenType.ARROW, "Expected '=>' after case expression");
                const consequent = this.parseStatement() || {
                    type: "BlockStatement",
                    body: [],
                    line: this.current,
                    column: 0,
                };
                cases.push({
                    type: "MatchCase",
                    test,
                    consequent,
                    line: start.line,
                    column: start.column,
                });
            }
        }
        this.consume(tokens_1.TokenType.RBRACE, "Expected '}' after match cases");
        return {
            type: "MatchStatement",
            discriminant,
            cases,
            line: start.line,
            column: start.column,
        };
    }
    /**
     * Parse while statement
     */
    parseWhileStatement() {
        const start = this.previous();
        // Parentheses are optional
        const hasParens = this.match(tokens_1.TokenType.LPAREN);
        const test = this.parseExpression();
        if (hasParens) {
            this.consume(tokens_1.TokenType.RPAREN, "Expected ')' after while condition");
        }
        const body = this.parseStatement() || {
            type: "BlockStatement",
            body: [],
            line: start.line,
            column: start.column,
        };
        return {
            type: "WhileStatement",
            test,
            body,
            line: start.line,
            column: start.column,
        };
    }
    /**
     * Parse for statement
     */
    parseForStatement() {
        const start = this.previous();
        const id = this.consume(tokens_1.TokenType.IDENTIFIER, "Expected variable name in for loop");
        this.consume(tokens_1.TokenType.IN, "Expected 'in' after variable in for loop");
        const right = this.parseExpression();
        const body = this.parseStatement() || {
            type: "BlockStatement",
            body: [],
            line: start.line,
            column: start.column,
        };
        return {
            type: "ForStatement",
            left: {
                type: "Identifier",
                name: id.value,
                line: id.line,
                column: id.column,
            },
            right,
            body,
            line: start.line,
            column: start.column,
        };
    }
    /**
     * Parse loop statement
     */
    parseLoopStatement() {
        const start = this.previous();
        const body = this.parseStatement() || {
            type: "BlockStatement",
            body: [],
            line: start.line,
            column: start.column,
        };
        return {
            type: "LoopStatement",
            body,
            line: start.line,
            column: start.column,
        };
    }
    /**
     * Parse return statement
     */
    parseReturnStatement() {
        const start = this.previous();
        let argument;
        if (!this.check(tokens_1.TokenType.SEMICOLON) && !this.isAtEnd() && !this.check(tokens_1.TokenType.RBRACE)) {
            argument = this.parseExpression();
        }
        this.consumeStatementEnd();
        return {
            type: "ReturnStatement",
            argument,
            line: start.line,
            column: start.column,
        };
    }
    /**
     * Parse expression statement
     */
    parseExpressionStatement() {
        const expr = this.parseExpression();
        this.consumeStatementEnd();
        return {
            type: "ExpressionStatement",
            expression: expr,
            line: expr.line,
            column: expr.column,
        };
    }
    /**
     * Parse expression (assignment is lowest precedence)
     */
    parseExpression() {
        return this.parseAssignment();
    }
    /**
     * Parse assignment expression
     */
    parseAssignment() {
        let expr = this.parseTernary();
        if (this.match(tokens_1.TokenType.ASSIGN, tokens_1.TokenType.PLUS_ASSIGN, tokens_1.TokenType.MINUS_ASSIGN, tokens_1.TokenType.MULTIPLY_ASSIGN, tokens_1.TokenType.DIVIDE_ASSIGN, tokens_1.TokenType.MODULO_ASSIGN)) {
            const op = this.previous();
            const right = this.parseAssignment();
            return {
                type: "AssignmentExpression",
                left: expr,
                operator: op.value,
                right,
                line: expr.line,
                column: expr.column,
            };
        }
        return expr;
    }
    /**
     * Parse ternary expression (? :)
     */
    parseTernary() {
        let expr = this.parseOr();
        if (this.match(tokens_1.TokenType.QUESTION)) {
            const consequent = this.parseExpression();
            this.consume(tokens_1.TokenType.COLON, "Expected ':' in ternary expression");
            const alternate = this.parseExpression();
            return {
                type: "ConditionalExpression",
                test: expr,
                consequent,
                alternate,
                line: expr.line,
                column: expr.column,
            };
        }
        return expr;
    }
    /**
     * Parse logical OR
     */
    parseOr() {
        let expr = this.parseAnd();
        while (this.match(tokens_1.TokenType.OR)) {
            const op = this.previous();
            const right = this.parseAnd();
            expr = {
                type: "BinaryExpression",
                left: expr,
                operator: "||",
                right,
                line: expr.line,
                column: expr.column,
            };
        }
        return expr;
    }
    /**
     * Parse logical AND
     */
    parseAnd() {
        let expr = this.parseEquality();
        while (this.match(tokens_1.TokenType.AND)) {
            const right = this.parseEquality();
            expr = {
                type: "BinaryExpression",
                left: expr,
                operator: "&&",
                right,
                line: expr.line,
                column: expr.column,
            };
        }
        return expr;
    }
    /**
     * Parse equality
     */
    parseEquality() {
        let expr = this.parseComparison();
        while (this.match(tokens_1.TokenType.EQUAL, tokens_1.TokenType.NOT_EQUAL)) {
            const op = this.previous();
            const right = this.parseComparison();
            expr = {
                type: "BinaryExpression",
                left: expr,
                operator: op.value,
                right,
                line: expr.line,
                column: expr.column,
            };
        }
        return expr;
    }
    /**
     * Parse comparison
     */
    parseComparison() {
        let expr = this.parseAdditive();
        while (this.match(tokens_1.TokenType.LESS, tokens_1.TokenType.LESS_EQUAL, tokens_1.TokenType.GREATER, tokens_1.TokenType.GREATER_EQUAL, tokens_1.TokenType.IN)) {
            const op = this.previous();
            const right = this.parseAdditive();
            expr = {
                type: "BinaryExpression",
                left: expr,
                operator: op.value,
                right,
                line: expr.line,
                column: expr.column,
            };
        }
        return expr;
    }
    /**
     * Parse addition and subtraction
     */
    parseAdditive() {
        let expr = this.parseMultiplicative();
        while (this.match(tokens_1.TokenType.PLUS, tokens_1.TokenType.MINUS)) {
            const op = this.previous();
            const right = this.parseMultiplicative();
            expr = {
                type: "BinaryExpression",
                left: expr,
                operator: op.value,
                right,
                line: expr.line,
                column: expr.column,
            };
        }
        return expr;
    }
    /**
     * Parse multiplication, division, modulo
     */
    parseMultiplicative() {
        let expr = this.parseUnary();
        while (this.match(tokens_1.TokenType.MULTIPLY, tokens_1.TokenType.DIVIDE, tokens_1.TokenType.MODULO)) {
            const op = this.previous();
            const right = this.parseUnary();
            expr = {
                type: "BinaryExpression",
                left: expr,
                operator: op.value,
                right,
                line: expr.line,
                column: expr.column,
            };
        }
        return expr;
    }
    /**
     * Parse unary expressions
     */
    parseUnary() {
        if (this.match(tokens_1.TokenType.NOT, tokens_1.TokenType.MINUS, tokens_1.TokenType.PLUS)) {
            const op = this.previous();
            const expr = this.parseUnary();
            return {
                type: "UnaryExpression",
                operator: op.value,
                argument: expr,
                prefix: true,
                line: op.line,
                column: op.column,
            };
        }
        return this.parsePostfix();
    }
    /**
     * Parse postfix expressions (member access, function calls)
     */
    parsePostfix() {
        let expr = this.parsePrimary();
        while (true) {
            if (this.match(tokens_1.TokenType.LPAREN)) {
                const args = this.parseArguments();
                this.consume(tokens_1.TokenType.RPAREN, "Expected ')' after arguments");
                expr = {
                    type: "CallExpression",
                    callee: expr,
                    arguments: args,
                    line: expr.line,
                    column: expr.column,
                };
            }
            else if (this.match(tokens_1.TokenType.DOT)) {
                const prop = this.consume(tokens_1.TokenType.IDENTIFIER, "Expected property name after '.'");
                expr = {
                    type: "MemberExpression",
                    object: expr,
                    property: {
                        type: "Identifier",
                        name: prop.value,
                        line: prop.line,
                        column: prop.column,
                    },
                    computed: false,
                    line: expr.line,
                    column: expr.column,
                };
            }
            else if (this.match(tokens_1.TokenType.LBRACKET)) {
                const index = this.parseExpression();
                this.consume(tokens_1.TokenType.RBRACKET, "Expected ']' after index");
                expr = {
                    type: "MemberExpression",
                    object: expr,
                    property: index,
                    computed: true,
                    line: expr.line,
                    column: expr.column,
                };
            }
            else {
                break;
            }
        }
        return expr;
    }
    /**
     * Parse primary expressions
     */
    parsePrimary() {
        // Literals
        if (this.match(tokens_1.TokenType.TRUE)) {
            const token = this.previous();
            return {
                type: "Literal",
                value: true,
                raw: "true",
                line: token.line,
                column: token.column,
            };
        }
        if (this.match(tokens_1.TokenType.FALSE)) {
            const token = this.previous();
            return {
                type: "Literal",
                value: false,
                raw: "false",
                line: token.line,
                column: token.column,
            };
        }
        if (this.match(tokens_1.TokenType.NULL)) {
            const token = this.previous();
            return {
                type: "Literal",
                value: null,
                raw: "null",
                line: token.line,
                column: token.column,
            };
        }
        if (this.match(tokens_1.TokenType.NUMBER)) {
            const token = this.previous();
            return {
                type: "Literal",
                value: Number(token.value),
                raw: token.value,
                line: token.line,
                column: token.column,
            };
        }
        if (this.match(tokens_1.TokenType.STRING)) {
            const token = this.previous();
            return {
                type: "Literal",
                value: token.value,
                raw: token.value,
                line: token.line,
                column: token.column,
            };
        }
        // Identifier
        if (this.match(tokens_1.TokenType.IDENTIFIER)) {
            const token = this.previous();
            return {
                type: "Identifier",
                name: token.value,
                line: token.line,
                column: token.column,
            };
        }
        // This
        if (this.match(tokens_1.TokenType.THIS)) {
            const token = this.previous();
            return {
                type: "ThisExpression",
                line: token.line,
                column: token.column,
            };
        }
        // Array literal
        if (this.match(tokens_1.TokenType.LBRACKET)) {
            const start = this.previous();
            const elements = [];
            while (!this.check(tokens_1.TokenType.RBRACKET) && !this.isAtEnd()) {
                elements.push(this.parseExpression());
                if (!this.match(tokens_1.TokenType.COMMA))
                    break;
            }
            this.consume(tokens_1.TokenType.RBRACKET, "Expected ']' after array elements");
            return {
                type: "ArrayExpression",
                elements,
                line: start.line,
                column: start.column,
            };
        }
        // Object literal
        if (this.match(tokens_1.TokenType.LBRACE)) {
            const start = this.previous();
            const properties = [];
            while (!this.check(tokens_1.TokenType.RBRACE) && !this.isAtEnd()) {
                let key;
                let computed = false;
                if (this.match(tokens_1.TokenType.LBRACKET)) {
                    const expr = this.parseExpression();
                    this.consume(tokens_1.TokenType.RBRACKET, "Expected ']' after computed property");
                    key = expr;
                    computed = true;
                }
                else {
                    const token = this.consume(tokens_1.TokenType.IDENTIFIER, "Expected property key");
                    key = {
                        type: "Identifier",
                        name: token.value,
                        line: token.line,
                        column: token.column,
                    };
                }
                this.consume(tokens_1.TokenType.COLON, "Expected ':' after property key");
                const value = this.parseExpression();
                properties.push({
                    type: "ObjectProperty",
                    key,
                    value,
                    computed,
                    line: key.line,
                    column: key.column,
                });
                if (!this.match(tokens_1.TokenType.COMMA))
                    break;
            }
            this.consume(tokens_1.TokenType.RBRACE, "Expected '}' after object properties");
            return {
                type: "ObjectExpression",
                properties,
                line: start.line,
                column: start.column,
            };
        }
        // Grouped expression or function expression
        if (this.match(tokens_1.TokenType.LPAREN)) {
            const start = this.previous();
            const expr = this.parseExpression();
            this.consume(tokens_1.TokenType.RPAREN, "Expected ')' after expression");
            return expr;
        }
        // Lambda/Function expression
        if (this.match(tokens_1.TokenType.FN)) {
            return this.parseFunctionExpression();
        }
        // New expression
        if (this.match(tokens_1.TokenType.NEW)) {
            const start = this.previous();
            const callee = this.parsePrimary();
            let args = [];
            if (this.match(tokens_1.TokenType.LPAREN)) {
                args = this.parseArguments();
                this.consume(tokens_1.TokenType.RPAREN, "Expected ')' after constructor arguments");
            }
            return {
                type: "NewExpression",
                callee,
                arguments: args,
                line: start.line,
                column: start.column,
            };
        }
        throw this.error("Expected expression");
    }
    /**
     * Parse function expression
     */
    parseFunctionExpression() {
        const start = this.previous();
        this.consume(tokens_1.TokenType.LPAREN, "Expected '(' after 'fn'");
        const params = this.parseParameters();
        this.consume(tokens_1.TokenType.RPAREN, "Expected ')' after parameters");
        const body = this.parseBlockStatement();
        return {
            type: "FunctionExpression",
            params,
            body,
            line: start.line,
            column: start.column,
        };
    }
    /**
     * Parse function parameters
     */
    parseParameters() {
        const params = [];
        while (!this.check(tokens_1.TokenType.RPAREN) && !this.isAtEnd()) {
            let rest = false;
            if (this.match(tokens_1.TokenType.DOT, tokens_1.TokenType.DOT, tokens_1.TokenType.DOT)) {
                rest = true;
            }
            const id = this.consume(tokens_1.TokenType.IDENTIFIER, "Expected parameter name");
            let typeAnnotation;
            if (this.match(tokens_1.TokenType.COLON)) {
                typeAnnotation = this.parseTypeAnnotation();
            }
            let defaultValue;
            if (this.match(tokens_1.TokenType.ASSIGN)) {
                defaultValue = this.parseExpression();
            }
            params.push({
                type: "Parameter",
                id: {
                    type: "Identifier",
                    name: id.value,
                    line: id.line,
                    column: id.column,
                },
                typeAnnotation,
                default: defaultValue,
                rest,
                line: id.line,
                column: id.column,
            });
            if (!this.match(tokens_1.TokenType.COMMA))
                break;
        }
        return params;
    }
    /**
     * Parse type annotation
     */
    parseTypeAnnotation() {
        const start = this.peek();
        if (this.match(tokens_1.TokenType.IDENTIFIER)) {
            const token = this.previous();
            const name = token.value;
            if (name === "number" || name === "text" || name === "bool" || name === "null") {
                return {
                    type: "PrimitiveType",
                    name: name,
                    line: token.line,
                    column: token.column,
                };
            }
            else {
                return {
                    type: "IdentifierType",
                    name,
                    line: token.line,
                    column: token.column,
                };
            }
        }
        throw this.error("Expected type annotation");
    }
    /**
     * Parse function arguments
     */
    parseArguments() {
        const args = [];
        while (!this.check(tokens_1.TokenType.RPAREN) && !this.isAtEnd()) {
            args.push(this.parseExpression());
            if (!this.match(tokens_1.TokenType.COMMA))
                break;
        }
        return args;
    }
    /**
     * Helper: check if current token is of given type
     */
    check(type) {
        if (this.isAtEnd())
            return false;
        return this.peek().type === type;
    }
    /**
     * Helper: match one or more token types
     */
    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    /**
     * Helper: consume a token or throw error
     */
    consume(type, message) {
        if (this.check(type)) {
            return this.advance();
        }
        throw this.error(message);
    }
    /**
     * Helper: advance to next token
     */
    advance() {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    }
    /**
     * Helper: get current token
     */
    peek() {
        return this.tokens[this.current];
    }
    /**
     * Helper: get next token
     */
    peekNext() {
        if (this.current + 1 >= this.tokens.length)
            return null;
        return this.tokens[this.current + 1];
    }
    /**
     * Helper: get previous token
     */
    previous() {
        return this.tokens[this.current - 1];
    }
    /**
     * Helper: check if at end of tokens
     */
    isAtEnd() {
        return this.peek().type === tokens_1.TokenType.EOF;
    }
    /**
     * Helper: consume statement end (semicolon or newline or brace)
     */
    consumeStatementEnd() {
        if (this.check(tokens_1.TokenType.SEMICOLON) ||
            this.check(tokens_1.TokenType.RBRACE) ||
            this.check(tokens_1.TokenType.EOF)) {
            this.match(tokens_1.TokenType.SEMICOLON);
        }
    }
    /**
     * Helper: create error
     */
    error(message) {
        return new ParseError(message, this.peek());
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map