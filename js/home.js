// js/home.js
// Home page visuals:
//   1. Hero — cross-fading real aircraft photography (data/aircraft.js),
//      cycling through tube&wing / D8 / BWB / TBW with credit captions.
//   2. Fuel energy-density scatter (gravimetric vs volumetric LHV), D3, with
//      hover tooltips and category coloring.
//   3. Animated stat counters.
//   4. Airframe preview cards (photo + credit + blurb), data-driven.

document.addEventListener("DOMContentLoaded", () => {
  initHero();
  initFuelScatter("fuel-scatter");
  initCounters();
  initConfigPreviewCards();
});

// exposed so other pages (e.g. project.html) can render the same chart
// into a differently-named container without re-running the hero/counters.
window.renderFuelScatter = initFuelScatter;

/* ============================== 1. HERO (real aircraft photos) ============================== */
// Cross-fades through the four airframe photos in data/aircraft.js (CONFIGS),
// rather than drawing stylized D3 silhouettes — real photography reads much
// better at hero size and gives proper credit to the source images.

function initHero() {
  const stage = document.getElementById("hero-stage");
  const photoLayer = document.getElementById("hero-photos");
  if (!stage || !photoLayer || typeof CONFIGS === "undefined") return;

  const caption = document.getElementById("hero-caption");
  const creditEl = document.getElementById("hero-credit");

  // build one absolutely-positioned photo div per config
  const layers = CONFIGS.map((cfg, i) => {
    const div = document.createElement("div");
    div.className = "hero-photo" + (i === 0 ? " active" : "");
    div.style.backgroundImage = `url("${cfg.photo}")`;
    photoLayer.appendChild(div);
    return div;
  });

  let idx = 0;

  function showConfig(i) {
    const cfg = CONFIGS[i];
    layers.forEach((div, k) => div.classList.toggle("active", k === i));
    if (caption) {
      caption.style.opacity = 0;
      setTimeout(() => {
        caption.textContent = cfg.name;
        caption.style.opacity = 1;
      }, 350);
    }
    if (creditEl) {
      creditEl.style.opacity = 0;
      setTimeout(() => {
        creditEl.textContent = cfg.photoCredit || "";
        creditEl.style.opacity = 1;
      }, 350);
    }
  }
  showConfig(0);

  setInterval(() => {
    idx = (idx + 1) % CONFIGS.length;
    showConfig(idx);
  }, 4200);
}

/* ==================== airframe preview cards (real photos) ==================== */
// Populates the "Four shapes, one optimizer" grid on the home page with the
// same photo + credit data used by the hero, so there's a single source of
// truth (data/aircraft.js) instead of hard-coded HTML per card.

function initConfigPreviewCards() {
  const grid = document.getElementById("config-preview-grid");
  if (!grid || typeof CONFIGS === "undefined") return;

  grid.innerHTML = CONFIGS.map(cfg => `
    <div class="card">
      <div class="config-card-photo">
        <img src="${cfg.photo}" alt="${cfg.name}" loading="lazy" />
      </div>
      <div class="photo-credit">${cfg.photoCredit || ""}</div>
      <h3>${cfg.name}</h3>
      <p>${cfg.desc}</p>
    </div>
  `).join("");
}

/* ======================= 2. FUEL ENERGY SCATTER ======================= */

