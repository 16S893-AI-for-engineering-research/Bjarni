// js/home.js
// Home page D3 visuals:
//   1. Hero "shape-shifting aircraft" — cross-fading + floating SVG silhouettes
//      cycling through tube&wing / D8 / BWB / TBW.
//   2. Fuel energy-density scatter (gravimetric vs volumetric LHV), D3, with
//      hover tooltips and category coloring.
//   3. Animated stat counters.

document.addEventListener("DOMContentLoaded", () => {
  initHero();
  initFuelScatter("fuel-scatter");
  initCounters();
});

// exposed so other pages (e.g. project.html) can render the same chart
// into a differently-named container without re-running the hero/counters.
window.renderFuelScatter = initFuelScatter;

/* ============================== 1. HERO ============================== */

function initHero() {
  const stage = document.getElementById("hero-stage");
  if (!stage) return;

  const width = stage.clientWidth || 900;
  const height = stage.clientHeight || 500;

  const svg = d3.select(stage)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("class", "parallax-layer")
    .style("z-index", 3);

  const cx = width / 2, cy = height / 2 - 10;

  // Faint orbit rings (pure decoration, different scroll speeds handled via data-speed on container)
  const rings = svg.append("g").attr("class", "rings").attr("opacity", 0.25);
  [1, 1.5, 2].forEach((s, i) => {
    rings.append("ellipse")
      .attr("cx", cx).attr("cy", cy)
      .attr("rx", 160 * s).attr("ry", 60 * s)
      .attr("fill", "none")
      .attr("stroke", i === 1 ? "var(--cryo)" : "var(--jetA)")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "2,6");
  });

  const g = svg.append("g").attr("transform", `translate(${cx},${cy})`);

  // Four silhouette groups, drawn with simple path primitives, one active at a time.
  const shapes = {
    tubeWing: drawTubeWing(g),
    d8: drawD8(g),
    bwb: drawBWB(g),
    tbw: drawTBW(g)
  };
  Object.values(shapes).forEach(s => s.attr("opacity", 0));

  const order = ["tubeWing", "d8", "bwb", "tbw"];
  const labels = {
    tubeWing: "Tube & Wing",
    d8: "Double-Bubble (D8)",
    bwb: "Blended Wing Body",
    tbw: "Truss-Braced Wing"
  };

  const caption = document.getElementById("hero-caption");
  let idx = 0;

  function showShape(i, animateIn) {
    const key = order[i];
    Object.entries(shapes).forEach(([k, sel]) => {
      sel.transition().duration(700).attr("opacity", k === key ? 1 : 0);
    });
    if (caption) {
      caption.style.opacity = 0;
      setTimeout(() => {
        caption.textContent = labels[key];
        caption.style.opacity = 1;
      }, 350);
    }
  }
  showShape(0);

  setInterval(() => {
    idx = (idx + 1) % order.length;
    showShape(idx);
  }, 3200);

  // gentle bobbing float, independent of the cross-fade
  d3.timer((elapsed) => {
    const dy = Math.sin(elapsed / 900) * 6;
    const rot = Math.sin(elapsed / 1800) * 1.4;
    g.attr("transform", `translate(${cx},${cy + dy}) rotate(${rot})`);
  });

  window.addEventListener("resize", () => { /* keep simple: viewBox scales it */ });
}

