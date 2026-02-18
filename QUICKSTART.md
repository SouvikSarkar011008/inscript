# InScript Quick Start Guide

## Installation & Setup

InScript is a TypeScript-based compiler that generates JavaScript code for games.

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone or download the InScript repository
cd inscript

# Install dependencies
npm install

# Build the compiler
npm run build
```

## Creating Your First Game

### Step 1: Write the Game Code

Create a file named `my-game.inscript`:

```inscript
game MyGame {
    title: "My First Game"
    width: 800
    height: 600
}

let playerX = 400
let playerY = 300

on init() {
    print("Game initialized!")
}

on update(dt) {
    if Input.isArrowLeft() {
        playerX = playerX - 200 * dt
    }
    if Input.isArrowRight() {
        playerX = playerX + 200 * dt
    }
}

on render() {
    Canvas.clear("#1a1a2e")
    Canvas.drawCircle(playerX, playerY, 20, "#00ff00")
    Canvas.drawText("Arrow Keys to Move", 10, 10, "#ffffff", 14)
}
```

### Step 2: Compile to JavaScript

```bash
node build/cli/index.js compile my-game.inscript -o my-game.js
```

Or use the watch mode for development:

```bash
node build/cli/index.js watch my-game.inscript
```

### Step 3: Create HTML File

Create `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Game</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #0f0f1e;
        }
        canvas {
            border: 2px solid #00ff00;
            background: #000;
        }
    </style>
</head>
<body>
    <canvas id="game-canvas"></canvas>
    <script src="my-game.js"></script>
</body>
</html>
```

### Step 4: Run in Browser

Open `index.html` in your web browser or use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server
```

Then navigate to `http://localhost:8000`

## InScript Language Features

### Variables

```inscript
let mutable = 10
const immutable = 20
var alsoMutable = 30
```

### Functions

```inscript
func add(a, b) {
    return a + b
}

let result = add(5, 3)  // result = 8
```

### Classes

```inscript
class Player {
    name: text
    health: number = 100
    
    func new(playerName) {
        this.name = playerName
    }
    
    func takeDamage(amount) {
        this.health = this.health - amount
    }
}

let player = new Player("Hero")
player.takeDamage(10)
```

### Control Flow

```inscript
// If statements
if health <= 0 {
    print("Game Over!")
}

// For loops
for i = 0 to 10 {
    print(i)
}

// While loops
while score < 100 {
    score = score + 10
}

// Match/Case (switch)
match gameState {
    case "idle" {
        print("Waiting...")
    }
    case "playing" {
        print("Game running!")
    }
}
```

### Objects & Arrays

```inscript
let player = {
    x: 100,
    y: 200,
    health: 100
}

let enemies = [1, 2, 3]
let first = get(enemies, 0)
```

## Game Loop

Every game has four event handlers:

### 1. on init()
Called once when the game starts. Initialize game state here.

```inscript
on init() {
    print("Game starting!")
}
```

### 2. on update(dt)
Called every frame with deltaTime (time since last frame). Update game logic here.

```inscript
on update(dt) {
    player.x = player.x + player.velocity * dt
}
```

### 3. on render()
Called every frame after update. Draw graphics here.

```inscript
on render() {
    Canvas.clear("#000")
    Canvas.drawRect(player.x, player.y, 50, 50, "#0f0")
}
```

### 4. on input(event)
Called when user provides input (click, touch, etc).

```inscript
on input(event) {
    if event.type == "mousedown" {
        print("Clicked!")
    }
}
```

## Standard Library

### Math Functions

```inscript
let value = abs(-10)           // 10
let rounded = floor(3.7)       // 3
let root = sqrt(16)            // 4
let power = pow(2, 8)          // 256
let random = randomInt(1, 100) // Random 1-99
```

### Vectors

```inscript
let pos = new Vec2(100, 50)
let velocity = new Vec2(10, 5)
let newPos = pos.add(velocity)
let dist = pos.distance(velocity)
```

### String Functions

```inscript
let text = "Hello World"
let upper = toUpperCase(text)
let lower = toLowerCase(text)
let length = length(text)
let arr = split(text, " ")
```

