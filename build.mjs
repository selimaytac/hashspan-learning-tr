// Builds the static site into _site/ from content/: a map of every topic, one HTML page per topic (all of its
// pages, images and notes, readable without JavaScript), a glossary, sitemap.xml, robots.txt and llms.txt.
// Run: node build.mjs   (BASE_URL sets the absolute address used in canonical links and the sitemap)
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, '_site');
const BASE = (process.env.BASE_URL ?? 'https://selimaytac.github.io/hashspan-learning-tr').replace(/\/$/, '');
const PATH = new URL(`${BASE}/`).pathname; // e.g. /hashspan-learning-tr/
const SITE = 'Görsel Kripto ve hashspan';
const SITE_DESC = 'Kripto cüzdanları, imzalar, custody, konsensüs ve on-chain gözlemlenebilirlik: az yazı, çok çizim. Türkçe ve ücretsiz.';
const LICENSE = 'https://creativecommons.org/licenses/by/4.0/deed.tr';
const REPO = 'https://github.com/selimaytac/hashspan-learning-tr';

const data = JSON.parse(readFileSync(join(root, 'content', 'data.json'), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = (p = '') => `${PATH}${p}`;
const abs = (p = '') => `${BASE}/${p}`;

// Every topic in reading order, with its neighbours.
const topics = [];
for (const track of data.tracks) {
  for (const section of track.sections) {
    for (const topic of section.topics) topics.push({ ...topic, track, section, path: `${track.slug}/${topic.slug}/` });
  }
}
topics.forEach((t, i) => { t.prev = topics[i - 1]; t.next = topics[i + 1]; });
const pageCount = topics.reduce((n, t) => n + t.pages.length, 0);

const css = `
:root{--bg:#f7f6f3;--card:#fff;--ink:#1d1d1f;--muted:#5d6068;--line:#e2dfd8;--accent:#1864ab;--accent-bg:#e7f0fa;--done:#2b8a3e;--done-bg:#e6f5ea;--shadow:0 1px 3px rgba(0,0,0,.08)}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#141517;--card:#1e1f22;--ink:#ececea;--muted:#a1a4ab;--line:#33353a;--accent:#74b0f4;--accent-bg:#1b2a3b;--done:#69db7c;--done-bg:#1b3022;--shadow:none}}
:root[data-theme=dark]{--bg:#141517;--card:#1e1f22;--ink:#ececea;--muted:#a1a4ab;--line:#33353a;--accent:#74b0f4;--accent-bg:#1b2a3b;--done:#69db7c;--done-bg:#1b3022;--shadow:none}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:var(--accent)}img{max-width:100%;height:auto}
.wrap{max-width:860px;margin:0 auto;padding:0 16px}
.top{position:sticky;top:0;z-index:5;background:var(--card);border-bottom:1px solid var(--line)}
.top .wrap{display:flex;gap:12px;align-items:center;min-height:52px}
.brand{font-weight:700;text-decoration:none;color:var(--ink);white-space:nowrap}
.top nav{display:flex;gap:14px;margin-left:auto;font-size:15px}.top nav a{text-decoration:none}
.bar{height:3px;background:var(--line)}.bar i{display:block;height:100%;width:0;background:var(--done);transition:width .2s}
h1{font-size:30px;line-height:1.25;margin:28px 0 8px}h2{font-size:21px;line-height:1.3;margin:0 0 8px}
.lead{color:var(--muted);font-size:18px;margin:0 0 20px}
.crumbs{font-size:14px;color:var(--muted);margin-top:16px}.crumbs a{color:var(--muted)}
.btn{display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:15px;padding:8px 14px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink);text-decoration:none;cursor:pointer}
.btn:hover{border-color:var(--accent)}.btn.primary{background:var(--accent);border-color:var(--accent);color:#fff}
.btn[disabled]{opacity:.4;cursor:default}
.search{width:100%;font:inherit;padding:10px 14px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink);margin:4px 0 18px}
.track{margin:28px 0}.track>h2{font-size:24px;margin-bottom:2px}.track>p{color:var(--muted);margin:0 0 12px}
details.sec{background:var(--card);border:1px solid var(--line);border-radius:14px;margin:0 0 12px;box-shadow:var(--shadow)}
details.sec>summary{cursor:pointer;list-style:none;padding:14px 18px;font-weight:650;display:flex;gap:10px;align-items:center}
details.sec>summary::-webkit-details-marker{display:none}
details.sec>summary::before{content:'▸';color:var(--muted)}details.sec[open]>summary::before{content:'▾'}
.sec .meta{margin-left:auto;color:var(--muted);font-weight:400;font-size:14px}
.path{list-style:none;margin:0;padding:2px 18px 14px 46px;position:relative}
.path::before{content:'';position:absolute;left:29px;top:0;bottom:22px;border-left:2px solid var(--line)}
.path li{position:relative;margin:8px 0}
.path li::before{content:'';position:absolute;left:-23px;top:16px;width:12px;height:12px;border-radius:50%;background:var(--card);border:2px solid var(--muted)}
.path li.part::before{background:var(--accent);border-color:var(--accent)}.path li.done::before{background:var(--done);border-color:var(--done)}
.path a{display:block;padding:8px 12px;border:1px solid var(--line);border-radius:10px;text-decoration:none;color:var(--ink);background:var(--bg)}
.path li.done a{border-color:var(--done);background:var(--done-bg)}
.path a small{display:block;color:var(--muted);font-size:13px;line-height:1.4}
.path a b{color:var(--muted);font-weight:600;margin-right:4px}
.resume{display:none;margin:0 0 16px}.resume.on{display:flex}
.pg{scroll-margin-top:64px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px;margin:0 0 20px;box-shadow:var(--shadow)}
.pg figure{margin:0 0 12px;text-align:center}.pg img{border-radius:10px;background:#fff;border:1px solid var(--line)}
.pg.portrait img{max-height:78vh;width:auto}
.pg .no{color:var(--muted);font-size:14px}
.pg ul{margin:6px 0 4px;padding-left:22px}.pg li{margin:4px 0}
.pg details{margin-top:8px;font-size:14px;color:var(--muted)}.pg details summary{cursor:pointer}
.steps{display:none;gap:8px;align-items:center;justify-content:space-between;position:sticky;bottom:0;background:var(--bg);padding:10px 0 14px;z-index:4}
.js .steps{display:flex}.steps .count{color:var(--muted);font-size:15px}
.js.paged .pg{display:none}.js.paged .pg.cur{display:block}
.mode{font-size:14px}
.next-topic{display:flex;gap:12px;flex-wrap:wrap;justify-content:space-between;margin:24px 0 40px}
.next-topic a{flex:1 1 240px;padding:14px 16px;border:1px solid var(--line);border-radius:12px;background:var(--card);text-decoration:none;color:var(--ink)}
.next-topic small{display:block;color:var(--muted)}
table{border-collapse:collapse;width:100%;font-size:15px;margin:8px 0 24px;background:var(--card)}
th,td{border:1px solid var(--line);padding:8px 10px;text-align:left;vertical-align:top}
.tablewrap{overflow-x:auto}
footer{border-top:1px solid var(--line);color:var(--muted);font-size:14px;padding:20px 0 40px;margin-top:40px}
code{font-size:.9em;background:var(--accent-bg);padding:1px 5px;border-radius:5px}
.hide{display:none!important}
@media (min-width:1000px){.wrap{max-width:1140px}.pg.portrait{display:grid;grid-template-columns:minmax(0,560px) minmax(0,1fr);grid-template-rows:auto auto auto 1fr;column-gap:28px;align-items:start}.pg.portrait figure{grid-row:1/span 4;margin:0}.pg.portrait img{max-height:84vh}.pg.portrait h2{margin-top:8px}.js.paged .pg.portrait.cur{display:grid}}
@media (max-width:600px){.brand{font-size:15px}.top nav a:first-child{display:none}.top nav{gap:10px;font-size:14px}.top .wrap{gap:8px}h1{font-size:25px}.pg{padding:10px;border-radius:12px}.top nav{gap:10px}.pg.portrait img{max-height:none;width:100%}}
`;

// Progress lives in this browser only (localStorage): which pages were seen and where reading stopped.
const js = `
(() => {
  const S = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
  const seen = new Set(S.get('gk-seen') || []);
  const save = () => S.set('gk-seen', [...seen]);
  document.documentElement.classList.add('js');
  const theme = S.get('gk-theme'); if (theme) document.documentElement.dataset.theme = theme;
  const tt = document.getElementById('theme');
  if (tt) tt.onclick = (e) => { e.preventDefault(); const d = document.documentElement; const next = (d.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark' ? 'light' : 'dark'; d.dataset.theme = next; S.set('gk-theme', next); };

  // Map: progress per topic, resume link, search.
  for (const li of document.querySelectorAll('[data-pages]')) {
    const ids = li.dataset.pages.split(' ');
    const n = ids.filter((id) => seen.has(id)).length;
    if (n === ids.length) li.classList.add('done'); else if (n) li.classList.add('part');
    if (n && n < ids.length) li.querySelector('small').textContent += ' · ' + n + '/' + ids.length;
  }
  for (const sec of document.querySelectorAll('details.sec')) {
    const items = [...sec.querySelectorAll('[data-pages]')];
    const done = items.filter((x) => x.classList.contains('done')).length;
    const m = sec.querySelector('.meta'); if (m && done) m.textContent = done + '/' + items.length + ' konu';
  }
  const last = S.get('gk-last'), resume = document.getElementById('resume');
  if (resume && last) { resume.classList.add('on'); resume.querySelector('a').href = last.href; resume.querySelector('span').textContent = last.title; }
  const q = document.getElementById('q');
  if (q) q.oninput = () => {
    const v = q.value.trim().toLocaleLowerCase('tr');
    for (const li of document.querySelectorAll('[data-pages]')) li.classList.toggle('hide', !!v && !li.dataset.find.includes(v));
    for (const sec of document.querySelectorAll('details.sec')) { const any = sec.querySelector('[data-pages]:not(.hide)'); sec.classList.toggle('hide', !any); if (v) sec.open = !!any; }
  };

  // Topic: one page at a time (or all), arrows, swipe, progress.
  const pages = [...document.querySelectorAll('.pg')];
  if (!pages.length) return;
  const root = document.documentElement, bar = document.querySelector('.bar i'), count = document.getElementById('count');
  const prev = document.getElementById('prev'), next = document.getElementById('next'), mode = document.getElementById('mode');
  let i = Math.max(0, pages.findIndex((p) => '#' + p.id === location.hash));
  const paged = () => root.classList.contains('paged');
  function mark(k) { const id = pages[k].dataset.id; if (!seen.has(id)) { seen.add(id); save(); } }
  function progress() { const n = pages.filter((p) => seen.has(p.dataset.id)).length; bar.style.width = (100 * n / pages.length) + '%'; }
  function show(k, scroll) {
    i = Math.max(0, Math.min(pages.length - 1, k));
    pages.forEach((p, j) => p.classList.toggle('cur', j === i));
    count.textContent = (i + 1) + ' / ' + pages.length;
    prev.disabled = i === 0;
    next.textContent = i === pages.length - 1 ? (document.getElementById('nt') ? 'Sonraki konu →' : 'Bitti ✓') : 'İleri →';
    mark(i); progress();
    S.set('gk-last', { href: location.pathname + '#' + pages[i].id, title: document.title.split(' | ')[0] + ' · ' + (i + 1) + '/' + pages.length });
    history.replaceState(null, '', '#' + pages[i].id);
    if (scroll) pages[i].scrollIntoView({ block: 'start' });
  }
  function go(d) {
    if (d > 0 && i === pages.length - 1) { const nt = document.getElementById('nt'); if (nt) location.href = nt.href; return; }
    show(i + d, true);
  }
  prev.onclick = () => go(-1); next.onclick = () => go(1);
  mode.onclick = () => { root.classList.toggle('paged'); S.set('gk-paged', paged()); mode.textContent = paged() ? 'Tüm sayfalar' : 'Sayfa sayfa'; show(i, true); };
  if (S.get('gk-paged') !== false) root.classList.add('paged');
  mode.textContent = paged() ? 'Tüm sayfalar' : 'Sayfa sayfa';
  addEventListener('keydown', (e) => { if (e.target.closest('input,textarea')) return; if (e.code === 'ArrowRight') go(1); if (e.code === 'ArrowLeft') go(-1); });
  let x0 = null, y0 = 0;
  addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', (e) => { if (x0 === null || !paged()) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; if (Math.abs(dx) > 70 && Math.abs(dx) > 2 * Math.abs(dy)) go(dx < 0 ? 1 : -1); x0 = null; });
  // In "all pages" mode, a page counts as seen once most of it was on screen.
  const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting && !paged()) { const k = pages.indexOf(e.target); mark(k); progress(); } }, { threshold: 0.6 });
  pages.forEach((p) => io.observe(p));
  const hadHash = pages.some((p) => '#' + p.id === location.hash);
  show(i, false);
  // Rearranging the pages moves the scroll position; start at the top, or at the page the link points to.
  requestAnimationFrame(() => { if (hadHash) (paged() ? document.querySelector('h1') : pages[i]).scrollIntoView({ block: 'start' }); else scrollTo(0, 0); });
})();
`;

const layout = ({ title, description, path, image, body, jsonld = [], type = 'website' }) => `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<link rel="canonical" href="${abs(path)}"><link rel="license" href="${LICENSE}">
<meta property="og:type" content="${type}"><meta property="og:locale" content="tr_TR"><meta property="og:site_name" content="${esc(SITE)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${abs(path)}">
${image ? `<meta property="og:image" content="${abs(image)}"><meta name="twitter:card" content="summary_large_image">` : ''}
<meta name="theme-color" content="#1864ab"><link rel="icon" href="${url('favicon.svg')}" type="image/svg+xml">
<link rel="stylesheet" href="${url('style.css')}">
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head><body>
<header class="top"><div class="wrap"><a class="brand" href="${url()}">${esc(SITE)}</a>
<nav><a href="${url()}">Harita</a><a href="${url('sozluk/')}">Sözlük</a><a href="${url('hakkinda/')}">Hakkında</a><a href="#" id="theme" aria-label="Tema">◐</a></nav></div><div class="bar"><i></i></div></header>
<main class="wrap">${body}</main>
<footer><div class="wrap">İçerik <a href="${LICENSE}" rel="license">CC BY 4.0</a> · Kod MIT · <a href="${REPO}">GitHub</a></div></footer>
<script src="${url('app.js')}" defer></script>
</body></html>
`;

const files = new Map();
const put = (path, html) => files.set(path, html);

// Map.
const findText = (t) => [t.code, t.title, t.description, ...t.pages.flatMap((p) => [p.title, ...p.notes, p.text])].join(' ').toLocaleLowerCase('tr');
const mapBody = `
<h1>${esc(SITE)}</h1>
<p class="lead">${esc(SITE_DESC)} ${topics.length} konu, ${pageCount} sayfa.</p>
<p class="resume" id="resume"><a class="btn primary" href="#">Kaldığın yerden devam et: <span></span></a></p>
<input class="search" id="q" type="search" placeholder="Ara: imza, MPC, span, finality…" aria-label="Konularda ara">
${data.tracks.map((track) => `<section class="track"><h2 id="${track.slug}"><a href="${url(`${track.slug}/`)}">${esc(track.name)}</a></h2><p>${esc(track.description)}</p>
${track.sections.map((sec) => `<details class="sec" open><summary>${esc(sec.title)}<span class="meta">${sec.topics.length} konu</span></summary><ol class="path">
${sec.topics.map((t) => `<li data-pages="${t.pages.map((p) => p.id).join(' ')}" data-find="${esc(findText(t))}"><a href="${url(`${track.slug}/${t.slug}/`)}"><b>${esc(t.code)}</b>${esc(t.title)}<small>${t.pages.length} sayfa${t.description ? ' · ' + esc(t.description) : ''}</small></a></li>`).join('\n')}
</ol></details>`).join('\n')}</section>`).join('\n')}`;
put('index.html', layout({
  title: `${SITE}: çizimlerle kripto ve on-chain gözlemlenebilirlik`, description: SITE_DESC, path: '', body: mapBody,
  jsonld: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE, url: abs(), inLanguage: 'tr', description: SITE_DESC }],
}));

