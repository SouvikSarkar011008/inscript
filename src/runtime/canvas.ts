/**
 * InScript Canvas API
 * Wrapper around HTML5 Canvas for 2D drawing
 */

export function getCanvasAPICode(): string {
  return `
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
    ctx.font = \`\${fontSize}px \${fontFamily}\`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(String(text), x, y);
  },
  
  drawTextCenter: (text, x, y, color = "#fff", fontSize = 16, fontFamily = "Arial") => {
    const ctx = getCanvas();
    ctx.fillStyle = color;
    ctx.font = \`\${fontSize}px \${fontFamily}\`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(text), x, y);
  },
  
  measureText: (text, fontSize = 16, fontFamily = "Arial") => {
    const ctx = getCanvas();
    ctx.font = \`\${fontSize}px \${fontFamily}\`;
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
    getCanvas().font = \`\${fontSize}px \${fontFamily}\`;
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
`;
}
