/**
 * Abstract Syntax Tree (AST) node definitions for InScript
 */

// Base node interface
export interface ASTNode {
  type: string;
  line: number;
  column: number;
}

// ============================================================================
// Program
// ============================================================================

export interface Program extends ASTNode {
  type: "Program";
  body: Statement[];
}

// ============================================================================
// Statements
// ============================================================================

export type Statement =
  | VariableDeclaration
  | FunctionDeclaration
  | ClassDeclaration
  | GameDeclaration
  | AssetDeclaration
  | BlockStatement
  | ExpressionStatement
  | IfStatement
  | MatchStatement
  | WhileStatement
  | ForStatement
  | LoopStatement
  | ReturnStatement
  | BreakStatement
  | ContinueStatement
  | EventHandlerDeclaration;

export interface VariableDeclaration extends ASTNode {
  type: "VariableDeclaration";
  kind: "let" | "const" | "var";
  id: Identifier;
  typeAnnotation?: TypeAnnotation;
  init?: Expression;
}

export interface FunctionDeclaration extends ASTNode {
  type: "FunctionDeclaration";
  id: Identifier;
  params: Parameter[];
  returnType?: TypeAnnotation;
  body: BlockStatement;
}

export interface ClassDeclaration extends ASTNode {
  type: "ClassDeclaration";
  id: Identifier;
  superClass?: Identifier;
  body: ClassBody;
}

export interface ClassBody extends ASTNode {
  type: "ClassBody";
  members: ClassMember[];
}

export type ClassMember =
  | ClassProperty
  | ClassMethod;

export interface ClassProperty extends ASTNode {
  type: "ClassProperty";
  key: Identifier;
  typeAnnotation?: TypeAnnotation;
  value?: Expression;
}

export interface ClassMethod extends ASTNode {
  type: "ClassMethod";
  key: Identifier;
  params: Parameter[];
  returnType?: TypeAnnotation;
  body: BlockStatement;
  isPrivate: boolean;
  isConstructor: boolean;
}

export interface GameDeclaration extends ASTNode {
  type: "GameDeclaration";
  id: Identifier;
  properties: GameProperty[];
}

export interface GameProperty extends ASTNode {
  type: "GameProperty";
  key: Identifier;
  value: Literal | Identifier;
}

export interface AssetDeclaration extends ASTNode {
  type: "AssetDeclaration";
  assets: AssetDef[];
}

export interface AssetDef extends ASTNode {
  type: "AssetDef";
  assetType: "image" | "audio" | "font" | "model";
  id: Identifier;
  value: string;
  properties?: Map<string, Expression>;
}

export interface BlockStatement extends ASTNode {
  type: "BlockStatement";
  body: Statement[];
}

export interface ExpressionStatement extends ASTNode {
  type: "ExpressionStatement";
  expression: Expression;
}

export interface IfStatement extends ASTNode {
  type: "IfStatement";
  test: Expression;
  consequent: Statement;
  alternate?: Statement;
}

export interface MatchStatement extends ASTNode {
  type: "MatchStatement";
  discriminant: Expression;
  cases: MatchCase[];
}

export interface MatchCase extends ASTNode {
  type: "MatchCase";
  test: Expression | null; // null for default
  consequent: Statement;
}

export interface WhileStatement extends ASTNode {
  type: "WhileStatement";
  test: Expression;
  body: Statement;
}

export interface ForStatement extends ASTNode {
  type: "ForStatement";
  left: Identifier;
  right: Expression;
  body: Statement;
}

export interface LoopStatement extends ASTNode {
  type: "LoopStatement";
  body: Statement;
}

export interface ReturnStatement extends ASTNode {
  type: "ReturnStatement";
  argument?: Expression;
}

export interface BreakStatement extends ASTNode {
  type: "BreakStatement";
}

export interface ContinueStatement extends ASTNode {
  type: "ContinueStatement";
}

export interface EventHandlerDeclaration extends ASTNode {
  type: "EventHandlerDeclaration";
  event: "init" | "update" | "input" | "render";
  params: Parameter[];
  body: BlockStatement;
}

// ============================================================================
// Expressions
// ============================================================================

export type Expression =
  | Identifier
  | Literal
  | BinaryExpression
  | UnaryExpression
  | AssignmentExpression
  | UpdateExpression
  | CallExpression
  | MemberExpression
  | ArrayExpression
  | ObjectExpression
  | FunctionExpression
  | ConditionalExpression
  | NewExpression
  | ThisExpression;

export interface Identifier extends ASTNode {
  type: "Identifier";
  name: string;
}

export interface Literal extends ASTNode {
  type: "Literal";
  value: number | string | boolean | null;
  raw: string;
}

export interface BinaryExpression extends ASTNode {
  type: "BinaryExpression";
  left: Expression;
  operator: string;
  right: Expression;
}

export interface UnaryExpression extends ASTNode {
  type: "UnaryExpression";
  operator: "!" | "-" | "+";
  argument: Expression;
  prefix: boolean;
}

export interface AssignmentExpression extends ASTNode {
  type: "AssignmentExpression";
  left: Expression;
  operator: "=" | "+=" | "-=" | "*=" | "/=" | "%=";
  right: Expression;
}

export interface UpdateExpression extends ASTNode {
  type: "UpdateExpression";
  operator: "++" | "--";
  argument: Expression;
  prefix: boolean;
}

export interface CallExpression extends ASTNode {
  type: "CallExpression";
  callee: Expression;
  arguments: Expression[];
}

export interface MemberExpression extends ASTNode {
  type: "MemberExpression";
  object: Expression;
  property: Expression;
  computed: boolean;
}

export interface ArrayExpression extends ASTNode {
  type: "ArrayExpression";
  elements: (Expression | null)[];
}

export interface ObjectExpression extends ASTNode {
  type: "ObjectExpression";
  properties: ObjectProperty[];
}

export interface ObjectProperty extends ASTNode {
  type: "ObjectProperty";
  key: Identifier | Literal;
  value: Expression;
  computed: boolean;
}

export interface FunctionExpression extends ASTNode {
  type: "FunctionExpression";
  id?: Identifier;
  params: Parameter[];
  returnType?: TypeAnnotation;
  body: BlockStatement;
}

export interface ConditionalExpression extends ASTNode {
  type: "ConditionalExpression";
  test: Expression;
  consequent: Expression;
  alternate: Expression;
}

export interface NewExpression extends ASTNode {
  type: "NewExpression";
  callee: Expression;
  arguments: Expression[];
}

export interface ThisExpression extends ASTNode {
  type: "ThisExpression";
}

// ============================================================================
// Type Annotations
// ============================================================================

export type TypeAnnotation =
  | PrimitiveType
  | ArrayType
  | FunctionType
  | UnionType
  | IdentifierType;

export interface PrimitiveType extends ASTNode {
  type: "PrimitiveType";
  name: "number" | "text" | "bool" | "null";
}

export interface ArrayType extends ASTNode {
  type: "ArrayType";
  elementType: TypeAnnotation;
}

export interface FunctionType extends ASTNode {
  type: "FunctionType";
  paramTypes: TypeAnnotation[];
  returnType: TypeAnnotation;
}

export interface UnionType extends ASTNode {
  type: "UnionType";
  types: TypeAnnotation[];
}

export interface IdentifierType extends ASTNode {
  type: "IdentifierType";
  name: string;
}

// ============================================================================
// Parameters
// ============================================================================

export interface Parameter extends ASTNode {
  type: "Parameter";
  id: Identifier;
  typeAnnotation?: TypeAnnotation;
  default?: Expression;
  rest?: boolean;
}