// Track pages.
for (const track of data.tracks) {
  const tt = topics.filter((t) => t.track === track);
  put(`${track.slug}/index.html`, layout({
    title: `${track.name} | ${SITE}`, description: track.description, path: `${track.slug}/`,
    body: `<p class="crumbs"><a href="${url()}">Harita</a> › ${esc(track.name)}</p><h1>${esc(track.name)}</h1><p class="lead">${esc(track.description)}</p>
${track.sections.map((sec) => `<h2>${esc(sec.title)}</h2><ol class="path">${sec.topics.map((t) => `<li data-pages="${t.pages.map((p) => p.id).join(' ')}" data-find=""><a href="${url(`${track.slug}/${t.slug}/`)}"><b>${esc(t.code)}</b>${esc(t.title)}<small>${t.pages.length} sayfa${t.description ? ' · ' + esc(t.description) : ''}</small></a></li>`).join('')}</ol>`).join('\n')}`,
    jsonld: [{ '@context': 'https://schema.org', '@type': 'Course', name: track.name, description: track.description, inLanguage: 'tr', url: abs(`${track.slug}/`), license: LICENSE, isAccessibleForFree: true, provider: { '@type': 'Organization', name: SITE, url: abs() }, hasPart: tt.map((t) => ({ '@type': 'LearningResource', name: `${t.code} · ${t.title}`, url: abs(t.path) })) }],
  }));
}

