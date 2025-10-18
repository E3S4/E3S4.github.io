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
    this.maxPoints = 60;
    this.life = 1;
  }

  update(mouseX, mouseY) {
    const last = this.points[this.points.length - 1];
    last.vx += (mouseX - last.x) * 0.22;
    last.vy += (mouseY - last.y) * 0.22;
    last.vx *= 0.68;
    last.vy *= 0.68;
    const newX = last.x + last.vx;
    const newY = last.y + last.vy;
    this.points.push({ x: newX, y: newY, vx: last.vx, vy: last.vy });
    if (this.points.length > this.maxPoints) this.points.shift();
    this.life -= 0.005;
  }

  draw() {
    if (this.points.length < 2 || this.life <= 0) return;

    const gradient = ctx.createLinearGradient(
      this.points[0].x, this.points[0].y,
      this.points[this.points.length - 1].x, this.points[this.points.length - 1].y
    );

    const color1 = `hsla(${hue}, 100%, 70%, ${this.life})`;
    const color2 = `hsla(${(hue+80)%360}, 100%, 60%, ${this.life})`;
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    ctx.save();
    ctx.strokeStyle = gradient;
    ctx.shadowBlur = 60 + Math.random() * 30;
    ctx.shadowColor = color2;
    ctx.lineWidth = 18;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for(let i=1;i<this.points.length;i++) ctx.lineTo(this.points[i].x, this.points[i].y);
    ctx.stroke();
    ctx.restore();
  }
}

let mouseX = width/2;
let mouseY = height/2;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (ribbons.length < 12) ribbons.push(new Ribbon(mouseX, mouseY));
});

function animate() {
  ctx.fillStyle = 'rgba(0,0,0,0.045)';
  ctx.fillRect(0, 0, width, height);

  hue = (hue + 1 + Math.sin(Date.now() * 0.002)*2) % 360;
  idleOffset += 0.015;

  ribbons.forEach((ribbon, i) => {
    ribbon.update(mouseX + Math.sin(idleOffset)*50, mouseY + Math.cos(idleOffset)*50);
    ribbon.draw();
    if(ribbon.life <=0) ribbons.splice(i,1);
  });

  requestAnimationFrame(animate);
}

document.addEventListener('scroll', () => { idleOffset = window.scrollY / 200; });

animate();

const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.style.opacity='1';
      entry.target.style.transform='translateY(0)';
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.content, .technologies, .projects, .content-section');
  sections.forEach(section => {
    section.style.opacity='0';
    section.style.transform='translateY(25px)';
    section.style.transition='opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
});

