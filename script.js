document.addEventListener("DOMContentLoaded", function() {
  // --- CANVAS SETUP ---
  const container = document.getElementById("canvas-container");
  if (!container) {
    console.error("Canvas container not found");
    return;
  }
  
  const canvas = document.createElement("canvas");
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  
  // Flag controlling whether the dynamic background is active.
  let dynamicActive = false;
  let mouseX = 0, mouseY = 0;
  
  // Resize the canvas to fill the viewport.
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (!dynamicActive) {
      // Fill with solid black if dynamic background is off.
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  
  // Tie-dye background function using the provided coordinates.
  function getTieDyeBackground(x, y) {
    // Default to canvas center if invalid.
    const cw = canvas.width || 1;
    const ch = canvas.height || 1;
    x = Math.max(0, Math.min(x, cw));
    y = Math.max(0, Math.min(y, ch));
    
    const hue = (x / cw) * 360;
    const rawSat = (y / ch) * 100;
    const saturation = Math.max(0, Math.min(rawSat, 100));
    const lightness = 50 + (Math.sin(x * 0.05) * 20);
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, cw / 2);
    gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
    gradient.addColorStop(0.25, `hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness - 5}%)`);
    gradient.addColorStop(0.5, `hsl(${(hue + 120) % 360}, ${saturation}%, ${lightness - 10}%)`);
    gradient.addColorStop(0.75, `hsl(${(hue + 180) % 360}, ${saturation}%, ${lightness - 15}%)`);
    gradient.addColorStop(1, `hsl(${(hue + 240) % 360}, ${saturation}%, ${lightness - 20}%)`);
    return gradient;
  }
  
  // Animation loop: if dynamicActive is true, draw the dynamic background; otherwise, keep it black.
  function animate() {
    if (dynamicActive) {
      const bg = getTieDyeBackground(mouseX, mouseY);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(animate);
  }
  animate();
  
  // Activate dynamic background on touch or mouse events.
  function activateDynamic(e) {
    if (e.cancelable) e.preventDefault();
    let x, y;
    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    if (isFinite(x) && isFinite(y)) {
      mouseX = x;
      mouseY = y;
      dynamicActive = true;
    }
  }
  
  // Deactivate dynamic background on touchend/mouseup.
  function endDynamic(e) {
    dynamicActive = false;
  }
  
  // Attach event listeners to the container.
  container.addEventListener("touchstart", activateDynamic, { passive: false });
  container.addEventListener("touchmove", activateDynamic, { passive: false });
  container.addEventListener("mousemove", activateDynamic);
  
  // Attach end events to the window so they fire regardless of where the finger is released.
  window.addEventListener("touchend", endDynamic, { passive: false });
  window.addEventListener("mouseup", endDynamic);
});
