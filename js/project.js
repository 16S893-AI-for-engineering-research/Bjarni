// js/project.js
// Project page D3 visuals:
//   1. Config x Size status matrix (heatmap-style grid) with hover detail.
//   2. Small animated "today -> target" expansion diagram (concentric rings).

document.addEventListener("DOMContentLoaded", () => {
  initMatrix();
  initExpansionRings();
});

/* ============================ 1. MATRIX ============================ */

function initMatrix() {
  const el = document.getElementById("config-matrix");
  if (!el || typeof CONFIGS === "undefined") return;

  const cellW = 168, cellH = 92, labelW = 230, labelH = 46;
  const width = labelW + cellW * SIZE_CLASSES.length;
  const height = labelH + cellH * CONFIGS.length;

  const svg = d3.select(el).append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%");

  const statusColor = {
    today: "var(--good)",
    reference: "var(--cryo)",
    target: "var(--jetA)"
  };
  const statusLabel = {
    today: "TASOPT today",
    reference: "published concept",
    target: "project target"
  };

  // column headers (size classes)
  svg.selectAll("text.col-head")
    .data(SIZE_CLASSES)
    .join("text")
    .attr("class", "col-head")
    .attr("x", (d, i) => labelW + i * cellW + cellW / 2)
    .attr("y", labelH - 16)
    .attr("text-anchor", "middle")
    .attr("fill", "var(--ink)")
    .attr("font-family", "var(--mono)")
    .attr("font-weight", 700)
    .attr("font-size", 13)
    .text(d => d.name);

  svg.selectAll("text.col-sub")
    .data(SIZE_CLASSES)
    .join("text")
    .attr("class", "col-sub")
    .attr("x", (d, i) => labelW + i * cellW + cellW / 2)
    .attr("y", labelH)
    .attr("text-anchor", "middle")
    .attr("fill", "var(--faint)")
    .attr("font-family", "var(--mono)")
    .attr("font-size", 10.5)
    .text(d => d.pax);

  // row headers (configs)
  const rowG = svg.selectAll("g.row-head")
    .data(CONFIGS)
    .join("g")
    .attr("class", "row-head")
    .attr("transform", (d, i) => `translate(0,${labelH + i * cellH + cellH / 2})`);

  rowG.append("text")
    .attr("x", 0).attr("y", -22)
    .attr("fill", "var(--ink)")
    .attr("font-family", "var(--mono)")
    .attr("font-weight", 700)
    .attr("font-size", 13.5)
    .text(d => d.name);

  // wrapped description — foreignObject keeps it constrained to the label
  // column instead of overflowing into the heatmap cells.
  rowG.append("foreignObject")
    .attr("x", 0).attr("y", -10)
    .attr("width", labelW - 30)
    .attr("height", 54)
    .append("xhtml:div")
    .style("font-family", "var(--mono)")
    .style("font-size", "10.5px")
    .style("line-height", "1.4")
    .style("color", "var(--faint)")
    .text(d => d.desc);

  const tooltip = getTooltipP();

  // cells
  const cellData = [];
  CONFIGS.forEach((cfg, r) => {
    SIZE_CLASSES.forEach((sz, c) => {
      cellData.push({
        cfg, sz, r, c,
        status: MATRIX_STATUS[cfg.id][sz.id]
      });
    });
  });

  const cellsG = svg.append("g");

  const cells = cellsG.selectAll("rect.cell")
    .data(cellData)
    .join("rect")
    .attr("class", "cell")
    .attr("x", d => labelW + d.c * cellW + 6)
    .attr("y", d => labelH + d.r * cellH + 6)
    .attr("width", cellW - 12)
    .attr("height", cellH - 12)
    .attr("rx", 10)
    .attr("fill", d => statusColor[d.status])
    .attr("fill-opacity", 0)
    .attr("stroke", d => statusColor[d.status])
    .attr("stroke-opacity", 0.5)
    .style("cursor", "pointer")
    .on("mouseenter", function (event, d) {
      d3.select(this).transition().duration(150).attr("fill-opacity", 0.28).attr("stroke-opacity", 1);
      const companies = (d.cfg.companies || []).join(" &middot; ");
      tooltip.html(`
        <div class="tt-title" style="color:${statusColor[d.status]}">${d.cfg.name} × ${d.sz.name}</div>
        <div class="tt-row"><span>status</span><span>${statusLabel[d.status]}</span></div>
        <div class="tt-row"><span>typical size</span><span>${d.sz.pax}</span></div>
        <div class="tt-row"><span>range class</span><span>${d.sz.range}</span></div>
        ${companies ? `<div style="margin-top:6px; padding-top:6px; border-top:1px solid var(--card-bd); color:var(--muted);">${companies}</div>` : ""}
      `).classed("show", true);
    })
    .on("mousemove", (event) => positionTooltipP(tooltip, event))
    .on("mouseleave", function (event, d) {
      d3.select(this).transition().duration(150).attr("fill-opacity", 0.12).attr("stroke-opacity", 0.5);
      tooltip.classed("show", false);
    });

  cells.transition().delay((d, i) => i * 40).duration(400).attr("fill-opacity", 0.12);

  cellsG.selectAll("text.cell-icon")
    .data(cellData)
    .join("text")
    .attr("class", "cell-icon")
    .attr("x", d => labelW + d.c * cellW + cellW / 2)
    .attr("y", d => labelH + d.r * cellH + cellH / 2 + 5)
    .attr("text-anchor", "middle")
    .attr("font-family", "var(--mono)")
    .attr("font-size", 11)
    .attr("fill", d => statusColor[d.status])
    .attr("opacity", 0)
    .text(d => d.status === "today" ? "● today" : d.status === "reference" ? "◐ concept" : "○ target")
    .transition().delay((d, i) => i * 40 + 200).duration(400).attr("opacity", 0.9);
}

