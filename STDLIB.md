# InScript Standard Library Reference

The InScript Standard Library provides a comprehensive set of utilities for common programming tasks, including mathematics, vector operations, string manipulation, and array processing.

## 📦 Library Categories

### 1. Math Library

Mathematical functions and utilities for game development and numerical computations.

#### Trigonometric Functions
- **`sin(x)`** - Returns the sine of x (in radians)
- **`cos(x)`** - Returns the cosine of x (in radians)
- **`tan(x)`** - Returns the tangent of x (in radians)
- **`asin(x)`** - Returns the arcsine of x
- **`acos(x)`** - Returns the arccosine of x
- **`atan(x)`** - Returns the arctangent of x
- **`atan2(y, x)`** - Returns the arctangent of y/x

#### Power & Root Functions
- **`sqrt(x)`** - Returns the square root of x
- **`pow(base, exponent)`** - Returns base raised to the power of exponent
- **`abs(x)`** - Returns the absolute value of x

#### Rounding Functions
- **`floor(x)`** - Returns x rounded down to nearest integer
- **`ceil(x)`** - Returns x rounded up to nearest integer
- **`round(x)`** - Returns x rounded to nearest integer

#### Min/Max Functions
- **`min(...values)`** - Returns the minimum of given values
- **`max(...values)`** - Returns the maximum of given values
- **`clamp(value, min, max)`** - Clamps value between min and max

#### Interpolation
- **`lerp(a, b, t)`** - Linear interpolation between a and b (t: 0-1)
- **`distance(x1, y1, x2, y2)`** - Euclidean distance between two points
- **`distance3d(x1, y1, z1, x2, y2, z2)`** - Euclidean distance between two 3D points

#### Random Functions
- **`random()`** - Random number between 0 (inclusive) and 1 (exclusive)
- **`randomInt(min, max)`** - Random integer between min (inclusive) and max (exclusive)
- **`randomRange(min, max)`** - Random decimal between min and max

#### Angle Conversion
- **`degrees(radians)`** - Convert radians to degrees
- **`radians(degrees)`** - Convert degrees to radians

#### Example Usage
```inscript
let angle = radians(45)
let sine = sin(angle)
let clamped = clamp(150, 0, 100)  // Returns 100
let random = randomInt(1, 10)     // Random int 1-9
```

---

### 2. Vector Classes

**Vec2** - 2D Vector for game positions, velocities, and directions

**Properties:**
- `x` - X coordinate
- `y` - Y coordinate

**Methods:**
- **`add(other)`** - Returns new vector (this + other)
- **`subtract(other)`** - Returns new vector (this - other)
- **`multiply(scalar)`** - Returns new vector scaled by scalar
- **`divide(scalar)`** - Returns new vector divided by scalar
- **`magnitude()`** - Returns length of vector
- **`normalize()`** - Returns unit vector in same direction
- **`dot(other)`** - Returns dot product
- **`distance(other)`** - Returns distance to other vector
- **`clone()`** - Returns copy of vector

**Vec3** - 3D Vector for 3D game development

**Properties:**
- `x` - X coordinate
- `y` - Y coordinate
- `z` - Z coordinate

**Methods:** (same as Vec2, plus):
- **`cross(other)`** - Returns cross product with other vector

#### Example Usage
```inscript
// Create vectors
let pos = new Vec2(10, 20)
let velocity = new Vec2(5, -3)

// Vector operations
let newPos = pos.add(velocity)           // (15, 17)
let distance = pos.distance(newPos)      // Length of velocity
let direction = velocity.normalize()     // Unit vector
let magnitude = velocity.magnitude()     // Length

// 3D vectors
let p1 = new Vec3(1, 0, 0)
let p2 = new Vec3(0, 1, 0)
let cross = p1.cross(p2)                 // (0, 0, 1)
```

---

### 3. String Library

String manipulation functions for text processing.

#### String Properties
- **`length(str)`** - Get length of string

#### Character Access
- **`charAt(str, index)`** - Get character at index
- **`substring(str, start, end)`** - Extract substring
- **`slice(str, start, end)`** - Slice string (supports negative indices)

#### Search
- **`indexOf(str, search)`** - Find index of substring (-1 if not found)
- **`lastIndexOf(str, search)`** - Find last index of substring
- **`includes(str, search)`** - Check if string contains substring
- **`startsWith(str, search)`** - Check if string starts with substring
- **`endsWith(str, search)`** - Check if string ends with substring

#### Case Conversion
- **`toLowerCase(str)`** - Convert to lowercase
- **`toUpperCase(str)`** - Convert to uppercase
- **`trim(str)`** - Remove whitespace from both ends

#### Splitting & Joining
- **`split(str, separator)`** - Split string into array

