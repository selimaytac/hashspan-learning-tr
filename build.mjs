// Builds the static site into _site/ from content/ and assets/: a roadmap of every topic, one HTML page per topic
// (all of its pages, drawings and notes, readable without JavaScript), a glossary, sitemap.xml, robots.txt, llms.txt
// and the repository README.
// Run: node build.mjs   (BASE_URL sets the absolute address used in canonical links and the sitemap)
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, '_site');
const BASE = (process.env.BASE_URL ?? 'https://selimaytac.github.io/hashspan-learning-tr').replace(/\/$/, '');
const PATH = new URL(`${BASE}/`).pathname;
const SITE = 'Görsel Kripto';
const HASHSPAN = 'https://github.com/selimaytac/hashspan';
const SITE_DESC = 'Cüzdanlar, imzalar, custody, konsensüs ve on-chain gözlemlenebilirlik: her sayfada bir fikir, bir çizim. Türkçe ve ücretsiz.';
const LICENSE = 'https://creativecommons.org/licenses/by/4.0/deed.tr';
const REPO = 'https://github.com/selimaytac/hashspan-learning-tr';
const FONTS = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&family=Patrick+Hand&display=swap';
// Topics of the crypto track that the hashspan track builds on.
const PREREQ = ['k1-anahtar-adres-imza', 'k2-hesap-modelleri', 'k6-smart-account', 'k8-imza-ile-giris', 'k9-onaylar-tuzaklar'];

