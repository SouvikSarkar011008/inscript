"use strict";
/**
 * InScript Runtime Engine
 * Core game loop and event management system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRuntimeEngineCode = getRuntimeEngineCode;
function getRuntimeEngineCode() {
    return `
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
      
      console.log(\`🎮 Game Engine initialized: \${this.width}x\${this.height}\`);
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
`;
}
//# sourceMappingURL=engine.js.map