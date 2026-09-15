# TASOPT+ — Expanding TASOPT's Fuel × Airframe Design Space

A class project website for LAE (Laboratory for Aviation and the Environment) exploring how an AI coding
agent could rapidly extend [TASOPT](https://web.mit.edu/tasopt/www/) — a physics-based aircraft sizing &
optimization tool — beyond its current scope of conventional tube-and-wing aircraft burning Jet-A-like fuel,
into 13 fuels (Jet-A + 12 alternatives) and 4 airframe configurations (tube & wing, double-bubble/D8, blended
wing body, truss-braced wing) spanning regional to ultra-widebody aircraft.

Built as a static, dependency-free multi-page site using vanilla HTML/CSS/JS with **D3.js** for all data
visualization (energy-density scatter plots, a config × size status matrix, animated design-space diagrams).

## 🔗 View the live site

**→ [https://16s893-ai-for-engineering-research.github.io/Bjarni/](https://16s893-ai-for-engineering-research.github.io/Bjarni/)**

(Powered by GitHub Pages — see [Enabling GitHub Pages](#enabling-github-pages-first-time-setup) below if this
link 404s; it needs to be turned on once per repo.)

## Pages

| Page | Contents |
|---|---|
| `index.html` | Hero (aircraft photo cross-fade), fuel energy-density scatter, airframe preview cards |
| `project.html` | Technical outline: fuel families, config × size status matrix, expansion-rings diagram |
| `about.html` | Author bio, research timeline, back-pocket project ideas |
| `secret.html` | 🥚 hidden — see below |

## Structure

```
├── index.html / project.html / about.html / secret.html
├── css/style.css        — shared styling, animations
├── js/
│   ├── nav.js            — shared nav/footer, scroll reveal, easter-egg triggers
│   ├── home.js            — hero photo cross-fade, fuel scatter, stat counters
│   ├── project.js         — config×size matrix, expansion rings
│   ├── about.js           — timeline, funnel diagram
│   └── secret.js          — secret page animations
├── data/
│   ├── fuels.js           — 13 fuels with energy density, cost, LCA data
│   └── aircraft.js        — 4 airframe configs × 4 size classes
└── assets/                — aircraft photography (credited in-page) + author photo
```

## Running locally

No build step — just serve the folder statically:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Easter egg 🥚

There's a hidden 13th fuel tucked away. Three ways in:
1. Konami code (`↑ ↑ ↓ ↓ ← → ← →`) anywhere on the site
2. Triple-click the small dot hidden in the footer text
3. Click the headshot on the About Me page

## Enabling GitHub Pages (first-time setup)

If the live link above 404s, GitHub Pages hasn't been turned on for this repo yet. One-time fix:

1. On GitHub, go to the repo → **Settings** → **Pages** (left sidebar)
2. Under **Build and deployment → Source**, choose **Deploy from a branch**
3. Under **Branch**, select `main` and `/ (root)`, then **Save**
4. Wait ~1 minute, then refresh — the live URL will appear at the top of that same Pages settings screen