const VER = createHash('sha256').update(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'assets', 'style.css'))).update(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'assets', 'app.js'))).digest('hex').slice(0, 10);
const data = JSON.parse(readFileSync(join(root, 'content', 'data.json'), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = (p = '') => `${PATH}${p}`;
const abs = (p = '') => `${BASE}/${p}`;
const lower = (s) => s.toLocaleLowerCase('tr');

const topics = [];
for (const track of data.tracks) {
  for (const section of track.sections) {
    for (const topic of section.topics) topics.push({ ...topic, track, section, path: `${track.slug}/${topic.slug}/` });
  }
}
topics.forEach((t, i) => { t.prev = topics[i - 1]; t.next = topics[i + 1]; });
const pageCount = topics.reduce((n, t) => n + t.pages.length, 0);
const noteCount = topics.reduce((n, t) => n + t.pages.reduce((m, p) => m + p.notes.length, 0), 0);
const minutes = (t) => Math.max(3, Math.round(t.pages.length * 1.5));
const pdfLink = (file) => url(`pdf/${file}.pdf`);
const findText = (t) => lower([t.code, t.title, t.description, ...t.pages.flatMap((p) => [p.title, ...p.notes, p.text])].join(' '));

const logo = `<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><rect x="1.5" y="1.5" width="31" height="31" rx="8" fill="#ffec99" stroke="#1e1e1e" stroke-width="2"/><circle cx="12" cy="17" r="5" fill="#fff" stroke="#1e1e1e" stroke-width="2"/><path d="M17 17h10M23.5 17v4.5M27 17v3" stroke="#1e1e1e" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`;
const searchIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>';

const layout = ({ title, description, path, image, body, jsonld = [], type = 'website', nav = '', bodyClass = '' }) => `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<link rel="canonical" href="${abs(path)}"><link rel="license" href="${LICENSE}">
<meta property="og:type" content="${type}"><meta property="og:locale" content="tr_TR"><meta property="og:site_name" content="${esc(SITE)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${abs(path)}">
${image ? `<meta property="og:image" content="${abs(image)}"><meta name="twitter:card" content="summary_large_image">` : ''}
<meta name="theme-color" content="#fbfaf6"><meta name="color-scheme" content="light dark"><link rel="icon" href="${url('favicon.svg')}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}"><link rel="stylesheet" href="${url(`style.css?v=${VER}`)}">
<script>try{var t=JSON.parse(localStorage.getItem('gk-theme'));if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head><body${bodyClass ? ` class="${bodyClass}"` : ''}>
<header class="top"><div class="wrap"><a class="brand" href="${url()}">${logo}<span><b>${SITE}</b></span></a>
<a class="sponsor" href="${HASHSPAN}" target="_blank" rel="noopener" title="hashspan'a GitHub'da yıldız ver">★ <span>#hashspan</span><em> sponsorluğunda</em></a>
<nav aria-label="Site"><a href="${url()}"${nav === 'map' ? ' aria-current="page"' : ''}>Harita</a><a href="${url('sozluk/')}"${nav === 'gloss' ? ' aria-current="page"' : ''}>Sözlük</a><a class="wide" href="${url('kaydedilenler/')}"${nav === 'saved' ? ' aria-current="page"' : ''}>Kaydedilenler</a><a class="wide" href="${url('hakkinda/')}"${nav === 'about' ? ' aria-current="page"' : ''}>Hakkında</a><button class="theme" id="theme" type="button" aria-label="Açık ya da koyu tema">◐</button></nav></div>
<div class="meter"><i></i></div></header>
<main>${body}</main>
<footer><div class="wrap"><span>İçerik <a href="${LICENSE}" rel="license">CC BY 4.0</a> · kod MIT</span><a href="${url('kaydedilenler/')}">Kaydedilenler</a><a href="${url('hakkinda/')}">Hakkında</a><a href="${REPO}">GitHub</a><a href="${HASHSPAN}">★ hashspan'a yıldız ver</a><span>İlerlemen sadece bu tarayıcıda tutulur.</span></div></footer>
<script src="${url(`app.js?v=${VER}`)}" defer></script>
</body></html>
`;

const files = new Map();
const put = (path, html) => files.set(path, html);

// One section of a track as a roadmap module: tabs, title, a chain of topic nodes with handwritten margin notes.
const moduleHtml = (track, sec) => {
  const pages = sec.topics.reduce((n, t) => n + t.pages.length, 0);
  return `<section class="module" id="${track.slug}-${lower(sec.title).replace(/[^a-z0-9çğıöşü]+/g, '-').replace(/^-|-$/g, '')}">
<span class="tab l">${esc(track.name)}</span><span class="tab r">${sec.topics.length} konu · ${pages} sayfa</span>
<h3>${esc(sec.title)}</h3>
<ol class="chain">${sec.topics.map((t, k) => {
    const notes = t.pages.slice(0, 4).map((p) => `<li>- ${esc(p.title)}</li>`).join('') + (t.pages.length > 4 ? '<li>- …</li>' : '');
    return `<li data-pages="${t.pages.map((p) => p.id).join(' ')}" data-find="${esc(findText(t))}">
<ul class="ann"${k % 2 ? ' hidden' : ''}>${notes}</ul>
<a class="node" href="${url(`${track.slug}/${t.slug}/`)}"><b>${esc(t.code)}</b>${esc(t.title)}<small>${t.pages.length} sayfa · ${minutes(t)} dk</small></a>
<ul class="ann side"${k % 2 ? '' : ' hidden'}>${notes}</ul>
</li>`;
  }).join('\n')}</ol></section>`;
};

const roadmap = (track) => {
  const prereq = track.slug === 'hashspan'
    ? `<div class="prereq"><h3>Ön koşullar</h3><p>Anahtar, imza ve hesap kavramlarını bilmiyorsan önce bunlara bak:</p><ul>${PREREQ.map((slug) => topics.find((t) => t.slug === slug)).filter(Boolean).map((t) => `<li><a class="chip" href="${url(t.path)}">${esc(t.code)} · ${esc(t.title)}</a></li>`).join('')}</ul></div><div class="connector"><span>sonra</span></div>`
    : '';
  return `<div class="flow">${prereq}${track.sections.map((sec) => moduleHtml(track, sec)).join('<div class="connector"><span>sonra</span></div>')}</div>`;
};

const trackBlock = (track) => `<section class="track" id="${track.slug}" data-track="${track.slug}"><div class="track-head"><h2><a href="${url(`${track.slug}/`)}">${esc(track.name)}</a></h2><p>${esc(track.description)}</p><a class="chip dl" href="${pdfLink(`${track.slug}-tamami`)}" download>⤓ Tamamı PDF</a></div>
<nav class="pager" aria-label="${esc(track.name)} bölümleri"><button class="btn sq" type="button" data-step="-1" aria-label="Önceki bölüm">←</button><ol>${track.sections.map((sec, k) => `<li><button class="chip" type="button" data-go="${k}" title="${esc(sec.title)}">${esc(sec.title.split(' · ')[0])}</button></li>`).join('')}</ol><button class="btn sq" type="button" data-step="1" aria-label="Sonraki bölüm">→</button><span class="pager-name"></span></nav>
${roadmap(track)}
<div class="pager-foot"><button class="btn" type="button" data-step="-1">← Önceki bölüm</button><button class="btn go" type="button" data-step="1">Sonraki bölüm →</button></div></section>`;
const trackTabs = `<div class="tracktabs" role="tablist">${data.tracks.map((t) => `<button type="button" role="tab" data-track="${t.slug}"><b>${esc(t.name)}</b><small>${topics.filter((x) => x.track === t).length} konu</small></button>`).join('')}</div>
<p class="dlrow">${data.tracks.map((t) => `<a class="chip dl" href="${pdfLink(`${t.slug}-tamami`)}" download>⤓ ${esc(t.name)} · PDF</a>`).join('')}<span class="hand">Paylaş, dağıt: her sayfada sitenin adresi var.</span></p>`;

const legend = `<ul class="legend" aria-label="Renkler"><li class="chip">başlanmadı</li><li class="chip y">yarım</li><li class="chip g">bitti</li><li class="chip b">sıradaki</li></ul>`;
const searchBox = (ph) => `<label class="search">${searchIcon}<input id="q" type="search" placeholder="${ph}" aria-label="Ara"></label>`;

// Home.
const first = topics[0];
const heroPage = topics.flatMap((t) => t.pages).find((p) => p.id === 'k1-05-adres') ?? first.pages[0];
const hero = `<div class="wrap"><section class="hero">
<div><span class="eyebrow">Türkçe · ücretsiz · açık kaynak</span>
<h1>Kriptoyu <em>çizerek</em> öğren.</h1>
<p>Anahtardan konsensüse, cüzdandan custody'ye; sonra AI agent'ların zincirdeki işlemlerini OpenTelemetry ile izlemek. Her sayfada tek fikir ve bir çizim.</p>
<ul class="stats"><li><b>${topics.length}</b>konu</li><li><b>${pageCount}</b>çizim</li><li><b>${noteCount}</b>not</li></ul>
<div class="actions"><a class="btn go" href="${url(first.path)}">Baştan başla: ${esc(first.code)} →</a><a class="btn" id="resume" href="#" hidden>Devam et: <span></span></a></div></div>
<div class="sticker"><img src="${url(`img/${heroPage.id}.webp`)}" width="${heroPage.w}" height="${heroPage.h}" alt="Public key'den Ethereum adresine: keccak256 ve son 20 byte"><span class="hand">her sayfa böyle bir çizim ↘</span></div>
</section>
<div class="toolbar">${searchBox('Ara: imza, MPC, span, finality…')}${legend}</div>
${trackTabs}
${data.tracks.map(trackBlock).join('\n')}
</div>`;
put('index.html', layout({
  title: `${SITE}: çizimlerle kripto ve on-chain gözlemlenebilirlik`, description: SITE_DESC, path: '', body: hero, nav: 'map', image: `og/kripto-${first.slug}.jpg`,
  jsonld: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE, url: abs(), inLanguage: 'tr', description: SITE_DESC }],
}));

