from svgfig import Figure
f = Figure()
rows = [
 (["TOML [Wing] airfoil", "e.g. C.air"], 0),
 (["airtable(fname)", "reads grid + builds splines"], 0),
 (["wing.airsection", "airfoil struct"], 0),
 (["airfun(cl, t/c, M)", "spline lookup"], 0),
]
w = max(f.size(r, c)[0] for r, c in rows) + 10
x = 40; y = 20; nodes = []
for r, c in rows:
    n = f.node(x, y, r, cat=c, w=w); nodes.append(n); y = n.b[1] + 30
for a, b in zip(nodes, nodes[1:]):
    f.arrow(a.b, b.t)
last = nodes[-1]
pen = f.node(x + w + 90, last.y, ["out-of-range penalty", "cdp += 25 (t/c - 0.09)^2"], cat=3, w=w+40)
f.arrow(last.r, pen.l)
use = f.node(x + w + 90, nodes[1].y, ["wing_profiledrag_direct", "aeroperf_sweep"], cat=1, w=w+40)
f.connector([pen.t, (pen.cx, use.b[1])])
f.tag(pen.cx, (pen.t[1] + use.b[1]) / 2, "cdf, cdp, cm")
f.save(".walkthrough/figs/datapath.svg")