### Array Functions

```inscript
let arr = [1, 2, 3, 4, 5]
let len = length(arr)
let first = get(arr, 0)
let doubled = map(arr, func(x) { return x * 2 })
let sum = reduce(arr, func(a, b) { return a + b }, 0)
```

## Input Handling

### Keyboard

```inscript
if Input.isArrowUp() {
    player.y = player.y - 5
}

if Input.isSpacePressed() {
    player.jump()
}
```

### Mouse

```inscript
let mousePos = Input.getMousePosition()

if Input.isMouseLeftPressed() {
    shoot(mousePos.x, mousePos.y)
}
```

### Touch

```inscript
let touches = Input.getTouches()
for i = 0 to length(touches) {
    let touch = get(touches, i)
    print("Touch at: " + touch.x + ", " + touch.y)
}
```

## Canvas Drawing

### Shapes

```inscript
Canvas.drawRect(x, y, width, height, color)
Canvas.drawCircle(x, y, radius, color)
Canvas.drawLine(x1, y1, x2, y2, color, thickness)
```

### Text

```inscript
Canvas.drawText("Score: 100", 10, 10, "#fff", 16)
Canvas.drawTextCenter("GAME OVER", 400, 300, "#f00", 32)
```

### Images

```inscript
let img = loadImage("player.png")
Canvas.drawImage(img, x, y)
```

## Complete Example: Pong Game

```inscript
game Pong {
    title: "Pong"
    width: 800
    height: 400
}

let ballX = 400
let ballY = 200
let ballVelX = 300
let ballVelY = 200
let ballSize = 5

let player = { y: 150, width: 10, height: 100 }
let enemy = { y: 150, width: 10, height: 100 }

on update(dt) {
    // Ball movement
    ballX = ballX + ballVelX * dt
    ballY = ballY + ballVelY * dt
    
    // Wall collision
    if ballY < 0 {
        ballY = 0
        ballVelY = -ballVelY
    }
    if ballY > 400 {
        ballY = 400
        ballVelY = -ballVelY
    }
    
    // Player control
    if Input.isArrowUp() {
        player.y = player.y - 300 * dt
    }
    if Input.isArrowDown() {
        player.y = player.y + 300 * dt
    }
}

on render() {
    Canvas.clear("#000")
    Canvas.drawCircle(ballX, ballY, ballSize, "#fff")
    Canvas.drawRect(10, player.y, player.width, player.height, "#fff")
    Canvas.drawRect(780, enemy.y, enemy.width, enemy.height, "#fff")
}
```

## Debugging

### Print to Console

```inscript
print("Debug: player.x = " + player.x)
```

Output appears in browser DevTools console.

### Watch Mode

Continuously recompile while developing:

```bash
node build/cli/index.js watch my-game.inscript -o my-game.js
```

## Performance Tips

1. **Hardware Acceleration**: Most modern browsers use GPU acceleration
2. **deltaTime**: Always use it in update logic for smooth frame-rate independent movement
3. **Clear Strategically**: Only clear areas that need updating if possible
4. **Cache Frequently Used Values**: Store computed values to avoid recalculation

## Next Steps

- Read the [Standard Library Reference](STDLIB.md)
- Read the [Runtime Engine Documentation](RUNTIME.md)
- Check out the [Language Specification](SPEC.md)
- Explore the [examples/](examples/) folder
- Build your own game!

## Common Issues

**"Canvas not showing"**
- Make sure your HTML has `<canvas id="game-canvas"></canvas>`
- Check browser console for JavaScript errors

**"Input not working"**
- Ensure canvas element has focus (click it first)
- Use lowercase key names: `"arrowup"` not `"ArrowUp"`

**"Game running slow"**
- Check if you're clearing the canvas unnecessarily
- Reduce draw calls per frame
- Use browser DevTools to profile performance

## Getting Help

- Check the language [SPEC.md](SPEC.md) for syntax details
- Read [STDLIB.md](STDLIB.md) for available functions
- Review [RUNTIME.md](RUNTIME.md) for engine documentation
- Look at [examples/](examples/) for working code samples

Happy game developing! 🎮
