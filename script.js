// Aurora Ribbon Script
const canvas = document.getElementById('aurora');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let ribbons = [];

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

// Ribbon particle class
class Ribbon {
  constructor(x, y) {
    this.points = [{ x, y }];
    this.maxPoints = 30;
    this.color = 'rgba(0,255,120,0.7)';
  }

  update(mouseX, mouseY) {
    // Add new point toward mouse
    const last = this.points[this.points.length - 1];
    const dx = (mouseX - last.x) * 0.1;
    const dy = (mouseY - last.y) * 0.1;
    this.points.push({ x: last.x + dx, y: last.y + dy });

    // Limit points
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }
  }

  draw() {
    if (this.points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      const p = this.points[i];
      ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 12;
    ctx.shadowBlur = 100;
    ctx.shadowColor = 'rgba(0,255,120,0.6)';
    ctx.stroke();
  }
}

let mouseX = width / 2;
let mouseY = height / 2;

// Track mouse
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  // Spawn new ribbon occasionally
  if (ribbons.length < 3) {
    ribbons.push(new Ribbon(mouseX, mouseY));
  }
});

// Animate ribbons
function animate() {
  ctx.fillStyle = 'rgba(0,0,0,0.4)'; 
  ctx.fillRect(0, 0, width, height);

  ribbons.forEach((ribbon, i) => {
    ribbon.update(mouseX, mouseY);
    ribbon.draw();
  });

  requestAnimationFrame(animate);
}

animate();

