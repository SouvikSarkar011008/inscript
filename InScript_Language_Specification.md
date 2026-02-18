# InScript Language Specification

## 1. Overview

**InScript** is a game development programming language designed to be intuitive and approachable while maintaining the power needed for serious game creation. It compiles to JavaScript and WebGL, making games runnable in browsers and via Node.js with native bindings.

### Philosophy
- **Readability First**: Clear, English-like syntax that reads naturally
- **Game-Dev Focused**: Built-in support for 2D and 3D graphics, input, and physics
- **Minimal Boilerplate**: Get games running with minimal setup code
- **Gradual Complexity**: Simple for beginners, powerful for advanced developers

---

## 2. Language Syntax & Features

### 2.1 Basic Structure

```inscript
// Comments use double slash
/* Multi-line comments
   are supported too */

game MyGame {
    title: "My First Game"
    width: 800
    height: 600
    mode: "2d"  // or "3d" or "hybrid"
}
```

### 2.2 Data Types

```inscript
// Primitives
number: 42, 3.14, -100
text: "Hello", 'World'
bool: true, false
null: null

// Collections
list: [1, 2, 3, 4, 5]
map: {name: "Player", health: 100}

// Ranges
range: 1..10        // inclusive range
range: 1...10       // exclusive range
```

### 2.3 Variables

```inscript
let x = 10                          // mutable variable
const GRAVITY = 9.8                 // immutable constant
var velocity = {x: 0, y: 0}         // explicit variable

x = 20                              // valid
GRAVITY = 5                         // ERROR: cannot reassign const
```

### 2.4 Control Flow

```inscript
// If/Else
if score > 100 {
    print("High score!")
} else if score > 50 {
    print("Good score!")
} else {
    print("Try again!")
}

// Switch
match playerClass {
    "warrior" => attackPower = 15
    "mage" => attackPower = 10
    "archer" => attackPower = 12
    default => attackPower = 8
}

// Loops
for i in 1..10 {
    print(i)
}

while playerAlive {
    update()
}

loop {        // infinite loop
    // break and continue work as expected
}

// For-Each
for item in inventory {
    print(item)
}
```

### 2.5 Functions

```inscript
// Basic function
func greet(name) {
    return "Hello, " + name + "!"
}

// With type hints (optional)
func add(a: number, b: number) -> number {
    return a + b
}

// Multiple return values
func divmod(a: number, b: number) -> (number, number) {
    return (a / b, a % b)
}

// Lambda expressions
let square = fn(x) { x * x }
let numbers = [1, 2, 3].map(fn(x) { x * 2 })

// Default parameters
func createPlayer(name, level = 1) {
    return {name: name, level: level, health: 100}
}

// Variadic arguments
func sum(...numbers) {
    total = 0
    for n in numbers {
        total = total + n
    }
    return total
}
```

### 2.6 Classes and Objects

```inscript
class Player {
    name: text
    health: number
    position: Vec2
    
    func new(name, x = 0, y = 0) {
        this.name = name
        this.health = 100
        this.position = Vec2(x, y)
    }
    
    func takeDamage(amount) {
        this.health = this.health - amount
        if this.health <= 0 {
            this.die()
        }
    }
    
    func die() {
        print(this.name + " has been defeated!")
    }
    
    private func updateAnimation() {
        // Private methods
    }
}

// Usage
let player = Player("Hero", 100, 200)
player.takeDamage(10)
```

### 2.7 Inheritance

```inscript
class Enemy {
    health: number
    type: text
    
    func new(type) {
        this.type = type
        this.health = 50
    }
}

class Goblin extends Enemy {
    func new() {
        super("goblin")
        this.health = 30
    }
    
    func attack(target) {
        damage = 5
        target.takeDamage(damage)
    }
}
```

---

## 3. Game Development Features

### 3.1 Game Lifecycle

```inscript
game MyGame {
    title: "My Game"
    width: 1024
    height: 768
    mode: "2d"
}

// Called once when game starts
on init() {
    player = Player("Hero", 512, 384)
    enemies = []
    score = 0
}

// Called each frame (before render)
on update(deltaTime) {
    player.update(deltaTime)
    for enemy in enemies {
        enemy.update(deltaTime)
    }
}

// Called each frame (before update)
on input(event) {
    if event.type == "keydown" {
        match event.key {
            "ArrowUp" => player.moveUp()
            "ArrowDown" => player.moveDown()
            "ArrowLeft" => player.moveLeft()
            "ArrowRight" => player.moveRight()
            " " => player.jump()
        }
    }
}

// Called each frame (renders game state)
on render(canvas) {
    canvas.fill("white")
    player.draw(canvas)
    for enemy in enemies {
        enemy.draw(canvas)
    }
}
```

