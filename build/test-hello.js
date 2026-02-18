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


// ===== InScript Runtime Engine =====

class GameEngine {
  constructor(config = {}) {
    this.running = false;
    this.paused = false;
    this.deltaTime = 0;
    this.fps = 60;
    this.frameTime = 1000 / this.fps;
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.totalTime = 0;
    
    // Configuration
    this.title = config.title || "InScript Game";
    this.width = config.width || 800;
    this.height = config.height || 600;
    this.backgroundColor = config.backgroundColor || "#000000";
    
    // Canvas setup
    this.canvas = null;
    this.ctx = null;
    
    // Event handlers
    this.onInitCallback = null;
    this.onUpdateCallback = null;
    this.onRenderCallback = null;
    this.onInputCallback = null;
    
    // Input state
    this.input = {
      keys: {},
      mouse: { x: 0, y: 0, pressed: false, button: null },
      touches: [],
    };
    
    // Game state
    this.gameState = {};
  }
  
  /**
   * Initialize the engine and set up canvas
   */
  init(canvasElementId = "game-canvas") {
    try {
      this.canvas = document.getElementById(canvasElementId);
      if (!this.canvas) {
        // Create canvas if it doesn't exist
        this.canvas = document.createElement("canvas");
        this.canvas.id = canvasElementId;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.border = "1px solid #ccc";
        this.canvas.style.display = "block";
        this.canvas.style.margin = "10px auto";
        this.canvas.style.backgroundColor = this.backgroundColor;
        document.body.appendChild(this.canvas);
        
        // Style body
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";
      } else {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.backgroundColor = this.backgroundColor;
      }
      
      this.ctx = this.canvas.getContext("2d");
      
      // Set up input listeners
      this.setupInputListeners();
      
      // Call user init callback
      if (this.onInitCallback) {
        this.onInitCallback();
      }
      
      console.log(`🎮 Game Engine initialized: ${this.width}x${this.height}`);
    } catch (error) {
      console.error("Failed to initialize game engine:", error);
    }
  }
  
