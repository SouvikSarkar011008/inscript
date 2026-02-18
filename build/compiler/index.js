"use strict";
/**
 * InScript Compiler - Main Entry Point
 * Orchestrates the entire compilation pipeline
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = void 0;
const lexer_1 = require("./lexer");
const parser_1 = require("./parser");
const semantic_1 = require("./semantic");
const codegen_1 = require("./codegen");
const FS = __importStar(require("fs"));
class Compiler {
    /**
     * Compile InScript source code to JavaScript
     */
    compile(source) {
        const errors = [];
        const warnings = [];
        try {
            // Stage 1: Lexical Analysis
            console.log("📝 Lexical Analysis...");
            const lexer = new lexer_1.Lexer(source);
            const tokens = lexer.tokenize();
            console.log(`✅ Tokenized: ${tokens.length} tokens`);
            // Stage 2: Syntax Analysis
            console.log("📝 Syntax Analysis...");
            const parser = new parser_1.Parser(tokens);
            const ast = parser.parse();
            console.log(`✅ Generated AST with ${ast.body.length} top-level statements`);
            // Stage 3: Semantic Analysis
            console.log("📝 Semantic Analysis...");
            const semanticAnalyzer = new semantic_1.SemanticAnalyzer(ast);
            const semanticResult = semanticAnalyzer.analyze();
            if (!semanticResult.valid) {
                semanticResult.errors.forEach((err) => {
                    errors.push(err);
                    console.error(`❌ ${err.message}`);
                });
            }
            else {
                console.log("✅ Semantic validation passed");
            }
            if (errors.length > 0) {
                return { success: false, errors, warnings };
            }
            // Stage 4: Code Generation
            console.log("📝 Code Generation...");
            const codegen = new codegen_1.CodeGenerator(semanticResult.ast);
            const jsCode = codegen.generate();
            console.log(`✅ Generated ${jsCode.length} bytes of JavaScript`);
            return {
                success: true,
                output: jsCode,
                errors,
                warnings,
            };
        }
        catch (error) {
            if (error instanceof parser_1.ParseError || error instanceof semantic_1.SemanticError) {
                errors.push(error);
                console.error(`❌ ${error.message}`);
            }
            else {
                console.error("❌ Unexpected error:", error);
                errors.push(new Error(String(error)));
            }
            return { success: false, errors, warnings };
        }
    }
    /**
     * Compile from a file
     */
    compileFile(filePath) {
        try {
            const source = FS.readFileSync(filePath, "utf-8");
            console.log(`📂 Reading file: ${filePath}`);
            return this.compile(source);
        }
        catch (error) {
            const err = new Error(`Failed to read file ${filePath}: ${error}`);
            return { success: false, errors: [err], warnings: [] };
        }
    }
    /**
     * Compile and save to output file
     */
    compileFileToFile(inputPath, outputPath) {
        const result = this.compileFile(inputPath);
        if (result.success && result.output) {
            try {
                FS.writeFileSync(outputPath, result.output, "utf-8");
                console.log(`💾 JavaScript saved to: ${outputPath}`);
            }
            catch (error) {
                console.error(`Failed to write output file: ${error}`);
                result.success = false;
            }
        }
        return result;
    }
}
exports.Compiler = Compiler;
// Export for use in other modules
exports.default = Compiler;
//# sourceMappingURL=index.js.map