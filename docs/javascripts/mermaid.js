(function () {
  // If mermaid is injected by the plugin, re-init with the right theme.
  function currentTheme() {
    const scheme = document.documentElement.getAttribute(
      "data-md-color-scheme"
    );
    return scheme === "slate" ? "dark" : "default";
  }

  function initMermaid() {
    if (!window.mermaid) return;
    window.mermaid.initialize({ startOnLoad: true, theme: currentTheme() });
    // Re-render any diagrams that might need refresh
    const els = document.querySelectorAll(".mermaid");
    if (els.length) {
      window.mermaid.init(undefined, els);
    }
  }

  // Init ASAP
  document.addEventListener("DOMContentLoaded", initMermaid);

  // Watch for theme toggles
  const obs = new MutationObserver(initMermaid);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-md-color-scheme"],
  });
})();