  /**
   * Set up keyboard, mouse, and touch input listeners
   */
  setupInputListeners() {
    // Keyboard
    window.addEventListener("keydown", (e) => {
      this.input.keys[e.key.toLowerCase()] = true;
    });
    
    window.addEventListener("keyup", (e) => {
      this.input.keys[e.key.toLowerCase()] = false;
    });
    
    // Mouse
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.input.mouse.x = e.clientX - rect.left;
      this.input.mouse.y = e.clientY - rect.top;
    });
    
    this.canvas.addEventListener("mousedown", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.input.mouse.x = e.clientX - rect.left;
      this.input.mouse.y = e.clientY - rect.top;
      this.input.mouse.pressed = true;
      this.input.mouse.button = e.button;
      
      if (this.onInputCallback) {
        this.onInputCallback({
          type: "mousedown",
          button: e.button,
          x: this.input.mouse.x,
          y: this.input.mouse.y,
        });
      }
    });
    
    this.canvas.addEventListener("mouseup", (e) => {
      this.input.mouse.pressed = false;
      
      if (this.onInputCallback) {
        this.onInputCallback({
          type: "mouseup",
          button: e.button,
          x: this.input.mouse.x,
          y: this.input.mouse.y,
        });
      }
    });
    
    // Touch
    this.canvas.addEventListener("touchstart", (e) => {
      this.handleTouchEvent(e, "touchstart");
    });
    
    this.canvas.addEventListener("touchmove", (e) => {
      this.handleTouchEvent(e, "touchmove");
    });
    
    this.canvas.addEventListener("touchend", (e) => {
      this.handleTouchEvent(e, "touchend");
    });
  }
  
  /**
   * Handle touch events
   */
  handleTouchEvent(e, type) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    
    this.input.touches = [];
    for (let touch of e.touches) {
      this.input.touches.push({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        id: touch.identifier,
      });
    }
    
    if (this.onInputCallback && this.input.touches.length > 0) {
      this.onInputCallback({
        type: type,
        touches: this.input.touches,
      });
    }
  }
  
  /**
   * Start the game loop
   */
  start() {
    if (this.running) return;
    this.running = true;
    this.lastFrameTime = performance.now();
    console.log("🎮 Game started");
    this.gameLoop();
  }
  
  /**
   * Main game loop
   */
  gameLoop = () => {
    const currentTime = performance.now();
    this.deltaTime = Math.min((currentTime - this.lastFrameTime) / 1000, 0.1);
    this.lastFrameTime = currentTime;
    this.totalTime += this.deltaTime;
    this.frameCount++;
    
    if (!this.paused) {
      // Update
      if (this.onUpdateCallback) {
        this.onUpdateCallback(this.deltaTime);
      }
    }
    
    // Render
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    if (this.onRenderCallback) {
      this.onRenderCallback();
    }
    
    if (this.running) {
      requestAnimationFrame(this.gameLoop);
    }
  }
  
  /**
   * Pause the game
   */
  pause() {
    this.paused = true;
    console.log("⏸️  Game paused");
  }
  
  /**
   * Resume the game
   */
  resume() {
    this.paused = false;
    this.lastFrameTime = performance.now();
    console.log("▶️  Game resumed");
  }
  
  /**
   * Stop the game
   */
  stop() {
    this.running = false;
    console.log("⏹️  Game stopped");
  }
  
  /**
   * Check if a key is pressed
   */
  isKeyPressed(key) {
    return this.input.keys[key.toLowerCase()] === true;
  }
  
  /**
   * Get mouse position
   */
  getMousePosition() {
    return { x: this.input.mouse.x, y: this.input.mouse.y };
  }
  
  /**
   * Get mouse button state
   */
  isMousePressed(button = 0) {
    return this.input.mouse.pressed && this.input.mouse.button === button;
  }
  
  /**
   * Get touches
   */
  getTouches() {
    return this.input.touches;
  }
  
  /**
   * Get drawing context
   */
  getContext() {
    return this.ctx;
  }
  
  /**
   * Set callback functions
   */
  onInit(callback) {
    this.onInitCallback = callback;
  }
  
  onUpdate(callback) {
    this.onUpdateCallback = callback;
  }
  
  onRender(callback) {
    this.onRenderCallback = callback;
  }
  
  onInput(callback) {
    this.onInputCallback = callback;
  }
}

// Create global game engine instance
const game = new GameEngine(__gameConfig || {});



// ===== InScript Canvas API =====

// Helper to get canvas context from game engine
function getCanvas() {
  return game.getContext();
}

// Canvas/Drawing API
const Canvas = {
  // Clear canvas
  clear: (color = null) => {
    const ctx = getCanvas();
    if (color) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, game.width, game.height);
    } else {
      ctx.clearRect(0, 0, game.width, game.height);
    }
  },
  
  // Drawing shapes
  drawRect: (x, y, width, height, color = "#fff") => {
    const ctx = getCanvas();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  },
  
  drawRectStroke: (x, y, width, height, color = "#fff", lineWidth = 1) => {
    const ctx = getCanvas();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x, y, width, height);
  },
  
  drawCircle: (x, y, radius, color = "#fff") => {
    const ctx = getCanvas();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  },
  
  drawCircleStroke: (x, y, radius, color = "#fff", lineWidth = 1) => {
    const ctx = getCanvas();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
  },
  
  drawLine: (x1, y1, x2, y2, color = "#fff", lineWidth = 1) => {
    const ctx = getCanvas();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  },
  
  drawPolygon: (points, color = "#fff") => {
    const ctx = getCanvas();
    if (points.length < 2) return;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();
  },
  
  drawTriangle: (x1, y1, x2, y2, x3, y3, color = "#fff") => {
    Canvas.drawPolygon([
      { x: x1, y: y1 },
      { x: x2, y: y2 },
      { x: x3, y: y3 },
    ], color);
  },
  
  // Text drawing
  drawText: (text, x, y, color = "#fff", fontSize = 16, fontFamily = "Arial") => {
    const ctx = getCanvas();
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(String(text), x, y);
  },
  
  drawTextCenter: (text, x, y, color = "#fff", fontSize = 16, fontFamily = "Arial") => {
    const ctx = getCanvas();
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(text), x, y);
  },
  
  measureText: (text, fontSize = 16, fontFamily = "Arial") => {
    const ctx = getCanvas();
    ctx.font = `${fontSize}px ${fontFamily}`;
    return ctx.measureText(String(text)).width;
  },
  
  // Image drawing
  drawImage: (image, x, y, width = null, height = null) => {
    const ctx = getCanvas();
    if (width && height) {
      ctx.drawImage(image, x, y, width, height);
    } else {
      ctx.drawImage(image, x, y);
    }
  },
  
  // Sprites and animations
  drawSprite: (image, srcX, srcY, srcWidth, srcHeight, destX, destY, destWidth = null, destHeight = null) => {
    const ctx = getCanvas();
    if (destWidth && destHeight) {
      ctx.drawImage(image, srcX, srcY, srcWidth, srcHeight, destX, destY, destWidth, destHeight);
    } else {
      ctx.drawImage(image, srcX, srcY, srcWidth, srcHeight, destX, destY, srcWidth, srcHeight);
    }
  },
  
  // Color and style
  setFillColor: (color) => {
    getCanvas().fillStyle = color;
  },
  
  setStrokeColor: (color) => {
    getCanvas().strokeStyle = color;
  },
  
  setLineWidth: (width) => {
    getCanvas().lineWidth = width;
  },
  
  setOpacity: (opacity) => {
    getCanvas().globalAlpha = Math.max(0, Math.min(1, opacity));
  },
  
  setFont: (fontSize, fontFamily = "Arial") => {
    getCanvas().font = `${fontSize}px ${fontFamily}`;
  },
  
  // Canvas dimensions
  getWidth: () => game.width,
  getHeight: () => game.height,
  
  // Get context for advanced drawing
  getContext: () => getCanvas(),
};

