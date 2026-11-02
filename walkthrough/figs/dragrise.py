import csv, numpy as np, matplotlib; matplotlib.use("Agg"); import matplotlib.pyplot as plt
rows=[r for r in csv.DictReader(open("tools/airfoil_gen/reference/mses/mses_polars.csv")) if r["family"]=="c" and abs(float(r["tc"])-0.12)<1e-6]
xf=np.loadtxt("/tmp/wk/xf.txt", ndmin=2)
fig,ax=plt.subplots(figsize=(8,3.8))
for cl,col in ((0.6,"C0"),(0.9,"C3")):
    m=[(float(r["Mach"]),float(r["CD"])*1e4,float(r["CDw"])*1e4) for r in rows if abs(float(r["cl_target"])-cl)<1e-6]; m.sort()
    m=np.array(m); ax.plot(m[:,0],m[:,1],"-",color=col,label=f"MSES polar (stored), cl {cl}")
    ax.plot(m[:,0],m[:,2],":",color=col,lw=1,label=f"MSES wave drag, cl {cl}")
    x=xf[np.isclose(xf[:,0],cl)]; ax.plot(x[:,1],x[:,2]*1e4,"o",color=col,mfc="none",label=f"XFOIL (this run), cl {cl}")
ax.set_xlabel("Mach number"); ax.set_ylabel("section drag cd (counts)"); ax.set_ylim(0,250); ax.set_xlim(0,0.84)
ax.set_title("c120 section, Re 2e7, Ncrit 9, transition 0.03/0.05"); ax.grid(alpha=.3); ax.legend(fontsize=7,ncol=2)
fig.tight_layout(); fig.savefig(".walkthrough/figs/dragrise.png",dpi=130)