// Track pages.
for (const track of data.tracks) {
  const tt = topics.filter((t) => t.track === track);
  put(`${track.slug}/index.html`, layout({
    title: `${track.name} | ${SITE}`, description: track.description, path: `${track.slug}/`, nav: 'map',
    body: `<div class="wrap"><p class="crumbs"><a href="${url()}">Harita</a> / ${esc(track.name)}</p><div class="toolbar">${searchBox(`${track.name} içinde ara…`)}${legend}</div>${trackBlock(track)}</div>`,
    jsonld: [{ '@context': 'https://schema.org', '@type': 'Course', name: track.name, description: track.description, inLanguage: 'tr', url: abs(`${track.slug}/`), license: LICENSE, isAccessibleForFree: true, provider: { '@type': 'Organization', name: SITE, url: abs() }, hasPart: tt.map((t) => ({ '@type': 'LearningResource', name: `${t.code} · ${t.title}`, url: abs(t.path) })) }],
  }));
}

// Glossary: content/sozluk.md tables become term cards, each linked to the topics that use the term.
const md = readFileSync(join(root, 'content', 'sozluk.md'), 'utf8');
const inline = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
const terms = [];
let cat = '';
for (const line of md.split('\n')) {
  if (line.startsWith('## ')) { cat = line.slice(3).trim(); continue; }
  if (!line.startsWith('|') || /^\|\s*-/.test(line) || /^\|\s*Terim\s*\|/.test(line)) continue;
  const [term, what, why] = line.slice(1, -1).split('|').map((c) => c.trim());
  if (term) terms.push({ term, what, why, cat });
}
const slug = (x) => lower(x.replace(/`/g, '')).replace(/[^a-z0-9çğıöşü]+/g, '-').replace(/^-|-$/g, '');
// Glossary words found in page notes link to their card: the first word of each term, or each name before " / ".
const linkKeys = terms.flatMap((x) => x.term.replace(/`/g, '').split(/\s*\/\s*/).map((k) => k.replace(/\s*\(.*\)$/, '').trim())
  .filter((k) => k.length >= 3 && !/^(Adres|Konsensüs|Validator)$/.test(k)).map((k) => ({ k, x })));
