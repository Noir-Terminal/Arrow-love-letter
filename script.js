const TEXT = {
  label: "A little arrow for you",
  hint: "Pull the bow back & let Cupid fly ❤",
  missHint: "Oops, missed! Try again ❤",
  question: "Hey cutie ♡ will you stay mine forever?",
  yesTitle: "Hehe, I knew it! ♡",
  final: "Every day with you is my favourite day. Here's to <mark>forever</mark> with you, my love ❤",
  noLines: ["NO", "Hmm?", "Wrong button!", "Try again 😼", "Can't catch me!", "Just say yes ♡"],
};

// ---- Pixel cat (drawn on canvas) ----

const CAT_SAD = [
  "..K..........K..",
  "..KK........KK..",
  ".KKKK......KKKK.",
  ".KKKKKKKKKKKKKK.",
  "KKKKKKKKKKKKKKKK",
  "KKWWWKKKKKKWWWKK",
  "KKWKKKKKKKKWKKKK",
  "KPKKKKKPPKKKKKPK",
  "KKKKKKKKKKKKKKKK",
  "KKKKKRRKKRRKKKKK",
  ".KKKRRRRRRRRKKK.",
  ".KKKKRRRRRRKKKK.",
  "..KKKKKRRKKKKK..",
  "....KK....KK....",
];
const CAT_HAPPY = CAT_SAD.slice();
CAT_HAPPY[5] = "KKWWKKKKKKKKWWKK";
CAT_HAPPY[6] = "KKKWWKKKKKKWWKKK";

const COLORS = { K: "#111", W: "#fff", P: "#f2a7b8", R: "#c8344d" };
const ctx = document.getElementById("cat").getContext("2d");
function drawCat(map) {
  ctx.clearRect(0, 0, 16, 14);
  map.forEach((row, y) => [...row].forEach((c, x) => {
    if (COLORS[c]) { ctx.fillStyle = COLORS[c]; ctx.fillRect(x, y, 1, 1); }
  }));
}
drawCat(CAT_SAD);

const $ = (id) => document.getElementById(id);
$("label-text").textContent = TEXT.label;
$("hint").textContent = TEXT.hint;
$("title").textContent = TEXT.question;
$("no").textContent = TEXT.noLines[0];

const bg = $("bg-hearts");
setInterval(() => {
  const h = document.createElement("span");
  h.className = "bg-heart";
  h.textContent = Math.random() < 0.5 ? "❤" : "♡";
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 10 + Math.random() * 18 + "px";
  h.style.opacity = 0.3 + Math.random() * 0.6;
  h.style.animationDuration = 6 + Math.random() * 6 + "s";
  bg.appendChild(h);
  setTimeout(() => h.remove(), 12000);
}, 350);

const envScreen = $("envelope-screen");
const win = $("window");
const envelope = $("envelope");
const bowArea = $("bow-area");
const bow = $("bow");
const string = $("string");
const arrow = $("arrow");

const MAX_PULL = 70, MAX_ANGLE = 0.6;
let aiming = false, flying = false, angle = 0, pull = 0, start = null;

function nockPoint() {
  const r = bowArea.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + 20 + (r.height - 40) * 0.636 };
}

function placeArrow(x, y, a) {
  arrow.style.left = x - 7 + "px";
  arrow.style.top = y + "px";
  arrow.style.transform = `rotate(${a}rad) translateY(${-arrow.offsetHeight}px)`;
}

function render() {
  const n = nockPoint();
  bow.style.transform = `rotate(${angle}rad)`;
  string.setAttribute("points", `14,70 110,${70 + pull} 206,70`);
  placeArrow(n.x - Math.sin(angle) * pull, n.y + Math.cos(angle) * pull, angle);
}

function aim(e) {
  const dx = e.clientX - start.x, dy = Math.max(0, e.clientY - start.y);
  pull = Math.min(MAX_PULL, Math.hypot(dx, dy) * 0.7);
  angle = pull < 8 ? 0 : Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, Math.atan2(-dx, dy + 1)));
  render();
}

bowArea.addEventListener("pointerdown", (e) => {
  if (flying) return;
  aiming = true;
  start = { x: e.clientX, y: e.clientY };
  bowArea.setPointerCapture(e.pointerId);
});
window.addEventListener("pointermove", (e) => aiming && aim(e));
window.addEventListener("pointerup", release);
window.addEventListener("pointercancel", release);
function release() {
  if (!aiming) return;
  aiming = false;
  if (pull < 15) { angle = 0; pull = 45; }
  shoot();
}

