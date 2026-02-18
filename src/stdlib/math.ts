/**
 * InScript Math Standard Library
 * Provides mathematical utilities and functions
 */

export const MathStdlib = {
  name: 'Math',
  functions: {
    sin: {
      params: ['x'],
      description: 'Sine function (radians)',
    },
    cos: {
      params: ['x'],
      description: 'Cosine function (radians)',
    },
    tan: {
      params: ['x'],
      description: 'Tangent function (radians)',
    },
    asin: {
      params: ['x'],
      description: 'Arcsine function',
    },
    acos: {
      params: ['x'],
      description: 'Arccosine function',
    },
    atan: {
      params: ['x'],
      description: 'Arctangent function',
    },
    atan2: {
      params: ['y', 'x'],
      description: 'Arctangent of y/x',
    },
    sqrt: {
      params: ['x'],
      description: 'Square root',
    },
    pow: {
      params: ['base', 'exponent'],
      description: 'Power function',
    },
    abs: {
      params: ['x'],
      description: 'Absolute value',
    },
    floor: {
      params: ['x'],
      description: 'Floor (round down)',
    },
    ceil: {
      params: ['x'],
      description: 'Ceiling (round up)',
    },
    round: {
      params: ['x'],
      description: 'Round to nearest integer',
    },
    min: {
      params: ['...values'],
      description: 'Minimum value',
    },
    max: {
      params: ['...values'],
      description: 'Maximum value',
    },
    clamp: {
      params: ['value', 'min', 'max'],
      description: 'Clamp value between min and max',
    },
    lerp: {
      params: ['a', 'b', 't'],
      description: 'Linear interpolation between a and b (t: 0-1)',
    },
    distance: {
      params: ['x1', 'y1', 'x2', 'y2'],
      description: 'Euclidean distance between two points',
    },
    distance3d: {
      params: ['x1', 'y1', 'z1', 'x2', 'y2', 'z2'],
      description: 'Euclidean distance between two 3D points',
    },
    random: {
      params: [],
      description: 'Random number between 0 (inclusive) and 1 (exclusive)',
    },
    randomInt: {
      params: ['min', 'max'],
      description: 'Random integer between min (inclusive) and max (exclusive)',
    },
    randomRange: {
      params: ['min', 'max'],
      description: 'Random decimal between min and max',
    },
    degrees: {
      params: ['radians'],
      description: 'Convert radians to degrees',
    },
    radians: {
      params: ['degrees'],
      description: 'Convert degrees to radians',
    },
  },
};

export function getMathRuntimeCode(): string {
  return `
const Math = global.Math || {};

const inscriptMath = {
  sin: (x) => Math.sin(x),
  cos: (x) => Math.cos(x),
  tan: (x) => Math.tan(x),
  asin: (x) => Math.asin(x),
  acos: (x) => Math.acos(x),
  atan: (x) => Math.atan(x),
  atan2: (y, x) => Math.atan2(y, x),
  sqrt: (x) => Math.sqrt(x),
  pow: (base, exp) => Math.pow(base, exp),
  abs: (x) => Math.abs(x),
  floor: (x) => Math.floor(x),
  ceil: (x) => Math.ceil(x),
  round: (x) => Math.round(x),
  min: (...values) => Math.min(...values),
  max: (...values) => Math.max(...values),
  clamp: (value, min, max) => Math.max(min, Math.min(max, value)),
  lerp: (a, b, t) => a + (b - a) * t,
  distance: (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  },
  distance3d: (x1, y1, z1, x2, y2, z2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  },
  random: () => Math.random(),
  randomInt: (min, max) => Math.floor(Math.random() * (max - min)) + min,
  randomRange: (min, max) => min + Math.random() * (max - min),
  degrees: (rad) => rad * (180 / Math.PI),
  radians: (deg) => deg * (Math.PI / 180),
};
`;
}
