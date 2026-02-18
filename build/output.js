// InScript Runtime Helpers
// Print function
function print(value) {
  console.log(value);
}

// Type checking
function typeof(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

// ===== InScript Standard Library =====

// Math Library
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

// Vec2 - 2D Vector class
class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  multiply(scalar) {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  divide(scalar) {
    if (scalar === 0) throw new Error('Division by zero');
    return new Vec2(this.x / scalar, this.y / scalar);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vec2(0, 0);
    return this.divide(mag);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  distance(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  toString() {
    return `Vec2(${this.x}, ${this.y})`;
  }
}

// Vec3 - 3D Vector class
class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(other) {
    return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  subtract(other) {
    return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  multiply(scalar) {
    return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  divide(scalar) {
    if (scalar === 0) throw new Error('Division by zero');
    return new Vec3(this.x / scalar, this.y / scalar, this.z / scalar);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vec3(0, 0, 0);
    return this.divide(mag);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  cross(other) {
    return new Vec3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }

  distance(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  clone() {
    return new Vec3(this.x, this.y, this.z);
  }

  toString() {
    return `Vec3(${this.x}, ${this.y}, ${this.z})`;
  }
}

// String Library
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

// Array Library
const inscriptArray = {
  length: (arr) => Array.isArray(arr) ? arr.length : 0,
  push: (arr, value) => {
    if (Array.isArray(arr)) arr.push(value);
    return arr;
  },
  pop: (arr) => Array.isArray(arr) ? arr.pop() : undefined,
  shift: (arr) => Array.isArray(arr) ? arr.shift() : undefined,
  unshift: (arr, value) => {
    if (Array.isArray(arr)) arr.unshift(value);
    return arr;
  },
  get: (arr, index) => Array.isArray(arr) ? arr[index] : undefined,
  set: (arr, index, value) => {
    if (Array.isArray(arr)) arr[index] = value;
    return arr;
  },
  slice: (arr, start, end) => {
    if (!Array.isArray(arr)) return [];
    return end !== undefined ? arr.slice(start, end) : arr.slice(start);
  },
  splice: (arr, start, deleteCount, ...items) => {
    if (!Array.isArray(arr)) return [];
    return arr.splice(start, deleteCount, ...items);
  },
  indexOf: (arr, value) => Array.isArray(arr) ? arr.indexOf(value) : -1,
  includes: (arr, value) => Array.isArray(arr) ? arr.includes(value) : false,
  join: (arr, separator = ',') => Array.isArray(arr) ? arr.join(separator) : '',
  reverse: (arr) => {
    if (Array.isArray(arr)) arr.reverse();
    return arr;
  },
  sort: (arr) => {
    if (Array.isArray(arr)) arr.sort();
    return arr;
  },
  filter: (arr, callback) => Array.isArray(arr) ? arr.filter(callback) : [],
  map: (arr, callback) => Array.isArray(arr) ? arr.map(callback) : [],
  reduce: (arr, callback, initial) => {
    if (!Array.isArray(arr)) return initial;
    return initial !== undefined ? arr.reduce(callback, initial) : arr.reduce(callback);
  },
  forEach: (arr, callback) => {
    if (Array.isArray(arr)) arr.forEach(callback);
  },
  find: (arr, callback) => Array.isArray(arr) ? arr.find(callback) : undefined,
  findIndex: (arr, callback) => Array.isArray(arr) ? arr.findIndex(callback) : -1,
  some: (arr, callback) => Array.isArray(arr) ? arr.some(callback) : false,
  every: (arr, callback) => Array.isArray(arr) ? arr.every(callback) : true,
  concat: (arr, ...arrays) => {
    if (!Array.isArray(arr)) return [];
    return arr.concat(...arrays);
  },
  flatten: (arr, depth = 1) => {
    if (!Array.isArray(arr)) return [];
    return depth > 0 ? arr.reduce((acc, val) => 
      acc.concat(Array.isArray(val) ? inscriptArray.flatten(val, depth - 1) : val), []) : arr;
  },
};

const __gameConfig = {
  title: "Hello World Game",
  width: 800,
  height: 600,
  mode: "2d",
};

let score = 0;
const GRAVITY = 9.8;
function calculateHealth(maxHealth, damage) {
  return (maxHealth - damage);
}
class Player {
  name;
  health = 100;
constructor(playerName) {
        ;
  }
takeDamage(amount) {
        ;
  }
}
function __onInit() {
    print("Game initialized!");
}

function __onUpdate(dt) {
    ;
}

function __onInput(event) {
  if ((event.type == "keydown")) {
        print("Key pressed");
  }
}

function __onRender(canvas) {
    ;
    canvas.fillRect(0, 0, 800, 600);
}

