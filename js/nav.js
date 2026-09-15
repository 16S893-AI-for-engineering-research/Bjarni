// js/nav.js
// Shared chrome: nav/footer injection, scroll-reveal, cursor parallax,
// and the easter-egg triggers (Konami code + secret footer dot).

(function () {
  const NAV_LINKS = [
    { href: "index.html", label: "Home" },
    { href: "project.html", label: "Project" },
    { href: "about.html", label: "About Me" },
    { href: "devlog.html", label: "Dev Log" }
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
        <span>Built by Bjarni &middot; LAE &middot; class project, D3.js &middot; ${year}</span>
        <span class="small">↑ / ↓ / ← / → / ↑ / ↓ <span id="egg-dot" class="egg-hint" title="you didn&rsquo;t see this">&#x22EF;</span></span>
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

  // ---- Konami code listener: ↑ ↑ ↓ ↓ ← → ← → B A ----
  // Cross-browser fix notes:
  //   • Attach to document ONLY (not both window + document — that caused every
  //     keypress to run handleKey twice, making the sequence impossible to complete).
  //   • capture:true so SVG/D3 elements that call stopPropagation can't swallow keys.
  //   • Normalize via e.key first, fall back to legacy e.keyCode / e.which for older
  //     Safari builds that didn't always expose named arrow-key strings.
  //   • Give <body> a tabindex so Safari delivers keydown without needing a user click,
  //     and re-focus on every click so focus is never trapped in the address bar.
  //   • Non-sequence keys (letters, numbers, etc.) no longer reset pos to 0 — only
  //     a wrong arrow key resets, so accidental keypresses between arrows are forgiven.
  function initKonami() {
    const seq = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a"
    ];
    // legacy keyCode map (Safari < 10.1, some older Chrome)
    const keyCodeMap = { 38: "ArrowUp", 40: "ArrowDown", 37: "ArrowLeft", 39: "ArrowRight" };
    // set of keys that are part of the sequence (used to decide when to reset)
    const seqSet = new Set(seq);
    let pos = 0;

    function normalizeKey(e) {
      // e.key is reliable in all modern browsers; fall back for legacy builds
      if (e.key && seqSet.has(e.key)) return e.key;
      if (e.key && seqSet.has(e.key.toLowerCase())) return e.key.toLowerCase();
      if (keyCodeMap[e.keyCode]) return keyCodeMap[e.keyCode];
      if (keyCodeMap[e.which])   return keyCodeMap[e.which];
      return null;   // not a sequence key — ignore without resetting
    }

    function handleKey(e) {
      const key = normalizeKey(e);
      if (key === null) return;           // irrelevant key — don't reset progress
      if (key === seq[pos]) {
        pos++;
        if (pos === seq.length) { pos = 0; openEgg(); }
      } else {
        // wrong key — restart, but check if it matches the very first step
        pos = (key === seq[0]) ? 1 : 0;
      }
    }

    // Single listener on document with capture so D3 SVG elements can't block it.
    document.addEventListener("keydown", handleKey, { capture: true });

    // Give <body> a tabindex so Safari delivers keydown events without requiring
    // the user to first click an interactive element.
    if (!document.body.hasAttribute("tabindex")) {
      document.body.setAttribute("tabindex", "-1");
      document.body.style.outline = "none";
    }
    document.body.focus({ preventScroll: true });
    // Re-focus body after any click so focus can never get trapped in the address bar.
    document.addEventListener("click", () => document.body.focus({ preventScroll: true }));
  }

  // ---- secret footer "⋯" dot: click 3× fast ----
  // The three-dot ellipsis (⋯) at the end of the Konami hint in the footer
  // is the hidden trigger. Visual feedback (glow pulse on each click) guides
  // the user without giving the game away. A single click just makes it shimmer;
  // three clicks within 900 ms opens the egg overlay.
  function initFooterEgg() {
    const dot = document.getElementById("egg-dot");
    if (!dot) return;
    let clicks = 0, timer = null;

    dot.addEventListener("click", (e) => {
      e.stopPropagation(); // don't re-trigger the body-focus click listener
      clicks++;
      clearTimeout(timer);
      // animate a quick pulse for each click so the user knows it's interactive
      dot.classList.remove("egg-hint-ping");
      // force reflow so the animation restarts cleanly even on rapid clicks
      void dot.offsetWidth;
      dot.classList.add("egg-hint-ping");
      if (clicks >= 3) {
        clicks = 0;
        clearTimeout(timer);
        openEgg();
      } else {
        timer = setTimeout(() => { clicks = 0; }, 900);
      }
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