### 3.2 2D Graphics

```inscript
// Drawing shapes on canvas
on render(canvas) {
    // Colors
    canvas.fillColor = "#FF0000"       // hex color
    canvas.strokeColor = rgb(255, 0, 0)
    canvas.lineWidth = 2
    
    // Rectangles
    canvas.fillRect(x, y, width, height)
    canvas.strokeRect(x, y, width, height)
    
    // Circles
    canvas.fillCircle(centerX, centerY, radius)
    canvas.strokeCircle(centerX, centerY, radius)
    
    // Polygons
    canvas.fillPolygon([Point(0, 0), Point(100, 0), Point(50, 100)])
    
    // Lines
    canvas.line(x1, y1, x2, y2)
    
    // Text
    canvas.font = "20px Arial"
    canvas.text("Score: 100", 10, 30)
    
    // Images/Sprites
    let sprite = assets.image("player.png")
    canvas.drawImage(sprite, x, y)
    canvas.drawImage(sprite, x, y, width, height, srcX, srcY, srcW, srcH)
}

// Sprites - more advanced 2D
class Sprite {
    image: Image
    position: Vec2
    scale: Vec2
    rotation: number
    opacity: number
    
    func draw(canvas) {
        // Automatic rendering with transformations
    }
}
```

### 3.3 3D Graphics

```inscript
game MyGame {
    mode: "3d"
}

on init() {
    // Create 3D objects
    cube = Model3D("cube")
    cube.position = Vec3(0, 0, -5)
    cube.scale = Vec3(1, 1, 1)
    
    sphere = Model3D("sphere")
    sphere.position = Vec3(3, 0, -8)
    
    // Lighting
    light = Light3D("directional")
    light.direction = Vec3(1, 1, -1)
    light.color = white
    light.intensity = 1.0
}

on render(camera) {
    // Camera setup
    camera.position = Vec3(0, 2, 5)
    camera.lookAt(Vec3(0, 1, 0))
    camera.fov = 45
    
    // Render 3D objects
    cube.render(camera)
    sphere.render(camera)
    light.render(camera)
}

// 3D Structure
struct Vec3 {
    x: number
    y: number
    z: number
}
```

### 3.4 Input Handling

```inscript
on input(event) {
    if event.type == "keydown" {
        key = event.key
        print("Key pressed: " + key)
    }
    
    if event.type == "keyup" {
        key = event.key
        print("Key released: " + key)
    }
    
    if event.type == "mousemove" {
        mouseX = event.x
        mouseY = event.y
    }
    
    if event.type == "mousedown" {
        button = event.button  // 0=left, 1=middle, 2=right
        print("Mouse clicked at " + event.x + ", " + event.y)
    }
    
    if event.type == "mouseup" {
        print("Mouse released")
    }
    
    if event.type == "touch" {
        for touch in event.touches {
            print("Touch at " + touch.x + ", " + touch.y)
        }
    }
}

// Input helper
on update(dt) {
    if input.isKeyPressed("w") {
        player.moveForward()
    }
    if input.isMouseDown(0) {
        player.attack()
    }
}
```

### 3.5 Physics (2D)

```inscript
class PhysicsBody {
    position: Vec2
    velocity: Vec2
    acceleration: Vec2
    mass: number
    friction: number
    restitution: number  // bounce
    
    func applyForce(force: Vec2) {
        // F = ma
        this.acceleration = force / this.mass
    }
    
    func update(deltaTime) {
        this.velocity = this.velocity + (this.acceleration * deltaTime)
        this.velocity = this.velocity * (1 - this.friction)
        this.position = this.position + (this.velocity * deltaTime)
    }
}

// Collision detection
func checkCollision(rect1, rect2) -> bool {
    return rect1.x < rect2.x + rect2.width and
           rect1.x + rect1.width > rect2.x and
           rect1.y < rect2.y + rect2.height and
           rect1.y + rect1.height > rect2.y
}

func checkCircleCollision(circle1, circle2) -> bool {
    dist = distance(circle1.pos, circle2.pos)
    return dist < circle1.radius + circle2.radius
}
```

