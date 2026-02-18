/**
 * Parser for InScript
 * Converts tokens into an Abstract Syntax Tree (AST)
 */

import { Token, TokenType } from "../types/tokens";
import * as AST from "../types/ast";

export class ParseError extends Error {
  constructor(message: string, token: Token) {
    super(`Parse Error at L${token.line}:C${token.column}: ${message}`);
  }
}

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  /**
   * Parse tokens into AST
   */
  public parse(): AST.Program {
    const body: AST.Statement[] = [];

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
  private parseStatement(): AST.Statement | null {
    // Game declaration
    if (this.match(TokenType.GAME)) {
      return this.parseGameDeclaration();
    }

    // Assets declaration
    if (this.match(TokenType.ASSETS)) {
      return this.parseAssetDeclaration();
    }

    // Event handler
    if (this.match(TokenType.ON)) {
      return this.parseEventHandler();
    }

    // Variable declaration
    if (this.match(TokenType.LET, TokenType.CONST, TokenType.VAR)) {
      return this.parseVariableDeclaration();
    }

    // Function declaration
    if (this.match(TokenType.FUNC)) {
      return this.parseFunctionDeclaration();
    }

    // Class declaration
    if (this.match(TokenType.CLASS)) {
      return this.parseClassDeclaration();
    }

    // Block statement
    if (this.check(TokenType.LBRACE)) {
      return this.parseBlockStatement();
    }

    // If statement
    if (this.match(TokenType.IF)) {
      return this.parseIfStatement();
    }

    // Match statement
    if (this.match(TokenType.MATCH)) {
      return this.parseMatchStatement();
    }

    // While statement
    if (this.match(TokenType.WHILE)) {
      return this.parseWhileStatement();
    }

    // For statement
    if (this.match(TokenType.FOR)) {
      return this.parseForStatement();
    }

    // Loop statement
    if (this.match(TokenType.LOOP)) {
      return this.parseLoopStatement();
    }

    // Return statement
    if (this.match(TokenType.RETURN)) {
      return this.parseReturnStatement();
    }

    // Break statement
    if (this.match(TokenType.BREAK)) {
      this.consumeStatementEnd();
      return {
        type: "BreakStatement",
        line: this.previous().line,
        column: this.previous().column,
      };
    }

    // Continue statement
    if (this.match(TokenType.CONTINUE)) {
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
  private parseGameDeclaration(): AST.GameDeclaration {
    const start = this.previous();
    const id = this.consume(TokenType.IDENTIFIER, "Expected game name");

    this.consume(TokenType.LBRACE, "Expected '{' after game name");

    const properties: AST.GameProperty[] = [];

    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const key = this.consume(TokenType.IDENTIFIER, "Expected property name");
      this.consume(TokenType.COLON, "Expected ':' after property name");

      let value: AST.Literal | AST.Identifier;

      if (this.check(TokenType.STRING)) {
        const token = this.advance();
        value = {
          type: "Literal",
          value: token.value,
          raw: token.value,
          line: token.line,
          column: token.column,
        };
      } else if (this.check(TokenType.NUMBER)) {
        const token = this.advance();
        value = {
          type: "Literal",
          value: Number(token.value),
          raw: token.value,
          line: token.line,
          column: token.column,
        };
      } else if (this.check(TokenType.IDENTIFIER)) {
        const token = this.advance();
        value = {
          type: "Identifier",
          name: token.value,
          line: token.line,
          column: token.column,
        };
      } else {
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

    this.consume(TokenType.RBRACE, "Expected '}' after game properties");

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
  private parseAssetDeclaration(): AST.AssetDeclaration {
    const start = this.previous();
    this.consume(TokenType.LBRACE, "Expected '{' after 'assets'");

    const assets: AST.AssetDef[] = [];

    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      let assetType: "image" | "audio" | "font" | "model" = "image";

      if (this.match(TokenType.IMAGE)) {
        assetType = "image";
      } else if (this.match(TokenType.AUDIO)) {
        assetType = "audio";
      } else if (this.match(TokenType.FONT)) {
        assetType = "font";
      } else if (this.match(TokenType.MODEL)) {
        assetType = "model";
      } else {
        throw this.error("Expected asset type (image, audio, font, model)");
      }

      const id = this.consume(TokenType.IDENTIFIER, "Expected asset name");
      this.consume(TokenType.ASSIGN, "Expected '=' after asset name");

      const value = this.consume(TokenType.STRING, "Expected asset path string");

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
      this.match(TokenType.COMMA);
    }

    this.consume(TokenType.RBRACE, "Expected '}' after assets");

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
  private parseEventHandler(): AST.EventHandlerDeclaration {
    const start = this.previous();

    let eventName: "init" | "update" | "input" | "render" = "init";
    const token = this.advance();

    if (token.value === "init") eventName = "init";
    else if (token.value === "update") eventName = "update";
    else if (token.value === "input") eventName = "input";
    else if (token.value === "render") eventName = "render";
    else {
      throw this.error("Expected event name (init, update, input, render)");
    }

    this.consume(TokenType.LPAREN, "Expected '(' after event name");
    const params = this.parseParameters();
    this.consume(TokenType.RPAREN, "Expected ')' after parameters");

    const body = this.parseBlockStatement() as AST.BlockStatement;

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
  private parseVariableDeclaration(): AST.VariableDeclaration {
    const start = this.previous();
    const kind = start.value as "let" | "const" | "var";

    const id = this.consume(TokenType.IDENTIFIER, "Expected variable name");

    let typeAnnotation: AST.TypeAnnotation | undefined;
    if (this.match(TokenType.COLON)) {
      typeAnnotation = this.parseTypeAnnotation();
    }

    let init: AST.Expression | undefined;
    if (this.match(TokenType.ASSIGN)) {
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
  private parseFunctionDeclaration(): AST.FunctionDeclaration {
    const start = this.previous();

    const id = this.consume(TokenType.IDENTIFIER, "Expected function name");

    this.consume(TokenType.LPAREN, "Expected '(' after function name");
    const params = this.parseParameters();
    this.consume(TokenType.RPAREN, "Expected ')' after parameters");

    let returnType: AST.TypeAnnotation | undefined;
    if (this.match(TokenType.DOUBLE_ARROW)) {
      returnType = this.parseTypeAnnotation();
    }

    const body = this.parseBlockStatement() as AST.BlockStatement;

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
  private parseClassDeclaration(): AST.ClassDeclaration {
    const start = this.previous();

    const id = this.consume(TokenType.IDENTIFIER, "Expected class name");

    let superClass: AST.Identifier | undefined;
    if (this.match(TokenType.EXTENDS)) {
      const superToken = this.consume(TokenType.IDENTIFIER, "Expected superclass name");
      superClass = {
        type: "Identifier",
        name: superToken.value,
        line: superToken.line,
        column: superToken.column,
      };
    }

    this.consume(TokenType.LBRACE, "Expected '{' before class body");

    const members: AST.ClassMember[] = [];

    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const isPrivate = this.match(TokenType.PRIVATE);

      // Constructor (func new)
      if (this.match(TokenType.FUNC)) {
        let methodName: string;
        let methodToken: Token;

        if (this.match(TokenType.NEW)) {
          methodName = "new";
          methodToken = this.previous();
        } else {
          methodToken = this.consume(TokenType.IDENTIFIER, "Expected method name");
          methodName = methodToken.value;
        }

        this.consume(TokenType.LPAREN, "Expected '(' after method name");
        const params = this.parseParameters();
        this.consume(TokenType.RPAREN, "Expected ')' after parameters");

        let returnType: AST.TypeAnnotation | undefined;
        if (this.match(TokenType.DOUBLE_ARROW)) {
          returnType = this.parseTypeAnnotation();
        }

        const body = this.parseBlockStatement() as AST.BlockStatement;

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
      else if (this.check(TokenType.IDENTIFIER)) {
        const propToken = this.advance();

        let typeAnnotation: AST.TypeAnnotation | undefined;
        if (this.match(TokenType.COLON)) {
          typeAnnotation = this.parseTypeAnnotation();
        }

        let value: AST.Expression | undefined;
        if (this.match(TokenType.ASSIGN)) {
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
      } else {
        throw this.error("Expected method or property in class");
      }
    }

    this.consume(TokenType.RBRACE, "Expected '}' after class body");

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
  private parseBlockStatement(): AST.BlockStatement {
    const start = this.consume(TokenType.LBRACE, "Expected '{'");

    const body: AST.Statement[] = [];

    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const stmt = this.parseStatement();
      if (stmt) {
        body.push(stmt);
      }
    }

    this.consume(TokenType.RBRACE, "Expected '}'");

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
  private parseIfStatement(): AST.IfStatement {
    const start = this.previous();

    // Parentheses are optional in InScript
    const hasParens = this.match(TokenType.LPAREN);
    const test = this.parseExpression();
    if (hasParens) {
      this.consume(TokenType.RPAREN, "Expected ')' after if condition");
    }

    const consequent = this.parseStatement() || {
      type: "BlockStatement",
      body: [],
      line: start.line,
      column: start.column,
    };

    let alternate: AST.Statement | undefined;
    if (this.match(TokenType.ELSE)) {
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
  private parseMatchStatement(): AST.MatchStatement {
    const start = this.previous();

    const discriminant = this.parseExpression();

    this.consume(TokenType.LBRACE, "Expected '{' after match expression");

    const cases: AST.MatchCase[] = [];

    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      if (this.match(TokenType.DEFAULT)) {
        this.consume(TokenType.ARROW, "Expected '=>' after 'default'");
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
      } else {
        const test = this.parseExpression();
        this.consume(TokenType.ARROW, "Expected '=>' after case expression");
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

    this.consume(TokenType.RBRACE, "Expected '}' after match cases");

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
  private parseWhileStatement(): AST.WhileStatement {
    const start = this.previous();

    // Parentheses are optional
    const hasParens = this.match(TokenType.LPAREN);
    const test = this.parseExpression();
    if (hasParens) {
      this.consume(TokenType.RPAREN, "Expected ')' after while condition");
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
  private parseForStatement(): AST.ForStatement {
    const start = this.previous();

    const id = this.consume(TokenType.IDENTIFIER, "Expected variable name in for loop");

    this.consume(TokenType.IN, "Expected 'in' after variable in for loop");

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
  private parseLoopStatement(): AST.LoopStatement {
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
  private parseReturnStatement(): AST.ReturnStatement {
    const start = this.previous();

    let argument: AST.Expression | undefined;

    if (!this.check(TokenType.SEMICOLON) && !this.isAtEnd() && !this.check(TokenType.RBRACE)) {
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
  private parseExpressionStatement(): AST.ExpressionStatement {
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
  private parseExpression(): AST.Expression {
    return this.parseAssignment();
  }

  /**
   * Parse assignment expression
   */
  private parseAssignment(): AST.Expression {
    let expr = this.parseTernary();

    if (
      this.match(
        TokenType.ASSIGN,
        TokenType.PLUS_ASSIGN,
        TokenType.MINUS_ASSIGN,
        TokenType.MULTIPLY_ASSIGN,
        TokenType.DIVIDE_ASSIGN,
        TokenType.MODULO_ASSIGN
      )
    ) {
      const op = this.previous();
      const right = this.parseAssignment();

      return {
        type: "AssignmentExpression",
        left: expr,
        operator: op.value as any,
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
  private parseTernary(): AST.Expression {
    let expr = this.parseOr();

    if (this.match(TokenType.QUESTION)) {
      const consequent = this.parseExpression();
      this.consume(TokenType.COLON, "Expected ':' in ternary expression");
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
  private parseOr(): AST.Expression {
    let expr = this.parseAnd();

    while (this.match(TokenType.OR)) {
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
  private parseAnd(): AST.Expression {
    let expr = this.parseEquality();

    while (this.match(TokenType.AND)) {
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
  private parseEquality(): AST.Expression {
    let expr = this.parseComparison();

    while (this.match(TokenType.EQUAL, TokenType.NOT_EQUAL)) {
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
  private parseComparison(): AST.Expression {
    let expr = this.parseAdditive();

    while (
      this.match(
        TokenType.LESS,
        TokenType.LESS_EQUAL,
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.IN
      )
    ) {
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
  private parseAdditive(): AST.Expression {
    let expr = this.parseMultiplicative();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
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
  private parseMultiplicative(): AST.Expression {
    let expr = this.parseUnary();

    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO)) {
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
  private parseUnary(): AST.Expression {
    if (this.match(TokenType.NOT, TokenType.MINUS, TokenType.PLUS)) {
      const op = this.previous();
      const expr = this.parseUnary();

      return {
        type: "UnaryExpression",
        operator: op.value as "!" | "-" | "+",
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
  private parsePostfix(): AST.Expression {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match(TokenType.LPAREN)) {
        const args = this.parseArguments();
        this.consume(TokenType.RPAREN, "Expected ')' after arguments");

        expr = {
          type: "CallExpression",
          callee: expr,
          arguments: args,
          line: expr.line,
          column: expr.column,
        };
      } else if (this.match(TokenType.DOT)) {
        const prop = this.consume(TokenType.IDENTIFIER, "Expected property name after '.'");

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
      } else if (this.match(TokenType.LBRACKET)) {
        const index = this.parseExpression();
        this.consume(TokenType.RBRACKET, "Expected ']' after index");

        expr = {
          type: "MemberExpression",
          object: expr,
          property: index,
          computed: true,
          line: expr.line,
          column: expr.column,
        };
      } else {
        break;
      }
    }

    return expr;
  }

  /**
   * Parse primary expressions
   */
  private parsePrimary(): AST.Expression {
    // Literals
    if (this.match(TokenType.TRUE)) {
      const token = this.previous();
      return {
        type: "Literal",
        value: true,
        raw: "true",
        line: token.line,
        column: token.column,
      };
    }

    if (this.match(TokenType.FALSE)) {
      const token = this.previous();
      return {
        type: "Literal",
        value: false,
        raw: "false",
        line: token.line,
        column: token.column,
      };
    }

    if (this.match(TokenType.NULL)) {
      const token = this.previous();
      return {
        type: "Literal",
        value: null,
        raw: "null",
        line: token.line,
        column: token.column,
      };
    }

    if (this.match(TokenType.NUMBER)) {
      const token = this.previous();
      return {
        type: "Literal",
        value: Number(token.value),
        raw: token.value,
        line: token.line,
        column: token.column,
      };
    }

    if (this.match(TokenType.STRING)) {
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
    if (this.match(TokenType.IDENTIFIER)) {
      const token = this.previous();
      return {
        type: "Identifier",
        name: token.value,
        line: token.line,
        column: token.column,
      };
    }

    // This
    if (this.match(TokenType.THIS)) {
      const token = this.previous();
      return {
        type: "ThisExpression",
        line: token.line,
        column: token.column,
      };
    }

    // Array literal
    if (this.match(TokenType.LBRACKET)) {
      const start = this.previous();
      const elements: (AST.Expression | null)[] = [];

      while (!this.check(TokenType.RBRACKET) && !this.isAtEnd()) {
        elements.push(this.parseExpression());
        if (!this.match(TokenType.COMMA)) break;
      }

      this.consume(TokenType.RBRACKET, "Expected ']' after array elements");

      return {
        type: "ArrayExpression",
        elements,
        line: start.line,
        column: start.column,
      };
    }

    // Object literal
    if (this.match(TokenType.LBRACE)) {
      const start = this.previous();
      const properties: AST.ObjectProperty[] = [];

      while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
        let key: AST.Identifier | AST.Literal;
        let computed = false;

        if (this.match(TokenType.LBRACKET)) {
          const expr = this.parseExpression();
          this.consume(TokenType.RBRACKET, "Expected ']' after computed property");
          key = expr as any;
          computed = true;
        } else {
          const token = this.consume(TokenType.IDENTIFIER, "Expected property key");
          key = {
            type: "Identifier",
            name: token.value,
            line: token.line,
            column: token.column,
          };
        }

        this.consume(TokenType.COLON, "Expected ':' after property key");
        const value = this.parseExpression();

        properties.push({
          type: "ObjectProperty",
          key,
          value,
          computed,
          line: key.line,
          column: key.column,
        });

        if (!this.match(TokenType.COMMA)) break;
      }

      this.consume(TokenType.RBRACE, "Expected '}' after object properties");

      return {
        type: "ObjectExpression",
        properties,
        line: start.line,
        column: start.column,
      };
    }

    // Grouped expression or function expression
    if (this.match(TokenType.LPAREN)) {
      const start = this.previous();
      const expr = this.parseExpression();
      this.consume(TokenType.RPAREN, "Expected ')' after expression");
      return expr;
    }

    // Lambda/Function expression
    if (this.match(TokenType.FN)) {
      return this.parseFunctionExpression();
    }

    // New expression
    if (this.match(TokenType.NEW)) {
      const start = this.previous();
      const callee = this.parsePrimary();

      let args: AST.Expression[] = [];
      if (this.match(TokenType.LPAREN)) {
        args = this.parseArguments();
        this.consume(TokenType.RPAREN, "Expected ')' after constructor arguments");
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
  private parseFunctionExpression(): AST.FunctionExpression {
    const start = this.previous();

    this.consume(TokenType.LPAREN, "Expected '(' after 'fn'");
    const params = this.parseParameters();
    this.consume(TokenType.RPAREN, "Expected ')' after parameters");

    const body = this.parseBlockStatement() as AST.BlockStatement;

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
  private parseParameters(): AST.Parameter[] {
    const params: AST.Parameter[] = [];

    while (!this.check(TokenType.RPAREN) && !this.isAtEnd()) {
      let rest = false;
      if (this.match(TokenType.DOT, TokenType.DOT, TokenType.DOT)) {
        rest = true;
      }

      const id = this.consume(TokenType.IDENTIFIER, "Expected parameter name");

      let typeAnnotation: AST.TypeAnnotation | undefined;
      if (this.match(TokenType.COLON)) {
        typeAnnotation = this.parseTypeAnnotation();
      }

      let defaultValue: AST.Expression | undefined;
      if (this.match(TokenType.ASSIGN)) {
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

      if (!this.match(TokenType.COMMA)) break;
    }

    return params;
  }

  /**
   * Parse type annotation
   */
  private parseTypeAnnotation(): AST.TypeAnnotation {
    const start = this.peek();

    if (this.match(TokenType.IDENTIFIER)) {
      const token = this.previous();
      const name = token.value;

      if (name === "number" || name === "text" || name === "bool" || name === "null") {
        return {
          type: "PrimitiveType",
          name: name as any,
          line: token.line,
          column: token.column,
        };
      } else {
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
  private parseArguments(): AST.Expression[] {
    const args: AST.Expression[] = [];

    while (!this.check(TokenType.RPAREN) && !this.isAtEnd()) {
      args.push(this.parseExpression());
      if (!this.match(TokenType.COMMA)) break;
    }

    return args;
  }

  /**
   * Helper: check if current token is of given type
   */
  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  /**
   * Helper: match one or more token types
   */
  private match(...types: TokenType[]): boolean {
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
  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) {
      return this.advance();
    }
    throw this.error(message);
  }

  /**
   * Helper: advance to next token
   */
  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  /**
   * Helper: get current token
   */
  private peek(): Token {
    return this.tokens[this.current];
  }

  /**
   * Helper: get next token
   */
  private peekNext(): Token | null {
    if (this.current + 1 >= this.tokens.length) return null;
    return this.tokens[this.current + 1];
  }

  /**
   * Helper: get previous token
   */
  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  /**
   * Helper: check if at end of tokens
   */
  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  /**
   * Helper: consume statement end (semicolon or newline or brace)
   */
  private consumeStatementEnd(): void {
    if (
      this.check(TokenType.SEMICOLON) ||
      this.check(TokenType.RBRACE) ||
      this.check(TokenType.EOF)
    ) {
      this.match(TokenType.SEMICOLON);
    }
  }

  /**
   * Helper: create error
   */
  private error(message: string): ParseError {
    return new ParseError(message, this.peek());
  }
}
