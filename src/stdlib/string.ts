/**
 * InScript String Standard Library
 * Provides string manipulation utilities
 */

export const StringStdlib = {
  name: 'String',
  functions: {
    length: {
      params: ['str'],
      description: 'Get string length',
    },
    charAt: {
      params: ['str', 'index'],
      description: 'Get character at index',
    },
    substring: {
      params: ['str', 'start', 'end'],
      description: 'Extract substring',
    },
    slice: {
      params: ['str', 'start', 'end'],
      description: 'Slice string (supports negative indices)',
    },
    indexOf: {
      params: ['str', 'search'],
      description: 'Find index of substring',
    },
    lastIndexOf: {
      params: ['str', 'search'],
      description: 'Find last index of substring',
    },
    includes: {
      params: ['str', 'search'],
      description: 'Check if string contains substring',
    },
    startsWith: {
      params: ['str', 'search'],
      description: 'Check if string starts with substring',
    },
    endsWith: {
      params: ['str', 'search'],
      description: 'Check if string ends with substring',
    },
    toLowerCase: {
      params: ['str'],
      description: 'Convert to lowercase',
    },
    toUpperCase: {
      params: ['str'],
      description: 'Convert to uppercase',
    },
    trim: {
      params: ['str'],
      description: 'Remove whitespace from both ends',
    },
    split: {
      params: ['str', 'separator'],
      description: 'Split string into array',
    },
    replace: {
      params: ['str', 'search', 'replacement'],
      description: 'Replace first occurrence',
    },
    replaceAll: {
      params: ['str', 'search', 'replacement'],
      description: 'Replace all occurrences',
    },
    repeat: {
      params: ['str', 'count'],
      description: 'Repeat string n times',
    },
    reverse: {
      params: ['str'],
      description: 'Reverse string',
    },
    concat: {
      params: ['...strings'],
      description: 'Concatenate strings',
    },
  },
};

export function getStringRuntimeCode(): string {
  return `
const inscriptString = {
  length: (str) => String(str).length,
  charAt: (str, index) => String(str).charAt(index),
  substring: (str, start, end) => {
    const s = String(str);
    return end !== undefined ? s.substring(start, end) : s.substring(start);
  },
  slice: (str, start, end) => {
    const s = String(str);
    return end !== undefined ? s.slice(start, end) : s.slice(start);
  },
  indexOf: (str, search) => String(str).indexOf(String(search)),
  lastIndexOf: (str, search) => String(str).lastIndexOf(String(search)),
  includes: (str, search) => String(str).includes(String(search)),
  startsWith: (str, search) => String(str).startsWith(String(search)),
  endsWith: (str, search) => String(str).endsWith(String(search)),
  toLowerCase: (str) => String(str).toLowerCase(),
  toUpperCase: (str) => String(str).toUpperCase(),
  trim: (str) => String(str).trim(),
  split: (str, separator) => {
    const s = String(str);
    return separator === undefined ? [s] : s.split(String(separator));
  },
  replace: (str, search, replacement) => {
    return String(str).replace(String(search), String(replacement));
  },
  replaceAll: (str, search, replacement) => {
    return String(str).replaceAll(String(search), String(replacement));
  },
  repeat: (str, count) => String(str).repeat(Math.floor(count)),
  reverse: (str) => String(str).split('').reverse().join(''),
  concat: (...strs) => strs.map(String).join(''),
};
`;
}