// Topic pages.
for (const t of topics) {
  const name = `${t.code} · ${t.title}`;
  const description = t.description || `${t.title}: ${t.pages.length} sayfalık görsel anlatım.`;
  const og = `og/${t.track.slug}-${t.slug}.jpg`;
  const body = `<p class="crumbs"><a href="${url()}">Harita</a> › <a href="${url(`${t.track.slug}/`)}">${esc(t.track.name)}</a> › ${esc(t.section.title)}</p>
<h1>${esc(name)}</h1><p class="lead">${esc(description)}</p>
${t.prev ? `<p class="crumbs">Önce: <a href="${url(t.prev.path)}">${esc(`${t.prev.code} · ${t.prev.title}`)}</a></p>` : ''}
${t.pages.map((p, k) => `<section class="pg${p.h > p.w ? ' portrait' : ''}" id="s${k + 1}" data-id="${p.id}">
<figure><img src="${url(`img/${p.id}.webp`)}" width="${p.w}" height="${p.h}" alt="${esc(`${p.title}: ${p.text}`.slice(0, 480))}"${k ? ' loading="lazy"' : ''} decoding="async"></figure>
<h2><span class="no">${k + 1}/${t.pages.length}</span> ${esc(p.title)}</h2>
${p.notes.length ? `<ul>${p.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
${p.text ? `<details><summary>Görseldeki yazılar</summary><p>${esc(p.text)}</p></details>` : ''}
</section>`).join('\n')}
<div class="steps"><button class="btn" id="prev">← Geri</button><span class="count" id="count"></span><button class="btn mode" id="mode">Tüm sayfalar</button><button class="btn primary" id="next">İleri →</button></div>
<nav class="next-topic">${t.prev ? `<a href="${url(t.prev.path)}"><small>← Önceki konu</small>${esc(`${t.prev.code} · ${t.prev.title}`)}</a>` : ''}${t.next ? `<a id="nt" href="${url(t.next.path)}"><small>Sonraki konu →</small>${esc(`${t.next.code} · ${t.next.title}`)}</a>` : ''}</nav>`;
  put(`${t.path}index.html`, layout({
    title: `${name} | ${SITE}`, description, path: t.path, image: og, body, type: 'article',
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'LearningResource', name, description, inLanguage: 'tr', url: abs(t.path), image: abs(og), license: LICENSE, isAccessibleForFree: true, learningResourceType: 'Infographic', isPartOf: { '@type': 'Course', name: t.track.name, url: abs(`${t.track.slug}/`) }, timeRequired: `PT${Math.max(3, t.pages.length * 2)}M` },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Harita', item: abs() }, { '@type': 'ListItem', position: 2, name: t.track.name, item: abs(`${t.track.slug}/`) }, { '@type': 'ListItem', position: 3, name, item: abs(t.path) }] },
    ],
  }));
}

// Glossary from content/sozluk.md (headings and tables only).
const md = readFileSync(join(root, 'content', 'sozluk.md'), 'utf8');
const inline = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
let gloss = '', rows = [];
const flush = () => { if (!rows.length) return; const [head, , ...rest] = rows; gloss += `<div class="tablewrap"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rest.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; rows = []; };
for (const line of md.split('\n')) {
  if (line.startsWith('|')) { rows.push(line.slice(1, -1).split('|').map((c) => c.trim())); continue; }
  flush();
  if (line.startsWith('## ')) gloss += `<h2>${inline(line.slice(3))}</h2>`;
}
flush();
put('sozluk/index.html', layout({ title: `Sözlük | ${SITE}`, description: 'Kripto, blockchain ve OpenTelemetry terimleri: her terim tek cümle.', path: 'sozluk/', body: `<h1>Sözlük</h1><p class="lead">Her terim tek cümle; ayrıntı konularda.</p>${gloss}` }));