/* ==================== EXPANSION RINGS (today -> target) ==================== */

function initExpansionRings() {
  const el = document.getElementById("expansion-rings");
  if (!el) return;

  // Base the ring sizing on the *smaller* dimension so circles stay circular,
  // but give the SVG a wider (landscape) viewBox with generous margin so the
  // slowly-orbiting fuel/config labels never clip against the frame edge.
  const baseSize = Math.min(el.clientWidth || 520, 520);
  const labelMargin = 70; // room for the orbiting text labels + their own width
  const width = baseSize + labelMargin * 2;
  const height = baseSize + labelMargin * 2;

  const svg = d3.select(el).append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%");

  const cx = width / 2, cy = height / 2;
  const size = baseSize;

  const rings = [
    // center solid: Jet-A / T+W
    { r: size * 0.16, label: "TASOPT\ntoday", color: "var(--good)", sub: "T+W · Jet-A-like" },
    // green/cryo fuels ring — made slightly smaller so it overlaps the center
    { r: size * 0.22, label: "+ fuels", color: "var(--cryo)", sub: "12 alt fuels" },
    // purple/configs ring — reduced diameter per request
    { r: size * 0.36, label: "+ configs", color: "var(--nondrop)", sub: "D8 · BWB · TBW" },
    // outer target ring
    { r: size * 0.46, label: "target", color: "var(--jetA)", sub: "full design space" }
  ];

  rings.forEach((ring, i) => {
    svg.append("circle")
      .attr("cx", cx).attr("cy", cy).attr("r", 0)
      .attr("fill", "none")
      .attr("stroke", ring.color)
      .attr("stroke-width", i === 0 ? 0 : 1.4)
      .attr("stroke-dasharray", i === rings.length - 1 ? "3,5" : "none")
      .attr("opacity", 0.85)
      .transition().delay(i * 250).duration(700).ease(d3.easeCubicOut)
      .attr("r", ring.r);
  });

  svg.append("circle")
    .attr("cx", cx).attr("cy", cy).attr("r", 0)
    .attr("fill", "var(--good)").attr("fill-opacity", 0.25)
    .transition().duration(700).attr("r", rings[0].r);

  svg.append("text")
    .attr("x", cx).attr("y", cy + 4)
    .attr("text-anchor", "middle")
    .attr("fill", "var(--ink)")
    .attr("font-family", "var(--mono)")
    .attr("font-size", 12)
    .attr("font-weight", 700)
    .text("Jet-A / T+W");

  // rotating labels: fuels on the outermost orbit, configs on the purple (configs) ring
  const labelG = svg.append("g").attr("transform", `translate(${cx},${cy})`);

  // fuels: use the FUELS list (exclude hidden entries and Jet-A itself)
  const fuelLabels = FUELS.filter(f => !f.hidden && f.id !== 'jetA').map(f => f.id.toUpperCase());
  const R_fuel = rings[3].r + labelMargin * 0.6;
  const fuelItems = labelG.selectAll("text.orbit-fuel")
    .data(fuelLabels)
    .join("text")
    .attr("class", "orbit orbit-fuel")
    .attr("text-anchor", "middle")
    // color text same as the outer target ring
    .attr("fill", rings[3].color)
    .attr("font-family", "var(--mono)")
    .attr("font-size", 10)
    .text(d => d);

  // configs: use CONFIGS short codes (exclude Tube & Wing) and orbit them on the purple ring
  const configLabels = CONFIGS.filter(c => c.id !== 'tube-wing').map(c => c.short || c.id.toUpperCase());
  const R_cfg = rings[2].r + labelMargin * 0.22;
  const cfgItems = labelG.selectAll("text.orbit-cfg")
    .data(configLabels)
    .join("text")
    .attr("class", "orbit orbit-cfg")
    .attr("text-anchor", "middle")
    // color text same as the purple/configs ring
    .attr("fill", rings[2].color)
    .attr("font-family", "var(--mono)")
    .attr("font-size", 11)
    .attr("font-weight", 700)
    .text(d => d);

  d3.timer((elapsed) => {
    const t = elapsed / 1000;

    fuelItems.attr("transform", (d, i) => {
      const angle = (i / fuelLabels.length) * Math.PI * 2 + t * 0.08;
      const x = Math.cos(angle) * R_fuel;
      const y = Math.sin(angle) * R_fuel;
      return `translate(${x},${y})`;
    });

    cfgItems.attr("transform", (d, i) => {
      const angle = (i / configLabels.length) * Math.PI * 2 - t * 0.14;
      const x = Math.cos(angle) * R_cfg;
      const y = Math.sin(angle) * R_cfg;
      return `translate(${x},${y})`;
    });
  });
}

/* ============================ tooltip utils ============================ */
function getTooltipP() {
  let t = document.querySelector(".viz-tooltip");
  if (!t) {
    t = document.createElement("div");
    t.className = "viz-tooltip";
    document.body.appendChild(t);
  }
  return d3.select(t);
}
function positionTooltipP(tooltip, event) {
  const node = tooltip.node();
  const w = node.offsetWidth, h = node.offsetHeight;
  let left = event.clientX + 18;
  let top = event.clientY - h / 2;
  if (left + w > window.innerWidth - 12) left = event.clientX - w - 18;
  top = Math.max(12, Math.min(window.innerHeight - h - 12, top));
  tooltip.style("left", left + "px").style("top", top + "px");
}