linkKeys.sort((a, b) => b.k.length - a.k.length);
const reEsc = (k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const glossRe = new RegExp(`(^|[^\\p{L}\\p{N}_])(${linkKeys.map(({ k }) => reEsc(k)).join('|')})(?=$|[^\\p{L}\\p{N}_])`, 'giu');
const linkNotes = (notes) => {
  const used = new Set();
  return notes.map((n) => esc(n).replace(glossRe, (m, pre, word) => {
    const hit = linkKeys.find(({ k }) => lower(k) === lower(word));
    if (!hit || used.has(hit.x.term)) return m;
    used.add(hit.x.term);
    return `${pre}<a class="gl" href="${url(`sozluk/#${slug(hit.x.term)}`)}" title="${esc(hit.x.what)}">${word}</a>`;
  }));
};

// Topic pages.
const arrowL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
const arrowR = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';
for (const t of topics) {
  const name = `${t.code} · ${t.title}`;
  const description = t.description || `${t.title}: ${t.pages.length} sayfalık görsel anlatım.`;
  const og = `og/${t.track.slug}-${t.slug}.jpg`;
  const pre = t.track.slug === 'hashspan' && t === topics.find((x) => x.track === t.track)
    ? PREREQ.map((slug) => topics.find((x) => x.slug === slug)).filter(Boolean) : (t.prev && t.prev.track === t.track ? [t.prev] : []);
  const body = `<div class="wrap">
<p class="crumbs"><a href="${url()}">Harita</a> / <a href="${url(`${t.track.slug}/`)}">${esc(t.track.name)}</a> / ${esc(t.section.title)}</p>
<header class="topic-head"><h1><span>${esc(t.code)}</span>${esc(t.title)}</h1><p>${esc(description)}</p>
<ul class="meta"><li><a class="chip dl" href="${pdfLink(`${t.track.slug}-${t.slug}`)}" download>⤓ PDF</a></li><li class="chip">${t.pages.length} çizim</li><li class="chip">~${minutes(t)} dk</li>${pre.length ? `<li class="chip p">Önce: ${pre.map((x) => `<a href="${url(x.path)}">${esc(x.code)}</a>`).join(', ')}</li>` : ''}</ul></header>
<div class="reader${t.pages.length === 1 ? ' single' : ''}">
<aside class="toc" aria-label="Sayfalar"><span class="eyebrow">${esc(t.code)} · ${t.pages.length} sayfa</span><ol>${t.pages.map((p, k) => `<li><a href="#s${k + 1}">${esc(p.title)}</a></li>`).join('')}</ol></aside>
<article>
${t.pages.map((p, k) => `<section class="pg${p.h > p.w ? ' portrait' : ''}" id="s${k + 1}" data-id="${p.id}">
<figure class="shot${p.h > p.w ? '' : ' wide'}"><img src="${url(`img/${p.id}.webp`)}" width="${p.w}" height="${p.h}" style="aspect-ratio:${p.w}/${p.h}" alt="${esc(`${p.title}: ${p.text}`.slice(0, 480))}"${k ? ' loading="lazy"' : ''} decoding="async">${p.h > p.w ? '' : '<figcaption class="zoomhint">Büyütmek için dokun ⤢</figcaption>'}</figure>
<div class="notes"><div class="notes-top"><small>${esc(t.code)}.${k + 1} / ${t.pages.length}</small><button class="save" type="button" data-save="${p.id}" aria-pressed="false">☆ Kaydet</button></div><h2>${esc(p.title)}</h2>
${p.notes.length ? `<ul>${linkNotes(p.notes).map((n) => `<li>${n}</li>`).join('')}</ul>` : ''}
${p.text ? `<details><summary>Çizimdeki yazılar</summary><p>${esc(p.text)}</p></details>` : ''}</div>
</section>`).join('\n')}
${t.quiz?.length ? `<section class="quiz" aria-label="Kendini dene"><span class="eyebrow">Kendini dene · ${t.quiz.length} soru</span>${t.quiz.map((qz, n) => `<div class="qz" data-answer="${qz.answer}"><p class="qz-q">${esc(qz.q)}</p><ol class="qz-opts">${qz.options.map((o, m) => `<li><button class="qz-o" type="button" data-i="${m}">${esc(o)}</button></li>`).join('')}</ol><p class="qz-why" hidden>${esc(qz.why)}</p></div>`).join('')}</section>` : ''}
<section class="endcard"><span class="eyebrow">Konu bitti</span><h2>${t.next ? `Sırada: ${esc(`${t.next.code} · ${t.next.title}`)}` : 'Son konuya geldin'}</h2>
${t.next?.description ? `<p>${esc(t.next.description)}</p>` : ''}
<div class="row">${t.next ? `<a class="btn go" id="nt" href="${url(t.next.path)}">Sonraki konu →</a>` : ''}<a class="btn" href="${url(`#${t.track.slug}`)}">Haritaya dön</a><a class="btn" href="${pdfLink(`${t.track.slug}-${t.slug}`)}" download>⤓ Bu konunun PDF'i</a>${t.prev ? `<a class="btn" href="${url(t.prev.path)}">← ${esc(t.prev.code)}</a>` : ''}</div></section>
</article></div></div>
<nav class="dock" aria-label="Sayfa gezinme"><div class="in">
<button class="btn" id="prev" type="button">${arrowL}<span>Geri</span><kbd>←</kbd></button>
<button class="btn sheet-btn" id="sheet" type="button" aria-label="Sayfa listesi">☰</button>
<span class="count" id="count">1 / ${t.pages.length}</span><span class="dots">${t.pages.map(() => '<i></i>').join('')}</span>
<span class="spacer"></span><button class="btn mode" id="mode" type="button">Hepsi</button>
<button class="btn go" id="next" type="button"><span>İleri</span>${arrowR}<kbd>→</kbd></button></div></nav>
<div class="lightbox" role="dialog" aria-label="Büyük görünüm"><button class="btn" type="button">Kapat ✕</button><img alt=""></div>`;
  put(`${t.path}index.html`, layout({
    title: `${name} | ${SITE}`, description, path: t.path, image: og, body, type: 'article', bodyClass: 'topic',
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'LearningResource', name, description, inLanguage: 'tr', url: abs(t.path), image: abs(og), license: LICENSE, isAccessibleForFree: true, learningResourceType: 'Infographic', isPartOf: { '@type': 'Course', name: t.track.name, url: abs(`${t.track.slug}/`) }, timeRequired: `PT${minutes(t)}M` },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Harita', item: abs() }, { '@type': 'ListItem', position: 2, name: t.track.name, item: abs(`${t.track.slug}/`) }, { '@type': 'ListItem', position: 3, name, item: abs(t.path) }] },
    ],
  }));
}

const index = topics.map((t) => ({ t, text: findText(t) }));
const usedIn = (term) => {
  const keys = term.replace(/`/g, '').split(/\s*\/\s*|\s*\(/).map((k) => lower(k.replace(/\)$/, '').trim())).filter((k) => k.length > 2);
  const res = keys.map((k) => new RegExp(`(^|[^\\p{L}\\p{N}_])${reEsc(k)}(?=$|[^\\p{L}\\p{N}_])`, 'u'));
  return index.filter(({ text }) => res.some((r) => r.test(text))).slice(0, 4).map(({ t }) => t);
};
const cats = [...new Set(terms.map((x) => x.cat))];
put('sozluk/index.html', layout({
  title: `Sözlük | ${SITE}`, description: 'Kripto, blockchain, OpenTelemetry ve hashspan terimleri: her terim tek cümle, geçtiği konulara bağlantıyla.', path: 'sozluk/', nav: 'gloss',
  body: `<div class="wrap"><header class="gloss-head"><span class="eyebrow">${terms.length} terim</span><h1>Sözlük</h1><p class="hand" style="font-size:21px;color:var(--ink-2);margin:0">Her terim tek cümle. Ayrıntı, terimin geçtiği konularda.</p></header>
<div class="toolbar">${searchBox('Terim ara: nonce, span, receipt…')}<ul class="cats"><li><button class="chip fav-filter" type="button" data-cat="★" aria-pressed="false">★ Favorilerim <span id="favn">0</span></button></li>${cats.map((c) => `<li><button class="chip" type="button" data-cat="${esc(c)}" aria-pressed="false">${esc(c)} <span>${terms.filter((x) => x.cat === c).length}</span></button></li>`).join('')}</ul></div>
<p class="result" id="result" aria-live="polite"></p>
<div class="terms">${terms.map((x) => {
    const used = usedIn(x.term);
    return `<article class="term" id="${slug(x.term)}" data-cat="${esc(x.cat)}" data-term="${esc(x.term)}" data-find="${esc(lower(`${x.term} ${x.what} ${x.why}`))}"><div class="term-top"><span class="cat">${esc(x.cat)}</span><button class="fav" type="button" aria-pressed="false" aria-label="Favorilere ekle: ${esc(x.term.replace(/`/g, ''))}">☆</button></div><h3>${inline(x.term)}</h3><p>${inline(x.what)}</p>${x.why ? `<p class="why">${inline(x.why)}</p>` : ''}${used.length ? `<ul>${used.map((t) => `<li><a class="chip" href="${url(t.path)}" title="${esc(`${t.code} · ${t.title}`)}">${esc(t.track.slug === 'hashspan' ? `hashspan ${t.code}` : t.code)}</a></li>`).join('')}</ul>` : ''}</article>`;
  }).join('\n')}</div><nav class="gpager" aria-label="Sözlük sayfaları"></nav></div>`,
}));

