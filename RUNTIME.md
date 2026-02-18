# InScript Runtime Engine Documentation

The InScript Runtime Engine provides a complete game loop with canvas drawing, input handling, and event management for creating interactive 2D games in the browser.

## Overview

The runtime system consists of three main components:

1. **Game Engine** - Core game loop with deltaTime, state management
2. **Canvas API** - Wrapper for 2D drawing operations
3. **Input API** - Keyboard, mouse, and touch input handling

## Game Engine

The `GameEngine` class manages the game lifecycle and provides the core update/render loop.

### Initialization

The game engine is automatically initialized from the compiled code:

```javascript
game.init("game-canvas");  // Initialize with canvas element ID
game.start();             // Begin the game loop
```

The canvas element is automatically created if it doesn't exist, with dimensions from the game declaration.

### Game Loop

The game engine runs a 60 FPS update/render cycle using `requestAnimationFrame`:

```
Frame Start
  ├─ Update deltaTime
  ├─ Call onUpdate(deltaTime)
  ├─ Clear canvas
  ├─ Call onRender()
  └─ Schedule next frame
```

### Properties

- **`deltaTime`** - Time since last frame in seconds
- **`fps`** - Target frames per second (default: 60)
- **`frameCount`** - Total frames rendered
- **`totalTime`** - Total elapsed time in seconds
- **`width`** - Canvas width in pixels
- **`height`** - Canvas height in pixels

### Methods

```javascript
game.start()              // Start the game loop
game.stop()               // Stop the game
game.pause()              // Pause simulation (still renders)
game.resume()             // Resume after pause
game.getContext()         // Get 2D canvas context
game.isKeyPressed(key)    // Check keyboard
game.getMousePosition()   // Get mouse X,Y
game.isMousePressed(btn)  // Check mouse button
game.getTouches()         // Get touch point data
```

### Callbacks

Set callbacks to respond to game events:

```javascript
game.onInit(() => {
  print("Game started!");
});

game.onUpdate((deltaTime) => {
  player.update(deltaTime);
});

game.onRender(() => {
  Canvas.drawRect(0, 0, 800, 600, "#000");
  player.draw();
});

game.onInput((event) => {
  if (event.type === "mousedown") {
    print(`Clicked at ${event.x}, ${event.y}`);
  }
});
```

## Canvas API

The Canvas API provides simplified drawing functions for 2D graphics.

### Clearing & Background

```javascript
Canvas.clear();                    // Clear entire canvas
Canvas.clear("#000000");          // Clear with color
Canvas.getWidth()                 // Get canvas width
Canvas.getHeight()                // Get canvas height
```

### Shapes

```javascript
Canvas.drawRect(x, y, width, height, color)
Canvas.drawRectStroke(x, y, width, height, color, lineWidth)

Canvas.drawCircle(x, y, radius, color)
Canvas.drawCircleStroke(x, y, radius, color, lineWidth)

Canvas.drawLine(x1, y1, x2, y2, color, lineWidth)
Canvas.drawTriangle(x1, y1, x2, y2, x3, y3, color)

Canvas.drawPolygon([
  {x: 0, y: 0},
  {x: 100, y: 0},
  {x: 50, y: 100}
], color)
```

### Text

```javascript
Canvas.drawText(text, x, y, color, fontSize, fontFamily)
Canvas.drawTextCenter(text, x, y, color, fontSize, fontFamily)
Canvas.measureText(text, fontSize, fontFamily)  // Get width in pixels
```

### Images & Sprites

```javascript
Canvas.drawImage(image, x, y)
Canvas.drawImage(image, x, y, width, height)

// Draw sprite from image texture atlas
Canvas.drawSprite(image, srcX, srcY, srcW, srcH, destX, destY, destW, destH)

// Load image asynchronously
loadImage("path/to/image.png").then(img => {
  Canvas.drawImage(img, 0, 0);
});
```

### Styling

```javascript
Canvas.setFillColor(color)
Canvas.setStrokeColor(color)
Canvas.setLineWidth(width)
Canvas.setOpacity(0.0 to 1.0)
Canvas.setFont(fontSize, fontFamily)
Canvas.getContext()  // Direct access to canvas 2D context
```

## Input API

The Input API provides keyboard, mouse, and touch input handling.

### Keyboard Input

```javascript
Input.isKeyPressed(key)     // Check if any key is pressed
Input.isKeyDown(key)        // Same as above

// Arrow keys
Input.isArrowUp()
Input.isArrowDown()
Input.isArrowLeft()
Input.isArrowRight()

// WASD keys
Input.isWPressed()
Input.isAPressed()
Input.isSPressed()
Input.isDPressed()

// Common keys
Input.isSpacePressed()
Input.isEnterPressed()
Input.isEscapePressed()
Input.isShiftPressed()
Input.isCtrlPressed()
Input.isAltPressed()
```

