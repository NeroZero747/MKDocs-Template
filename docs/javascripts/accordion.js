// Bootstrap-like accordion behavior: one open at a time per group.
(function () {
  function wireGroup(groupEl) {
    groupEl.addEventListener("toggle", function (ev) {
      const t = ev.target;
      if (t.tagName !== "DETAILS" || !t.open) return;
      groupEl.querySelectorAll("details[open]").forEach((d) => {
        if (d !== t) d.removeAttribute("open");
      });
    });
  }

  // Auto-open a <details> if its summary text matches window.location.hash
  function openFromHash() {
    const hash = decodeURIComponent(location.hash).slice(1).toLowerCase();
    if (!hash) return;
    document.querySelectorAll(".accordion details").forEach((d) => {
      const text = d.querySelector("summary")?.textContent.toLowerCase().trim();
      if (text && text.includes(hash)) d.setAttribute("open", "");
    });
  }
  window.addEventListener("hashchange", openFromHash);
  document.addEventListener("DOMContentLoaded", openFromHash);

  function init() {
    document.querySelectorAll("[data-accordion-group]").forEach(wireGroup);
  }

  document.addEventListener("DOMContentLoaded", init);
  if (window.MutationObserver) {
    new MutationObserver(init).observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
})();