function initFuelScatter(targetId) {
  const el = document.getElementById(targetId || "fuel-scatter");
  if (!el || typeof FUELS === "undefined") return;
  el.innerHTML = ""; // guard against double-render if called twice

  const margin = { top: 24, right: 26, bottom: 52, left: 58 };
  const width = (el.clientWidth || 640) - margin.left - margin.right;
  const height = 380 - margin.top - margin.bottom;

  const svg = d3.select(el).append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("width", "100%");

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  // exclude any fuels flagged "hidden" (e.g. the easter-egg 13th fuel) from
  // the public-facing chart — it still lives in the data file for the secret page.
  const visibleFuels = FUELS.filter(f => !f.hidden);

  const x = d3.scaleLinear().domain([0, 125]).range([0, width]);
  const y = d3.scaleLinear().domain([0, 36]).range([height, 0]);

  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(6))
    .call(ax => ax.selectAll("text").attr("fill", "var(--muted)").attr("font-family", "var(--mono)").attr("font-size", 11))
    .call(ax => ax.selectAll("line,path").attr("stroke", "var(--line)"));

  g.append("g")
    .call(d3.axisLeft(y).ticks(6))
    .call(ax => ax.selectAll("text").attr("fill", "var(--muted)").attr("font-family", "var(--mono)").attr("font-size", 11))
    .call(ax => ax.selectAll("line,path").attr("stroke", "var(--line)"));

  g.append("text")
    .attr("x", width / 2).attr("y", height + 42)
    .attr("text-anchor", "middle").attr("fill", "var(--faint)")
    .attr("font-family", "var(--mono)").attr("font-size", 11.5)
    .text("gravimetric energy density (MJ/kg)  →");

  g.append("text")
    .attr("transform", `translate(-42,${height / 2}) rotate(-90)`)
    .attr("text-anchor", "middle").attr("fill", "var(--faint)")
    .attr("font-family", "var(--mono)").attr("font-size", 11.5)
    .text("volumetric energy density (MJ/L)  →");

  // gridlines
  g.append("g").attr("opacity", .5)
    .selectAll("line.gy")
    .data(y.ticks(6)).join("line")
    .attr("x1", 0).attr("x2", width)
    .attr("y1", d => y(d)).attr("y2", d => y(d))
    .attr("stroke", "var(--line)").attr("stroke-dasharray", "2,4");

  const tooltip = getTooltip();

  const nodes = g.selectAll("circle.fuel")
    .data(visibleFuels)
    .join("circle")
    .attr("class", "fuel")
    .attr("cx", d => x(d.lhv_gravimetric))
    .attr("cy", d => y(d.lhv_volumetric))
    .attr("r", 0)
    .attr("fill", d => d.color)
    .attr("fill-opacity", 0.85)
    .attr("stroke", "#000")
    .attr("stroke-opacity", 0.25)
    .style("cursor", "pointer")
    .on("mouseenter", function (event, d) {
      d3.select(this).transition().duration(150).attr("r", 12);
      tooltip
        .html(`
          <div class="tt-title" style="color:${d.color}">${d.name}</div>
          <div class="tt-row"><span>gravimetric</span><span>${d.lhv_gravimetric} MJ/kg</span></div>
          <div class="tt-row"><span>volumetric</span><span>${d.lhv_volumetric} MJ/L</span></div>
          <div class="tt-row"><span>state</span><span>${d.state}</span></div>
        `)
        .classed("show", true);
    })
    .on("mousemove", (event) => positionTooltip(tooltip, event))
    .on("mouseleave", function () {
      d3.select(this).transition().duration(150).attr("r", 8);
      tooltip.classed("show", false);
    });

  nodes.transition().delay((d, i) => i * 60).duration(500).ease(d3.easeBackOut).attr("r", 8);

  // labels for reference + hydrogen (avoid clutter — just call out extremes)
  ["jetA", "lh2"].forEach(id => {
    const d = FUEL_BY_ID[id];
    g.append("text")
      .attr("x", x(d.lhv_gravimetric)).attr("y", y(d.lhv_volumetric) - 14)
      .attr("text-anchor", "middle").attr("fill", "var(--ink)")
      .attr("font-family", "var(--mono)").attr("font-size", 11)
      .attr("opacity", 0)
      .text(d.name)
      .transition().delay(900).duration(500).attr("opacity", .85);
  });
}

/* ============================ tooltip utils ============================ */
function getTooltip() {
  let t = document.querySelector(".viz-tooltip");
  if (!t) {
    t = document.createElement("div");
    t.className = "viz-tooltip";
    document.body.appendChild(t);
  }
  return d3.select(t);
}
function positionTooltip(tooltip, event) {
  const node = tooltip.node();
  const w = node.offsetWidth, h = node.offsetHeight;
  let left = event.clientX + 18;
  let top = event.clientY - h / 2;
  if (left + w > window.innerWidth - 12) left = event.clientX - w - 18;
  top = Math.max(12, Math.min(window.innerHeight - h - 12, top));
  tooltip.style("left", left + "px").style("top", top + "px");
}

/* ============================ counters ============================ */
function initCounters() {
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = parseFloat(el.dataset.count);
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          io.disconnect();
          const dur = 1200;
          const start = performance.now();
          function step(now) {
            const p = Math.min(1, (now - start) / dur);
            const v = target * d3.easeCubicOut(p);
            el.textContent = (target % 1 === 0) ? Math.round(v) : v.toFixed(1);
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
  });
}
