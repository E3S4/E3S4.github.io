// Get canvas elements and set them to match screen resolution
var dpr = window.devicePixelRatio || 1;
const canvas = document.getElementById("starsCanvas");
canvas.width = window.innerWidth * dpr;
canvas.height = window.innerHeight * dpr;
const ctx = canvas.getContext('2d');
ctx.scale(dpr, dpr);

const canvasMw = document.getElementById("milkyWayCanvas");
canvasMw.width = window.innerWidth * dpr;
canvasMw.height = window.innerHeight * dpr;
const ctxMw = canvasMw.getContext('2d');
ctxMw.scale(dpr, dpr);

// Star and shooting star settings
const sNumber = 600;
const sSize = 0.3;
const sSizeR = 0.6;
const sAlphaR = 0.5;
const sMaxHueProportion = 0.6;

const shootingStarDensity = 0.01;
const shootingStarBaseXspeed = 30;
const shootingStarBaseYspeed = 15;
const shootingStarBaseLength = 8;
const shootingStarBaseLifespan = 60;
const shootingStarsColors = ["#a1ffba", "#a1d2ff", "#fffaa1", "#ffa1a1"];

// Milky Way settings
const mwStarCount = 100000;
const mwRandomStarProp = 0.2;
const mwClusterCount = 300;
const mwClusterStarCount = 1500;
const mwClusterSize = 120;
const mwClusterSizeR = 80;
const mwClusterLayers = 10;
const mwAngle = 0.6;
const mwHueMin = 150;
const mwHueMax = 300;
const mwWhiteProportionMin = 50;
const mwWhiteProportionMax = 65;

// Random and data arrays
let randomArray, hueArray, StarsArray, ShootingStarsArray;
const randomArrayLength = 1000;
const hueArrayLength = 1000;
let randomArrayIterator = 0;

// Single twinkling star
class Star {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.alpha = size / (sSize + sSizeR);
    this.baseHue = hueArray[Math.floor(Math.random() * hueArrayLength)];
    this.baseHueProportion = Math.random();
    this.randomIndexa = Math.floor(Math.random() * randomArrayLength);
    this.randomIndexh = this.randomIndexa;
    this.randomValue = randomArray[this.randomIndexa];
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    let rAlpha = this.alpha + Math.min((this.randomValue - 0.5) * sAlphaR, 1);
    let rHue =
      randomArray[this.randomIndexh] > this.baseHueProportion
        ? hueArray[this.randomIndexa]
        : this.baseHue;
    this.color = `hsla(${rHue},100%,85%,${rAlpha})`;
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.randomIndexh = this.randomIndexa;
    this.randomIndexa = this.randomIndexa >= 999 ? 0 : this.randomIndexa + 1;
    this.randomValue = randomArray[this.randomIndexa];
    this.draw();
  }
}

// Shooting star streak
class ShootingStar {
  constructor(x, y, speedX, speedY, color) {
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.framesLeft = shootingStarBaseLifespan;
    this.color = color;
  }

  goingOut() {
    return this.framesLeft <= 0;
  }

  ageModifier() {
    let halfLife = shootingStarBaseLifespan / 2.0;
    return Math.pow(1.0 - Math.abs(this.framesLeft - halfLife) / halfLife, 2);
  }

  draw() {
    let am = this.ageModifier();
    let endX = this.x - this.speedX * shootingStarBaseLength * am;
    let endY = this.y - this.speedY * shootingStarBaseLength * am;

    let gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
    gradient.addColorStop(0, "#fff");
    gradient.addColorStop(Math.min(am, 0.7), this.color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.strokeStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }

  update() {
    this.framesLeft--;
    this.x += this.speedX;
    this.y += this.speedY;
    this.draw();
  }
}

// Milky Way star cluster
class MwStarCluster {
  constructor(x, y, size, hue, baseWhiteProportion, brightnessModifier) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.hue = hue;
    this.baseWhiteProportion = baseWhiteProportion;
    this.brightnessModifier = brightnessModifier;
  }

  draw() {
    let starsPerLayer = Math.floor(mwClusterStarCount / mwClusterLayers);
    for (let layer = 1; layer < mwClusterLayers; layer++) {
      let layerRadius = (this.size * layer) / mwClusterLayers;
      for (let i = 1; i < starsPerLayer; i++) {
        let posX = this.x + 2 * layerRadius * (Math.random() - 0.5);
        let posY =
          this.y +
          2 *
            Math.sqrt(Math.pow(layerRadius, 2) - Math.pow(this.x - posX, 2)) *
            (Math.random() - 0.5);
        let size = 0.05 + Math.random() * 0.15;
        let alpha = 0.3 + Math.random() * 0.4;
        let whitePercentage =
          this.baseWhiteProportion +
          15 +
          15 * this.brightnessModifier +
          Math.floor(Math.random() * 10);
        ctxMw.beginPath();
        ctxMw.arc(posX, posY, size, 0, Math.PI * 2, false);
        ctxMw.fillStyle = `hsla(${this.hue},100%,${whitePercentage}%,${alpha})`;
        ctxMw.fill();
      }
    }

    // Add soft glow around cluster
    let gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size
    );
    gradient.addColorStop(
      0,
      `hsla(${this.hue},100%,${this.baseWhiteProportion}%,0.002)`
    );
    gradient.addColorStop(
      0.25,
      `hsla(${this.hue},100%,${this.baseWhiteProportion + 30}%,${0.01 + 0.01 * this.brightnessModifier})`
    );
    gradient.addColorStop(
      0.4,
      `hsla(${this.hue},100%,${this.baseWhiteProportion + 15}%,0.005)`
    );
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctxMw.beginPath();
    ctxMw.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctxMw.fillStyle = gradient;
    ctxMw.fill();
  }
}

