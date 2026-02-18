/**
 * InScript Compiler - Main Entry Point
 * Orchestrates the entire compilation pipeline
 */

import { Lexer } from "./lexer";
import { Parser, ParseError } from "./parser";
import { SemanticAnalyzer, SemanticError } from "./semantic";
import { CodeGenerator } from "./codegen";
import * as FS from "fs";
import * as Path from "path";

export interface CompilationResult {
  success: boolean;
  output?: string;
  errors: (ParseError | SemanticError)[];
  warnings: string[];
}

export class Compiler {
  /**
   * Compile InScript source code to JavaScript
   */
  public compile(source: string): CompilationResult {
    const errors: (ParseError | SemanticError)[] = [];
    const warnings: string[] = [];

    try {
      // Stage 1: Lexical Analysis
      console.log("📝 Lexical Analysis...");
      const lexer = new Lexer(source);
      const tokens = lexer.tokenize();
      console.log(`✅ Tokenized: ${tokens.length} tokens`);

      // Stage 2: Syntax Analysis
      console.log("📝 Syntax Analysis...");
      const parser = new Parser(tokens);
      const ast = parser.parse();
      console.log(`✅ Generated AST with ${ast.body.length} top-level statements`);

      // Stage 3: Semantic Analysis
      console.log("📝 Semantic Analysis...");
      const semanticAnalyzer = new SemanticAnalyzer(ast);
      const semanticResult = semanticAnalyzer.analyze();

      if (!semanticResult.valid) {
        semanticResult.errors.forEach((err) => {
          errors.push(err);
          console.error(`❌ ${err.message}`);
        });
      } else {
        console.log("✅ Semantic validation passed");
      }

      if (errors.length > 0) {
        return { success: false, errors, warnings };
      }

      // Stage 4: Code Generation
      console.log("📝 Code Generation...");
      const codegen = new CodeGenerator(semanticResult.ast);
      const jsCode = codegen.generate();
      console.log(`✅ Generated ${jsCode.length} bytes of JavaScript`);

      return {
        success: true,
        output: jsCode,
        errors,
        warnings,
      };
    } catch (error) {
      if (error instanceof ParseError || error instanceof SemanticError) {
        errors.push(error);
        console.error(`❌ ${error.message}`);
      } else {
        console.error("❌ Unexpected error:", error);
        errors.push(new Error(String(error)) as any);
      }

      return { success: false, errors, warnings };
    }
  }

  /**
   * Compile from a file
   */
  public compileFile(filePath: string): CompilationResult {
    try {
      const source = FS.readFileSync(filePath, "utf-8");
      console.log(`📂 Reading file: ${filePath}`);
      return this.compile(source);
    } catch (error) {
      const err = new Error(`Failed to read file ${filePath}: ${error}`);
      return { success: false, errors: [err as any], warnings: [] };
    }
  }

  /**
   * Compile and save to output file
   */
  public compileFileToFile(inputPath: string, outputPath: string): CompilationResult {
    const result = this.compileFile(inputPath);

    if (result.success && result.output) {
      try {
        FS.writeFileSync(outputPath, result.output, "utf-8");
        console.log(`💾 JavaScript saved to: ${outputPath}`);
      } catch (error) {
        console.error(`Failed to write output file: ${error}`);
        result.success = false;
      }
    }

    return result;
  }
}

// Export for use in other modules
export default Compiler;
