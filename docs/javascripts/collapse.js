// collapse.js — Bootstrap-like Collapse for MkDocs Material
// Features:
// - [data-collapse-target="#id"] triggers
// - Multiple triggers per target
// - Smooth height animation (no jank, auto height handled in JS)
// - Optional accordion via data-parent="#groupId"
// - Accessible: aria-expanded, aria-controls, keyboard-friendly
// - Works with instant navigation (MutationObserver re-init)
// - Respects prefers-reduced-motion

(function () {
  const SEL_TRIGGER = '[data-collapse-target]';
  const CLASS_SHOW = 'show';
  const ANIM_MS = 250;

  const preferNoMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getTarget(el) {
    const sel = el.getAttribute('data-collapse-target');
    if (!sel) return null;
    try { return document.querySelector(sel); } catch { return null; }
  }

  function setAria(trigger, target, expanded) {
    trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    if (target.id) trigger.setAttribute('aria-controls', target.id);
  }

  function measure(target) {
    // Temporarily set to auto to measure full height without changing box size
    const prev = target.style.height;
    target.style.height = 'auto';
    const h = target.scrollHeight;
    target.style.height = prev || '';
    return h;
  }

  function collapse(target) {
    if (!target.classList.contains(CLASS_SHOW)) return;
    const start = target.getBoundingClientRect().height || measure(target);
    target.style.height = start + 'px';
    // force reflow
    target.offsetHeight; // eslint-disable-line no-unused-expressions
    target.classList.remove(CLASS_SHOW);
    if (preferNoMotion) {
      target.style.height = '0px';
      end();
      return;
    }
    target.style.height = '0px';
    let tid = setTimeout(end, ANIM_MS + 30);
    target.addEventListener('transitionend', onEnd);
    function onEnd(e) { if (e.propertyName === 'height') end(); }
    function end() {
      clearTimeout(tid);
      target.removeEventListener('transitionend', onEnd);
      target.style.height = '';
      // fire event for consumers
      target.dispatchEvent(new CustomEvent('collapsed'));
    }
  }

  function expand(target) {
    if (target.classList.contains(CLASS_SHOW)) return;
    target.classList.add(CLASS_SHOW);
    const endH = measure(target);
    target.style.height = '0px';
    // reflow
    target.offsetHeight; // eslint-disable-line no-unused-expressions
    if (preferNoMotion) {
      target.style.height = '';
      end();
      return;
    }
    target.style.height = endH + 'px';
    let tid = setTimeout(end, ANIM_MS + 30);
    target.addEventListener('transitionend', onEnd);
    function onEnd(e) { if (e.propertyName === 'height') end(); }
    function end() {
      clearTimeout(tid);
      target.removeEventListener('transitionend', onEnd);
      target.style.height = ''; // let content resize naturally
      target.dispatchEvent(new CustomEvent('expanded'));
    }
  }

  function toggle(target) {
    if (target.classList.contains(CLASS_SHOW)) collapse(target);
    else expand(target);
  }

  function closeSiblingsIfAccordion(trigger, target) {
    const parentSel = trigger.getAttribute('data-parent');
    if (!parentSel) return;
    const parent = document.querySelector(parentSel);
    if (!parent) return;
    parent.querySelectorAll('.collapse.show').forEach((openEl) => {
      if (openEl !== target) collapse(openEl);
    });
  }

  function attachTrigger(trigger) {
    if (trigger._collapseWired) return;
    trigger._collapseWired = true;

    const target = getTarget(trigger);
    if (!target) return;

    // Initial ARIA
    setAria(trigger, target, target.classList.contains(CLASS_SHOW));

    // Click/keyboard
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const tgt = getTarget(trigger);
      if (!tgt) return;
      closeSiblingsIfAccordion(trigger, tgt);
      toggle(tgt);
      setTimeout(() => setAria(trigger, tgt, tgt.classList.contains(CLASS_SHOW)), ANIM_MS / 2);
      // Optional: swap button text when open/close
      const swap = trigger.getAttribute('data-toggle-text');
      if (swap) {
        const open = tgt.classList.contains(CLASS_SHOW);
        const cur = trigger.textContent.trim();
        if (open && cur !== swap) trigger.dataset._origText = cur;
        if (open && swap) trigger.textContent = swap;
        if (!open && trigger.dataset._origText) trigger.textContent = trigger.dataset._origText;
      }
    });

    // Keep ARIA in sync if target changes by other triggers
    target.addEventListener('expanded', () => setAria(trigger, target, true));
    target.addEventListener('collapsed', () => setAria(trigger, target, false));
  }

  function initScope(scope) {
    // Ensure all .collapse elements start hidden without jump
    scope.querySelectorAll('.collapse').forEach((el) => {
      el.style.overflow = 'hidden';
      el.style.transition = preferNoMotion ? 'none' : `height ${ANIM_MS}ms ease`;
      if (!el.classList.contains(CLASS_SHOW)) {
        el.style.height = '0px';
      } else {
        // If marked show in markup, ensure height is natural
        el.style.height = '';
      }
    });
    scope.querySelectorAll(SEL_TRIGGER).forEach(attachTrigger);

    // Deep-link open if URL hash targets a collapse panel
    const hash = decodeURIComponent(location.hash || '').trim();
    if (hash && hash.startsWith('#')) {
      const el = scope.querySelector(hash);
      if (el && el.classList.contains('collapse') && !el.classList.contains(CLASS_SHOW)) {
        expand(el);
        // scroll into view but respect header height
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), ANIM_MS);
      }
    }
  }

  function init() { initScope(document); }

  document.addEventListener('DOMContentLoaded', init);

  // Re-initialize on SPA-like content replacements (MkDocs Material)
  if (window.MutationObserver) {
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const n of m.addedNodes || []) {
          if (n.nodeType === 1) initScope(n);
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }
})();