### Mouse Input

```javascript
Input.getMousePosition()     // {x, y} object
Input.getMouseX()            // X coordinate
Input.getMouseY()            // Y coordinate

Input.isMousePressed(button)        // 0=left, 1=middle, 2=right
Input.isMouseLeftPressed()
Input.isMouseRightPressed()
Input.isMouseMiddlePressed()
```

### Touch Input

```javascript
Input.getTouches()           // Array of touch points
Input.getTouchCount()        // Number of active touches
Input.getFirstTouch()        // First touch {x, y, id}
```

## InScript Game Example

```inscript
game MyGame {
    title: "My Game"
    width: 800
    height: 600
}

let player = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    speed: 200,
    color: "#00FF00"
}

// Called once at startup
on init() {
    print("Game started!")
}

// Called every frame with time delta
on update(dt) {
    // Move player with arrow keys
    let moveDistance = player.speed * dt
    
    if Input.isArrowLeft() {
        player.x = player.x - moveDistance
    }
    if Input.isArrowRight() {
        player.x = player.x + moveDistance
    }
    if Input.isArrowUp() {
        player.y = player.y - moveDistance
    }
    if Input.isArrowDown() {
        player.y = player.y + moveDistance
    }
}

// Called every frame for rendering
on render() {
    // Clear background
    Canvas.clear("#000000")
    
    // Draw player
    Canvas.drawRect(player.x, player.y, player.width, player.height, player.color)
    
    // Draw border
    Canvas.drawRectStroke(player.x, player.y, player.width, player.height, "#FFFF00", 2)
    
    // Draw text
    Canvas.drawText("Arrow Keys to Move", 10, 10, "#FFFFFF", 16)
}

// Handle input events
on input(event) {
    if event.type == "mousedown" {
        let mousePos = Input.getMousePosition()
        print("Clicked at: " + mousePos.x + ", " + mousePos.y)
    }
}
```

## Running InScript Games

### Compilation

```bash
npx inscript compile game.inscript -o game.js
```

### In HTML

Create an HTML file with a canvas element and script reference:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Game</title>
</head>
<body>
    <canvas id="game-canvas"></canvas>
    <script src="game.js"></script>
</body>
</html>
```

The runtime engine automatically:
- Creates/configures the canvas
- Sets up input listeners
- Runs the game loop
- Calls your event handlers

### Browser Compatibility

The runtime requires:
- HTML5 Canvas API
- ES6 (arrow functions, classes)
- `requestAnimationFrame` for smooth animation

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance Tips

1. **Use deltaTime for movement** - Always multiply speeds by `deltaTime` for frame-rate independent physics
2. **Clear strategically** - Only clear areas that need updating
3. **Batch drawing calls** - Draw similar objects together
4. **Avoid dynamic properties** - Cache frequently accessed game state
5. **Use simple shapes** - Circles and rectangles are faster than complex paths
6. **Optimize collision detection** - Use spatial partitioning for many objects

## Troubleshooting

**Canvas not appearing:**
- Ensure the HTML file has a `<canvas id="game-canvas"></canvas>` or the runtime will create one
- Check browser console for JavaScript errors

**Input not working:**
- Ensure the canvas element has focus
- Check that input keys match lowercase names (e.g., "arrowup" not "ArrowUp")

**Game running slowly:**
- Check frame rate with `game.fps` and `game.frameCount`
- Profile with browser DevTools Performance tab
- Reduce number of draw calls per frame

## Advanced Usage

### Direct Canvas Context Access

For advanced drawing operations not covered by Canvas API:

```javascript
let ctx = Canvas.getContext()
// Use standard Canvas 2D API
ctx.fillStyle = "#FF0000"
ctx.fillRect(0, 0, 100, 100)
```

### Game State Management

```inscript
let gameState = {
    level: 1,
    score: 0,
    lives: 3,
    isPaused: false
}

on update(dt) {
    if Input.isKeyPressed("p") {
        gameState.isPaused = !gameState.isPaused
    }
    
    if !gameState.isPaused {
        // Update game logic
    }
}
```

### Camera/Viewport

```inscript
let camera = {
    x: 0,
    y: 0,
    width: 800,
    height: 600
}

on render() {
    // Translate drawing position by camera offset
    Canvas.drawRect(player.x - camera.x, player.y - camera.y, 50, 50, "#00FF00")
}
```

## Summary

The InScript Runtime Engine provides everything needed to create 2D games:
- ✅ Smooth 60 FPS game loop
- ✅ Canvas drawing primitives
- ✅ Keyboard, mouse, and touch input
- ✅ Event-driven game lifecycle
- ✅ Browser compatibility

Start building games with InScript today!
