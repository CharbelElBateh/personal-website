/* Mounts the page's 3D stage and renders still clusters into card images. */
// The page loads this file as boot.js?v=<build>; pass the same version on so caches refresh together.
const V = new URL(import.meta.url).search;
const { mountStage, renderStill } = await import("./stage.js" + V);

if (window.LoadProgress) window.LoadProgress.mark("engine");

const host = document.querySelector("[data-stage]");
if (host) {
  try {
    const stage = mountStage(host, { preset: host.dataset.stage, seed: Number(host.dataset.seed || 7) });
    if (stage) window.__stage = stage;
  } catch (e) {
    host.classList.add("stage-fallback");
    console.warn("stage:", e);
  }
}
// The preloader waits for "stage:ready". A mounted stage sends it after its first frames; otherwise send it now.
if (!window.__stage) requestAnimationFrame(() => window.dispatchEvent(new Event("stage:ready")));

const stills = document.querySelectorAll("img[data-still]");
if (stills.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(async (en) => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const img = en.target;
      const box = img.parentElement.getBoundingClientRect();
      try {
        img.src = await renderStill({
          preset: img.dataset.still,
          seed: Number(img.dataset.seed || 1),
          width: Math.round(Math.min(box.width, 1400)),
          height: Math.round(Math.min(box.height, 800)),
          count: 16,
        });
        img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
      } catch (e) {
        console.warn("still:", e);
      }
    });
  }, { rootMargin: "400px" });
  stills.forEach((img) => io.observe(img));
}

// Home page closing sequence: built once the visitor scrolls within a few screens of it,
// so people who never get that far never pay for it.
const finale = document.querySelector(".finale");
if (finale) {
  const near = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    near.disconnect();
    import("./finale.js" + V);
  }, { rootMargin: "300% 0px 300% 0px" });
  const watch = () => near.observe(finale);
  if (!document.querySelector(".preloader") || window.__preloaded) watch();
  else window.addEventListener("preloader:done", watch, { once: true });
}