function drawTubeWing(g) {
  const s = g.append("g");
  s.append("path").attr("d","M -170,0 Q -160,-10 -120,-11 L 120,-8 Q 155,-7 168,0 Q 155,7 120,8 L -120,11 Q -160,10 -170,0 Z").attr("fill","var(--jetA)").attr("opacity",.9);
  s.append("path").attr("d","M -10,-4 L -85,-95 Q -75,-98 -62,-92 L -6,-9 Z").attr("fill","var(--ink)").attr("opacity",.92);
  s.append("path").attr("d","M -10,4 L -85,95 Q -75,98 -62,92 L -6,9 Z").attr("fill","var(--ink)").attr("opacity",.92);
  s.append("path").attr("d","M -140,0 L -168,-24 Q -160,-10 -160,0 Q -160,10 -168,24 Z").attr("fill","var(--ink)").attr("opacity",.75);
  return s;
}
function drawD8(g) {
  const s = g.append("g");
  s.append("path")
    .attr("d", "M -150,-30 Q -150,-46 -110,-46 L 90,-40 Q 145,-36 150,0 Q 145,36 90,40 L -110,46 Q -150,46 -150,30 Q -158,0 -150,-30 Z")
    .attr("fill", "var(--cryo)").attr("opacity", .88);
  s.append("path").attr("d", "M -110,-44 Q -30,-30 -30,0 Q -30,30 -110,44").attr("fill", "none").attr("stroke", "var(--bg-0)").attr("stroke-width", 2.5).attr("opacity", .55);
  s.append("path").attr("d", "M 0,-24 L -70,-115 Q -58,-118 -46,-112 L 10,-30 Z").attr("fill", "var(--ink)").attr("opacity", .92);
  s.append("path").attr("d", "M 0,24 L -70,115 Q -58,118 -46,112 L 10,30 Z").attr("fill", "var(--ink)").attr("opacity", .92);
  s.append("ellipse").attr("cx", 78).attr("cy", 22).attr("rx", 22).attr("ry", 10).attr("fill", "var(--ink)").attr("opacity", .85);
  s.append("ellipse").attr("cx", 78).attr("cy", -22).attr("rx", 22).attr("ry", 10).attr("fill", "var(--ink)").attr("opacity", .85);
  s.append("path").attr("d", "M 120,-30 L 145,-52 L 138,-30 Z").attr("fill", "var(--ink)").attr("opacity", .7);
  s.append("path").attr("d", "M 120,30 L 145,52 L 138,30 Z").attr("fill", "var(--ink)").attr("opacity", .7);
  return s;
}
function drawBWB(g) {
  const s = g.append("g");
  const path = "M -170,0 " +
               "Q -140,-14 -80,-18 " +
               "L 60,-68 " +
               "Q 95,-80 108,-64 " +
               "L 40,-20 " +
               "Q 70,-6 70,0 " +
               "Q 70,6 40,20 " +
               "L 108,64 " +
               "Q 95,80 60,68 " +
               "L -80,18 " +
               "Q -140,14 -170,0 Z";
  s.append("path").attr("d", path).attr("fill", "var(--nondrop)").attr("opacity", .88);
  s.append("ellipse").attr("cx", -105).attr("cy", 0).attr("rx", 40).attr("ry", 12).attr("fill", "var(--ink)").attr("opacity", .28);
  s.append("ellipse").attr("cx", 58).attr("cy", -28).attr("rx", 15).attr("ry", 7).attr("fill", "var(--ink)").attr("opacity", .8);
  s.append("ellipse").attr("cx", 58).attr("cy", 28).attr("rx", 15).attr("ry", 7).attr("fill", "var(--ink)").attr("opacity", .8);
  s.append("path").attr("d", "M 100,-66 L 114,-78 L 108,-60 Z").attr("fill", "var(--ink)").attr("opacity", .7);
  s.append("path").attr("d", "M 100,66 L 114,78 L 108,60 Z").attr("fill", "var(--ink)").attr("opacity", .7);
  return s;
}
function drawTBW(g) {
  const s = g.append("g");
  s.append("path").attr("d","M -160,0 Q -152,-9 -118,-10 L 118,-7 Q 145,-6 155,0 Q 145,6 118,7 L -118,10 Q -152,9 -160,0 Z").attr("fill", "var(--rose)").attr("opacity", .9);
  s.append("path").attr("d","M -5,-3 L -145,-70 Q -135,-73 -122,-67 L -1,-8 Z").attr("fill", "var(--ink)").attr("opacity", .92);
  s.append("path").attr("d","M -5,3 L -145,70 Q -135,73 -122,67 L -1,8 Z").attr("fill", "var(--ink)").attr("opacity", .92);
  s.append("line").attr("x1",-40).attr("y1",5).attr("x2",-95).attr("y2",48).attr("stroke", "var(--faint)").attr("stroke-width", 3.5);
  s.append("line").attr("x1",-40).attr("y1",-5).attr("x2",-95).attr("y2",-48).attr("stroke", "var(--faint)").attr("stroke-width", 3.5);
  s.append("path").attr("d","M -132,0 L -155,-18 Q -148,-8 -148,0 Q -148,8 -155,18 Z").attr("fill", "var(--ink)").attr("opacity", .75);
  return s;
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
