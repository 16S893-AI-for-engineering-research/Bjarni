// js/secret.js
// The secret page: a D3 particle field (rising bubbles) behind a fake
// "TASOPT feasibility check" terminal with a typewriter effect + confetti burst.

document.addEventListener("DOMContentLoaded", () => {
  initBubbles();
  initTerminal();
});

function initBubbles() {
  const el = document.getElementById("bubble-field");
  if (!el) return;

  const width = el.clientWidth || window.innerWidth;
  const height = el.clientHeight || 420;

  const svg = d3.select(el).append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%").attr("height", "100%");

  const colors = ["#ff5a3d", "#e8b04b", "#ff8c42", "#d64545", "#ffcf7a"];

  const n = 46;
  const data = d3.range(n).map(() => ({
    x: Math.random() * width,
    y: height + Math.random() * height,
    r: 3 + Math.random() * 9,
    speed: 0.3 + Math.random() * 0.9,
    wobble: Math.random() * Math.PI * 2,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  const circles = svg.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("r", d => d.r)
    .attr("fill", d => d.color)
    .attr("fill-opacity", 0.35)
    .attr("stroke", d => d.color)
    .attr("stroke-opacity", 0.6);

  d3.timer((elapsed) => {
    data.forEach(d => {
      d.y -= d.speed;
      d.x += Math.sin(elapsed / 800 + d.wobble) * 0.4;
      if (d.y < -20) {
        d.y = height + 20;
        d.x = Math.random() * width;
      }
    });
    circles.attr("cx", d => d.x).attr("cy", d => d.y);
  });
}

function initTerminal() {
  const btn = document.getElementById("run-check");
  const out = document.getElementById("terminal-out");
  if (!btn || !out) return;

  const lines = [
    "> tasopt.plus --fuel=13 --config=tube-wing --size=narrowbody",
    "loading fuel property table ...... OK",
    "checking energy density ........... catastrophically low",
    "checking tank compatibility ....... tank has melted",
    "checking regulatory pathway ....... does not exist",
    "checking combustor design ......... redundant, it's already a volcano",
    "checking thesis-defense readiness . asymptotically approaching",
    "",
    "RESULT: feasible only in Iceland, and only if you don't mind lava.",
    "recommend: patience, structural cooling, and maybe a permit from Grindav\u00edk.",
    "",
    "> _ fuel #13 flagged for further study (by someone braver than TASOPT)."
  ];

  let running = false;

  btn.addEventListener("click", () => {
    if (running) return;
    running = true;
    out.textContent = "";
    out.classList.add("show");
    let li = 0;
    function typeLine() {
      if (li >= lines.length) { running = false; burstConfetti(); return; }
      const line = lines[li];
      let ci = 0;
      const speed = line.length === 0 ? 0 : 14;
      function typeChar() {
        out.textContent += line[ci] ?? "";
        ci++;
        if (ci < line.length) {
          setTimeout(typeChar, speed);
        } else {
          out.textContent += "\n";
          li++;
          setTimeout(typeLine, 220);
        }
      }
      if (line.length === 0) { out.textContent += "\n"; li++; setTimeout(typeLine, 120); }
      else typeChar();
    }
    typeLine();
  });
}

function burstConfetti() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.zIndex = "600";
  overlay.style.pointerEvents = "none";
  document.body.appendChild(overlay);

  const svg = d3.select(overlay).append("svg")
    .attr("width", "100%").attr("height", "100%")
    .style("position", "absolute").style("inset", "0");

  const w = window.innerWidth, h = window.innerHeight;
  const colors = ["#e8b04b", "#5fd2c2", "#8ea0e8", "#d98aa8", "#7fe0a8", "#eef2f8"];
  const n = 90;
  const bits = d3.range(n).map(() => ({
    x: w / 2 + (Math.random() - 0.5) * 140,
    y: h * 0.35,
    vx: (Math.random() - 0.5) * 9,
    vy: -Math.random() * 9 - 3,
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 12,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 0
  }));

  const rects = svg.selectAll("rect")
    .data(bits)
    .join("rect")
    .attr("width", 7).attr("height", 10)
    .attr("fill", d => d.color);

  const g = 0.35;
  const timer = d3.timer((elapsed) => {
    bits.forEach(b => {
      b.vy += g;
      b.x += b.vx;
      b.y += b.vy;
      b.rot += b.vr;
      b.life++;
    });
    rects.attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rot})`)
      .attr("opacity", d => Math.max(0, 1 - d.life / 140));
    if (elapsed > 2600) {
      timer.stop();
      overlay.remove();
    }
  });
}