#### Manipulation
- **`replace(str, search, replacement)`** - Replace first occurrence
- **`replaceAll(str, search, replacement)`** - Replace all occurrences
- **`repeat(str, count)`** - Repeat string n times
- **`reverse(str)`** - Reverse string
- **`concat(...strings)`** - Concatenate multiple strings

#### Example Usage
```inscript
let text = "Hello World"
let upper = toUpperCase(text)           // "HELLO WORLD"
let lower = toLowerCase(text)           // "hello world"
let words = split(text, " ")            // ["Hello", "World"]
let has_o = includes(text, "o")         // true
let first5 = substring(text, 0, 5)      // "Hello"
let repeated = repeat("Ha", 3)          // "HaHaHa"
```

---

### 4. Array Library

Array manipulation functions for collection processing.

#### Array Properties
- **`length(arr)`** - Get number of elements

#### Element Access
- **`get(arr, index)`** - Get element at index
- **`set(arr, index, value)`** - Set element at index

#### Adding/Removing Elements
- **`push(arr, value)`** - Add element to end
- **`pop(arr)`** - Remove and return last element
- **`shift(arr)`** - Remove and return first element
- **`unshift(arr, value)`** - Add element to beginning
- **`splice(arr, start, deleteCount, ...items)`** - Insert/remove elements

#### Searching
- **`indexOf(arr, value)`** - Find index of value (-1 if not found)
- **`includes(arr, value)`** - Check if array contains value
- **`find(arr, callback)`** - Find first matching element
- **`findIndex(arr, callback)`** - Find index of first match

#### Combining
- **`join(arr, separator)`** - Join array into string
- **`concat(arr, ...arrays)`** - Concatenate arrays
- **`slice(arr, start, end)`** - Extract subarray

#### Iteration
- **`forEach(arr, callback)`** - Iterate over array
- **`filter(arr, callback)`** - Create filtered array
- **`map(arr, callback)`** - Create mapped array
- **`reduce(arr, callback, initial)`** - Reduce array to single value
- **`some(arr, callback)`** - Check if any element matches
- **`every(arr, callback)`** - Check if all elements match

#### Sorting & Reversing
- **`sort(arr)`** - Sort array in place
- **`reverse(arr)`** - Reverse array in place
- **`flatten(arr, depth)`** - Flatten nested array

#### Example Usage
```inscript
let numbers = [1, 2, 3, 4, 5]

// Basic operations
let first = get(numbers, 0)              // 1
let length = length(numbers)             // 5
let str = join(numbers, ",")             // "1,2,3,4,5"

// Iteration
forEach(numbers, func(n) { print(n) })   // Print each number

// Functional operations
let doubled = map(numbers, func(x) { return x * 2 })
let evens = filter(numbers, func(x) { return x % 2 == 0 })
let sum = reduce(numbers, func(acc, val) { return acc + val }, 0)

// Checking
let hasThree = includes(numbers, 3)      // true
let anyOdd = some(numbers, func(x) { return x % 2 == 1 })
```

---

## 🎮 Game Development Tips

### Vector Usage in Games
```inscript
// Player movement
let playerPos = new Vec2(100, 100)
let moveSpeed = 5
let input = new Vec2(1, 0)  // Right
let velocity = input.multiply(moveSpeed)
playerPos = playerPos.add(velocity)

// Distance-based gameplay
let player = new Vec2(50, 50)
let enemy = new Vec2(100, 100)
let distance = player.distance(enemy)
if (distance < 50) {
    print("Enemy too close!")
}
```

### Math in Games
```inscript
// Angle towards target
let targetAngle = atan2(target.y - player.y, target.x - player.x)
let angle = degrees(targetAngle)

// Smooth interpolation
let alpha = 0.1  // Interpolation factor
let newValue = lerp(current, target, alpha)

// Clamped rotation
let rotation = clamp(desiredRotation, minAngle, maxAngle)
```

### Array Processing
```inscript
// Find closest enemy
let enemies = [/* list of enemies */]
let closest = reduce(enemies, func(min, enemy) {
    let d = player.distance(enemy.pos)
    return d < min.distance ? {enemy: enemy, distance: d} : min
}, {distance: infinity})
```

---

## 📋 Built-in Functions Summary

| Category | Functions |
|----------|-----------|
| **Core** | print, typeof, input |
| **Math** | sin, cos, tan, sqrt, pow, abs, floor, ceil, min, max, clamp, lerp, distance, random |
| **Vector** | Vec2, Vec3 |
| **String** | length, split, replace, uppercase, lowercase, trim, etc. |
| **Array** | push, pop, map, filter, reduce, forEach, sort, join, etc. |

---

## 📚 Note

All standard library functions are automatically available in your InScript code. No imports or includes are necessary. The functions are injected into the runtime during code generation and are available globally.