// Utility function for loading images
function loadImage(src, onLoad = null) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (onLoad) onLoad(img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}



// ===== InScript Input API =====

const Input = {
  // Keyboard input
  isKeyPressed: (key) => game.isKeyPressed(key),
  
  isKeyDown: (key) => game.isKeyPressed(key),
  
  // Arrow keys
  isArrowUp: () => game.isKeyPressed("arrowup"),
  isArrowDown: () => game.isKeyPressed("arrowdown"),
  isArrowLeft: () => game.isKeyPressed("arrowleft"),
  isArrowRight: () => game.isKeyPressed("arrowright"),
  
  // WASD keys
  isWPressed: () => game.isKeyPressed("w"),
  isAPressed: () => game.isKeyPressed("a"),
  isSPressed: () => game.isKeyPressed("s"),
  isDPressed: () => game.isKeyPressed("d"),
  
  // Common keys
  isSpacePressed: () => game.isKeyPressed(" "),
  isEnterPressed: () => game.isKeyPressed("enter"),
  isEscapePressed: () => game.isKeyPressed("escape"),
  isShiftPressed: () => game.isKeyPressed("shift"),
  isCtrlPressed: () => game.isKeyPressed("control"),
  isAltPressed: () => game.isKeyPressed("alt"),
  
  // Mouse input
  getMousePosition: () => game.getMousePosition(),
  getMouseX: () => game.getMousePosition().x,
  getMouseY: () => game.getMousePosition().y,
  
  isMousePressed: (button = 0) => game.isMousePressed(button),
  isMouseLeftPressed: () => game.isMousePressed(0),
  isMouseRightPressed: () => game.isMousePressed(2),
  isMouseMiddlePressed: () => game.isMousePressed(1),
  
  // Touch input
  getTouches: () => game.getTouches(),
  getTouchCount: () => game.getTouches().length,
  getFirstTouch: () => {
    const touches = game.getTouches();
    return touches.length > 0 ? touches[0] : null;
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



// ===== Game Initialization =====

// Initialize the game engine
game.init("game-canvas");

// Register event handlers if they exist
if (typeof __onInit === "function") {
  game.onInit(__onInit);
}

if (typeof __onUpdate === "function") {
  game.onUpdate(__onUpdate);
}

if (typeof __onRender === "function") {
  game.onRender(__onRender);
}

if (typeof __onInput === "function") {
  game.onInput(__onInput);
}

// Start the game
game.start();
