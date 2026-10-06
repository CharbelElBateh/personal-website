/* ==========================================================================
   Scroll — inertial smooth scrolling (Lenis), the first-visit preloader,
   and the home-page sequence.

   Home sequence (section.intro, pinned for ~2.6 screens of scroll):
     0.00 – 0.32  the stage window opens from a framed card to full bleed;
                  the headline lifts away, the giant name fades
     0.22 – 0.78  the camera pushes into the cluster while it bursts apart
     0.42 – 0.80  the statement assembles word by word, out of a blur
   The 3D stage (assets/stage.js) is driven through window.__stage.
   Reduced motion: no smoothing, no pinning, no preloader.
   ========================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  function range(p, a, b) { return clamp01((p - a) / (b - a)); }
  function easeInOut(t) { t = clamp01(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOut(t) { t = clamp01(t); return 1 - Math.pow(1 - t, 3); }

  /* ---- Smooth scroll */
  var lenis = null;
  if (!reduce && typeof window.Lenis === "function") {
    lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
  }
  window.Smooth = {
    stop: function () { if (lenis) lenis.stop(); },
    start: function () { if (lenis) lenis.start(); }
  };

  /* ---- Loading: real progress across the expensive steps.
     Steps report in through window.LoadProgress.mark(name). The counter
     eases toward true progress on a clock, so it never stalls on a slow
     frame and never claims 100 before the work is done. */
  var STEPS = { fonts: 0.1, engine: 0.2, stage: 0.25, finale: 0.4, page: 0.05 };
  var marked = {}, real = 0;
  window.LoadProgress = {
    mark: function (k) {
      if (marked[k] || !(k in STEPS)) return;
      marked[k] = true;
      real = Math.min(1, real + STEPS[k]);
    },
    value: function () { return real; }
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { window.LoadProgress.mark("fonts"); });
  else window.LoadProgress.mark("fonts");
  if (document.readyState === "complete") window.LoadProgress.mark("page");
  else window.addEventListener("load", function () { window.LoadProgress.mark("page"); });
  window.addEventListener("stage:ready", function () { window.LoadProgress.mark("stage"); });
  if (!document.querySelector(".finale")) window.LoadProgress.mark("finale");
  if (!document.querySelector("[data-stage]")) { window.LoadProgress.mark("stage"); window.LoadProgress.mark("engine"); }

  var pre = document.querySelector(".preloader");
  if (pre) {
    var seen = false;
    try { seen = sessionStorage.getItem("preloaded") === "1"; } catch (e) {}
    if (reduce || seen) {
      pre.remove();
    } else {
      try { sessionStorage.setItem("preloaded", "1"); } catch (e) {}
      if (lenis) lenis.stop();
      var count = pre.querySelector(".count"), bar = pre.querySelector(".bar i"), label = pre.querySelector(".label-step");
      var t0 = performance.now(), last = t0, shown = 0;
      var MIN_MS = 1400, MAX_MS = 12000;
      (function tick(now) {
        var dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        var elapsed = now - t0;
        var target = (elapsed > MAX_MS ? 1 : real) * 100;
        // never finish before the minimum, never outrun the real work
        if (elapsed < MIN_MS) target = Math.min(target, 100 * easeOut(elapsed / MIN_MS) * 0.98);
        shown += (target - shown) * (1 - Math.exp(-dt * 5));
        if (target >= 100 && shown > 99.5) shown = 100;
        var n = Math.round(shown);
        count.textContent = (n < 10 ? "00" : n < 100 ? "0" : "") + n;
        bar.style.transform = "scaleX(" + (shown / 100) + ")";
        if (label) {
          label.textContent = !marked.engine ? "Loading the engine" : !marked.stage ? "Lighting the glass" : !marked.finale ? "Raising the temple" : "Ready";
        }
        if (shown < 100) { requestAnimationFrame(tick); return; }
        pre.classList.add("done");
        if (lenis) lenis.start();
        setTimeout(function () { pre.remove(); }, 1000);
      })(t0);
    }
  }

  /* ---- Home sequence */
  var intro = document.querySelector(".intro");
  if (!intro || reduce) return;
  intro.classList.add("is-live");

  var stage = intro.querySelector(".intro-stage");
  var head = intro.querySelector(".intro-head");
  var marks = intro.querySelector(".marks");
  var name = intro.querySelector(".intro-name");
  var heroCta = intro.querySelector(".intro-cta");
  var meter = intro.querySelector(".intro-meter");
  var meterFill = meter && meter.querySelector("i");
  var statement = intro.querySelector("[data-words]");
  var statementBox = intro.querySelector(".intro-statement");

  // Split the statement into word spans, keeping inline emphasis.
  var words = [];
  (function split(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          var s = document.createElement("span");
          s.className = "w"; s.textContent = part; s.setAttribute("aria-hidden", "true");
          words.push(s); frag.appendChild(s);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) split(child);
    });
  })(statement);

  var gutter = 0, headBottom = 0, marksH = 0;
  function measure() {
    gutter = parseFloat(getComputedStyle(head).paddingLeft) || 24;
    headBottom = head.offsetTop + head.offsetHeight;
    marksH = marks.offsetHeight + 24;
    intro.style.setProperty("--marks-h", marksH + "px");
    marks.style.top = (window.innerHeight - marks.offsetHeight - 14) + "px";
  }
  measure();
  window.addEventListener("resize", measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  function frame() {
    requestAnimationFrame(frame);
    var r = intro.getBoundingClientRect();
    var H = window.innerHeight;
    if (r.bottom < 0 || r.top > H) return;
    var p = clamp01(-r.top / Math.max(r.height - H, 1));

    // 1. the window opens to full bleed
    var open = easeInOut(range(p, 0, 0.32));
    stage.style.setProperty("--clip-t", (headBottom * (1 - open)).toFixed(1) + "px");
    stage.style.setProperty("--clip-b", (marksH * (1 - open)).toFixed(1) + "px");
    stage.style.setProperty("--clip-x", (gutter * (1 - open)).toFixed(1) + "px");
    stage.style.setProperty("--clip-r", (2 * (1 - open)).toFixed(1) + "px");

    var lift = easeOut(range(p, 0, 0.22));
    head.style.transform = "translateY(" + (-lift * 60).toFixed(1) + "px)";
    head.style.opacity = String(1 - lift);
    marks.style.opacity = String(1 - easeOut(range(p, 0, 0.1)));
    var nameOut = range(p, 0.08, 0.3);
    name.style.opacity = String(1 - nameOut);
    name.style.transform = "translateY(" + (nameOut * 40).toFixed(1) + "px)";
    if (heroCta) {
      heroCta.style.opacity = String(1 - nameOut);
      heroCta.style.transform = "translateY(" + (nameOut * 40).toFixed(1) + "px)";
      heroCta.style.pointerEvents = nameOut > 0.5 ? "none" : "";
    }

    // 2. camera and cluster
    if (window.__stage) {
      window.__stage.setJourney({
        dolly: easeInOut(range(p, 0.22, 0.78)) * 0.86,
        explode: easeInOut(range(p, 0.3, 0.8)),
        spin: easeInOut(range(p, 0.1, 0.9)) * 1.4,
        // centre the cluster in the visible window while it is still framed
        focusY: ((headBottom - marksH) / 2) * (1 - open)
      });
    }

    // 3. the statement, word by word out of a blur
    for (var i = 0; i < words.length; i++) {
      var a = 0.42 + (i / words.length) * 0.3;
      var t = easeOut(range(p, a, a + 0.08));
      var w = words[i];
      w.style.opacity = String(t);
      w.style.transform = "translateY(" + ((1 - t) * 0.25).toFixed(3) + "em)";
      w.style.filter = t > 0.99 ? "none" : "blur(" + ((1 - t) * 8).toFixed(2) + "px)";
    }
    statementBox.style.setProperty("--scrim", range(p, 0.38, 0.52).toFixed(3));
    meter.style.opacity = String(range(p, 0.3, 0.4));
    meterFill.style.transform = "scaleX(" + p.toFixed(4) + ")";
  }
  requestAnimationFrame(frame);
})();
