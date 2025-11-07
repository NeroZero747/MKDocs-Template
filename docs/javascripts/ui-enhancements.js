// ui-enhancements.js
// Extras for MkDocs Material:
// - Scroll shadow fallback (.scrolled on header/sidebar)
// - Back-to-top floating button
// - Click-to-copy heading anchors
// - Image lightbox (for .zoomable images)
// - Handy keyboard shortcuts

(function () {
  // -------- 1) Scroll shadow fallback (header/sidebar) --------
  function toggleShadows() {
    const scrolled = (window.scrollY || document.documentElement.scrollTop) > 16;
    document.querySelector('.md-header')?.classList.toggle('scrolled', scrolled);
    document.querySelector('.md-sidebar')?.classList.toggle('scrolled', scrolled);
  }
  document.addEventListener('scroll', toggleShadows, { passive: true });
  document.addEventListener('DOMContentLoaded', toggleShadows);

  // -------- 2) Back-to-top button --------
  function addBackToTop() {
    if (document.getElementById('backToTop')) return;
    const btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.className = 'back-to-top';
    btn.type = 'button';
    btn.title = 'Back to top';
    btn.innerHTML = '↑';
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(btn);

    function toggleBtn() {
      const show = (window.scrollY || document.documentElement.scrollTop) > 400;
      btn.classList.toggle('show', show);
    }
    document.addEventListener('scroll', toggleBtn, { passive: true });
    toggleBtn();
  }
  document.addEventListener('DOMContentLoaded', addBackToTop);

  // -------- 3) Click-to-copy heading anchors --------
  function addHeadingCopy() {
    const container = document.querySelector('.md-content');
    if (!container) return;
    container.querySelectorAll('h1[id], h2[id], h3[id], h4[id]').forEach(h => {
      if (h.querySelector('.copy-link')) return;
      const a = document.createElement('button');
      a.className = 'copy-link';
      a.type = 'button';
      a.title = 'Copy link to this section';
      a.innerHTML = '🔗';
      a.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = location.origin + location.pathname + '#' + h.id;
        navigator.clipboard.writeText(url).then(() => {
          a.classList.add('copied');
          setTimeout(() => a.classList.remove('copied'), 900);
        });
      });
      h.appendChild(a);
      // Allow clicking the heading text to navigate its own anchor
      h.addEventListener('click', (e) => {
        if ((e.target instanceof Element) && e.target.classList.contains('copy-link')) return;
        location.hash = h.id;
      });
    });
  }
  document.addEventListener('DOMContentLoaded', addHeadingCopy);
  // Re-run on page changes in instant navigation
  document.addEventListener('DOMContentLoaded', () => {
    if (window.MutationObserver) {
      new MutationObserver(addHeadingCopy)
        .observe(document.querySelector('.md-content'), { childList: true, subtree: true });
    }
  });

  // -------- 4) Image lightbox (click .zoomable images) --------
  function wireLightbox() {
    if (document.getElementById('imgLightbox')) return;
    const dlg = document.createElement('dialog');
    dlg.id = 'imgLightbox';
    dlg.className = 'img-lightbox';
    dlg.innerHTML = `
      <button class="lb-close" aria-label="Close">✕</button>
      <img alt="Zoomed image"/>
      <div class="lb-caption"></div>
    `;
    document.body.appendChild(dlg);

    dlg.querySelector('.lb-close').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg) dlg.close();
    });

    function openLightbox(src, alt) {
      const img = dlg.querySelector('img');
      img.src = src;
      img.alt = alt || '';
      dlg.querySelector('.lb-caption').textContent = alt || '';
      if (!dlg.open) dlg.showModal();
    }

    // Delegate clicks on images with .zoomable
    document.addEventListener('click', (e) => {
      const el = e.target;
      if (!(el instanceof Element)) return;
      const img = el.closest('img.zoomable');
      if (img) {
        e.preventDefault();
        openLightbox(img.src, img.alt);
      }
    });
  }
  document.addEventListener('DOMContentLoaded', wireLightbox);

  // -------- 5) Keyboard shortcuts --------
  // /  -> focus search
  // g g -> go to top
  // g b -> go to bottom
  // [ / ] -> previous/next heading (h2+)
  (function () {
    let gPressedAt = 0;
    function isWithin(ms) { return (performance.now() - gPressedAt) < ms; }

    document.addEventListener('keydown', (e) => {
      // Ignore in inputs
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.getAttribute('contenteditable') === 'true')) return;

      if (e.key === '/') {
        // focus Material search
        const search = document.querySelector('input.md-search__input');
        if (search) { e.preventDefault(); search.focus(); }
        return;
      }

      if (e.key.toLowerCase() === 'g') {
        gPressedAt = performance.now();
        return;
      }
      if (e.key.toLowerCase() === 'g' && isWithin(500)) return;

      if (e.key.toLowerCase() === 'g' && isWithin(500)) return;

      if (e.key.toLowerCase() === 'g' && isWithin(500)) return;

      if (e.key.toLowerCase() === 'g' && isWithin(500)) return;

      if (e.key.toLowerCase() === 'g' && isWithin(500)) return;

    });

    document.addEventListener('keydown', (e) => {
      // second half of combo
      if ((performance.now() - gPressedAt) < 500) {
        if (e.key.toLowerCase() === 'g') { // g g
          window.scrollTo({ top: 0, behavior: 'smooth' });
          gPressedAt = 0;
          return;
        }
        if (e.key.toLowerCase() === 'b') { // g b
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          gPressedAt = 0;
          return;
        }
      }

      if (e.key === '[' || e.key === ']') {
        const heads = Array.from(document.querySelectorAll('.md-content h2[id], .md-content h3[id]'));
        if (!heads.length) return;
        const y = window.scrollY + 10;
        let idx = heads.findIndex(h => h.getBoundingClientRect().top + window.scrollY > y) - 1;
        if (idx < 0) idx = 0;
        if (e.key === ']') idx = Math.min(idx + 1, heads.length - 1);
        if (e.key === '[') idx = Math.max(idx - 1, 0);
        heads[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  })();
})();


