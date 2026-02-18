/**
 * Token types for the InScript lexer
 */

export enum TokenType {
  // Literals
  NUMBER = "NUMBER",
  STRING = "STRING",
  IDENTIFIER = "IDENTIFIER",

  // Keywords
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

  // Operators
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

  // Comparison
  EQUAL = "EQUAL",
  NOT_EQUAL = "NOT_EQUAL",
  LESS = "LESS",
  LESS_EQUAL = "LESS_EQUAL",
  GREATER = "GREATER",
  GREATER_EQUAL = "GREATER_EQUAL",

  // Logical
  AND = "AND",
  OR = "OR",
  NOT = "NOT",

  // Punctuation
  LPAREN = "LPAREN",        // (
  RPAREN = "RPAREN",        // )
  LBRACE = "LBRACE",        // {
  RBRACE = "RBRACE",        // }
  LBRACKET = "LBRACKET",    // [
  RBRACKET = "RBRACKET",    // ]
  SEMICOLON = "SEMICOLON",  // ;
  COMMA = "COMMA",          // ,
  DOT = "DOT",              // .
  COLON = "COLON",          // :
  ARROW = "ARROW",          // =>
  RANGE = "RANGE",          // ..
  RANGE_EXCLUSIVE = "RANGE_EXCLUSIVE", // ...
  QUESTION = "QUESTION",    // ?
  DOUBLE_ARROW = "DOUBLE_ARROW", // ->

  // Special
  EOF = "EOF",
  NEWLINE = "NEWLINE",
  ERROR = "ERROR",
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
  length: number;
}

export const KEYWORDS: Map<string, TokenType> = new Map([
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
