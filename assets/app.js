// Progress lives in this browser only (localStorage): seen pages, where reading stopped, favourite terms, theme.
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

  // Theme: light unless the reader switched to dark.
  const tt = $('#theme');
  if (tt) tt.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    S.set('gk-theme', root.dataset.theme);
  });

  // After a PDF download starts, ask for a star or a follow (unless the reader turned it off).
  const thanks = $('#thanks');
  if (thanks && thanks.showModal) {
    for (const a of $$('a[href$=".pdf"]')) a.addEventListener('click', () => {
      if (S.get('gk-thanks-off')) return;
      setTimeout(() => { try { thanks.showModal(); } catch { /* dialog unavailable */ } }, 300);
    });
    $('#thanks-off').addEventListener('change', (e) => S.set('gk-thanks-off', e.target.checked));
    thanks.addEventListener('click', (e) => { if (e.target === thanks) thanks.close(); });
  }

  // Map: state per topic (started, done) and the suggested next topic.
  const items = $$('.chain > li[data-pages]');
  if (items.length) {
    for (const li of items) {
      const ids = li.dataset.pages.split(' ');
      const n = ids.filter((id) => seen.has(id)).length;
      li.classList.toggle('done', n === ids.length);
      li.classList.toggle('part', n > 0 && n < ids.length);
      const small = $('.node small', li);
      if (small && n && n < ids.length) small.textContent = `${n}/${ids.length} sayfa`;
    }
    (items.find((li) => li.classList.contains('part')) || items.find((li) => !li.classList.contains('done')))?.classList.add('next');
    const last = S.get('gk-last');
    const resume = $('#resume');
    if (resume && last) { resume.href = last.href; resume.querySelector('span').textContent = last.title; resume.hidden = false; }
  }

  // Map pagination: one track and one section at a time.
  const tracks = $$('.track[data-track]');
  if (tracks.length) {
    const tabs = $$('.tracktabs button');
    const state = { track: null, index: {} };
    const modulesOf = (tr) => $$('.module', tr);
    function showSection(tr, k, scroll) {
      const mods = modulesOf(tr);
      k = Math.max(0, Math.min(mods.length - 1, k));
      state.index[tr.dataset.track] = k;
      mods.forEach((m, j) => m.classList.toggle('on', j === k));
      const pre = $('.prereq', tr); if (pre) pre.classList.toggle('on', k === 0);
      $$('.pager [data-go]', tr).forEach((b, j) => {
        b.setAttribute('aria-current', String(j === k));
        const lis = $$('.chain > li', mods[j]);
        b.classList.toggle('done', lis.length > 0 && lis.every((li) => li.classList.contains('done')));
      });
      $('.pager-name', tr).textContent = mods[k].querySelector('h3').textContent;
      $$('[data-step="-1"]', tr).forEach((b) => { b.disabled = k === 0; });
      $$('[data-step="1"]', tr).forEach((b) => { b.disabled = k === mods.length - 1; });
      if (scroll !== undefined) history.replaceState(null, '', `#${mods[k].id}`);
      if (scroll) ($('.tracktabs') || tr).scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    function showTrack(slug, k, scroll) {
      state.track = slug;
      tracks.forEach((tr) => tr.classList.toggle('on', tr.dataset.track === slug));
      tabs.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.track === slug)));
      const tr = tracks.find((x) => x.dataset.track === slug);
      showSection(tr, k ?? state.index[slug] ?? 0, scroll);
    }
    tabs.forEach((b) => b.addEventListener('click', () => showTrack(b.dataset.track, undefined, false)));
    for (const tr of tracks) {
      $$('[data-go]', tr).forEach((b) => b.addEventListener('click', () => showSection(tr, Number(b.dataset.go), false)));
      $$('[data-step]', tr).forEach((b) => b.addEventListener('click', () => showSection(tr, state.index[tr.dataset.track] + Number(b.dataset.step), b.closest('.pager-foot') !== null)));
    }
    // Start at the linked section, else where the suggested next topic is.
    const linked = location.hash && $(`.module${CSS.escape(location.hash)}`);
    const start = linked || $('.chain > li.next')?.closest('.module') || $('.module');
    const startTrack = start.closest('.track');
    for (const tr of tracks) state.index[tr.dataset.track] = 0;
    showTrack(startTrack.dataset.track, modulesOf(startTrack).indexOf(start));
    if (!linked) requestAnimationFrame(() => scrollTo(0, 0));
  }

  // Search (map and glossary), glossary categories, favourites and pages.
  const q = $('#q');
  const terms = $$('.term');
  const favs = new Set(S.get('gk-favs') || []);
  const PER = 12;
  let gpage = 0;
  let cat = '';
  function paintFavs() {
    for (const t of terms) {
      const on = favs.has(t.dataset.term);
      t.classList.toggle('is-fav', on);
      const b = $('.fav', t); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? '★' : '☆';
    }
    const n = $('#favn'); if (n) n.textContent = String(favs.size);
  }
  function applyGlossary() {
    const v = q.value.trim().toLocaleLowerCase('tr');
    const match = terms.filter((t) => (!v || t.dataset.find.includes(v)) && (!cat || (cat === '★' ? favs.has(t.dataset.term) : t.dataset.cat === cat)));
    const pages = Math.max(1, Math.ceil(match.length / PER));
    gpage = Math.min(gpage, pages - 1);
    for (const t of terms) t.classList.add('off');
    match.slice(gpage * PER, gpage * PER + PER).forEach((t) => t.classList.remove('off'));
    $('#result').textContent = match.length
      ? `${match.length} terim${pages > 1 ? ` · sayfa ${gpage + 1}/${pages}` : ''}`
      : (cat === '★' ? 'Henüz favori yok: bir terimin ☆ işaretine dokun.' : 'Bu aramayla eşleşen terim yok.');
    const nav = $('.gpager');
    nav.innerHTML = '';
    if (pages > 1) {
      const mk = (label, p, aria) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'chip'; b.textContent = label;
        if (aria) b.setAttribute('aria-label', aria);
        b.setAttribute('aria-current', String(p === gpage));
        b.disabled = p < 0 || p >= pages;
        b.addEventListener('click', () => { gpage = p; applyGlossary(); $('.gloss-head').scrollIntoView({ behavior: 'smooth' }); });
        nav.append(b);
      };
      mk('←', gpage - 1, 'Önceki sayfa');
      for (let p = 0; p < pages; p += 1) mk(String(p + 1), p);
      mk('→', gpage + 1, 'Sonraki sayfa');
    }
  }
  if (terms.length) {
    paintFavs();
    for (const t of terms) $('.fav', t).addEventListener('click', () => {
      favs.has(t.dataset.term) ? favs.delete(t.dataset.term) : favs.add(t.dataset.term);
      S.set('gk-favs', [...favs]); paintFavs(); applyGlossary();
    });
    for (const b of $$('.cats button')) b.addEventListener('click', () => {
      cat = b.getAttribute('aria-pressed') === 'true' ? '' : b.dataset.cat;
      for (const x of $$('.cats button')) x.setAttribute('aria-pressed', String(x.dataset.cat === cat && !!cat));
      gpage = 0; applyGlossary();
    });
    q.addEventListener('input', () => { gpage = 0; applyGlossary(); });
    const target = location.hash && terms.find((t) => `#${t.id}` === decodeURIComponent(location.hash));
    if (target) gpage = Math.floor(terms.indexOf(target) / PER);
    applyGlossary();
    if (target) { target.classList.add('flash'); requestAnimationFrame(() => target.scrollIntoView({ block: 'center' })); }
  } else if (q) {
    const cards = $$('[data-find]');
    q.addEventListener('input', () => {
      const v = q.value.trim().toLocaleLowerCase('tr');
      root.classList.toggle('searching', !!v);
      for (const c of cards) c.classList.toggle('hide', !!v && !c.dataset.find.includes(v));
      for (const m of $$('.module')) m.classList.toggle('hide', !!v && !$('[data-find]:not(.hide)', m));
      for (const tr of $$('.track')) tr.classList.toggle('hide', !!v && !$('.module:not(.hide)', tr));
    });
  }

  // Saved pages: a toggle on each page, listed on the saved page.
  const saved = new Set(S.get('gk-saved') || []);
  for (const b of $$('.save')) {
    const paintSave = () => { const on = saved.has(b.dataset.save); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? '★ Kaydedildi' : '☆ Kaydet'; };
    paintSave();
    b.addEventListener('click', () => { saved.has(b.dataset.save) ? saved.delete(b.dataset.save) : saved.add(b.dataset.save); S.set('gk-saved', [...saved]); paintSave(); });
  }
  const savedIndex = $('#saved-index');
  if (savedIndex) {
    const idx = JSON.parse(savedIndex.textContent);
    const ids = [...saved].filter((id) => idx[id]).reverse();
    $('#saved-empty').hidden = ids.length > 0;
    $('#saved').append(...ids.map((id) => {
      const a = document.createElement('a'); a.className = 'saved-card'; a.href = idx[id].href;
      const img = document.createElement('img'); img.src = idx[id].img; img.alt = ''; img.loading = 'lazy';
      const b = document.createElement('b'); b.textContent = idx[id].title;
      const sm = document.createElement('small'); sm.textContent = idx[id].topic;
      a.append(img, b, sm); return a;
    }));
  }

  // Mini check: pick an option, see whether it is right and why.
  for (const qz of $$('.qz')) {
    const right = Number(qz.dataset.answer);
    for (const o of $$('.qz-o', qz)) o.addEventListener('click', () => {
      if (qz.classList.contains('done')) return;
      qz.classList.add('done');
      const pick = Number(o.dataset.i);
      $$('.qz-o', qz).forEach((x, n) => { if (n === right) x.classList.add('right'); });
      if (pick !== right) o.classList.add('wrong');
      const why = $('.qz-why', qz); why.textContent = `${pick === right ? 'Doğru. ' : 'Doğrusu işaretli. '}${why.textContent}`; why.hidden = false;
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
    $('.endcard')?.classList.toggle('show', end);
    $('.quiz')?.classList.toggle('show', end);
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
  const io = new IntersectionObserver((es) => {
    for (const e of es) if (e.isIntersecting && !paged()) { mark(pages.indexOf(e.target)); paint(); }
  }, { threshold: 0.55 });
  pages.forEach((p) => io.observe(p));
  show(i, false);
  requestAnimationFrame(() => { if (hadHash) pages[i].scrollIntoView({ block: 'start' }); else scrollTo(0, 0); });
})();
