// Clean DataTable (stable via CSS min-height):
// - Header dropdown filters (multi-select)
// - Click-to-sort
// - Bottom pagination only (no search)
// - Clear filters button
// - Stable height via tbody min-height
(function () {
  function detectType(val) {
    const s = String(val);
    const num = parseFloat(s.replace(/[, \t]/g, ''));
    if (!isNaN(num) && /^[-+\d.,\s]+$/.test(s)) return 'number';
    const d = Date.parse(s);
    if (!isNaN(d)) return 'date';
    return 'string';
  }
  function cmp(a, b, type) {
    if (type === 'number') {
      a = parseFloat(String(a).replace(/[, \t]/g, '')) || 0;
      b = parseFloat(String(b).replace(/[, \t]/g, '')) || 0;
    } else if (type === 'date') {
      a = Date.parse(a) || 0;
      b = Date.parse(b) || 0;
    } else {
      a = (a || '').toLowerCase();
      b = (b || '').toLowerCase();
    }
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  // --- dropdown filter setup ---
  function buildHeader(th) {
    if (th.querySelector('.th-inner')) return;

    const wrap = document.createElement('span');
    wrap.className = 'th-inner';

    const label = document.createElement('span');
    label.className = 'th-label';
    label.textContent = th.textContent.trim();

    const caret = document.createElement('span');
    caret.className = 'th-caret';
    caret.textContent = '▾';
    caret.title = 'Filter';

    const panel = document.createElement('div');
    panel.className = 'dd-panel';

    const ctrls = document.createElement('div');
    ctrls.className = 'dd-controls';
    const allBtn = document.createElement('button');
    allBtn.className = 'dd-action all';
    allBtn.textContent = 'Select all';
    const clrBtn = document.createElement('button');
    clrBtn.className = 'dd-action clear';
    clrBtn.textContent = 'Clear';
    ctrls.appendChild(allBtn);
    ctrls.appendChild(clrBtn);

    const list = document.createElement('div');
    list.className = 'dd-list';
    panel.appendChild(ctrls);
    panel.appendChild(list);

    th.textContent = '';
    th.style.position = 'relative';
    th.appendChild(wrap);
    th.appendChild(panel);
    wrap.appendChild(label);
    wrap.appendChild(caret);

    caret.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('open');
    });
    document.addEventListener('click', () => panel.classList.remove('open'));
    panel.addEventListener('click', (e) => e.stopPropagation());

    th._filterParts = { list, caret, allBtn, clrBtn };
  }

  function uniqueValuesForColumn(table, colIdx) {
    const set = new Set();
    const tbody = table.tBodies[0];
    Array.from(tbody.rows).forEach((r) => {
      const v = (r.cells[colIdx]?.textContent || '').trim();
      if (v) set.add(v);
    });
    return Array.from(set).sort();
  }

  function setupFilters(table) {
    const ths = table.tHead?.rows[0].cells || [];
    Array.from(ths).forEach((th, idx) => {
      buildHeader(th);
      const { list, caret, allBtn, clrBtn } = th._filterParts;
      if (list.dataset.initialized) return;
      uniqueValuesForColumn(table, idx).forEach((v) => {
        const label = document.createElement('label');
        label.className = 'dd-item';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = true;
        cb.value = v;
        const span = document.createElement('span');
        span.textContent = v;
        label.append(cb, span);
        list.append(label);
      });
      list.dataset.initialized = '1';
      function updateCaret() {
        const tot = list.querySelectorAll('input').length;
        const chk = list.querySelectorAll('input:checked').length;
        caret.textContent = chk === tot ? '▾' : '▾*';
      }
      list.addEventListener('change', () => {
        applyFilters(table);
        updateCaret();
      });
      allBtn.onclick = () => {
        list.querySelectorAll('input').forEach((cb) => (cb.checked = true));
        updateCaret();
        applyFilters(table);
      };
      clrBtn.onclick = () => {
        list.querySelectorAll('input').forEach((cb) => (cb.checked = false));
        updateCaret();
        applyFilters(table);
      };
      updateCaret();
    });
  }

  function currentFilterSets(table) {
    const sets = [];
    const ths = table.tHead?.rows[0].cells || [];
    Array.from(ths).forEach((th, i) => {
      const list = th._filterParts?.list;
      if (!list) return sets.push(null);
      const checked = list.querySelectorAll('input:checked');
      if (!checked.length) return sets.push(new Set());
      const s = new Set();
      checked.forEach((cb) => s.add(cb.value));
      sets.push(s);
    });
    return sets;
  }

  function applyFilters(table) {
    const sets = currentFilterSets(table);
    const rows = Array.from(table.tBodies[0].rows);
    rows.forEach((row) => {
      let show = true;
      for (let i = 0; i < row.cells.length; i++) {
        const s = sets[i];
        if (!s) continue;
        const val = (row.cells[i]?.textContent || '').trim();
        if (s.size === 0 || !s.has(val)) {
          show = false;
          break;
        }
      }
      row.dataset.visible = show ? '1' : '0';
    });
    updatePager(table);
  }

  // --- sorting ---
  function enableSorting(table) {
    const ths = table.tHead?.rows[0].cells || [];
    const tbody = table.tBodies[0];
    const types = Array.from(ths).map((th, i) => {
      const row = Array.from(tbody.rows).find((r) => r.cells[i]);
      if (row) return detectType((row.cells[i]?.textContent || '').trim());
      return 'string';
    });

    Array.from(ths).forEach((th, i) => {
      const lbl = th.querySelector('.th-label') || th;
      lbl.style.cursor = 'pointer';
      lbl.onclick = () => {
        const cur = th.dataset.sort || 'none';
        const dir = cur === 'asc' ? 'desc' : 'asc';
        ths.forEach((t) => {
          t.removeAttribute('data-sort');
          t.classList.remove('sorted-asc', 'sorted-desc');
        });
        th.dataset.sort = dir;
        th.classList.add(dir === 'asc' ? 'sorted-asc' : 'sorted-desc');
        const rows = Array.from(tbody.rows).filter((r) => r.dataset.visible !== '0');
        rows.sort((a, b) => {
          const va = (a.cells[i]?.textContent || '').trim();
          const vb = (b.cells[i]?.textContent || '').trim();
          return dir === 'asc' ? cmp(va, vb, types[i]) : -cmp(va, vb, types[i]);
        });
        rows.forEach((r) => tbody.append(r));
        updatePager(table, true);
      };
    });
  }

  // --- footer and pager ---
  function clearAllFilters(table) {
    const ths = table.tHead?.rows[0].cells || [];
    Array.from(ths).forEach((th) => {
      const list = th._filterParts?.list;
      if (!list) return;
      list.querySelectorAll('input').forEach((cb) => (cb.checked = true));
      th._filterParts.caret.textContent = '▾';
    });
    applyFilters(table);
  }

  function addPagerBottom(table) {
    const footer = document.createElement('div');
    footer.className = 'table-footer';

    const left = document.createElement('div');
    left.className = 'footer-left';
    const clearBtn = document.createElement('button');
    clearBtn.className = 'pager-btn';
    clearBtn.textContent = 'Clear filters';
    clearBtn.onclick = () => clearAllFilters(table);
    left.append(clearBtn);

    const pager = document.createElement('div');
    pager.className = 'pager';
    const prev = document.createElement('button');
    prev.className = 'pager-btn';
    prev.textContent = 'Prev';
    const next = document.createElement('button');
    next.className = 'pager-btn';
    next.textContent = 'Next';
    const info = document.createElement('span');
    info.className = 'pager-info';
    const sel = document.createElement('select');
    sel.className = 'pager-select';
    [10, 25, 50, 100].forEach((n) => {
      const o = document.createElement('option');
      o.value = n;
      o.textContent = n + ' / page';
      sel.append(o);
    });
    sel.value = '10';
    pager.append(prev, next, info, sel);
    footer.append(left, pager);
    table.insertAdjacentElement('afterend', footer);
    table._pager = { page: 1, pageSize: 10, prev, next, info, sel };

    prev.onclick = () => {
      table._pager.page--;
      updatePager(table, true);
    };
    next.onclick = () => {
      table._pager.page++;
      updatePager(table, true);
    };
    sel.onchange = () => {
      table._pager.pageSize = parseInt(sel.value, 10);
      table._pager.page = 1;
      updatePager(table);
    };
  }

  function updatePager(table, keepPage) {
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);
    const visible = rows.filter((r) => r.dataset.visible !== '0');
    const ctrl = table._pager;
    const per = ctrl.pageSize;
    const total = visible.length;
    const pages = Math.max(1, Math.ceil(total / per));
    if (!keepPage || ctrl.page > pages) ctrl.page = 1;

    rows.forEach((r) => (r.style.display = 'none'));
    const start = (ctrl.page - 1) * per;
    const end = start + per;
    visible.slice(start, end).forEach((r) => (r.style.display = ''));

    // Set a constant min-height on tbody to prevent layout jumps
    const h = tbody.rows[0]?.getBoundingClientRect().height || 40;
    tbody.style.minHeight = per * h + 'px';

    ctrl.info.textContent = `Page ${ctrl.page} of ${pages} • ${total} rows`;
    ctrl.prev.disabled = ctrl.page <= 1;
    ctrl.next.disabled = ctrl.page >= pages;
  }

  // --- init ---
  function enhance(table) {
    if (table.dataset.clean === '1') return;
    table.dataset.clean = '1';
    setupFilters(table);
    enableSorting(table);
    Array.from(table.tBodies[0].rows).forEach((r) => (r.dataset.visible = '1'));
    addPagerBottom(table);
    updatePager(table);
  }

  function init() {
    document.querySelectorAll('table.datatable-clean, table.datatable').forEach(enhance);
  }
  document.addEventListener('DOMContentLoaded', init);
})();