const savedIndex = Object.fromEntries(topics.flatMap((t) => t.pages.map((p, k) => [p.id, { title: p.title, topic: `${t.code} · ${t.title}`, href: url(`${t.path}#s${k + 1}`), img: url(`img/${p.id}.webp`) }])));
put('kaydedilenler/index.html', layout({
  title: `Kaydedilenler | ${SITE}`, description: 'Tekrar bakmak için kaydettiğin sayfalar ve sözlük favorilerin.', path: 'kaydedilenler/', nav: 'saved',
  body: `<div class="wrap"><header class="gloss-head"><span class="eyebrow">Sadece bu tarayıcıda</span><h1>Kaydedilenler</h1><p class="hand" style="font-size:21px;color:var(--ink-2);margin:0">Bir sayfadaki ☆ Kaydet düğmesiyle buraya eklenir.</p></header>
<div class="saved-grid" id="saved"></div><p class="result" id="saved-empty" hidden>Henüz kaydedilen sayfa yok. Bir konuda, notların üstündeki ☆ Kaydet düğmesine dokun.</p>
<script type="application/json" id="saved-index">${JSON.stringify(savedIndex).replace(/</g, '\\u003c')}</script></div>`,
}));
put('hakkinda/index.html', layout({
  title: `Hakkında | ${SITE}`, description: SITE_DESC, path: 'hakkinda/', nav: 'about',
  body: `<div class="wrap prose"><span class="eyebrow">Hakkında</span><h1>Az yazı, çok çizim</h1>
<p>Her konu kısa sayfalara bölünür: her sayfada bir fikir, bir çizim ve altında birkaç not. Konular haritada sırayla dizilidir; önceki konular sonrakilerin temelidir.</p>
<p>Örneklerdeki adres, hash ve imzalar gerçekten hesaplanmıştır. Anahtarlar Anvil'in herkesçe bilinen test anahtarlarıdır, gerçek para için asla kullanılmamalıdır.</p>
<p>hashspan bölümü, AI agent'ların zincire gönderdiği işlemleri OpenTelemetry ile izleyen açık kaynak <a href="https://github.com/selimaytac/hashspan">hashspan</a> kütüphanesini anlatır.</p>
<p>İlerlemen sadece bu tarayıcıda tutulur; hesap, çerez ya da takip yoktur.</p>
<p>İçerik <a href="${LICENSE}" rel="license">CC BY 4.0</a> ile paylaşılır: kaynak göstererek kullanabilirsin. Kaynak kod ve içerik: <a href="${REPO}">${REPO.replace('https://', '')}</a>.</p></div>`,
}));
put('404.html', layout({ title: `Bulunamadı | ${SITE}`, description: SITE_DESC, path: '404.html', body: `<div class="wrap prose"><h1>Bu sayfa yok</h1><p><a class="btn go" href="${url()}">Haritaya dön</a></p></div>` }));

