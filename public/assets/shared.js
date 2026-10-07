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
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    if (window.Smooth) window.Smooth.start();
    if (lastTrigger) { lastTrigger.focus({ preventScroll: true }); lastTrigger = null; }
  }
  window.openModal = function (id, trigger) {
    var m = document.getElementById(id);
    if (!m) return;
    lastTrigger = trigger || document.activeElement;
    m.classList.add("open");
    m.removeAttribute("aria-hidden");
    history.replaceState(null, "", "#" + id.replace(/^modal-/, ""));
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
    f = Array.prototype.filter.call(f, function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();

/* ---- Custom scrollbar. Drawn in the DOM rather than styled with
   ::-webkit-scrollbar, because phones, tablets and Safari use overlay
   scrollbars that ignore that CSS. The native bar is hidden (html.has-sbar),
   so this one must work by mouse, touch and pen: drag the thumb, or click the
   track to jump. Keyboard and wheel scrolling are untouched. */
(function () {
  var root = document.documentElement;
  var rail = document.createElement("div");
  rail.className = "sbar";
  rail.setAttribute("aria-hidden", "true");
  rail.innerHTML = '<div class="sbar-thumb"></div>';
  document.body.appendChild(rail);
  root.classList.add("has-sbar");
  var thumb = rail.firstChild;

  var thumbH = 0, maxScroll = 0, track = 0, idleTimer = 0, dragging = null, queued = false;

  function measure() {
    var vh = window.innerHeight;
    maxScroll = Math.max(0, root.scrollHeight - vh);
    rail.classList.toggle("off", maxScroll < 2);
    thumbH = Math.max(44, Math.round(vh * vh / (maxScroll + vh)));
    track = vh - thumbH;
    thumb.style.height = thumbH + "px";
    place();
  }
  function place() {
    var p = maxScroll ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    thumb.style.transform = "translateY(" + Math.round(p * track) + "px)";
  }
  function wake() {
    rail.classList.add("awake");
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { if (!dragging) rail.classList.remove("awake"); }, 1200);
  }
  function scrollTo(y) {
    y = Math.min(maxScroll, Math.max(0, y));
    if (window.Smooth && window.Smooth.to) window.Smooth.to(y);
    else window.scrollTo(0, y);
  }

  window.addEventListener("scroll", function () {
    wake();
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; place(); });
  }, { passive: true });
  window.addEventListener("resize", measure);
  if (window.ResizeObserver) new ResizeObserver(measure).observe(document.body);
  measure();

  thumb.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    e.stopPropagation();
    thumb.setPointerCapture(e.pointerId);
    dragging = { y: e.clientY, from: window.scrollY };
    rail.classList.add("dragging", "awake");
  });
  thumb.addEventListener("pointermove", function (e) {
    if (!dragging || !track) return;
    scrollTo(dragging.from + (e.clientY - dragging.y) * maxScroll / track);
  });
  function release() {
    if (!dragging) return;
    dragging = null;
    rail.classList.remove("dragging");
    wake();
  }
  thumb.addEventListener("pointerup", release);
  thumb.addEventListener("pointercancel", release);

  // Track click: centre the thumb on the pointer.
  rail.addEventListener("pointerdown", function (e) {
    if (e.target !== rail || !track) return;
    e.preventDefault();
    scrollTo((e.clientY - thumbH / 2) / track * maxScroll);
    wake();
  });
})();

/* ---- Menu panel (the header and menu markup are rendered at build time) */
(function () {
  var btn = document.querySelector(".menu-toggle");
  var menu = document.getElementById("site-menu");
  if (!btn || !menu) return;
  function set(open) {
    menu.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { var first = menu.querySelector("a"); if (first) first.focus({ preventScroll: true }); }
  }
  btn.addEventListener("click", function () { set(!menu.classList.contains("open")); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("open")) { set(false); btn.focus(); }
  });
  document.addEventListener("pointerdown", function (e) {
    if (menu.classList.contains("open") && !menu.contains(e.target) && !btn.contains(e.target)) set(false);
  });
})();

/* ---- Phones: show the pinned CTA after the first screen, hide it near the
   footer and the home finale (they carry their own call to action). */
(function () {
  var cta = document.querySelector(".mobile-cta");
  if (!cta) return;
  var blockers = document.querySelectorAll(".site-footer, .finale, .preloader");
  var blocked = new Set();
  function update() {
    var past = window.scrollY > window.innerHeight * 0.6;
    var menuOpen = document.querySelector(".menu.open");
    cta.classList.toggle("show", past && !blocked.size && !menuOpen);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) blocked.add(e.target); else blocked.delete(e.target); });
    update();
  });
  blockers.forEach(function (b) { io.observe(b); });
  window.addEventListener("scroll", update, { passive: true });
  document.addEventListener("click", function () { setTimeout(update, 0); });
  update();
})();

/* ---- Skip link: move focus into the page without changing the address */
(function () {
  var skip = document.querySelector(".skip-link");
  var main = document.getElementById("main");
  if (!skip || !main) return;
  skip.addEventListener("click", function (e) { e.preventDefault(); main.focus(); });
})();