### 3.6 Audio

```inscript
on init() {
    bgMusic = assets.audio("background.mp3")
    jumpSfx = assets.audio("jump.wav")
}

on update(dt) {
    if input.isKeyPressed("space") {
        jumpSfx.play()
    }
}

// Audio control
bgMusic.play()
bgMusic.stop()
bgMusic.pause()
bgMusic.loop = true
bgMusic.volume = 0.5  // 0.0 to 1.0
```

### 3.7 Asset Management

```inscript
assets {
    // Images
    image player = "sprites/player.png"
    image enemy = "sprites/enemy.png"
    image background = "bg/level1.png"
    
    // Audio
    audio music_bg = "audio/background.mp3"
    audio sfx_jump = "audio/jump.wav"
    
    // Fonts
    font title = "fonts/Arial.ttf", size: 48
    font ui = "fonts/Arial.ttf", size: 16
    
    // 3D Models
    model cube = "models/cube.obj"
    model player_model = "models/player.fbx"
}

// Usage
on init() {
    let sprite = assets.player
    let sound = assets.sfx_jump
    sound.play()
}
```

---

## 4. Standard Library

### 4.1 Math Functions

```inscript
// Basic
min(a, b)
max(a, b)
abs(x)
sqrt(x)
pow(base, exponent)
floor(x)
ceil(x)
round(x)

// Trigonometry
sin(angle)
cos(angle)
tan(angle)
degrees(radians)
radians(degrees)

// Random
random()         // 0.0 to 1.0
random(min, max) // min to max
randomInt(1, 100)
randomChoice(list)
```

### 4.2 Vector Math (2D & 3D)

```inscript
// Vec2 operations
Vec2(x, y).length()
Vec2(x, y).normalize()
Vec2(1, 0).dot(Vec2(0, 1))  // dot product
Vec2(x1, y1).distance(Vec2(x2, y2))
Vec2(x, y).rotate(angle)

// Vec3 operations  
Vec3(x, y, z).cross(other)
// All Vec2 methods work on Vec3 too
```

### 4.3 String Functions

```inscript
"hello".length
"hello".toUpperCase()
"HELLO".toLowerCase()
"hello world".split(" ")
"h,e,l,l,o".split(",")
"hello".substring(1, 4)
"hello".contains("ell")
"  hello  ".trim()
"a".repeat(5)  // "aaaaa"

// String interpolation
name = "Player"
level = 1
message = "Your name is {name} and level is {level}"
```

### 4.4 List/Array Functions

```inscript
list = [1, 2, 3, 4, 5]

list.length
list.push(6)
list.pop()
list.shift()
list.unshift(0)
list.indexOf(3)
list.contains(4)
list.reverse()
list.sort()
list.slice(1, 3)

// Higher-order functions
list.map(fn(x) { x * 2 })
list.filter(fn(x) { x > 2 })
list.reduce(fn(acc, x) { acc + x }, 0)
list.forEach(fn(item) { print(item) })
```

### 4.5 Utility Functions

```inscript
print(value)           // console output
typeof(value)          // Type checking
isNull(value)
isNumber(value)
isText(value)
isList(value)
timer(callback, interval)  // Scheduled execution
delay(callback, ms)    // Delayed execution
```

---

## 5. Example Games

### 5.1 Simple Pong Game

