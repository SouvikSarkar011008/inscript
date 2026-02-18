"use strict";
/**
 * Token types for the InScript lexer
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEYWORDS = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    // Literals
    TokenType["NUMBER"] = "NUMBER";
    TokenType["STRING"] = "STRING";
    TokenType["IDENTIFIER"] = "IDENTIFIER";
    // Keywords
    TokenType["LET"] = "LET";
    TokenType["CONST"] = "CONST";
    TokenType["VAR"] = "VAR";
    TokenType["FUNCTION"] = "FUNCTION";
    TokenType["FUNC"] = "FUNC";
    TokenType["CLASS"] = "CLASS";
    TokenType["EXTENDS"] = "EXTENDS";
    TokenType["NEW"] = "NEW";
    TokenType["THIS"] = "THIS";
    TokenType["SUPER"] = "SUPER";
    TokenType["RETURN"] = "RETURN";
    TokenType["IF"] = "IF";
    TokenType["ELSE"] = "ELSE";
    TokenType["MATCH"] = "MATCH";
    TokenType["WHILE"] = "WHILE";
    TokenType["FOR"] = "FOR";
    TokenType["IN"] = "IN";
    TokenType["LOOP"] = "LOOP";
    TokenType["BREAK"] = "BREAK";
    TokenType["CONTINUE"] = "CONTINUE";
    TokenType["TRUE"] = "TRUE";
    TokenType["FALSE"] = "FALSE";
    TokenType["NULL"] = "NULL";
    TokenType["ON"] = "ON";
    TokenType["GAME"] = "GAME";
    TokenType["ASSETS"] = "ASSETS";
    TokenType["IMAGE"] = "IMAGE";
    TokenType["AUDIO"] = "AUDIO";
    TokenType["FONT"] = "FONT";
    TokenType["MODEL"] = "MODEL";
    TokenType["PRIVATE"] = "PRIVATE";
    TokenType["FN"] = "FN";
    TokenType["DEFAULT"] = "DEFAULT";
    // Operators
    TokenType["PLUS"] = "PLUS";
    TokenType["MINUS"] = "MINUS";
    TokenType["MULTIPLY"] = "MULTIPLY";
    TokenType["DIVIDE"] = "DIVIDE";
    TokenType["MODULO"] = "MODULO";
    TokenType["ASSIGN"] = "ASSIGN";
    TokenType["PLUS_ASSIGN"] = "PLUS_ASSIGN";
    TokenType["MINUS_ASSIGN"] = "MINUS_ASSIGN";
    TokenType["MULTIPLY_ASSIGN"] = "MULTIPLY_ASSIGN";
    TokenType["DIVIDE_ASSIGN"] = "DIVIDE_ASSIGN";
    TokenType["MODULO_ASSIGN"] = "MODULO_ASSIGN";
    // Comparison
    TokenType["EQUAL"] = "EQUAL";
    TokenType["NOT_EQUAL"] = "NOT_EQUAL";
    TokenType["LESS"] = "LESS";
    TokenType["LESS_EQUAL"] = "LESS_EQUAL";
    TokenType["GREATER"] = "GREATER";
    TokenType["GREATER_EQUAL"] = "GREATER_EQUAL";
    // Logical
    TokenType["AND"] = "AND";
    TokenType["OR"] = "OR";
    TokenType["NOT"] = "NOT";
    // Punctuation
    TokenType["LPAREN"] = "LPAREN";
    TokenType["RPAREN"] = "RPAREN";
    TokenType["LBRACE"] = "LBRACE";
    TokenType["RBRACE"] = "RBRACE";
    TokenType["LBRACKET"] = "LBRACKET";
    TokenType["RBRACKET"] = "RBRACKET";
    TokenType["SEMICOLON"] = "SEMICOLON";
    TokenType["COMMA"] = "COMMA";
    TokenType["DOT"] = "DOT";
    TokenType["COLON"] = "COLON";
    TokenType["ARROW"] = "ARROW";
    TokenType["RANGE"] = "RANGE";
    TokenType["RANGE_EXCLUSIVE"] = "RANGE_EXCLUSIVE";
    TokenType["QUESTION"] = "QUESTION";
    TokenType["DOUBLE_ARROW"] = "DOUBLE_ARROW";
    // Special
    TokenType["EOF"] = "EOF";
    TokenType["NEWLINE"] = "NEWLINE";
    TokenType["ERROR"] = "ERROR";
})(TokenType || (exports.TokenType = TokenType = {}));
exports.KEYWORDS = new Map([
    ["let", TokenType.LET],
    ["const", TokenType.CONST],
    ["var", TokenType.VAR],
    ["function", TokenType.FUNCTION],
    ["func", TokenType.FUNC],
    ["class", TokenType.CLASS],
    ["extends", TokenType.EXTENDS],
    ["new", TokenType.NEW],
    ["this", TokenType.THIS],
    ["super", TokenType.SUPER],
    ["return", TokenType.RETURN],
    ["if", TokenType.IF],
    ["else", TokenType.ELSE],
    ["match", TokenType.MATCH],
    ["while", TokenType.WHILE],
    ["for", TokenType.FOR],
    ["in", TokenType.IN],
    ["loop", TokenType.LOOP],
    ["break", TokenType.BREAK],
    ["continue", TokenType.CONTINUE],
    ["true", TokenType.TRUE],
    ["false", TokenType.FALSE],
    ["null", TokenType.NULL],
    ["on", TokenType.ON],
    ["game", TokenType.GAME],
    ["assets", TokenType.ASSETS],
    ["image", TokenType.IMAGE],
    ["audio", TokenType.AUDIO],
    ["font", TokenType.FONT],
    ["model", TokenType.MODEL],
    ["private", TokenType.PRIVATE],
    ["fn", TokenType.FN],
    ["default", TokenType.DEFAULT],
]);
//# sourceMappingURL=tokens.js.map