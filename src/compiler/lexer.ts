/**
 * Lexer for InScript
 * Converts source code into a stream of tokens
 */

import { Token, TokenType, KEYWORDS } from "../types/tokens";

export class Lexer {
  private source: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];

  constructor(source: string) {
    this.source = source;
  }

  /**
   * Main entry point for tokenization
   */
  public tokenize(): Token[] {
    while (this.position < this.source.length) {
      this.skipWhitespaceAndComments();

      if (this.position >= this.source.length) break;

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
        this.addToken(TokenType.ERROR, char);
        this.advance();
      }
    }

    this.addToken(TokenType.EOF, "");
    return this.tokens;
  }

  /**
   * Skip whitespace and comments
   */
  private skipWhitespaceAndComments(): void {
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
        while (
          this.position < this.source.length &&
          this.peek() !== "\n"
        ) {
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
      } else {
        break;
      }
    }
  }

  /**
   * Read an identifier or keyword
   */
  private readIdentifierOrKeyword(): void {
    const start = this.position;
    const startColumn = this.column;

    while (
      this.position < this.source.length &&
      (this.isLetter(this.peek()) ||
        this.isDigit(this.peek()) ||
        this.peek() === "_")
    ) {
      this.advance();
    }

    const value = this.source.substring(start, this.position);
    const tokenType = KEYWORDS.get(value) || TokenType.IDENTIFIER;

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
  private readNumber(): void {
    const start = this.position;
    const startColumn = this.column;

    // Integer part
    while (this.position < this.source.length && this.isDigit(this.peek())) {
      this.advance();
    }

    // Decimal part
    if (
      this.peek() === "." &&
      this.isDigit(this.peekNext())
    ) {
      this.advance(); // .
      while (
        this.position < this.source.length &&
        this.isDigit(this.peek())
      ) {
        this.advance();
      }
    }

    const value = this.source.substring(start, this.position);
    this.tokens.push({
      type: TokenType.NUMBER,
      value: value,
      line: this.line,
      column: startColumn,
      length: value.length,
    });
  }

  /**
   * Read a string literal
   */
  private readString(): void {
    const quote = this.peek();
    const startColumn = this.column;
    this.advance(); // Opening quote

    let value = "";

    while (this.position < this.source.length && this.peek() !== quote) {
      if (this.peek() === "\\") {
        this.advance();
        if (this.position >= this.source.length) break;

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
      } else {
        value += this.peek();
        this.advance();
      }
    }

    if (this.peek() === quote) {
      this.advance(); // Closing quote
    }

    this.tokens.push({
      type: TokenType.STRING,
      value: value,
      line: this.line,
      column: startColumn,
      length: value.length + 2,
    });
  }

  /**
   * Read operators and punctuation
   */
  private readOperator(): boolean {
    const char = this.peek();
    const next = this.peekNext();
    const startColumn = this.column;

    // Three-character operators
    if (char === "." && next === "." && this.source[this.position + 2] === ".") {
      this.advance();
      this.advance();
      this.advance();
      this.addToken(TokenType.RANGE_EXCLUSIVE, "...");
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
  private getTwoCharToken(twoChar: string): TokenType | null {
    const map: { [key: string]: TokenType } = {
      "==": TokenType.EQUAL,
      "!=": TokenType.NOT_EQUAL,
      "<=": TokenType.LESS_EQUAL,
      ">=": TokenType.GREATER_EQUAL,
      "&&": TokenType.AND,
      "||": TokenType.OR,
      "+=": TokenType.PLUS_ASSIGN,
      "-=": TokenType.MINUS_ASSIGN,
      "*=": TokenType.MULTIPLY_ASSIGN,
      "/=": TokenType.DIVIDE_ASSIGN,
      "%=": TokenType.MODULO_ASSIGN,
      "..": TokenType.RANGE,
      "=>": TokenType.ARROW,
      "->": TokenType.DOUBLE_ARROW,
    };
    return map[twoChar] || null;
  }

  /**
   * Get token type for single-character operators
   */
  private getSingleCharToken(char: string): TokenType | null {
    const map: { [key: string]: TokenType } = {
      "+": TokenType.PLUS,
      "-": TokenType.MINUS,
      "*": TokenType.MULTIPLY,
      "/": TokenType.DIVIDE,
      "%": TokenType.MODULO,
      "=": TokenType.ASSIGN,
      "<": TokenType.LESS,
      ">": TokenType.GREATER,
      "!": TokenType.NOT,
      "(": TokenType.LPAREN,
      ")": TokenType.RPAREN,
      "{": TokenType.LBRACE,
      "}": TokenType.RBRACE,
      "[": TokenType.LBRACKET,
      "]": TokenType.RBRACKET,
      ";": TokenType.SEMICOLON,
      ",": TokenType.COMMA,
      ".": TokenType.DOT,
      ":": TokenType.COLON,
      "?": TokenType.QUESTION,
    };
    return map[char] || null;
  }

  /**
   * Helper: peek at current character
   */
  private peek(): string {
    if (this.position >= this.source.length) return "\0";
    return this.source[this.position];
  }

  /**
   * Helper: peek at next character
   */
  private peekNext(): string {
    if (this.position + 1 >= this.source.length) return "\0";
    return this.source[this.position + 1];
  }

  /**
   * Helper: advance position
   */
  private advance(): void {
    if (this.position < this.source.length) {
      if (this.source[this.position] === "\n") {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.position++;
    }
  }

  /**
   * Helper: check if character is a letter
   */
  private isLetter(char: string): boolean {
    return /[a-zA-Z]/.test(char);
  }

  /**
   * Helper: check if character is a digit
   */
  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }

  /**
   * Helper: add token
   */
  private addToken(type: TokenType, value: string): void {
    this.tokens.push({
      type: type,
      value: value,
      line: this.line,
      column: this.column,
      length: value.length,
    });
  }
}
