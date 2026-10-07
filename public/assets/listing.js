/* Listing pages (Work, Publications, Projects): rows open modals, copy buttons,
   and deep links (page.html#id opens that item). The markup is rendered at build time. */
(function () {
  var root = document.querySelector(".listing");
  if (!root) return;

  root.querySelectorAll(".listing-row").forEach(function (row) {
    row.addEventListener("click", function () { window.openModal("modal-" + row.dataset.id, row); });
  });

  document.querySelectorAll(".modal [data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var modal = btn.closest(".modal");
      var id = modal.parentNode.id.replace("modal-", "");
      var text = btn.dataset.copy === "bibtex"
        ? modal.querySelector(".bibtex").textContent
        : location.href.split("#")[0] + "#" + id;
      var status = modal.querySelector(".copy-status");
      function done(msg) { status.textContent = msg; setTimeout(function () { status.textContent = ""; }, 2400); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { done(btn.dataset.copy === "bibtex" ? "BibTeX copied" : "Link copied"); },
          function () { done("Couldn't copy. Select it by hand."); });
      } else done("Copying isn't available in this browser.");
    });
  });

  function fromHash() {
    var id = location.hash.slice(1);
    if (!id || !document.getElementById("modal-" + id)) return;
    window.openModal("modal-" + id, root.querySelector('.listing-row[data-id="' + id + '"]'));
  }
  fromHash();
  window.addEventListener("hashchange", fromHash);
})();
