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
let hue = 160;
let idleOffset = 0;

class Ribbon {
  constructor(x, y) {
    this.points = [{ x, y, vx: 0, vy: 0 }];
    this.maxPoints = 55;
    this.life = 1;
    this.shadow = 50 + Math.random() * 40; // Pre-calc shadow blur (FPS boost)
  }

  update(mx, my) {
    const last = this.points[this.points.length - 1];

    last.vx += (mx - last.x) * 0.18;
    last.vy += (my - last.y) * 0.18;
    last.vx *= 0.72;
    last.vy *= 0.72;

    const newX = last.x + last.vx;
    const newY = last.y + last.vy;
    this.points.push({ x: newX, y: newY, vx: last.vx, vy: last.vy });

    if (this.points.length > this.maxPoints) this.points.shift();
    this.life -= 0.0045;
  }

  draw() {
    if (this.points.length < 2 || this.life <= 0) return;

    const color1 = `hsla(${hue}, 100%, 70%, ${this.life})`;
    const color2 = `hsla(${(hue + 80) % 360}, 100%, 60%, ${this.life})`;

    const gradient = ctx.createLinearGradient(
      this.points[0].x, this.points[0].y,
      this.points[this.points.length - 1].x, this.points[this.points.length - 1].y
    );
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    ctx.save();
    ctx.strokeStyle = gradient;
    ctx.shadowBlur = this.shadow;
    ctx.shadowColor = color2;
    ctx.lineWidth = 16;
    ctx.globalAlpha = 0.45;

    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++)
      ctx.lineTo(this.points[i].x, this.points[i].y);
    ctx.stroke();
    ctx.restore();
  }
}

let mouseX = width / 2;
let mouseY = height / 2;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (ribbons.length < 10) ribbons.push(new Ribbon(mouseX, mouseY));
});

function animate() {
  ctx.clearRect(0, 0, width, height);

  hue = (hue + 1.2) % 360;
  idleOffset += 0.01;

  ribbons = ribbons.filter(ribbon => ribbon.life > 0);

  ribbons.forEach(ribbon => {
    ribbon.update(
      mouseX + Math.sin(idleOffset) * 35,
      mouseY + Math.cos(idleOffset) * 35
    );
    ribbon.draw();
  });

  requestAnimationFrame(animate);
}

document.addEventListener('scroll', () => {
  idleOffset = window.scrollY * 0.01;
});

animate();


// Section Fade-In Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.content, .technologies, .projects, .content-section')
    .forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(25px)';
      el.style.transition = '0.6s ease';
      observer.observe(el);
    });
});

