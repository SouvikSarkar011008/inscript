/**
 * InScript Runtime Module Index
 * Exports runtime engine, canvas API, and input API
 */

export { getRuntimeEngineCode } from './engine';
export { getCanvasAPICode } from './canvas';
export { getInputAPICode } from './input';

export function getAllRuntimeCode(): string {
  // Import all runtime code generators
  const { getRuntimeEngineCode } = require('./engine');
  const { getCanvasAPICode } = require('./canvas');
  const { getInputAPICode } = require('./input');
  
  return `
${getRuntimeEngineCode()}

${getCanvasAPICode()}

${getInputAPICode()}
`;
}
