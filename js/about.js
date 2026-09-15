// js/about.js
// About page: animated D3 timeline of the PhD journey + a small
// "fuel research funnel" diagram (screening -> down-select -> system impact).

document.addEventListener("DOMContentLoaded", () => {
  initTimeline();
  initFunnel();
});

function initTimeline() {
  const el = document.getElementById("timeline");
  if (!el) return;

  const events = [
    { year: "2023", title: "Started PhD @ LAE", desc: "Joined the Laboratory for Aviation and the Environment. Alternative fuels for aviation, systems focus." },
    { year: "2023–24", title: "High-level screening", desc: "Pre-screening a wide field of alternative fuels on system-level metrics before deep dives." },
    { year: "2024–25", title: "Down-selection", desc: "Narrowing to the fuels worth serious aircraft-integration study." },
    { year: "now", title: "TASOPT+ (this project)", desc: "Extending TASOPT to model fuel ↔ aircraft coupling directly, across configs & fuels." },
    { year: "next", title: "Total system impact", desc: "Quantifying how fuel choice reshapes the aircraft, and how the aircraft constrains fuel choice back." },
    { year: "eventually…", title: "Wrap up the PhD", desc: "Slowly. Surely. The Iceland thesis-defense party will be worth the wait." }
  ];

  const width = Math.min(el.clientWidth || 900, 980);
  const rowH = 92;
  const height = events.length * rowH + 40;

  const svg = d3.select(el).append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%");

  const lineX = 90;

  svg.append("line")
    .attr("x1", lineX).attr("x2", lineX)
    .attr("y1", 20).attr("y2", 20)
    .attr("stroke", "var(--card-bd)").attr("stroke-width", 2)
    .transition().duration(1400).ease(d3.easeCubicOut)
    .attr("y2", height - 30);

  const g = svg.selectAll("g.ev")
    .data(events)
    .join("g")
    .attr("class", "ev")
    .attr("transform", (d, i) => `translate(0,${30 + i * rowH})`)
    .attr("opacity", 0);

  g.transition().delay((d, i) => i * 180 + 300).duration(500).attr("opacity", 1);

  g.append("circle")
    .attr("cx", lineX).attr("cy", 0).attr("r", 7)
    .attr("fill", (d, i) => i === events.length - 2 ? "var(--jetA)" : (i === events.length - 1 ? "var(--faint)" : "var(--cryo)"))
    .attr("stroke", "var(--bg-0)").attr("stroke-width", 3);

  g.append("text")
    .attr("x", lineX - 20).attr("y", 5)
    .attr("text-anchor", "end")
    .attr("fill", "var(--faint)")
    .attr("font-family", "var(--mono)")
    .attr("font-size", 12)
    .text(d => d.year);

  const textG = g.append("g").attr("transform", `translate(${lineX + 26},0)`);

  textG.append("text")
    .attr("y", -2)
    .attr("fill", "var(--ink)")
    .attr("font-weight", 700)
    .attr("font-size", 16)
    .text(d => d.title);

  textG.append("foreignObject")
    .attr("x", 0).attr("y", 10)
    .attr("width", width - lineX - 60)
    .attr("height", 50)
    .append("xhtml:div")
    .style("font-family", "var(--display)")
    .style("font-size", "13.5px")
    .style("color", "var(--muted)")
    .style("line-height", "1.4")
    .text(d => d.desc);
}

function initFunnel() {
  const el = document.getElementById("funnel");
  if (!el) return;

  const stages = [
    { label: ["All candidate fuels"], w: 1.0, color: "var(--nondrop)" },
    { label: ["System-level pre-screen"], w: 0.68, color: "var(--cryo)" },
    { label: ["Down-selected fuels"], w: 0.42, color: "var(--saf)" },
    { label: ["Aircraft-coupled study", "(this project →)"], w: 0.24, color: "var(--jetA)" }
  ];

  const width = Math.min(el.clientWidth || 560, 560);
  const rowH = 64;
  const height = stages.length * rowH + 20;

  const svg = d3.select(el).append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%");

  const maxW = width - 40;

  stages.forEach((s, i) => {
    const w0 = maxW * (stages[i - 1]?.w ?? 1.0);
    const w1 = maxW * s.w;
    const y0 = i * rowH + 10;
    const y1 = y0 + rowH - 14;
    const x0a = (width - w0) / 2, x0b = x0a + w0;
    const x1a = (width - w1) / 2, x1b = x1a + w1;

    svg.append("path")
      .attr("d", `M ${x0a},${y0} L ${x0b},${y0} L ${x1b},${y1} L ${x1a},${y1} Z`)
      .attr("fill", s.color)
      .attr("fill-opacity", 0)
      .transition().delay(i * 220).duration(500)
      .attr("fill-opacity", 0.28);

    svg.append("path")
      .attr("d", `M ${x0a},${y0} L ${x0b},${y0} L ${x1b},${y1} L ${x1a},${y1} Z`)
      .attr("fill", "none").attr("stroke", s.color).attr("stroke-opacity", 0)
      .transition().delay(i * 220).duration(500)
      .attr("stroke-opacity", 0.7);

    const textG = svg.append("g")
      .attr("opacity", 0)
      .attr("transform", `translate(${width / 2},${(y0 + y1) / 2})`);
    const lineCount = s.label.length;
    s.label.forEach((line, li) => {
      textG.append("text")
        .attr("text-anchor", "middle")
        .attr("y", (li - (lineCount - 1) / 2) * 14 + 4)
        .attr("fill", "var(--ink)")
        .attr("font-family", "var(--mono)")
        .attr("font-size", 12)
        .text(line);
    });
    textG.transition().delay(i * 220 + 250).duration(400).attr("opacity", 1);
  });
}
