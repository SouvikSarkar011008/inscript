"use strict";
/**
 * InScript Input API
 * Wrapper for keyboard, mouse, and touch input
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputAPICode = getInputAPICode;
function getInputAPICode() {
    return `
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
`;
}
//# sourceMappingURL=input.js.map