// Printable pages: one per topic and one per track, turned into PDFs by pdf.mjs. Every sheet carries the site's
// address and the sponsor mark, so a shared PDF still leads back to the site.
const MARK = readFileSync(join(root, 'content', 'brand', 'hashspan-mark.svg'), 'utf8');
const printCss = `@page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0;background:#fff;color:#1e1e1e;font:10.5pt/1.45 "IBM Plex Sans",system-ui,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.sheet{width:210mm;height:297mm;padding:10mm 13mm 9mm;display:flex;flex-direction:column;page-break-after:always;overflow:hidden}
.sheet:last-child{page-break-after:auto}
.ph{display:flex;align-items:center;gap:3mm;border-bottom:.5mm solid #1e1e1e;padding-bottom:2.5mm;font:600 9pt/1.2 "JetBrains Mono",monospace}
.ph svg{width:8mm;height:8mm;flex:none}.ph .t{flex:1;min-width:0}.ph .t small{display:block;font-weight:400;color:#5c5f66}
.ph .sp{display:flex;align-items:center;gap:1.5mm;font-weight:500;color:#464953;white-space:nowrap}.ph .sp svg{width:6mm;height:6mm}
.body{flex:1;min-height:0;display:flex;flex-direction:column;gap:4mm;padding-top:5mm}
.fig{flex:1;min-height:0;display:flex;justify-content:center}.fig img{max-height:100%;max-width:100%;object-fit:contain;border:.4mm solid #1e1e1e;border-radius:3mm}
h2{font:700 13pt/1.25 "JetBrains Mono",monospace;margin:0}h2 small{font-weight:500;color:#6f737c;margin-right:2mm}
ul{margin:0;padding-left:5mm}li{margin:0 0 1.2mm}
.pf{display:flex;justify-content:space-between;gap:4mm;border-top:.3mm dashed #b9b4a6;padding-top:2.5mm;font:500 8pt/1.3 "JetBrains Mono",monospace;color:#5c5f66}
.pf b{color:#1e1e1e}
.cover .body{justify-content:center;gap:8mm}.cover h1{font:700 26pt/1.15 "JetBrains Mono",monospace;margin:0}.cover p{font-size:12.5pt;color:#464953;margin:0;max-width:150mm}
.cover .big{display:flex;align-items:center;gap:4mm;font:600 12pt/1.3 "JetBrains Mono",monospace}.cover .big svg{width:14mm;height:14mm}
.toc{columns:2;column-gap:10mm;font-size:9.5pt}.toc div{break-inside:avoid;margin-bottom:1.2mm}
.q{border:.4mm dashed #1e1e1e;border-radius:3mm;padding:4mm 5mm;margin-bottom:4mm;break-inside:avoid}.q p{margin:0 0 2mm;font-weight:600}
.q ol{margin:0;padding-left:6mm}.q .ans{margin-top:2mm;font-size:9.5pt;color:#2b8a3e}`;
const sheetHead = (left, sub) => `<header class="ph">${logo}<span class="t">${esc(left)}<small>${esc(sub)}</small></span><span class="sp">${MARK}#hashspan sponsorluğunda</span></header>`;
const sheetFoot = (path, n, total) => `<footer class="pf"><span><a href="${abs(path)}" style="color:inherit;text-decoration:none"><b>${esc(abs(path).replace(/^https?:\/\//, ''))}</b></a></span><span>CC BY 4.0 · ${n}/${total}</span></footer>`;
function printDoc(title, items, path) {
  // items: topics in order. A cover, then one sheet per drawing, then the topic's questions with answers.
  const sheets = [];
  const cover = items.length > 1;
  if (cover) {
    sheets.push({ cls: 'cover', html: (n, total) => `${sheetHead(SITE, title)}<div class="body"><span class="big">${logo}${esc(SITE)}</span><h1>${esc(title)}</h1><p>${esc(SITE_DESC)}</p>
<div class="toc">${items.map((t) => `<div><b>${esc(t.code)}</b> ${esc(t.title)} <span style="color:#6f737c">· ${t.pages.length} sayfa</span></div>`).join('')}</div>
<p class="big">${MARK}<span>#hashspan sponsorluğunda · github.com/selimaytac/hashspan</span></p></div>${sheetFoot(path, n, total)}` });
  }
  for (const t of items) {
    t.pages.forEach((p, k) => sheets.push({ html: (n, total) => `${sheetHead(`${t.code} · ${t.title}`, `${t.track.name} · ${t.section.title}`)}
<div class="body"><div class="fig"><img src="../print/${p.id}.jpg" alt=""></div><h2><small>${esc(t.code)}.${k + 1}/${t.pages.length}</small>${esc(p.title)}</h2>
${p.notes.length ? `<ul>${p.notes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>${sheetFoot(t.path, n, total)}` }));
    if (t.quiz?.length) {
      sheets.push({ html: (n, total) => `${sheetHead(`${t.code} · ${t.title}`, 'Kendini dene')}<div class="body"><h2>Kendini dene</h2>
${t.quiz.map((q) => `<div class="q"><p>${esc(q.q)}</p><ol type="a">${q.options.map((o) => `<li>${esc(o)}</li>`).join('')}</ol><div class="ans">Cevap: ${'abc'[q.answer]}) ${esc(q.why)}</div></div>`).join('')}
${t.next ? `<p>Sıradaki konu: <b>${esc(`${t.next.code} · ${t.next.title}`)}</b>, ${esc(abs(t.next.path).replace(/^https?:\/\//, ''))}</p>` : ''}</div>${sheetFoot(t.path, n, total)}` });
    }
  }
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${esc(title)} | ${SITE}</title><link rel="stylesheet" href="${FONTS}"><style>${printCss}</style></head><body>
${sheets.map((sh, i) => `<section class="sheet ${sh.cls ?? ''}">${sh.html(i + 1, sheets.length)}</section>`).join('\n')}</body></html>`;
}
const prints = [];
for (const t of topics) prints.push({ file: `${t.track.slug}-${t.slug}`, html: printDoc(`${t.code} · ${t.title}`, [t], t.path) });
for (const track of data.tracks) prints.push({ file: `${track.slug}-tamami`, html: printDoc(track.name, topics.filter((t) => t.track === track), `${track.slug}/`) });
const pdfHref = (file) => url(`pdf/${file}.pdf`);

rmSync(out, { recursive: true, force: true });
for (const [path, html] of files) { mkdirSync(dirname(join(out, path)), { recursive: true }); writeFileSync(join(out, path), html); }
cpSync(join(root, 'assets', 'style.css'), join(out, 'style.css'));
cpSync(join(root, 'assets', 'app.js'), join(out, 'app.js'));
writeFileSync(join(out, 'favicon.svg'), logo.replace('width="34" height="34" ', 'xmlns="http://www.w3.org/2000/svg" ').replace(' aria-hidden="true"', ''));
writeFileSync(join(out, '.nojekyll'), '');
cpSync(join(root, 'content', 'img'), join(out, 'img'), { recursive: true });
cpSync(join(root, 'content', 'og'), join(out, 'og'), { recursive: true });
cpSync(join(root, 'content', 'print'), join(out, 'print'), { recursive: true });
mkdirSync(join(out, 'print-html'), { recursive: true });
for (const p of prints) writeFileSync(join(out, 'print-html', `${p.file}.html`), p.html);
writeFileSync(join(out, 'print-html', 'list.json'), JSON.stringify(prints.map((p) => p.file)));
const urls = ['', 'sozluk/', 'hakkinda/', 'kaydedilenler/', ...data.tracks.map((t) => `${t.slug}/`), ...topics.map((t) => t.path)];
writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${abs(u)}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${abs('sitemap.xml')}\n`);
writeFileSync(join(out, 'llms.txt'), `# ${SITE}\n\n> ${SITE_DESC}\n\n${data.tracks.map((track) => `## ${track.name}\n\n${topics.filter((t) => t.track === track).map((t) => `- [${t.code} · ${t.title}](${abs(t.path)}): ${t.description || `${t.pages.length} sayfa`}`).join('\n')}`).join('\n\n')}\n`);

writeFileSync(join(root, 'README.md'), `# ${SITE}

${SITE_DESC}

**Site:** ${abs()}

${topics.length} konu, ${pageCount} çizim, ${noteCount} not. Her konu kısa sayfalara bölünmüştür: her sayfada bir fikir, bir çizim ve altında birkaç not.

${data.tracks.map((track) => `## ${track.name}\n\n${track.description}\n\n${track.sections.map((sec) => `### ${sec.title}\n\n${sec.topics.map((t) => `- [${t.code} · ${t.title}](${abs(`${track.slug}/${t.slug}/`)})${t.description ? `: ${t.description}` : ''}`).join('\n')}`).join('\n\n')}`).join('\n\n')}

## Yapı

- \`content/\`: çizimler (\`img/\`), sosyal önizlemeler (\`og/\`), konu ve sayfa verisi (\`data.json\`), sözlük (\`sozluk.md\`)
- \`assets/\`: sitenin stili ve davranışı
- \`build.mjs\`: siteyi \`_site/\` altına üretir (\`node build.mjs\`, bağımlılık yok); GitHub Actions her push'ta GitHub Pages'e yayınlar

## Lisans

İçerik (çizimler ve metinler) [CC BY 4.0](LICENSE): kaynak göstererek kullanabilirsin. Kod [MIT](LICENSE-CODE).
`);
console.log(`${files.size} HTML files, ${topics.length} topics, ${pageCount} pages, ${terms.length} terms → ${out}`);