put('hakkinda/index.html', layout({
  title: `Hakkında | ${SITE}`, description: SITE_DESC, path: 'hakkinda/',
  body: `<h1>Hakkında</h1><p class="lead">${esc(SITE_DESC)}</p>
<p>Her konu kısa sayfalara bölünmüştür: her sayfada bir fikir, bir çizim ve altında birkaç madde. Örneklerdeki adres, hash ve imzalar gerçekten hesaplanmıştır; anahtarlar Anvil'in herkesçe bilinen test anahtarlarıdır, gerçek para için asla kullanılmamalıdır.</p>
<p>hashspan bölümü, AI agent'ların zincire gönderdiği işlemleri OpenTelemetry ile izleyen açık kaynak <a href="https://github.com/selimaytac/hashspan">hashspan</a> kütüphanesini anlatır.</p>
<p>İlerlemen sadece bu tarayıcıda tutulur; hesap, çerez ya da takip yoktur.</p>
<p>İçerik <a href="${LICENSE}" rel="license">CC BY 4.0</a> ile paylaşılır: kaynak göstererek kullanabilirsin. Kaynak kod ve içerik: <a href="${REPO}">${REPO.replace('https://', '')}</a>.</p>`,
}));

put('404.html', layout({ title: `Bulunamadı | ${SITE}`, description: SITE_DESC, path: '404.html', body: `<h1>Sayfa bulunamadı</h1><p><a class="btn primary" href="${url()}">Haritaya dön</a></p>` }));