```inscript
game Pong {
    title: "Pong"
    width: 800
    height: 600
    mode: "2d"
}

class Paddle {
    x: number
    y: number
    width: number = 10
    height: number = 100
    speed: number = 5
    
    func moveUp() {
        this.y = max(0, this.y - this.speed)
    }
    
    func moveDown() {
        this.y = min(600 - this.height, this.y + this.speed)
    }
    
    func draw(canvas) {
        canvas.fillColor = "white"
        canvas.fillRect(this.x, this.y, this.width, this.height)
    }
}

class Ball {
    x: number = 400
    y: number = 300
    radius: number = 5
    vx: number = 4
    vy: number = 4
    speed: number = 4
    
    func update() {
        this.x = this.x + this.vx
        this.y = this.y + this.vy
        
        // Bounce off top/bottom
        if this.y - this.radius < 0 or this.y + this.radius > 600 {
            this.vy = -this.vy
        }
    }
    
    func draw(canvas) {
        canvas.fillColor = "white"
        canvas.fillCircle(this.x, this.y, this.radius)
    }
}

let paddle1
let paddle2
let ball

on init() {
    paddle1 = Paddle()
    paddle1.x = 10
    paddle1.y = 250
    
    paddle2 = Paddle()
    paddle2.x = 780
    paddle2.y = 250
    
    ball = Ball()
}

on input(event) {
    if event.type == "keydown" {
        match event.key {
            "w" => paddle1.moveUp()
            "s" => paddle1.moveDown()
            "ArrowUp" => paddle2.moveUp()
            "ArrowDown" => paddle2.moveDown()
        }
    }
}

on update(dt) {
    ball.update()
    
    // Reset ball if goes out of bounds
    if ball.x < 0 or ball.x > 800 {
        ball.x = 400
        ball.y = 300
    }
}

on render(canvas) {
    canvas.fillColor = "black"
    canvas.fillRect(0, 0, 800, 600)
    
    paddle1.draw(canvas)
    paddle2.draw(canvas)
    ball.draw(canvas)
}
```

### 5.2 Simple Platformer

```inscript
game Platformer {
    title: "Simple Platformer"
    width: 1024
    height: 768
    mode: "2d"
}

class Player {
    x: number
    y: number
    width: number = 32
    height: number = 48
    vx: number = 0
    vy: number = 0
    speed: number = 5
    jumpPower: number = 15
    gravity: number = 0.6
    isJumping: bool = false
    
    func update(platforms) {
        // Horizontal movement
        this.x = this.x + this.vx
        
        // Gravity
        this.vy = this.vy + this.gravity
        this.y = this.y + this.vy
        
        // Collision with platforms
        for platform in platforms {
            if checkCollision(this, platform) {
                if this.vy > 0 {
                    this.y = platform.y - this.height
                    this.vy = 0
                    this.isJumping = false
                }
            }
        }
        
        // Keep in bounds
        this.x = max(0, min(1024 - this.width, this.x))
    }
    
    func moveLeft() {
        this.vx = -this.speed
    }
    
    func moveRight() {
        this.vx = this.speed
    }
    
    func jump() {
        if not this.isJumping {
            this.vy = -this.jumpPower
            this.isJumping = true
        }
    }
    
    func draw(canvas) {
        canvas.fillColor = "blue"
        canvas.fillRect(this.x, this.y, this.width, this.height)
    }
}

class Platform {
    x: number
    y: number
    width: number
    height: number = 20
    
    func draw(canvas) {
        canvas.fillColor = "green"
        canvas.fillRect(this.x, this.y, this.width, this.height)
    }
}

let player
let platforms

on init() {
    player = Player()
    player.x = 100
    player.y = 300
    
    platforms = [
        Platform({x: 0, y: 700, width: 1024}),
        Platform({x: 200, y: 600, width: 300}),
        Platform({x: 700, y: 500, width: 300})
    ]
}

on input(event) {
    if event.type == "keydown" {
        match event.key {
            "ArrowLeft" => player.moveLeft()
            "ArrowRight" => player.moveRight()
            " " => player.jump()
        }
    } else if event.type == "keyup" {
        if event.key == "ArrowLeft" or event.key == "ArrowRight" {
            player.vx = 0
        }
    }
}

on update(dt) {
    player.update(platforms)
}

on render(canvas) {
    canvas.fillColor = "lightblue"
    canvas.fillRect(0, 0, 1024, 768)
    
    for platform in platforms {
        platform.draw(canvas)
    }
    
    player.draw(canvas)
}
```

---

## 6. Compilation Target

InScript compiles to JavaScript and uses:
- **Canvas API** for 2D rendering
- **WebGL** for 3D rendering
- **Web Audio API** for sound
- **DOM APIs** for input handling

The compiled output can run in browsers, Node.js with native extensions, or Electron-based applications.

---

## 7. Next Steps

- **Parser & Lexer**: Build tokenizer and syntax parser
- **Compiler**: Generate JavaScript/WebGL code
- **Runtime**: Provide game engine runtime
- **IDE Support**: VS Code extension for syntax highlighting
- **Documentation**: Complete API reference and tutorials
- **Examples**: Library of game examples
