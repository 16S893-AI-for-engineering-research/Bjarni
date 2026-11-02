import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
fig, ax = plt.subplots(figsize=(10, 3.4)); ax.axis("off"); ax.set_xlim(0, 10); ax.set_ylim(0, 3.4)
B = {
 "t1": (0.9, 2.8, "1 Build XFOIL\n(headless)"), "t2": (0.9, 1.7, "2 .air reader/\nwriter + plots"),
 "t3": (0.9, 0.6, "3 Section\ngeometry"), "t4": (2.9, 2.8, "4 Batch driver\n(M, cl, t/c)"),
 "t5": (4.6, 1.7, "5 Lanes A1-A4\nvs C.air"), "t6": (6.2, 1.7, "6 Assemble\nC_xfoil.air"),
 "t7": (7.8, 1.7, "7 TASOPT\nsystem check"), "t8": (7.8, 0.45, "8 TBW\nenvelope"),
 "t9": (6.2, 0.45, "9 Thin sections,\nextended runs"), "t10": (4.6, 0.45, "10 Merge\nC_tbw.air"),
}
col = {k: ("#cfe2f3" if k in ("t1","t2","t3","t4","t5","t6","t7") else "#f4cccc") for k in B}
for k, (x, y, s) in B.items():
    ax.text(x, y, s, ha="center", va="center", fontsize=9, bbox=dict(boxstyle="round,pad=0.4", fc=col[k], ec="0.3"))
def ar(a, b):
    xa, ya, _ = B[a]; xb, yb, _ = B[b]
    ax.annotate("", xy=(xb, yb), xytext=(xa, ya), arrowprops=dict(arrowstyle="-|>", color="0.3", shrinkA=26, shrinkB=26))
for a, b in [("t1","t4"),("t2","t5"),("t3","t5"),("t4","t5"),("t5","t6"),("t6","t7"),("t7","t8"),("t8","t9"),("t9","t10")]:
    ar(a, b)
ax.text(0.1, 3.3, "Milestone A: recreate C.air (blue)     Milestone B: extend to TBW (red)", fontsize=9, va="top")
ax.text(4.6, 2.6, "parallel subagents here", ha="center", fontsize=8, style="italic")
fig.tight_layout(); fig.savefig(".walkthrough/figs/plan.png", dpi=130)
