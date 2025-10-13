const canvas = document.getElementById('aurora');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;
window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});
let ribbons = [];
let hue = 140; // starts around green
class Ribbon {
  constructor(x, y) {
    this.points = [{ x, y }];
    this.maxPoints = 50;
    this.life = 1;
  }
  update(mouseX, mouseY) {
    const last = this.points[this.points.length - 1];
    const dx = (mouseX - last.x) * 0.1;
    const dy = (mouseY - last.y) * 0.1;
    this.points.push({ x: last.x + dx, y: last.y + dy });
    if (this.points.length > this.maxPoints) this.points.shift();
    this.life -= 0.004;
  }
  draw() {
    if (this.points.length < 2 || this.life <= 0) return;
    const gradient = ctx.createLinearGradient(
      this.points[0].x, this.points[0].y,
      this.points[this.points.length - 1].x,
      this.points[this.points.length - 1].y
    );
    const color1 = `hsla(${hue}, 100%, 70%, ${this.life})`;
    const color2 = `hsla(${(hue + 60) % 360}, 100%, 60%, ${this.life})`;
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.save();
    ctx.shadowBlur = 100; 
    ctx.shadowColor = color2;
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      const p = this.points[i];
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.shadowBlur = 250;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 40;
    ctx.stroke();

    ctx.restore();
  }
}

let mouseX = width / 8;
let mouseY = height / 4;

// Track mouse movement
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (ribbons.length < 5) ribbons.push(new Ribbon(mouseX, mouseY));
});

// Animate everything
function animate() {
  // Soft fade background for smooth trails
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0, 0, width, height);

  hue = (hue + 0.4) % 360; // slow color drift

  ribbons.forEach((ribbon, i) => {
    ribbon.update(mouseX, mouseY);
    ribbon.draw();
    if (ribbon.life <= 0) ribbons.splice(i, 1);
  });

  requestAnimationFrame(animate);
}

animate();

