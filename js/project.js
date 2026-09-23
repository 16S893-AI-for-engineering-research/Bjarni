// js/project.js
// Project page D3 visuals:
//   1. Config x Size status matrix (heatmap-style grid) with hover detail.
//   2. Small animated "today -> target" expansion diagram (concentric rings).
//   3. Dynamic fuel scatter with selectable x/y axes.

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

  // fuels: use unique fuel names (exclude hidden entries and Jet-A itself, deduplicate variants)
  const fuelNames = new Set();
  FUELS.forEach(f => {
    if (!f.hidden && f.id !== 'jetA') {
      fuelNames.add(f.name);
    }
  });
  const fuelLabels = Array.from(fuelNames);
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

/* ==================== 3. DYNAMIC FUEL SCATTER WITH AXIS & SIZING SELECTORS ==================== */

function initDynamicFuelScatter(targetId) {
  const el = document.getElementById(targetId);
  if (!el || typeof FUELS === "undefined") return;
  el.innerHTML = "";

  // Define available metrics for X and Y axes
  const axisMetrics = {
    gravimetric: { label: "Gravimetric Energy Density (MJ/kg)", key: "lhv_gravimetric", domain: [0, 125] },
    volumetric: { label: "Volumetric Energy Density (MJ/L)", key: "lhv_volumetric", domain: [0, 36] },
    emissions: { label: "LCA/Emissions (gCO2eq/MJ)", key: "lcaPerMJ", domain: [0, 180] },
    cost: { label: "Cost ($/MJ)", key: "costPerMJ", domain: [0, 0.12] }
  };

  // Define available metrics for bubble size and color
  const bubbleMetrics = {
    none: { label: "Uniform Size", key: null, scale: "none" },
    market_size_ej: { label: "Market Size (EJ)", key: "market_size_ej", scale: "log" },
    cost: { label: "Cost ($/MJ)", key: "costPerMJ", scale: "linear" },
    emissions: { label: "LCA/Emissions (gCO2eq/MJ)", key: "lcaPerMJ", scale: "linear" }
  };

  // Create container for controls and chart
  const container = document.createElement("div");
  container.style.width = "100%";

  // Control panel
  const controls = document.createElement("div");
  controls.style.display = "grid";
  controls.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
  controls.style.gap = "16px";
  controls.style.marginBottom = "24px";
  controls.style.alignItems = "center";
  controls.style.flexWrap = "wrap";

  // Helper to create labeled selector
  function createSelector(labelText, optionsObj, defaultKey) {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "6px";

    const label = document.createElement("label");
    label.style.fontFamily = "var(--mono)";
    label.style.fontSize = "11px";
    label.style.color = "var(--faint)";
    label.style.fontWeight = "600";
    label.textContent = labelText;

    const select = document.createElement("select");
    select.style.padding = "8px 10px";
    select.style.fontFamily = "var(--mono)";
    select.style.fontSize = "12px";
    select.style.border = "1px solid var(--line)";
    select.style.borderRadius = "4px";
    select.style.background = "var(--bg)";
    select.style.color = "var(--ink)";
    select.style.cursor = "pointer";

    Object.entries(optionsObj).forEach(([key, metric]) => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = metric.label;
      if (key === defaultKey) opt.selected = true;
      select.appendChild(opt);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    return { wrapper, select };
  }

  // X-axis selector
  const { wrapper: xWrapper, select: xSelect } = createSelector("X-axis", axisMetrics, "gravimetric");
  controls.appendChild(xWrapper);

  // Y-axis selector
  const { wrapper: yWrapper, select: ySelect } = createSelector("Y-axis", axisMetrics, "volumetric");
  controls.appendChild(yWrapper);

  // Bubble size selector
  const { wrapper: sizeWrapper, select: sizeSelect } = createSelector("Bubble Size", bubbleMetrics, "market_size_ej");
  controls.appendChild(sizeWrapper);

  // Bubble color selector
  const { wrapper: colorWrapper, select: colorSelect } = createSelector("Bubble Color", bubbleMetrics, "market_size_ej");
  controls.appendChild(colorWrapper);

  container.appendChild(controls);

  // Chart container
  const chartDiv = document.createElement("div");
  chartDiv.id = "fuel-scatter-dynamic-chart";
  chartDiv.style.width = "100%";
  chartDiv.style.height = "500px";

  container.appendChild(chartDiv);
  el.appendChild(container);

  // Render function
  function renderChart() {
    const xKey = xSelect.value;
    const yKey = ySelect.value;
    const sizeKey = sizeSelect.value;
    const colorKey = colorSelect.value;

    const xMetric = axisMetrics[xKey];
    const yMetric = axisMetrics[yKey];
    const sizeMetric = bubbleMetrics[sizeKey];
    const colorMetric = bubbleMetrics[colorKey];

    chartDiv.innerHTML = "";

    const margin = { top: 24, right: 26, bottom: 52, left: 58 };
    const width = (chartDiv.clientWidth || 640) - margin.left - margin.right;
    const height = 420 - margin.top - margin.bottom;

    const svg = d3.select(chartDiv).append("svg")
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr("width", "100%")
      .attr("height", "100%");

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Filter fuels: exclude those with NaN values for the selected axes
    const visibleFuels = FUELS.filter(f => 
      f[xMetric.key] != null && f[yMetric.key] != null
    );

    // Create scales with dynamic domains based on visible data
    const xData = visibleFuels.map(f => f[xMetric.key]);
    const yData = visibleFuels.map(f => f[yMetric.key]);
    
    const xMin = Math.min(...xData);
    const xMax = Math.max(...xData);
    const yMin = Math.min(...yData);
    const yMax = Math.max(...yData);
    
    // Add 10% padding to prevent bubbles from being cut off
    const xRange = xMax - xMin || 1;
    const yRange = yMax - yMin || 1;
    const xDomain = [Math.max(0, xMin - xRange * 0.1), xMax + xRange * 0.1];
    const yDomain = [Math.max(0, yMin - yRange * 0.1), yMax + yRange * 0.1];
    
    const x = d3.scaleLinear().domain(xDomain).range([0, width]);
    const y = d3.scaleLinear().domain(yDomain).range([height, 0]);

    // Size scale
    let sizeScale;
    if (sizeKey === "none") {
      sizeScale = () => 8;
    } else {
      const sizeData = visibleFuels
        .map(f => f[sizeMetric.key])
        .filter(v => v != null);
      
      if (sizeMetric.scale === "log") {
        const sizeMin = Math.min(...sizeData);
        const sizeMax = Math.max(...sizeData);
        sizeScale = d3.scaleLog()
          .domain([Math.max(0.01, sizeMin), sizeMax])
          .range([4, 16]);
      } else {
        const sizeMin = Math.min(...sizeData);
        const sizeMax = Math.max(...sizeData);
        sizeScale = d3.scaleLinear()
          .domain([sizeMin, sizeMax])
          .range([4, 16]);
      }
    }

    // Color scale
    let colorScale;
    if (colorKey === "none") {
      colorScale = d => d.color; // Use fuel's own color
    } else {
      const colorData = visibleFuels
        .map(f => f[colorMetric.key])
        .filter(v => v != null);
      
      if (colorMetric.scale === "log") {
        const colorMin = Math.min(...colorData);
        const colorMax = Math.max(...colorData);
        colorScale = d3.scaleLog()
          .domain([Math.max(0.01, colorMin), colorMax])
          .range(["#e8f4f8", "#d62828"]); // Light blue to red
      } else {
        const colorMin = Math.min(...colorData);
        const colorMax = Math.max(...colorData);
        colorScale = d3.scaleLinear()
          .domain([colorMin, colorMax])
          .range(["#e8f4f8", "#d62828"]); // Light blue to red
      }
    }

    // Draw axes
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
      .text(xMetric.label + "  →");

    g.append("text")
      .attr("transform", `translate(-42,${height / 2}) rotate(-90)`)
      .attr("text-anchor", "middle").attr("fill", "var(--faint)")
      .attr("font-family", "var(--mono)").attr("font-size", 11.5)
      .text(yMetric.label + "  →");

    // Gridlines
    g.append("g").attr("opacity", 0.5)
      .selectAll("line.gy")
      .data(y.ticks(6)).join("line")
      .attr("x1", 0).attr("x2", width)
      .attr("y1", d => y(d)).attr("y2", d => y(d))
      .attr("stroke", "var(--line)").attr("stroke-dasharray", "2,4");

    const tooltip = getTooltip();

    // Draw circles
    const nodes = g.selectAll("circle.fuel")
      .data(visibleFuels)
      .join("circle")
      .attr("class", "fuel")
      .attr("cx", d => x(d[xMetric.key]))
      .attr("cy", d => y(d[yMetric.key]))
      .attr("r", d => sizeScale(d[sizeMetric.key]))
      .attr("fill", d => colorScale(d[colorMetric.key]) || d.color)
      .attr("fill-opacity", 0.75)
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        d3.select(this).transition().duration(150)
          .attr("fill-opacity", 1)
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 2.5);
        
        const tooltipContent = `
          <div class="tt-title" style="color:${d.color}">${d.name}</div>
          <div class="tt-row"><span>Variant</span><span>${d.variant === 'fossil' ? 'Fossil' : 'Green'}</span></div>
          ${d.derivedFrom ? `<div class="tt-row"><span>Derived from</span><span>${d.derivedFrom}</span></div>` : ''}
          <div class="tt-row"><span>${xMetric.label}</span><span>${d[xMetric.key].toFixed(2)}</span></div>
          <div class="tt-row"><span>${yMetric.label}</span><span>${d[yMetric.key] != null ? d[yMetric.key].toFixed(2) : 'N/A'}</span></div>
          ${d[sizeMetric.key] != null ? `<div class="tt-row"><span>${sizeMetric.label}</span><span>${d[sizeMetric.key].toFixed(3)}</span></div>` : ''}
        `;
        tooltip.html(tooltipContent).classed("show", true);
      })
      .on("mousemove", (event) => positionTooltip(tooltip, event))
      .on("mouseleave", function () {
        d3.select(this).transition().duration(150)
          .attr("fill-opacity", 0.75)
          .attr("stroke-opacity", 0.3)
          .attr("stroke-width", 1.5);
        tooltip.classed("show", false);
      });

    nodes.transition().delay((d, i) => i * 30).duration(400).ease(d3.easeBackOut);

    // Add dynamic labels with collision avoidance
    const labelData = visibleFuels.map(d => ({
      fuel: d,
      x: x(d[xMetric.key]),
      y: y(d[yMetric.key]),
      size: sizeScale(d[sizeMetric.key])
    }));

    // Iterative collision avoidance - labels move until no overlaps
    const labelOffsets = new Map();
    const maxIterations = 15;
    const minDist = 55;

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      let hasCollision = false;
      
      labelData.forEach((d, i) => {
        const offsets = [
          { dx: 0, dy: -16 },    // top
          { dx: 16, dy: -12 },   // top-right
          { dx: 16, dy: 0 },     // right
          { dx: 16, dy: 12 },    // bottom-right
          { dx: 0, dy: 16 },     // bottom
          { dx: -16, dy: 12 },   // bottom-left
          { dx: -16, dy: 0 },    // left
          { dx: -16, dy: -12 }   // top-left
        ];

        let bestOffset = labelOffsets.get(d.fuel.id) || { dx: 0, dy: 0 };
        let bestCollisionCount = Infinity;

        // Try each offset and pick the one with fewest collisions
        for (let offset of offsets) {
          let collisionCount = 0;
          
          // Check against all other labels
          for (let other of labelData) {
            if (other === d) continue;
            
            const otherOffset = labelOffsets.get(other.fuel.id) || { dx: 0, dy: 0 };
            const dx = (d.x + offset.dx) - (other.x + otherOffset.dx);
            const dy = (d.y + offset.dy) - (other.y + otherOffset.dy);
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < minDist) {
              collisionCount++;
            }
          }
          
          if (collisionCount < bestCollisionCount) {
            bestCollisionCount = collisionCount;
            bestOffset = offset;
          }
        }

        if (bestCollisionCount > 0) {
          hasCollision = true;
        }
        labelOffsets.set(d.fuel.id, bestOffset);
      });

      if (!hasCollision) break; // All labels are well-placed
    }

    // Render labels
    const labels = g.selectAll("text.fuel-label")
      .data(labelData)
      .join("text")
      .attr("class", "fuel-label")
      .attr("x", d => {
        const offset = labelOffsets.get(d.fuel.id) || { dx: 0, dy: 0 };
        return d.x + offset.dx;
      })
      .attr("y", d => {
        const offset = labelOffsets.get(d.fuel.id) || { dx: 0, dy: 0 };
        return d.y + offset.dy;
      })
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", "var(--ink)")
      .attr("font-family", "var(--mono)")
      .attr("font-size", "9px")
      .attr("font-weight", "700")
      .attr("pointer-events", "none")
      .text(d => {
        // Add variant indicator
        const variant = d.fuel.variant === 'fossil' ? '(f)' : '(g)';
        return `${d.fuel.name} ${variant}`;
      })
      .attr("opacity", 0)
      .transition().delay((d, i) => i * 30 + 150).duration(400)
      .attr("opacity", 0.8);

    // Draw connecting lines
    const lines = g.selectAll("line.fuel-label-line")
      .data(labelData)
      .join("line")
      .attr("class", "fuel-label-line")
      .attr("x1", d => d.x)
      .attr("y1", d => d.y)
      .attr("x2", d => {
        const offset = labelOffsets.get(d.fuel.id) || { dx: 0, dy: 0 };
        return d.x + offset.dx * 0.5;
      })
      .attr("y2", d => {
        const offset = labelOffsets.get(d.fuel.id) || { dx: 0, dy: 0 };
        return d.y + offset.dy * 0.5;
      })
      .attr("stroke", "var(--line)")
      .attr("stroke-width", 0.5)
      .attr("opacity", 0.2)
      .attr("pointer-events", "none");

    // Add color scale legend (only if not using fuel type colors)
    if (colorKey !== "none") {
      const legendX = width - 120;
      const legendY = -20;
      const legendWidth = 100;
      const legendHeight = 12;
      
      // Get color scale data
      const colorData = visibleFuels
        .map(f => f[colorMetric.key])
        .filter(v => v != null);
      
      const colorMin = Math.min(...colorData);
      const colorMax = Math.max(...colorData);
      
      // Create gradient
      const gradientId = `colorGradient-${Date.now()}`;
      const defs = g.append("defs");
      const gradient = defs.append("linearGradient")
        .attr("id", gradientId)
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%");
      
      gradient.append("stop").attr("offset", "0%").attr("stop-color", "#e8f4f8");
      gradient.append("stop").attr("offset", "100%").attr("stop-color", "#d62828");
      
      // Draw gradient bar
      g.append("rect")
        .attr("x", legendX)
        .attr("y", legendY)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("fill", `url(#${gradientId})`)
        .attr("stroke", "var(--line)")
        .attr("stroke-width", 0.5);
      
      // Min label
      g.append("text")
        .attr("x", legendX)
        .attr("y", legendY + legendHeight + 12)
        .attr("text-anchor", "middle")
        .attr("fill", "var(--faint)")
        .attr("font-family", "var(--mono)")
        .attr("font-size", "8px")
        .text(colorMin.toFixed(2));
      
      // Max label
      g.append("text")
        .attr("x", legendX + legendWidth)
        .attr("y", legendY + legendHeight + 12)
        .attr("text-anchor", "middle")
        .attr("fill", "var(--faint)")
        .attr("font-family", "var(--mono)")
        .attr("font-size", "8px")
        .text(colorMax.toFixed(2));
      
      // Color metric label
      g.append("text")
        .attr("x", legendX + legendWidth / 2)
        .attr("y", legendY - 6)
        .attr("text-anchor", "middle")
        .attr("fill", "var(--faint)")
        .attr("font-family", "var(--mono)")
        .attr("font-size", "9px")
        .attr("font-weight", "600")
        .text(colorMetric.label);
    }

    // Add legend for variant indicators
    const legendY = height + 12;
    const legendItems = [
      { text: "(f) = Fossil-derived", x: 0 },
      { text: "(g) = Green/Renewable", x: 160 }
    ];

    legendItems.forEach(item => {
      g.append("text")
        .attr("x", item.x).attr("y", legendY)
        .attr("fill", "var(--faint)")
        .attr("font-family", "var(--mono)")
        .attr("font-size", "9px")
        .text(item.text)
        .attr("opacity", 0.7);
    });
  }

  // Attach event listeners and initial render
  xSelect.addEventListener("change", renderChart);
  ySelect.addEventListener("change", renderChart);
  sizeSelect.addEventListener("change", renderChart);
  colorSelect.addEventListener("change", renderChart);

  renderChart();
}

// Expose for external calls
window.initDynamicFuelScatter = initDynamicFuelScatter;
