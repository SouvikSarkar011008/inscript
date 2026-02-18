# InScript Quick Reference Guide

## Table of Contents
1. [Syntax Cheat Sheet](#syntax-cheat-sheet)
2. [Built-in Data Types](#built-in-data-types)
3. [Common Functions](#common-functions)
4. [Game Development API](#game-development-api)
5. [Input Handling](#input-handling)
6. [Graphics & Drawing](#graphics--drawing)
7. [Physics & Collision](#physics--collision)
8. [Common Patterns](#common-patterns)

---

## Syntax Cheat Sheet

### Variables & Constants
```inscript
let x = 10              // Mutable variable
const PI = 3.14159      // Immutable constant
var y = 20              // Explicit variable (same as let)
```

### Operators
```inscript
// Arithmetic
a + b, a - b, a * b, a / b, a % b

// Comparison
a == b, a != b, a < b, a <= b, a > b, a >= b

// Logical
a && b, a || b, !a

// Assignment
x = 10, x += 5, x -= 3, x *= 2, x /= 4
```

### Control Flow
```inscript
// Conditionals
if x > 10 { print("Big") } else { print("Small") }

// Switch-like
match value {
    "a" => print("A")
    "b" => print("B")
    default => print("Other")
}

// Loops
for i in 1..10 { print(i) }
for item in list { print(item) }
while condition { update() }
loop { break }  // Infinite loop with break
```

### Functions
```inscript
func greet(name) { return "Hello, " + name }
func add(a, b) -> number { return a + b }
func setup(x = 0) { print(x) }
func sum(...args) { /** TODO: sum all args **/ }

let square = fn(x) { x * x }
numbers.map(fn(n) { n * 2 })
```

### Classes
```inscript
class Player {
    name: text
    health: number = 100
    
    func new(name) {
        this.name = name
    }
    
    func takeDamage(amount) {
        this.health = this.health - amount
    }
}

let p = Player("Hero")
p.takeDamage(10)
```

---

## Built-in Data Types

### Primitives
```inscript
type number     // Integer and floating-point
type text       // Strings
type bool       // true or false
type null       // null value

// Type checking
typeof(x)       // Returns type as text
isNumber(x)
isText(x)
isList(x)
```

### Collections
```inscript
// Lists
let arr = [1, 2, 3]
arr[0]          // Access element
arr.length      // Get length
arr.push(4)     // Add element
arr.pop()       // Remove last element

// Maps
let obj = {name: "Player", health: 100}
obj.name        // Access property
obj["health"]   // Alternative access

// Ranges
for i in 1..10 { }          // 1-10 inclusive
for i in 1...10 { }         // 1-9 inclusive
```

### Vectors (2D & 3D)
```inscript
v1 = Vec2(10, 20)
v2 = Vec3(10, 20, 30)

v1.x, v1.y, v1.z
v1.length()
v1.normalize()
v1.distance(v2)
v1.rotate(angle)
```

---

## Common Functions

### Output
```inscript
print(value)
print("Score: " + score)
```

### Math
```inscript
// Basic
abs(x)
min(a, b), max(a, b)
sqrt(x)
pow(base, exp)
floor(x), ceil(x), round(x)

// Trigonometry
sin(rad), cos(rad), tan(rad)
degrees(rad), radians(deg)

// Random
random()                // 0.0 to 1.0
random(min, max)        // Between min and max
randomInt(1, 100)       // Integer
randomChoice(list)      // Random element
```

### Strings
```inscript
str.length
str.toUpperCase()
str.toLowerCase()
str.substring(start, end)
str.split(",")
str.contains("text")
str.trim()
str.repeat(3)

// String interpolation
"Player: {name}, Level: {level}"
```

### Arrays
```inscript
arr.length
arr.push(item)
arr.pop()
arr.shift()
arr.unshift(item)
arr.reverse()
arr.sort()
arr.indexOf(item)
arr.contains(item)
arr.slice(start, end)
arr.join(",")

// Functional
arr.map(fn(x) { x * 2 })
arr.filter(fn(x) { x > 5 })
arr.reduce(fn(acc, x) { acc + x }, 0)
arr.forEach(fn(x) { print(x) })
arr.find(fn(x) { x == 5 })
arr.some(fn(x) { x > 10 })
arr.every(fn(x) { x > 0 })
```

---

## Game Development API

### Game Configuration
```inscript
game MyGame {
    title: "Game Title"
    width: 800                  // Canvas width
    height: 600                 // Canvas height
    mode: "2d"                  // "2d", "3d", or "hybrid"
    backgroundColor: "#FFFFFF"  // Default background
    targetFPS: 60              // Target frame rate
}
```

### Game Lifecycle Hooks

```inscript
// Called once at startup
on init() {
    // Initialize game resources
}

// Called every frame before render
on update(deltaTime: number) {
    // Update game state
    // deltaTime: seconds since last frame
}

// Called for every input event
on input(event: InputEvent) {
    // Handle keyboard, mouse, touch
}

// Called every frame to render
on render(canvas: Canvas) {
    // Draw game graphics
}
```

### Asset Declaration
```inscript
assets {
    image player_sprite = "sprites/player.png"
    image background = "background.png"
    
    audio sfx_jump = "sounds/jump.wav"
    audio music_bg = "music/background.mp3"
    
    font title_font = "fonts/Arial.ttf", size: 48
    font ui_font = "fonts/Arial.ttf", size: 16
    
    model player_model = "models/player.fbx"
}

// Usage in code
on init() {
    let sprite = assets.player_sprite
    assets.sfx_jump.play()
}
```

---

## Input Handling

### Keyboard Input
```inscript
on input(event) {
    if event.type == "keydown" {
        key = event.key  // "ArrowUp", "a", " ", etc.
        
        match key {
            "ArrowUp" => moveUp()
            "ArrowDown" => moveDown()
            "w" => moveForward()
            " " => jump()
        }
    }
    
    if event.type == "keyup" {
        // Handle key release
    }
}

// Check key state each frame
on update(dt) {
    if input.isKeyPressed("w") {
        player.moveForward()
    }
    if input.isKeyDown("Shift") {
        player.sprint()
    }
}
```

### Mouse Input
```inscript
on input(event) {
    if event.type == "mousemove" {
        mouseX = event.x
        mouseY = event.y
    }
    
    if event.type == "mousedown" {
        button = event.button  // 0=left, 1=middle, 2=right
        shoot()
    }
    
    if event.type == "mouseup" {
        // Button released
    }
}

// Check mouse state
on update(dt) {
    if input.isMouseDown(0) {
        // Left button held
    }
}
```

### Touch Input
```inscript
on input(event) {
    if event.type == "touch" {
        for touch in event.touches {
            x = touch.x
            y = touch.y
            touch.id  // Unique touch identifier
        }
    }
}
```

---

## Graphics & Drawing

### 2D Canvas Drawing
```inscript
on render(canvas) {
    // Fill color and stroke
    canvas.fillColor = "#FF0000"      // Hex
    canvas.strokeColor = "rgba(0,0,0,1)"
    canvas.lineWidth = 2
    canvas.lineCap = "round"          // "butt", "round", "square"
    canvas.lineJoin = "round"         // "bevel", "round", "miter"
    
    // Rectangles
    canvas.fillRect(x, y, w, h)
    canvas.strokeRect(x, y, w, h)
    canvas.clearRect(x, y, w, h)      // Erase
    
    // Circles
    canvas.fillCircle(cx, cy, r)
    canvas.strokeCircle(cx, cy, r)
    
    // Polygons
    points = [Vec2(0, 0), Vec2(100, 0), Vec2(50, 100)]
    canvas.fillPolygon(points)
    canvas.strokePolygon(points)
    
    // Lines
    canvas.line(x1, y1, x2, y2)
    canvas.polyline([p1, p2, p3])
    
    // Text
    canvas.font = "24px Arial"
    canvas.fontColor = "black"
    canvas.text("Hello", x, y)
    canvas.textAlign = "center"       // "left", "center", "right"
    
    // Images
    img = assets.background
    canvas.drawImage(img, x, y)
    canvas.drawImage(img, x, y, width, height)
    
    // Transformations
    canvas.save()
    canvas.translate(x, y)
    canvas.rotate(angle)
    canvas.scale(sx, sy)
    canvas.drawImage(img, 0, 0)
    canvas.restore()
}
```

### Drawing Helper Class
```inscript
class Sprite {
    image: Image
    x: number
    y: number
    width: number
    height: number
    rotation: number = 0
    scaleX: number = 1
    scaleY: number = 1
    opacity: number = 1
    
    func draw(canvas) {
        canvas.save()
        canvas.translate(this.x, this.y)
        canvas.rotate(this.rotation)
        canvas.scale(this.scaleX, this.scaleY)
        canvas.globalAlpha = this.opacity
        canvas.drawImage(this.image, 0, 0, this.width, this.height)
        canvas.restore()
    }
}
```

---

## Physics & Collision

### Simple Collision Detection
```inscript
// Rectangle collision
func rectCollide(a, b) -> bool {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y
}

// Circle collision
func circleCollide(a, b) -> bool {
    dist = distance(Vec2(a.x, a.y), Vec2(b.x, b.y))
    return dist < a.radius + b.radius
}

// Usage
on update(dt) {
    for obstacle in obstacles {
        if rectCollide(player, obstacle) {
            player.takeDamage(10)
        }
    }
}
```

### Physics Body
```inscript
class PhysicsBody {
    x: number
    y: number
    vx: number = 0
    vy: number = 0
    ax: number = 0
    ay: number = 0
    friction: number = 0.1
    gravity: number = 9.8
    
    func applyForce(fx, fy) {
        this.ax = this.ax + fx
        this.ay = this.ay + fy
    }
    
    func update(dt) {
        this.vx = this.vx + this.ax * dt
        this.vy = this.vy + this.ay * dt
        
        this.vx = this.vx * (1 - this.friction)
        this.vy = this.vy * (1 - this.friction)
        
        this.ay = this.gravity  // Reset gravity each frame
        this.ax = 0
        
        this.x = this.x + this.vx * dt
        this.y = this.y + this.vy * dt
    }
}
```

---

## Common Patterns

### Game Objects with Update/Draw
```inscript
class GameObject {
    x: number
    y: number
    
    func update(dt) { }
    func draw(canvas) { }
}

class Player extends GameObject {
    func update(dt) {
        // Handle movement
    }
    
    func draw(canvas) {
        // Render player
    }
}

// Main game
let objects = []

on init() {
    objects.push(Player())
}

on update(dt) {
    for obj in objects {
        obj.update(dt)
    }
}

on render(canvas) {
    for obj in objects {
        obj.draw(canvas)
    }
}
```

### Game States
```inscript
let gameState = "menu"

on input(event) {
    match gameState {
        "menu" => handleMenuInput(event)
        "playing" => handleGameInput(event)
        "paused" => handlePauseInput(event)
        "gameover" => handleGameoverInput(event)
    }
}

on update(dt) {
    match gameState {
        "menu" => updateMenu(dt)
        "playing" => updateGame(dt)
        "paused" => updatePause(dt)
        "gameover" => updateGameover(dt)
    }
}

on render(canvas) {
    match gameState {
        "menu" => renderMenu(canvas)
        "playing" => renderGame(canvas)
        "paused" => renderPause(canvas)
        "gameover" => renderGameover(canvas)
    }
}
```

### Spawning Objects
```inscript
let enemies = []

func spawnEnemy(x, y) {
    enemy = Enemy(x, y)
    enemies.push(enemy)
}

func removeEnemy(enemy) {
    idx = enemies.indexOf(enemy)
    if idx >= 0 {
        enemies.splice(idx, 1)
    }
}

on update(dt) {
    // Update all enemies
    for i = enemies.length - 1; i >= 0; i = i - 1 {
        enemy = enemies[i]
        enemy.update(dt)
        
        if enemy.isDead() {
            removeEnemy(enemy)
        }
    }
}
```

### Score & UI
```inscript
class ScoreManager {
    score: number = 0
    highScore: number = 0
    
    func addScore(amount) {
        this.score = this.score + amount
        if this.score > this.highScore {
            this.highScore = this.score
        }
    }
    
    func reset() {
        this.score = 0
    }
}

let scoreManager = ScoreManager()

on update(dt) {
    if playerKilledEnemy() {
        scoreManager.addScore(100)
    }
}

on render(canvas) {
    canvas.font = "24px Arial"
    canvas.text("Score: " + scoreManager.score, 10, 30)
    canvas.text("High: " + scoreManager.highScore, 10, 60)
}
```

### Timer/Cooldown
```inscript
class Timer {
    duration: number
    elapsed: number = 0
    isActive: bool = false
    callback: func
    
    func start(duration, callback = null) {
        this.duration = duration
        this.elapsed = 0
        this.isActive = true
        this.callback = callback
    }
    
    func update(dt) {
        if this.isActive {
            this.elapsed = this.elapsed + dt
            if this.elapsed >= this.duration {
                this.isActive = false
                if this.callback {
                    this.callback()
                }
            }
        }
    }
    
    func isFinished() -> bool {
        return not this.isActive and this.elapsed >= this.duration
    }
}

// Usage
let shootTimer = Timer()

on input(event) {
    if event.key == " " and not shootTimer.isActive {
        shoot()
        shootTimer.start(0.3)  // 300ms cooldown
    }
}

on update(dt) {
    shootTimer.update(dt)
}
```

---

## Tips & Best Practices

1. **Organize Code**: Use classes to group related data and behavior
2. **Constants**: Define magic numbers as constants at the top
3. **Comments**: Explain the "why", not the "what"
4. **Physics**: Use deltaTime (dt) for frame-rate independent movement
5. **Input**: Check input state in update() for smooth controls
6. **Collisions**: Loop backwards when removing from arrays
7. **Performance**: Cache frequently accessed values
8. **Testing**: Test your game at different frame rates

---

This quick reference covers the most common InScript patterns for game development!
