/* Shared chrome: header (wordmark + pills), menu panel, ink footer. */
(function () {
  var PAGES = [
    { key: "home", greek: "Α", label: "Home", href: "index.html" },
    { key: "about", greek: "Β", label: "About", href: "about.html" },
    { key: "work", greek: "Γ", label: "Work", href: "work.html" },
    { key: "publishings", greek: "Δ", label: "Publishings", href: "publishings.html" },
    { key: "projects", greek: "Ε", label: "Projects", href: "projects.html" },
    { key: "curio", greek: "Ζ", label: "Look at this", href: "curiosities.html" },
    { key: "contact", greek: "Η", label: "Contact", href: "contact.html" }
  ];
  var ARROW = '<svg class="arrow" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 14L14 4M6 4h8v8"/></svg>';

  function header(active) {
    var links = PAGES.map(function (p) {
      return '<li><a href="' + p.href + '"' + (p.key === active ? ' aria-current="page"' : "") + '><span class="greek" aria-hidden="true">' + p.greek + "</span>" + p.label + ARROW + "</a></li>";
    }).join("");
    return '' +
      '<header class="site-header">' +
        '<a class="wordmark" href="index.html">Charbel Al Bateh</a>' +
        '<div class="header-actions">' +
          '<a class="pill pill-ink hide-sm" href="contact.html">Get in touch <span class="dot" aria-hidden="true"></span></a>' +
          '<button class="pill pill-light menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu">Menu <span class="dots" aria-hidden="true"><i></i><i></i></span></button>' +
        "</div>" +
      "</header>" +
      '<nav class="menu" id="site-menu" aria-label="Primary">' +
        '<ul class="menu-links">' + links + "</ul>" +
        '<div class="menu-foot"><a href="mailto:charbelelbateh@gmail.com">charbelelbateh@gmail.com</a><span>Beirut · Remote-friendly</span></div>' +
      "</nav>";
  }

  function footer() {
    return '' +
      '<footer class="site-footer"><div class="wrap">' +
        '<a class="footer-cta" href="contact.html">Write a <em>letter</em>, I\'ll write back <svg class="arrow-big" width="0.62em" height="0.62em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 19L19 5M8 5h11v11"/></svg></a>' +
        '<div class="footer-grid">' +
          '<div><h3>Write</h3><a href="mailto:charbelelbateh@gmail.com">charbelelbateh@gmail.com</a></div>' +
          '<div><h3>Elsewhere</h3><a href="https://github.com/CharbelElBateh" target="_blank" rel="noopener">GitHub</a><a href="#">Scholar</a><a href="https://www.linkedin.com/in/charbel-al-bateh" target="_blank" rel="noopener">LinkedIn</a></div>' +
          '<div><h3>Read</h3><a href="work.html">Work</a><a href="publishings.html">Publishings</a><a href="projects.html">Projects</a></div>' +
          '<div><h3>Wander</h3><a href="about.html">About</a><a href="curiosities.html">Look at this</a><a href="contact.html">Contact</a></div>' +
        "</div>" +
        '<div class="footer-base"><span>Charbel Al Bateh · AI Engineer &amp; Researcher</span><span>MMXXVI — built with patience</span></div>' +
      "</div></footer>";
  }

  function wireMenu() {
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
  }

  window.mountChrome = function (active) {
    var h = document.getElementById("nav-mount");
    var f = document.getElementById("footer-mount");
    if (h) h.innerHTML = header(active);
    if (f) f.innerHTML = footer();
    wireMenu();
  };
})();