// Initialize all stars and arrays
function init() {
  randomArray = Array.from({ length: randomArrayLength }, () => Math.random());

  hueArray = Array.from({ length: hueArrayLength }, () => {
    let rHue = Math.floor(Math.random() * 160);
    if (rHue > 60) rHue += 110;
    return rHue;
  });

  StarsArray = Array.from({ length: sNumber }, () => {
    let size = Math.random() * sSizeR + sSize;
    let x = Math.random() * (innerWidth - size * 4) + size * 2;
    let y = Math.random() * (innerHeight - size * 4) + size * 2;
    return new Star(x, y, size);
  });

  ShootingStarsArray = [];
  DrawMilkyWayCanvas();
}

// Main animation loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  StarsArray.forEach((s) => s.update());

  // Randomly spawn shooting stars
  if (randomArray[randomArrayIterator] < shootingStarDensity) {
    let posX = Math.random() * canvas.width;
    let posY = Math.random() * 150;
    let speedX = (Math.random() - 0.5) * shootingStarBaseXspeed;
    let speedY = Math.random() * shootingStarBaseYspeed;
    let color =
      shootingStarsColors[
        Math.floor(Math.random() * shootingStarsColors.length)
      ];
    ShootingStarsArray.push(new ShootingStar(posX, posY, speedX, speedY, color));
  }

  // Remove finished shooting stars
  for (let i = ShootingStarsArray.length - 1; i >= 0; i--) {
    if (ShootingStarsArray[i].goingOut()) ShootingStarsArray.splice(i, 1);
    else ShootingStarsArray[i].update();
  }

  randomArrayIterator =
    randomArrayIterator + 1 >= randomArrayLength ? 0 : randomArrayIterator + 1;
}

// Milky Way coordinates
function MilkyWayX() {
  return Math.floor(Math.random() * innerWidth);
}

function MilkyWayYFromX(xPos, mode) {
  let offset = ((innerWidth / 2) - xPos) * mwAngle;
  if (mode === "star")
    return (
      Math.pow(Math.random(), 1.2) * innerHeight * (Math.random() - 0.5) +
      innerHeight / 2 +
      (Math.random() - 0.5) * 100 +
      offset
    );
  else
    return (
      Math.pow(Math.random(), 1.5) * innerHeight * 0.6 * (Math.random() - 0.5) +
      innerHeight / 2 +
      (Math.random() - 0.5) * 100 +
      offset
    );
}

// Draw background Milky Way field
function DrawMilkyWayCanvas() {
  // Background stars
  for (let i = 0; i < mwStarCount; i++) {
    ctxMw.beginPath();
    let xPos = MilkyWayX();
    let yPos =
      Math.random() < mwRandomStarProp
        ? Math.floor(Math.random() * innerHeight)
        : MilkyWayYFromX(xPos, "star");
    let size = Math.random() * 0.27;
    ctxMw.arc(xPos, yPos, size, 0, Math.PI * 2, false);
    let alpha = 0.4 + Math.random() * 0.6;
    ctxMw.fillStyle = `hsla(0,100%,100%,${alpha})`;
    ctxMw.fill();
  }

  // Star clusters for Milky Way band
  for (let i = 0; i < mwClusterCount; i++) {
    let xPos = MilkyWayX();
    let yPos = MilkyWayYFromX(xPos, "cluster");
    let distToCenter =
      (1 - Math.abs(xPos - innerWidth / 2) / (innerWidth / 2)) *
      (1 - Math.abs(yPos - innerHeight / 2) / (innerHeight / 2));
    let size = mwClusterSize + Math.random() * mwClusterSizeR;
    let hue =
      mwHueMin +
      Math.floor(
        (Math.random() * 0.5 + distToCenter * 0.5) * (mwHueMax - mwHueMin)
      );
    let baseWhiteProportion =
      mwWhiteProportionMin +
      Math.random() * (mwWhiteProportionMax - mwWhiteProportionMin);
    new MwStarCluster(
      xPos,
      yPos,
      size,
      hue,
      baseWhiteProportion,
      distToCenter
    ).draw();
  }
}

// Start animation
init();
animate();
