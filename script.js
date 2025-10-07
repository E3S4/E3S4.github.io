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

class Ribbon {
  constructor(color, amplitude, speed, offsetY) {
    this.color = color;
    this.amplitude = amplitude; // wave height
    this.speed = speed;         // wave speed
    this.offsetY = offsetY;     // vertical offset
    this.phase = Math.random() * Math.PI * 2; // starting phase
  }

  draw(time) {
    ctx.beginPath();
    const segments = 100;
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      const y = height/2 + this.offsetY + Math.sin((i/segments) * Math.PI * 4 + this.phase + time * this.speed) * this.amplitude;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    // Create gradient along ribbon
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(0,255,120,0)');
    gradient.addColorStop(0.5, this.color);
    gradient.addColorStop(1, 'rgba(0,255,120,0)');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 20;
    ctx.shadowBlur = 30;
    ctx.shadowColor = this.color;
    ctx.stroke();
  }
}

// Create multiple layered ribbons
const ribbons = [
  new Ribbon('rgba(0,255,120,0.5)', 50, 0.002, -50),
  new Ribbon('rgba(0,200,100,0.4)', 30, 0.0015, 30),
  new Ribbon('rgba(0,255,150,0.3)', 40, 0.0025, 0)
];

let lastTime = 0;
function animate(time) {
  const deltaTime = time - lastTime;
  lastTime = time;

  // Slight fade to black for trails
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(0, 0, width, height);

  ribbons.forEach(ribbon => ribbon.draw(time));

  requestAnimationFrame(animate);
}

animate();
