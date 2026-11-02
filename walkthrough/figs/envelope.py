import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt, numpy as np
fig, ax = plt.subplots(1, 2, figsize=(9, 3.6))
a = ax[0]
a.add_patch(plt.Rectangle((0.09, 0.0), 0.145-0.09, 0.81, fc="C0", alpha=0.3, label="C.air grid (stored)"))
a.add_patch(plt.Rectangle((0.06, 0.0), 0.145-0.06, 0.87, fill=False, ec="C3", ls="--", lw=2, label="planned TBW table (target)"))
a.set_xlim(0.05, 0.16); a.set_ylim(0, 0.95); a.set_xlabel("thickness ratio t/c"); a.set_ylabel(r"Mach number $M_\perp$")
a.legend(loc="lower right", fontsize=8); a.set_title("Mach / thickness coverage")
b = ax[1]
t = np.linspace(0.06, 0.09, 50); b.plot(t, 25*(t-0.09)**2*1e4, "C3")
b.set_xlabel("thickness ratio t/c"); b.set_ylabel("penalty added to cdp (drag counts)")
b.set_title("airfun thickness penalty below t/c = 0.09"); b.grid(alpha=0.3)
fig.tight_layout(); fig.savefig(".walkthrough/figs/envelope.png", dpi=130)