rmSync(out, { recursive: true, force: true });
for (const [path, html] of files) { mkdirSync(dirname(join(out, path)), { recursive: true }); writeFileSync(join(out, path), html); }
writeFileSync(join(out, 'style.css'), css.trim());
writeFileSync(join(out, 'app.js'), js.trim());
writeFileSync(join(out, 'favicon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#1864ab"/><circle cx="12" cy="16" r="5" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M17 16h9m-3 0v4" stroke="#fff" stroke-width="2.5" fill="none"/></svg>');
writeFileSync(join(out, '.nojekyll'), '');
cpSync(join(root, 'content', 'img'), join(out, 'img'), { recursive: true });
cpSync(join(root, 'content', 'og'), join(out, 'og'), { recursive: true });
const urls = ['', 'sozluk/', 'hakkinda/', ...data.tracks.map((t) => `${t.slug}/`), ...topics.map((t) => t.path)];
writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${abs(u)}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${abs('sitemap.xml')}\n`);
writeFileSync(join(out, 'llms.txt'), `# ${SITE}\n\n> ${SITE_DESC}\n\n${data.tracks.map((track) => `## ${track.name}\n\n${topics.filter((t) => t.track === track).map((t) => `- [${t.code} · ${t.title}](${abs(t.path)}): ${t.description || `${t.pages.length} sayfa`}`).join('\n')}`).join('\n\n')}\n`);
// The repository README: what this is and every topic with its link.
writeFileSync(join(root, 'README.md'), `# ${SITE}

${SITE_DESC}

**Site:** ${abs()}

Her konu kısa sayfalara bölünmüştür: her sayfada bir fikir, bir çizim ve altında birkaç madde. ${topics.length} konu, ${pageCount} sayfa.

${data.tracks.map((track) => `## ${track.name}\n\n${track.description}\n\n${track.sections.map((sec) => `### ${sec.title}\n\n${sec.topics.map((t) => `- [${t.code} · ${t.title}](${abs(`${track.slug}/${t.slug}/`)})${t.description ? `: ${t.description}` : ''}`).join('\n')}`).join('\n\n')}`).join('\n\n')}

## Yapı

- \`content/\`: görseller (\`img/\`), sosyal önizlemeler (\`og/\`), konu ve sayfa verisi (\`data.json\`), sözlük (\`sozluk.md\`)
- \`build.mjs\`: siteyi \`_site/\` altına üretir (\`node build.mjs\`, bağımlılık yok); GitHub Actions her push'ta GitHub Pages'e yayınlar

## Lisans

İçerik (görseller ve metinler) [CC BY 4.0](LICENSE): kaynak göstererek kullanabilirsin. Kod [MIT](LICENSE-CODE).
`);
console.log(`${files.size} HTML files, ${topics.length} topics, ${pageCount} pages → ${out}`);
