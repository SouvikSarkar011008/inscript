/**
 * Token types for the InScript lexer
 */
export declare enum TokenType {
    NUMBER = "NUMBER",
    STRING = "STRING",
    IDENTIFIER = "IDENTIFIER",
    LET = "LET",
    CONST = "CONST",
    VAR = "VAR",
    FUNCTION = "FUNCTION",
    FUNC = "FUNC",
    CLASS = "CLASS",
    EXTENDS = "EXTENDS",
    NEW = "NEW",
    THIS = "THIS",
    SUPER = "SUPER",
    RETURN = "RETURN",
    IF = "IF",
    ELSE = "ELSE",
    MATCH = "MATCH",
    WHILE = "WHILE",
    FOR = "FOR",
    IN = "IN",
    LOOP = "LOOP",
    BREAK = "BREAK",
    CONTINUE = "CONTINUE",
    TRUE = "TRUE",
    FALSE = "FALSE",
    NULL = "NULL",
    ON = "ON",
    GAME = "GAME",
    ASSETS = "ASSETS",
    IMAGE = "IMAGE",
    AUDIO = "AUDIO",
    FONT = "FONT",
    MODEL = "MODEL",
    PRIVATE = "PRIVATE",
    FN = "FN",
    DEFAULT = "DEFAULT",
    PLUS = "PLUS",
    MINUS = "MINUS",
    MULTIPLY = "MULTIPLY",
    DIVIDE = "DIVIDE",
    MODULO = "MODULO",
    ASSIGN = "ASSIGN",
    PLUS_ASSIGN = "PLUS_ASSIGN",
    MINUS_ASSIGN = "MINUS_ASSIGN",
    MULTIPLY_ASSIGN = "MULTIPLY_ASSIGN",
    DIVIDE_ASSIGN = "DIVIDE_ASSIGN",
    MODULO_ASSIGN = "MODULO_ASSIGN",
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    LESS = "LESS",
    LESS_EQUAL = "LESS_EQUAL",
    GREATER = "GREATER",
    GREATER_EQUAL = "GREATER_EQUAL",
    AND = "AND",
    OR = "OR",
    NOT = "NOT",
    LPAREN = "LPAREN",// (
    RPAREN = "RPAREN",// )
    LBRACE = "LBRACE",// {
    RBRACE = "RBRACE",// }
    LBRACKET = "LBRACKET",// [
    RBRACKET = "RBRACKET",// ]
    SEMICOLON = "SEMICOLON",// ;
    COMMA = "COMMA",// ,
    DOT = "DOT",// .
    COLON = "COLON",// :
    ARROW = "ARROW",// =>
    RANGE = "RANGE",// ..
    RANGE_EXCLUSIVE = "RANGE_EXCLUSIVE",// ...
    QUESTION = "QUESTION",// ?
    DOUBLE_ARROW = "DOUBLE_ARROW",// ->
    EOF = "EOF",
    NEWLINE = "NEWLINE",
    ERROR = "ERROR"
}
export interface Token {
    type: TokenType;
    value: string;
    line: number;
    column: number;
    length: number;
}
export declare const KEYWORDS: Map<string, TokenType>;
//# sourceMappingURL=tokens.d.ts.map