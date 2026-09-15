// js/nav.js
// Shared chrome: nav/footer injection, scroll-reveal, cursor parallax,
// and the easter-egg triggers (Konami code + secret footer dot).

(function () {
  const NAV_LINKS = [
    { href: "index.html", label: "Home" },
    { href: "project.html", label: "Project" },
    { href: "about.html", label: "About Me" }
  ];

  function currentPage() {
    const p = location.pathname.split("/").pop() || "index.html";
    return p;
  }

  function buildNav() {
    const nav = document.createElement("nav");
    nav.className = "site-nav";
    const here = currentPage();
    nav.innerHTML = `
      <div class="wrap">
        <a href="index.html" class="brand-mark">
          <span class="dot"></span>
          TASOPT<span style="color:var(--faint)">+</span>
        </a>
        <div class="nav-links">
          ${NAV_LINKS.map(l => `<a href="${l.href}" class="${l.href === here ? "active" : ""}">${l.label}</a>`).join("")}
        </div>
      </div>
    `;
    document.body.prepend(nav);
  }

  function buildFooter() {
    const year = new Date().getFullYear();
    const footer = document.createElement("footer");
    footer.innerHTML = `
      <div class="wrap">
        <span>Built by Bjarni &middot; LAE &middot; class project, D3.js &middot; ${year} <span id="egg-dot" class="egg-hint" title=""></span></span>
        <span class="small">↑ / ↓ / ← / → / ↑ / ↓ ... just saying</span>
      </div>
    `;
    document.body.appendChild(footer);
  }

  function buildEggOverlay() {
    if (document.getElementById("egg-overlay")) return;
    const div = document.createElement("div");
    div.id = "egg-overlay";
    div.innerHTML = `
      <div class="egg-modal">
        <span class="egg-emoji">🌋</span>
        <h2 style="margin-top:6px;">You found the 13th fuel.</h2>
        <p style="margin:12px auto 6px;">Somewhere between "radically different from Jet-A" and "please still let this
        thing fly," there's one fuel TASOPT+ refuses to model. It's Icelandic. It's molten. It's problematic.</p>
        <div class="mt-16">
          <a href="secret.html" class="btn primary">Open the classified fuel dossier →</a>
        </div>
        <div class="mt-16">
          <button class="btn" id="egg-close">close</button>
        </div>
      </div>
    `;
    document.body.appendChild(div);
    div.querySelector("#egg-close").addEventListener("click", () => div.classList.remove("show"));
    div.addEventListener("click", (e) => { if (e.target === div) div.classList.remove("show"); });
  }

  function openEgg() {
    buildEggOverlay();
    document.getElementById("egg-overlay").classList.add("show");
    try { localStorage.setItem("tasopt_egg_found", "1"); } catch (e) {}
  }

  // ---- Konami code listener: ↑ ↑ ↓ ↓ ← → ← → ----
  // Cross-browser hardened: Safari (especially older desktop/iOS builds) can be
  // inconsistent about `key` naming and about delivering keydown events to a
  // page that hasn't been explicitly focused yet. We normalize against both
  // `key` and the legacy `keyCode`, and force focus onto the document body on
  // load / first interaction so arrow keys are never swallowed by the chrome
  // (address bar, etc.) instead of reaching our listener.
  function initKonami() {
    const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight"];
    const keyCodeMap = { 38: "ArrowUp", 40: "ArrowDown", 37: "ArrowLeft", 39: "ArrowRight" };
    let pos = 0;

    function normalizeKey(e) {
      if (seq.includes(e.key)) return e.key;
      if (keyCodeMap[e.keyCode]) return keyCodeMap[e.keyCode];
      if (keyCodeMap[e.which]) return keyCodeMap[e.which];
      return null;
    }

    function handleKey(e) {
      const key = normalizeKey(e);
      if (!key) { pos = 0; return; }
      const expected = seq[pos];
      if (key === expected) {
        pos++;
        if (pos === seq.length) { pos = 0; openEgg(); }
      } else {
        pos = (key === seq[0]) ? 1 : 0;
      }
    }

    // capture:true so we see the event even if some other element (svg, iframe-ish
    // widget, etc.) stops propagation first — helps with Safari focus quirks.
    window.addEventListener("keydown", handleKey, { capture: true });
    document.addEventListener("keydown", handleKey, { capture: true });

    // make sure the document can actually receive key events on load
    if (!document.body.hasAttribute("tabindex")) {
      document.body.setAttribute("tabindex", "-1");
      document.body.style.outline = "none";
    }
    document.body.focus({ preventScroll: true });
    document.addEventListener("click", () => document.body.focus({ preventScroll: true }), { once: false });
  }

  // ---- secret footer dot: click 3x fast ----
  function initFooterEgg() {
    const dot = document.getElementById("egg-dot");
    if (!dot) return;
    let clicks = 0, timer = null;
    dot.addEventListener("click", () => {
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(() => { clicks = 0; }, 800);
      if (clicks >= 3) { clicks = 0; openEgg(); }
    });
  }

  // ---- scroll reveal ----
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) en.target.classList.add("in"); });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
  }

  // ---- cursor-reactive backdrop parallax ----
  function initCursorParallax() {
    const bg = document.querySelector(".bg");
    if (!bg) return;
    window.addEventListener("mousemove", (e) => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 2;
      const my = (e.clientY / window.innerHeight - 0.5) * 2;
      bg.style.setProperty("--mx", mx);
      bg.style.setProperty("--my", my);
      bg.style.transform = `translate3d(${mx * -14}px, ${my * -14}px, 0)`;
    });
  }

  // ---- generic multi-speed scroll parallax: elements with [data-speed] ----
  function initScrollParallax() {
    const layers = document.querySelectorAll("[data-speed]");
    if (!layers.length) return;
    let ticking = false;
    function update() {
      const sy = window.scrollY;
      layers.forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 0;
        el.style.transform = `translate3d(0, ${sy * speed}px, 0)`;
      });
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    });
    update();
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildNav();
    buildFooter();
    initFooterEgg();
    initKonami();
    initReveal();
    initCursorParallax();
    initScrollParallax();
  });

  window.TASOPT_openEgg = openEgg;
})();
