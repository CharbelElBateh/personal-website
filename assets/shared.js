/* Shared site scripts */

/* ---- Bootstrap: progress bar, hide-on-scroll nav, reveals, modals */
(function () {
  var prog = document.createElement("div");
  prog.className = "scroll-prog";
  prog.setAttribute("aria-hidden", "true");
  document.body.appendChild(prog);

  var lastY = window.scrollY;
  var ticking = false;
  function onScroll() {
    var doc = document.documentElement;
    var h = (doc.scrollHeight - doc.clientHeight) || 1;
    var y = window.scrollY;
    prog.style.transform = "scaleX(" + Math.min(1, y / h) + ")";
    var nav = document.querySelector(".site-header");
    var menuOpen = document.querySelector(".menu.open");
    if (nav && !menuOpen && !nav.contains(document.activeElement)) {
      if (y > lastY + 4 && y > 120) nav.classList.add("hidden");
      else if (y < lastY - 4 || y <= 120) nav.classList.remove("hidden");
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

  function observeReveals() {
    document.querySelectorAll(".reveal, .reveal-x, .stagger, .line-reveal").forEach(function (el) {
      if (!el.dataset.observed) { el.dataset.observed = "1"; io.observe(el); }
    });
  }
  observeReveals();
  // Re-run after partials and listings render
  setTimeout(observeReveals, 50);
  setTimeout(observeReveals, 300);

  /* Modals: centred, focus moves in on open and back to the trigger on close. */
  var lastTrigger = null;
  function closeAll() {
    var open = document.querySelectorAll(".modal-backdrop.open");
    if (!open.length) return;
    open.forEach(function (m) { m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); });
    document.body.style.overflow = "";
    if (window.Smooth) window.Smooth.start();
    if (lastTrigger) { lastTrigger.focus({ preventScroll: true }); lastTrigger = null; }
  }
  window.openModal = function (id, trigger) {
    var m = document.getElementById(id);
    if (!m) return;
    lastTrigger = trigger || document.activeElement;
    m.classList.add("open");
    m.removeAttribute("aria-hidden");
    document.body.style.overflow = "hidden";
    if (window.Smooth) window.Smooth.stop();
    var close = m.querySelector(".modal-close");
    if (close) close.focus({ preventScroll: true });
  };
  window.closeModal = function () { closeAll(); };
  document.addEventListener("click", function (e) {
    if (e.target.classList && e.target.classList.contains("modal-backdrop")) closeAll();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeAll(); return; }
    if (e.key !== "Tab") return;
    var m = document.querySelector(".modal-backdrop.open .modal");
    if (!m) return;
    var f = m.querySelectorAll("a[href], button, [tabindex]:not([tabindex='-1'])");
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