function shoot() {
  flying = true;
  const n = nockPoint();
  let x = n.x - Math.sin(angle) * pull, y = n.y + Math.cos(angle) * pull;
  let a = angle;
  const speed = 11 + pull / 5;
  pull = 0;
  string.setAttribute("points", "14,70 110,70 206,70");

  (function step() {
    const len = arrow.offsetHeight;
    const r = envelope.getBoundingClientRect();
    const tx = x + Math.sin(a) * len, ty = y - Math.cos(a) * len; // arrow tip
    // gentle aim assist: curve slightly toward the envelope while it's ahead
    if (ty > r.bottom) {
      const want = Math.atan2(r.left + r.width / 2 - tx, ty - (r.top + r.height / 2));
      if (Math.abs(want - a) < 0.5) a += (want - a) * 0.04;
    }
    x += Math.sin(a) * speed; y -= Math.cos(a) * speed;
    placeArrow(x, y, a);
    if (tx > r.left + 10 && tx < r.right - 10 && ty > r.top && ty < r.bottom - 30) return hit();
    if (ty < -150 || tx < -150 || tx > innerWidth + 150) return miss();
    requestAnimationFrame(step);
  })();
}

function miss() {
  flying = false;
  angle = 0;
  render();
  $("hint").textContent = TEXT.missHint;
  setTimeout(() => ($("hint").textContent = TEXT.hint), 1800);
}

function hit() {
  envelope.classList.add("hit");
  burst(innerWidth / 2, envelope.getBoundingClientRect().top + 80);
  setTimeout(() => {
    envScreen.classList.add("hidden");
    arrow.classList.add("hidden-arrow");
    win.classList.remove("hidden");
  }, 700);
}

window.addEventListener("resize", () => !flying && render());
requestAnimationFrame(render);

const no = $("no"), yes = $("yes"), content = win.querySelector(".content");
let noCount = 0;
function runAway() {
  const box = content.getBoundingClientRect();
  if (!box.width) return; // window not open yet
  const y = yes.getBoundingClientRect();
  const w = no.offsetWidth, h = no.offsetHeight;
  const cur = no.getBoundingClientRect();
  let left, top;

  for (let i = 0; i < 30; i++) {
    left = 10 + Math.random() * (box.width - w - 20);
    top = 10 + Math.random() * (box.height - h - 20);
    const L = box.left + left, T = box.top + top;
    const overYes = L < y.right + 10 && L + w > y.left - 10 && T < y.bottom + 10 && T + h > y.top - 10;
    const tooClose = Math.hypot(L - cur.left, T - cur.top) < 90;
    if (!overYes && !tooClose) break;
  }
  no.classList.add("loose");
  no.style.left = left + "px";
  no.style.top = top + "px";
  no.textContent = TEXT.noLines[++noCount % TEXT.noLines.length];
  yes.style.transform = `scale(${Math.min(1 + noCount * 0.08, 1.6)})`;
}
no.addEventListener("mouseenter", runAway);
no.addEventListener("click", runAway);
no.addEventListener("touchstart", (e) => { e.preventDefault(); runAway(); });

yes.addEventListener("click", (e) => {
  $("title").textContent = TEXT.yesTitle;
  $("buttons").classList.add("hidden");
  no.classList.add("hidden");
  $("cat").classList.add("dance");
  drawCat(CAT_HAPPY);
  burst(e.clientX, e.clientY);
  setTimeout(() => burst(innerWidth / 2, innerHeight / 2), 400);
  typeOut($("final"), TEXT.final);
});

function typeOut(el, html) {
  el.classList.remove("hidden");
  const plain = html.replace(/<[^>]+>/g, "");
  let i = 0;
  const t = setInterval(() => {
    el.textContent = plain.slice(0, ++i);
    if (i >= plain.length) { clearInterval(t); el.innerHTML = html; }
  }, 45);
}

function burst(x, y) {
  const colors = ["#e85a8a", "#f7a1c0", "#c8344d", "#f4c95d", "#b48ef0", "#ff9c7a"];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement("span");
    c.className = "confetti";
    c.textContent = "❤";
    c.style.left = x + "px";
    c.style.top = y + "px";
    c.style.color = colors[i % colors.length];
    c.style.fontSize = 14 + Math.random() * 30 + "px";
    const a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 380;
    c.style.setProperty("--dx", Math.cos(a) * d + "px");
    c.style.setProperty("--dy", Math.sin(a) * d + 200 + "px");
    c.style.setProperty("--r", Math.random() * 720 - 360 + "deg");
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 2700);
  }
}
