#!/usr/bin/env node

/**
 * InScript CLI - Command Line Interface
 */

import * as FS from "fs";
import * as Path from "path";
import Compiler from "../compiler";

const args = process.argv.slice(2);

// Display version
const version = "0.1.0";

// Commands available
const commands: { [key: string]: string } = {
  compile: "compile <file> [-o output.js] - Compile InScript to JavaScript",
  run: "run <file> - Compile and run InScript code",
  watch: "watch <file> - Watch for changes and recompile",
  version: "--version - Show version",
  help: "--help - Show help",
};

/**
 * Print help message
 */
function printHelp(): void {
  console.log(`
🎮 InScript Compiler v${version}

Usage: inscript <command> [options]

Commands:
  compile <file> [-o output.js]  Compile InScript to JavaScript
  run <file>                     Compile and run code (outputs to stdout)
  watch <file>                   Watch for changes and recompile
  --version                      Show version
  --help                         Show this help message

Examples:
  inscript compile game.inscript
  inscript compile game.inscript -o game.js
  inscript run game.inscript
  inscript watch game.inscript

Documentation: https://github.com/inscript-lang/inscript
`);
}

/**
 * Print version
 */
function printVersion(): void {
  console.log(`InScript v${version}`);
}

/**
 * Compile command
 */
function cmdCompile(args: string[]): void {
  if (args.length === 0) {
    console.error("❌ Error: compile requires a file path");
    console.error("Usage: inscript compile <file> [-o output.js]");
    process.exit(1);
  }

  const inputFile = args[0];
  let outputFile = inputFile.replace(/\.inscript$/, ".js");

  // Check for -o flag
  for (let i = 1; i < args.length; i++) {
    if (args[i] === "-o" && i + 1 < args.length) {
      outputFile = args[i + 1];
    }
  }

  if (!FS.existsSync(inputFile)) {
    console.error(`❌ Error: File not found: ${inputFile}`);
    process.exit(1);
  }

  console.log(`📂 Compiling: ${inputFile}`);
  const compiler = new Compiler();
  const result = compiler.compileFileToFile(inputFile, outputFile);

  if (result.success) {
    console.log(`✅ Compilation complete!`);
    console.log(`📄 Output: ${outputFile}`);
    process.exit(0);
  } else {
    console.error(`\n❌ Compilation failed with ${result.errors.length} error(s)`);
    result.errors.forEach((err) => {
      console.error(`   ${err.message}`);
    });
    process.exit(1);
  }
}

/**
 * Run command
 */
function cmdRun(args: string[]): void {
  if (args.length === 0) {
    console.error("❌ Error: run requires a file path");
    console.error("Usage: inscript run <file>");
    process.exit(1);
  }

  const inputFile = args[0];

  if (!FS.existsSync(inputFile)) {
    console.error(`❌ Error: File not found: ${inputFile}`);
    process.exit(1);
  }

  console.log(`📂 Running: ${inputFile}`);
  const compiler = new Compiler();
  const result = compiler.compileFile(inputFile);

  if (result.success && result.output) {
    console.log("\n=== JavaScript Output ===\n");
    console.log(result.output);
    process.exit(0);
  } else {
    console.error(`\n❌ Compilation failed with ${result.errors.length} error(s)`);
    result.errors.forEach((err) => {
      console.error(`   ${err.message}`);
    });
    process.exit(1);
  }
}

/**
 * Watch command
 */
function cmdWatch(args: string[]): void {
  if (args.length === 0) {
    console.error("❌ Error: watch requires a file path");
    console.error("Usage: inscript watch <file>");
    process.exit(1);
  }

  const inputFile = args[0];
  let outputFile = inputFile.replace(/\.inscript$/, ".js");

  if (!FS.existsSync(inputFile)) {
    console.error(`❌ Error: File not found: ${inputFile}`);
    process.exit(1);
  }

  console.log(`👀 Watching: ${inputFile}`);
  console.log(`💾 Output: ${outputFile}`);

  const compiler = new Compiler();
  let lastMtime = FS.statSync(inputFile).mtime.getTime();

  const checkFile = (): void => {
    try {
      const stat = FS.statSync(inputFile);
      const currentMtime = stat.mtime.getTime();

      if (currentMtime > lastMtime) {
        lastMtime = currentMtime;
        console.log(`\n📝 Changes detected at ${new Date().toLocaleTimeString()}`);
        const result = compiler.compileFileToFile(inputFile, outputFile);

        if (result.success) {
          console.log(`✅ Compilation successful`);
        } else {
          console.error(`❌ Compilation failed`);
        }
      }
    } catch (error) {
      console.error(`Error checking file: ${error}`);
    }
  };

  // Check every 500ms
  setInterval(checkFile, 500);
  console.log("Press Ctrl+C to stop watching\n");
}

/**
 * Main entry point
 */
function main(): void {
  if (args.length === 0) {
    printHelp();
    process.exit(0);
  }

  const command = args[0];

  switch (command) {
    case "compile":
      cmdCompile(args.slice(1));
      break;

    case "run":
      cmdRun(args.slice(1));
      break;

    case "watch":
      cmdWatch(args.slice(1));
      break;

    case "--version":
    case "-v":
      printVersion();
      process.exit(0);
      break;

    case "--help":
    case "-h":
    case "help":
      printHelp();
      process.exit(0);
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      console.error(`\nRun 'inscript --help' for usage information`);
      process.exit(1);
  }
}

// Run CLI
main();
