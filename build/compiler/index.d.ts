/**
 * InScript Compiler - Main Entry Point
 * Orchestrates the entire compilation pipeline
 */
import { ParseError } from "./parser";
import { SemanticError } from "./semantic";
export interface CompilationResult {
    success: boolean;
    output?: string;
    errors: (ParseError | SemanticError)[];
    warnings: string[];
}
export declare class Compiler {
    /**
     * Compile InScript source code to JavaScript
     */
    compile(source: string): CompilationResult;
    /**
     * Compile from a file
     */
    compileFile(filePath: string): CompilationResult;
    /**
     * Compile and save to output file
     */
    compileFileToFile(inputPath: string, outputPath: string): CompilationResult;
}
export default Compiler;
//# sourceMappingURL=index.d.ts.map