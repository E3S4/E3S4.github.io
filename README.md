<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>EESA </title>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>

<style>
:root{
  --bg:#070a12;
  --panel:rgba(255,255,255,0.05);
  --text:#e5e7eb;
  --muted:#9aa4b2;
  --accent:#7c86ff;
}

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;
}

body{
  height:100vh;
  overflow:hidden;
  background:radial-gradient(circle at top,#0f1630,#060810);
  color:var(--text);
}

/* subtle depth only (no visual noise) */
body::before{
  content:"";
  position:absolute;
  inset:0;
  background:radial-gradient(circle,rgba(124,134,255,0.06) 1px,transparent 1px);
  background-size:70px 70px;
  pointer-events:none;
}

/* BOOT */
.boot{
  position:fixed;
  inset:0;
  background:#000;
  color:#00ffb3;
  font-family:monospace;
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:9999;
}

/* DESKTOP */
.desktop{
  display:none;
  width:100%;
  height:100vh;
  position:relative;
}

/* ICONS */
.icons{
  position:absolute;
  top:30px;
  left:20px;
  display:flex;
  flex-direction:column;
  gap:18px;
}

.icon{
  width:90px;
  text-align:center;
  cursor:pointer;
  color:var(--muted);
  transition:0.2s;
}

.icon:hover{
  transform:translateY(-3px);
  color:var(--text);
}

.icon i{
  font-size:1.3rem;
  color:var(--accent);
}

/* ===== WINDOW CORE (IMPORTANT PART) ===== */
.window{
  position:absolute;
  width:420px;
  height:280px;
  min-width:260px;
  min-height:160px;

  background:var(--panel);
  backdrop-filter:blur(26px);

  border:1px solid rgba(255,255,255,0.08);
  border-radius:14px;

  display:none;
  overflow:hidden;

  box-shadow:0 35px 90px rgba(0,0,0,0.65);
}

/* ACTIVE FOCUS */
.window.active{
  border-color:rgba(124,134,255,0.35);
  box-shadow:0 45px 120px rgba(124,134,255,0.12);
}

/* HEADER */
.header{
  height:34px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 10px;
  background:rgba(0,0,0,0.35);
  font-size:0.78rem;
  color:var(--muted);
  cursor:grab;
}

/* MAC DOTS */
.dots{display:flex;gap:6px;}
.dot{width:10px;height:10px;border-radius:50%;}
.red{background:#ff5f57;}
.yellow{background:#febc2e;}
.green{background:#28c840;}

.close{color:#ff4d4d;cursor:pointer;}

/* CONTENT */
.content{
  padding:14px;
  font-size:0.9rem;
  line-height:1.7;
  color:#d7dbe2;
}

/* TERMINAL */
.terminal{
  font-family:ui-monospace,Menlo,monospace;
  font-size:0.85rem;
  white-space:pre-wrap;
  overflow:auto;
  height:100%;
  color:#c7d2fe;
}

/* INPUT */
input{
  width:100%;
  margin-top:8px;
  padding:9px;
  border-radius:10px;
  background:rgba(0,0,0,0.5);
  border:1px solid rgba(255,255,255,0.1);
  color:var(--text);
  outline:none;
}

/* APPS GRID */
.apps{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:10px;
}

.card{
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:12px;
  padding:12px;
  text-align:center;
  transition:0.25s;
  cursor:pointer;
}

.card i{
  font-size:1.3rem;
  color:var(--accent);
  display:block;
  margin-bottom:6px;
}

.card:hover{
  transform:translateY(-6px) rotate(-1deg);
  box-shadow:0 20px 60px rgba(124,134,255,0.2);
}


.resize{
  position:absolute;
  right:4px;
  bottom:4px;
  width:12px;
  height:12px;
  cursor:nwse-resize;
  opacity:0.3;
}

.resize:hover{
  opacity:1;
}
</style>
</head>

<body>

<div class="boot" id="boot">BOOTING  OS...</div>

<div class="desktop" id="desktop">

  <!-- ICONS -->
  <div class="icons">
    <div class="icon" onclick="openWin('terminal')">
      <i class="fa-solid fa-terminal"></i>
      Terminal
    </div>

    <div class="icon" onclick="openWin('apps')">
      <i class="fa-solid fa-layer-group"></i>
      Apps
    </div>

    <div class="icon" onclick="openWin('about')">
      <i class="fa-solid fa-user"></i>
      Profile
    </div>
  </div>

  <!-- TERMINAL -->
  <div class="window" id="terminal" style="top:90px;left:220px;">
    <div class="header" onmousedown="drag(event,'terminal')">
      <div class="dots">
        <div class="dot red"></div>
        <div class="dot yellow"></div>
        <div class="dot green"></div>
      </div>
      EESA TERMINAL
      <span class="close" onclick="closeWin('terminal')">x</span>
    </div>

    <div class="content terminal" id="out"></div>
    <input id="cmd" placeholder="type command..." onkeydown="if(event.key==='Enter') run()"/>
    <div class="resize" onmousedown="resize(event,'terminal')"></div>
  </div>

  <!-- APPS -->
  <div class="window" id="apps" style="top:140px;left:260px;">
    <div class="header" onmousedown="drag(event,'apps')">
      <div class="dots">
        <div class="dot red"></div>
        <div class="dot yellow"></div>
        <div class="dot green"></div>
      </div>
      APPLICATIONS
      <span class="close" onclick="closeWin('apps')">x</span>
    </div>

    <div class="content">
      <div class="apps">

        <div class="card"><i class="fa-solid fa-code"></i>C++</div>
        <div class="card"><i class="fa-brands fa-python"></i>Python</div>
        <div class="card"><i class="fa-solid fa-c"></i>C</div>
        <div class="card"><i class="fa-brands fa-java"></i>Java</div>
        <div class="card"><i class="fa-solid fa-diagram-project"></i>DSA</div>
        <div class="card"><i class="fa-brands fa-github"></i>GitHub</div>

      </div>
    </div>

    <div class="resize" onmousedown="resize(event,'apps')"></div>
  </div>

  <!-- PROFILE -->
  <div class="window" id="about" style="top:220px;left:320px;">
    <div class="header" onmousedown="drag(event,'about')">
      <div class="dots">
        <div class="dot red"></div>
        <div class="dot yellow"></div>
        <div class="dot green"></div>
      </div>
      PROFILE
      <span class="close" onclick="closeWin('about')">x</span>
    </div>

    <div class="content">
      15-year-old developer focused on clean systems thinking.<br><br>
      C++ • Python • C • Java (learning)<br>
      DSA • GitHub • Architecture mindset
    </div>

    <div class="resize" onmousedown="resize(event,'about')"></div>
  </div>

</div>

<script>

setTimeout(()=>{
  document.getElementById("boot").style.display="none";
  document.getElementById("desktop").style.display="block";
},1800);

/* WINDOW SYSTEM */
let z=10;

function openWin(id){
  const w=document.getElementById(id);
  w.style.display="block";
  w.style.zIndex=++z;
  w.classList.add("active");
}

function closeWin(id){
  document.getElementById(id).style.display="none";
}


function drag(e,id){
  const w=document.getElementById(id);
  w.style.zIndex=++z;

  let ox=e.clientX-w.offsetLeft;
  let oy=e.clientY-w.offsetTop;

  function move(ev){
    w.style.left=(ev.clientX-ox)+"px";
    w.style.top=(ev.clientY-oy)+"px";
  }

  document.addEventListener("mousemove",move);
  document.onmouseup=()=>document.removeEventListener("mousemove",move);
}


function resize(e,id){
  const w=document.getElementById(id);

  function move(ev){
    w.style.width=(ev.clientX-w.offsetLeft)+"px";
    w.style.height=(ev.clientY-w.offsetTop)+"px";
  }

  document.addEventListener("mousemove",move);
  document.onmouseup=()=>document.removeEventListener("mousemove",move);
}

function run(){
  const input=document.getElementById("cmd");
  const out=document.getElementById("out");
  const cmd=input.value.toLowerCase();

  let res="";

  if(cmd==="help") res="about | skills | projects | whoami";
  else if(cmd==="about") res="15 yr dev focused on systems thinking";
  else if(cmd==="skills") res="C++ Python C Java DSA GitHub";
  else if(cmd==="projects") res="Password Manager / CLI Calc / AI System";
  else res="unknown command";

  type(out,"\n> "+cmd+"\n"+res+"\n");
  input.value="";
}

function type(el,text){
  let i=0;
  function step(){
    el.innerText+=text[i++];
    el.scrollTop=el.scrollHeight;
    if(i<text.length) requestAnimationFrame(step);
  }
  step();
}

</script>

</body>
</html>
