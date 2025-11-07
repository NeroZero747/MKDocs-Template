(function () {
  const root = document.documentElement;
  document.addEventListener("click", (e) => {
    const fav = e.target.closest(".js-fav");
    if (fav) {
      const cur = fav.getAttribute("aria-pressed") === "true";
      fav.setAttribute("aria-pressed", String(!cur));
      fav.classList.toggle("is-active", !cur);
    }
    const dens = e.target.closest("#toggleDensity");
    if (dens) {
      const compact = root.classList.toggle("compact");
      dens.setAttribute("aria-pressed", String(compact));
    }
  });
})();
