"use strict";
/**
 * InScript Vector Standard Library
 * Provides Vector2D and Vector3D classes for game mathematics
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorStdlib = void 0;
exports.getVectorRuntimeCode = getVectorRuntimeCode;
exports.VectorStdlib = {
    name: 'Vector',
    classes: {
        Vec2: {
            description: '2D Vector class',
            properties: ['x', 'y'],
            methods: ['add', 'subtract', 'multiply', 'divide', 'magnitude', 'normalize', 'dot', 'distance'],
        },
        Vec3: {
            description: '3D Vector class',
            properties: ['x', 'y', 'z'],
            methods: [
                'add',
                'subtract',
                'multiply',
                'divide',
                'magnitude',
                'normalize',
                'dot',
                'cross',
                'distance',
            ],
        },
    },
};
function getVectorRuntimeCode() {
    return `
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
    return \`Vec2(\${this.x}, \${this.y})\`;
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
    return \`Vec3(\${this.x}, \${this.y}, \${this.z})\`;
  }
}
`;
}
//# sourceMappingURL=vector.js.map