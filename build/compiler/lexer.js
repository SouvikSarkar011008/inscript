"use strict";
/**
 * Lexer for InScript
 * Converts source code into a stream of tokens
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
const tokens_1 = require("../types/tokens");
class Lexer {
    constructor(source) {
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
        this.source = source;
    }
    /**
     * Main entry point for tokenization
     */
    tokenize() {
        while (this.position < this.source.length) {
            this.skipWhitespaceAndComments();
            if (this.position >= this.source.length)
                break;
            const char = this.peek();
            // Identifiers and keywords
            if (this.isLetter(char) || char === "_") {
                this.readIdentifierOrKeyword();
            }
            // Numbers
            else if (this.isDigit(char)) {
                this.readNumber();
            }
            // Strings
            else if (char === '"' || char === "'") {
                this.readString();
            }
            // Operators and punctuation
            else if (!this.readOperator()) {
                this.addToken(tokens_1.TokenType.ERROR, char);
                this.advance();
            }
        }
        this.addToken(tokens_1.TokenType.EOF, "");
        return this.tokens;
    }
    /**
     * Skip whitespace and comments
     */
    skipWhitespaceAndComments() {
        while (this.position < this.source.length) {
            const char = this.peek();
            // Whitespace
            if (char === " " || char === "\t" || char === "\r") {
                this.advance();
            }
            // Newline
            else if (char === "\n") {
                this.advance();
            }
            // Line comment
            else if (char === "/" && this.peekNext() === "/") {
                this.advance(); // /
                this.advance(); // /
                while (this.position < this.source.length &&
                    this.peek() !== "\n") {
                    this.advance();
                }
            }
            // Block comment
            else if (char === "/" && this.peekNext() === "*") {
                this.advance(); // /
                this.advance(); // *
                while (this.position < this.source.length) {
                    if (this.peek() === "*" && this.peekNext() === "/") {
                        this.advance(); // *
                        this.advance(); // /
                        break;
                    }
                    this.advance();
                }
            }
            else {
                break;
            }
        }
    }
    /**
     * Read an identifier or keyword
     */
    readIdentifierOrKeyword() {
        const start = this.position;
        const startColumn = this.column;
        while (this.position < this.source.length &&
            (this.isLetter(this.peek()) ||
                this.isDigit(this.peek()) ||
                this.peek() === "_")) {
            this.advance();
        }
        const value = this.source.substring(start, this.position);
        const tokenType = tokens_1.KEYWORDS.get(value) || tokens_1.TokenType.IDENTIFIER;
        this.tokens.push({
            type: tokenType,
            value: value,
            line: this.line,
            column: startColumn,
            length: value.length,
        });
    }
    /**
     * Read a number literal
     */
    readNumber() {
        const start = this.position;
        const startColumn = this.column;
        // Integer part
        while (this.position < this.source.length && this.isDigit(this.peek())) {
            this.advance();
        }
        // Decimal part
        if (this.peek() === "." &&
            this.isDigit(this.peekNext())) {
            this.advance(); // .
            while (this.position < this.source.length &&
                this.isDigit(this.peek())) {
                this.advance();
            }
        }
        const value = this.source.substring(start, this.position);
        this.tokens.push({
            type: tokens_1.TokenType.NUMBER,
            value: value,
            line: this.line,
            column: startColumn,
            length: value.length,
        });
    }
    /**
     * Read a string literal
     */
    readString() {
        const quote = this.peek();
        const startColumn = this.column;
        this.advance(); // Opening quote
        let value = "";
        while (this.position < this.source.length && this.peek() !== quote) {
            if (this.peek() === "\\") {
                this.advance();
                if (this.position >= this.source.length)
                    break;
                const escaped = this.peek();
                switch (escaped) {
                    case "n":
                        value += "\n";
                        break;
                    case "t":
                        value += "\t";
                        break;
                    case "r":
                        value += "\r";
                        break;
                    case '"':
                        value += '"';
                        break;
                    case "'":
                        value += "'";
                        break;
                    case "\\":
                        value += "\\";
                        break;
                    default:
                        value += escaped;
                }
                this.advance();
            }
            else {
                value += this.peek();
                this.advance();
            }
        }
        if (this.peek() === quote) {
            this.advance(); // Closing quote
        }
        this.tokens.push({
            type: tokens_1.TokenType.STRING,
            value: value,
            line: this.line,
            column: startColumn,
            length: value.length + 2,
        });
    }
    /**
     * Read operators and punctuation
     */
    readOperator() {
        const char = this.peek();
        const next = this.peekNext();
        const startColumn = this.column;
        // Three-character operators
        if (char === "." && next === "." && this.source[this.position + 2] === ".") {
            this.advance();
            this.advance();
            this.advance();
            this.addToken(tokens_1.TokenType.RANGE_EXCLUSIVE, "...");
            return true;
        }
        // Two-character operators
        const twoChar = char + next;
        const twoCharToken = this.getTwoCharToken(twoChar);
        if (twoCharToken) {
            this.advance();
            this.advance();
            this.addToken(twoCharToken, twoChar);
            return true;
        }
        // Single-character operators
        const singleCharToken = this.getSingleCharToken(char);
        if (singleCharToken) {
            this.advance();
            this.addToken(singleCharToken, char);
            return true;
        }
        return false;
    }
    /**
     * Get token type for two-character operators
     */
    getTwoCharToken(twoChar) {
        const map = {
            "==": tokens_1.TokenType.EQUAL,
            "!=": tokens_1.TokenType.NOT_EQUAL,
            "<=": tokens_1.TokenType.LESS_EQUAL,
            ">=": tokens_1.TokenType.GREATER_EQUAL,
            "&&": tokens_1.TokenType.AND,
            "||": tokens_1.TokenType.OR,
            "+=": tokens_1.TokenType.PLUS_ASSIGN,
            "-=": tokens_1.TokenType.MINUS_ASSIGN,
            "*=": tokens_1.TokenType.MULTIPLY_ASSIGN,
            "/=": tokens_1.TokenType.DIVIDE_ASSIGN,
            "%=": tokens_1.TokenType.MODULO_ASSIGN,
            "..": tokens_1.TokenType.RANGE,
            "=>": tokens_1.TokenType.ARROW,
            "->": tokens_1.TokenType.DOUBLE_ARROW,
        };
        return map[twoChar] || null;
    }
    /**
     * Get token type for single-character operators
     */
    getSingleCharToken(char) {
        const map = {
            "+": tokens_1.TokenType.PLUS,
            "-": tokens_1.TokenType.MINUS,
            "*": tokens_1.TokenType.MULTIPLY,
            "/": tokens_1.TokenType.DIVIDE,
            "%": tokens_1.TokenType.MODULO,
            "=": tokens_1.TokenType.ASSIGN,
            "<": tokens_1.TokenType.LESS,
            ">": tokens_1.TokenType.GREATER,
            "!": tokens_1.TokenType.NOT,
            "(": tokens_1.TokenType.LPAREN,
            ")": tokens_1.TokenType.RPAREN,
            "{": tokens_1.TokenType.LBRACE,
            "}": tokens_1.TokenType.RBRACE,
            "[": tokens_1.TokenType.LBRACKET,
            "]": tokens_1.TokenType.RBRACKET,
            ";": tokens_1.TokenType.SEMICOLON,
            ",": tokens_1.TokenType.COMMA,
            ".": tokens_1.TokenType.DOT,
            ":": tokens_1.TokenType.COLON,
            "?": tokens_1.TokenType.QUESTION,
        };
        return map[char] || null;
    }
    /**
     * Helper: peek at current character
     */
    peek() {
        if (this.position >= this.source.length)
            return "\0";
        return this.source[this.position];
    }
    /**
     * Helper: peek at next character
     */
    peekNext() {
        if (this.position + 1 >= this.source.length)
            return "\0";
        return this.source[this.position + 1];
    }
    /**
     * Helper: advance position
     */
    advance() {
        if (this.position < this.source.length) {
            if (this.source[this.position] === "\n") {
                this.line++;
                this.column = 1;
            }
            else {
                this.column++;
            }
            this.position++;
        }
    }
    /**
     * Helper: check if character is a letter
     */
    isLetter(char) {
        return /[a-zA-Z]/.test(char);
    }
    /**
     * Helper: check if character is a digit
     */
    isDigit(char) {
        return /[0-9]/.test(char);
    }
    /**
     * Helper: add token
     */
    addToken(type, value) {
        this.tokens.push({
            type: type,
            value: value,
            line: this.line,
            column: this.column,
            length: value.length,
        });
    }
}
exports.Lexer = Lexer;
//# sourceMappingURL=lexer.js.map