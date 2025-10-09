// To ensure we use native resolution of screen
var dpr = window.devicePixelRatio || 1;

// getting canvases with native resolution
const canvas = document.getElementById("starsCanvas");
canvas.width = window.innerWidth*dpr;
canvas.height = window.innerHeight*dpr;
const ctx = canvas.getContext('2d');
ctx.scale(dpr,dpr); // to scale every drawing operations
const canvasMw = document.getElementById("milkyWayCanvas");
canvasMw.width = window.innerWidth*dpr;
canvasMw.height = window.innerHeight*dpr;
const ctxMw = canvasMw.getContext('2d');
ctxMw.scale(dpr,dpr); 
const sNumber = 600;              // number 
const sSize = .3;                 // minimum size
const sSizeR = .6;                // random side 
const sAlphaR = .5;               // random transparency 
const sMaxHueProportion = .6;     
const shootingStarDensity = 0.01;
const shootingStarBaseXspeed = 30;
const shootingStarBaseYspeed = 15;
const shootingStarBaseLength = 8;
const shootingStarBaseLifespan = 60;
