// Progress lives in this browser only (localStorage): which pages were seen and where reading stopped.
(() => {
  const S = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const root = document.documentElement;
  root.classList.add('js');
  const seen = new Set(S.get('gk-seen') || []);
  const save = () => S.set('gk-seen', [...seen]);

  // Theme toggle: light, dark, or the system's choice when never toggled.
  const theme = S.get('gk-theme');
  if (theme) root.dataset.theme = theme;
  const tt = $('#theme');
  if (tt) tt.addEventListener('click', () => {
    const dark = (root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';
    root.dataset.theme = dark ? 'light' : 'dark';
    S.set('gk-theme', root.dataset.theme);
  });

  // Map: state per topic (started, done) and the suggested next topic.
  const items = $$('[data-pages]');
  if (items.length) {
    for (const li of items) {
      const ids = li.dataset.pages.split(' ');
      const n = ids.filter((id) => seen.has(id)).length;
      li.classList.toggle('done', n === ids.length);
      li.classList.toggle('part', n > 0 && n < ids.length);
      const small = $('.node small', li);
      if (small && n && n < ids.length) small.textContent = `${n}/${ids.length} sayfa`;
    }
    // Suggest the first started topic, else the first one not finished.
    (items.find((li) => li.classList.contains('part')) || items.find((li) => !li.classList.contains('done')))?.classList.add('next');
    const last = S.get('gk-last');
    const resume = $('#resume');
    if (resume && last) { resume.href = last.href; resume.querySelector('span').textContent = last.title; resume.hidden = false; }
  }

  // Search on the map and in the glossary.
  const q = $('#q');
  if (q) {
    const cards = $$('[data-find]');
    let cat = '';
    const apply = () => {
      const v = q.value.trim().toLocaleLowerCase('tr');
      for (const c of cards) c.classList.toggle('hide', (!!v && !c.dataset.find.includes(v)) || (!!cat && c.dataset.cat !== cat));
      for (const m of $$('.module, .connector')) {
        if (!m.classList.contains('module')) { m.classList.toggle('hide', !!v); continue; }
        m.classList.toggle('hide', !!v && !$('[data-find]:not(.hide)', m));
      }
    };
    q.addEventListener('input', apply);
    for (const b of $$('.cats button')) b.addEventListener('click', () => {
      cat = b.getAttribute('aria-pressed') === 'true' ? '' : b.dataset.cat;
      for (const x of $$('.cats button')) x.setAttribute('aria-pressed', String(x.dataset.cat === cat && !!cat));
      apply();
    });
  }

  // Topic reader.
  const pages = $$('.pg');
  if (!pages.length) return;
  const links = $$('.toc a');
  const dots = $$('.dots i');
  const meter = $('.meter i');
  const count = $('#count'), prev = $('#prev'), next = $('#next'), mode = $('#mode');
  const toc = $('.toc'), sheet = $('#sheet');
  const nt = $('#nt');
  const paged = () => root.classList.contains('paged');
  let i = Math.max(0, pages.findIndex((p) => `#${p.id}` === location.hash));
  const hadHash = pages.some((p) => `#${p.id}` === location.hash);

  function mark(k) { const id = pages[k].dataset.id; if (!seen.has(id)) { seen.add(id); save(); } }
  function paint() {
    const n = pages.filter((p) => seen.has(p.dataset.id)).length;
    meter.style.width = `${(100 * n) / pages.length}%`;
    pages.forEach((p, j) => {
      const s = seen.has(p.dataset.id);
      links[j]?.classList.toggle('seen', s); links[j]?.classList.toggle('cur', j === i);
      dots[j]?.classList.toggle('seen', s); dots[j]?.classList.toggle('cur', j === i);
    });
  }
  function show(k, scroll) {
    i = Math.max(0, Math.min(pages.length - 1, k));
    pages.forEach((p, j) => p.classList.toggle('cur', j === i));
    count.textContent = `${i + 1} / ${pages.length}`;
    prev.disabled = i === 0;
    const end = i === pages.length - 1;
    next.querySelector('span').textContent = end ? (nt ? 'Sonraki konu' : 'Bitti') : 'İleri';
    next.classList.toggle('ok', end);
    mark(i); paint();
    S.set('gk-last', { href: `${location.pathname}#${pages[i].id}`, title: `${document.title.split(' | ')[0]} · ${i + 1}/${pages.length}` });
    history.replaceState(null, '', `#${pages[i].id}`);
    if (scroll) pages[i].scrollIntoView({ block: 'start' });
  }
  function go(d) {
    if (d > 0 && i === pages.length - 1) { if (nt) location.href = nt.href; return; }
    show(i + d, true);
  }
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  links.forEach((a, j) => a.addEventListener('click', (e) => { e.preventDefault(); toc.classList.remove('open'); show(j, true); }));
  if (sheet) sheet.addEventListener('click', () => toc.classList.toggle('open'));
  mode.addEventListener('click', () => {
    root.classList.toggle('paged'); S.set('gk-paged', paged());
    mode.textContent = paged() ? 'Hepsi' : 'Tek tek';
    show(i, true);
  });
  if (S.get('gk-paged') !== false) root.classList.add('paged');
  mode.textContent = paged() ? 'Hepsi' : 'Tek tek';

  // Zoom: tap a drawing to see it full size.
  const lb = $('.lightbox');
  for (const img of $$('.shot img')) img.addEventListener('click', () => { $('img', lb).src = img.src; lb.classList.add('open'); });
  lb.addEventListener('click', () => lb.classList.remove('open'));

  addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea')) return;
    if (e.code === 'Escape') { lb.classList.remove('open'); toc.classList.remove('open'); }
    if (e.code === 'ArrowRight' || e.code === 'KeyJ') go(1);
    if (e.code === 'ArrowLeft' || e.code === 'KeyK') go(-1);
  });
  let x0 = null, y0 = 0;
  addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', (e) => {
    if (x0 === null || !paged() || lb.classList.contains('open') || toc.classList.contains('open')) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 70 && Math.abs(dx) > 2 * Math.abs(dy)) go(dx < 0 ? 1 : -1);
    x0 = null;
  });
  // In "all pages" mode, a page counts as seen once most of it was on screen.
  const io = new IntersectionObserver((es) => {
    for (const e of es) if (e.isIntersecting && !paged()) { mark(pages.indexOf(e.target)); paint(); }
  }, { threshold: 0.55 });
  pages.forEach((p) => io.observe(p));
  show(i, false);
  // Rearranging the pages moves the scroll position: start at the top, or at the page a link points to.
  requestAnimationFrame(() => { if (hadHash) pages[i].scrollIntoView({ block: 'start' }); else scrollTo(0, 0); });
})();
