/**
 * Lexer for InScript
 * Converts source code into a stream of tokens
 */
import { Token } from "../types/tokens";
export declare class Lexer {
    private source;
    private position;
    private line;
    private column;
    private tokens;
    constructor(source: string);
    /**
     * Main entry point for tokenization
     */
    tokenize(): Token[];
    /**
     * Skip whitespace and comments
     */
    private skipWhitespaceAndComments;
    /**
     * Read an identifier or keyword
     */
    private readIdentifierOrKeyword;
    /**
     * Read a number literal
     */
    private readNumber;
    /**
     * Read a string literal
     */
    private readString;
    /**
     * Read operators and punctuation
     */
    private readOperator;
    /**
     * Get token type for two-character operators
     */
    private getTwoCharToken;
    /**
     * Get token type for single-character operators
     */
    private getSingleCharToken;
    /**
     * Helper: peek at current character
     */
    private peek;
    /**
     * Helper: peek at next character
     */
    private peekNext;
    /**
     * Helper: advance position
     */
    private advance;
    /**
     * Helper: check if character is a letter
     */
    private isLetter;
    /**
     * Helper: check if character is a digit
     */
    private isDigit;
    /**
     * Helper: add token
     */
    private addToken;
}
//# sourceMappingURL=lexer.d.ts.map