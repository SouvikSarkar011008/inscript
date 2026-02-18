/**
 * Debug tokenization
 */

import { Lexer } from "./compiler/lexer";
import * as FS from "fs";

const source = FS.readFileSync("examples/hello-world.inscript", "utf-8");
const lexer = new Lexer(source);
const tokens = lexer.tokenize();

console.log("=== Tokens around Line 20 ===\n");

// Find tokens around line 20
const line20Tokens = tokens.filter((t) => t.line >= 19 && t.line <= 22);

line20Tokens.forEach((token, i) => {
  console.log(
    `${token.line}:${token.column} - ${token.type.padEnd(20)} | "${token.value}"`
  );
});
