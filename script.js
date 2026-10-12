/* =====================================================================
   CONFIG — edit the invitation content here.
   Each event becomes one page of the card. Pages turn with a page curl.

   illustration: optional image for the bottom of the card (e.g. the
                 Haldi illustration exported from Figma as a transparent PNG).
                 If the file is missing, a drawn placeholder is shown.
   address:      shown in the venue box under the card.
   mapQuery:     searched in Google Maps when the address is tapped;
                 or set mapUrl to an exact "Share → Copy link" pin from Google Maps.
   cardImage:    optional full-card image (an export of the whole
                 "iPhone 16 - 1" card). When set, it replaces the HTML page.
   ===================================================================== */
const CONFIG = {
  monogram: 'S',
  events: [
    {
      theme: 'haldi',
      kicker: 'Please join us for a',
      title: 'Haldi',
      subtitle: 'Ceremony',
      blessing: 'Haldi ke rang, apno ke sang — come shower us with turmeric, laughter and love.',
      day: 'Thursday', month: 'May', date: '16', year: '2024', time: '11:00 AM',
      venue: 'The Grand Taj', city: 'Jaipur',
      address: 'Add the street address, Jaipur, Rajasthan',
      mapQuery: 'The Grand Taj, Jaipur', // what Google Maps searches for (or set mapUrl to a shared pin link)
      closing: 'Let’s get yellow & mellow',
      illustration: 'assets/haldi.png',
      cardImage: null,
    },
    {
      theme: 'mehendi',
      kicker: 'Please join us for the',
      title: 'Mehendi',
      subtitle: 'Evening',
      blessing: 'An evening of henna, music and dance as we colour our hands with love.',
      day: 'Thursday', month: 'May', date: '16', year: '2024', time: '5:00 PM',
      venue: 'The Grand Taj', city: 'Jaipur',
      address: 'Add the street address, Jaipur, Rajasthan',
      mapQuery: 'The Grand Taj, Jaipur', // what Google Maps searches for (or set mapUrl to a shared pin link)
      closing: 'Come dressed in green',
      illustration: 'assets/mehendi.png',
      cardImage: null,
    },
    {
      theme: 'wedding',
      kicker: 'Please join us for the',
      title: 'Shubh Vivah',
      subtitle: 'Wedding',
      blessing: 'We request the honour of your presence as we begin our forever together.',
      day: 'Friday', month: 'May', date: '17', year: '2024', time: '7:00 PM',
      venue: 'The Grand Taj', city: 'Jaipur',
      address: 'Add the street address, Jaipur, Rajasthan',
      mapQuery: 'The Grand Taj, Jaipur', // what Google Maps searches for (or set mapUrl to a shared pin link)
      closing: 'With love & gratitude',
      illustration: 'assets/wedding.png',
      cardImage: null,
    },
  ],
};

const THEMES = {
  haldi:   { accent: '#e9a514', deep: '#c27a12', drape1: '#fbe7ab', drape2: '#f1c656', wash: '#f6cd45', bead1: '#f39a1e', bead2: '#f7c636', paste: '#f2b51c', bg: '#efe6cf' },
  mehendi: { accent: '#6e8f2c', deep: '#4b6a1d', drape1: '#e4ecc6', drape2: '#b9cd7f', wash: '#b4cb73', bead1: '#f39a1e', bead2: '#7da43c', paste: '#5d7a26', bg: '#e9ead5' },
  wedding: { accent: '#b4243f', deep: '#8a1a31', drape1: '#f9d8d8', drape2: '#e9a3ad', wash: '#efa1ae', bead1: '#d8314f', bead2: '#f2b53a', paste: '#c8304f', bg: '#f3e4df' },
};

const CARD_RATIO = 0.71; // width / height of the card

/* ---------- helpers ---------- */
const $ = (id) => document.getElementById(id);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function rng(seed) { // deterministic so the layout is identical on every load
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

/* =====================================================================
   Cherry blossoms
   ===================================================================== */
const PETAL_D = 'M0 0C-20-8-26-30-14-38C-8-42-3-40 0-35C3-40 8-42 14-38C26-30 20-8 0 0Z';

function blossomDefs() {
  const grad = (id, stops) => `<radialGradient id="${id}" cx=".5" cy="1" r="1.05">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</radialGradient>`;
  let stamens = '';
  for (let i = 0; i < 11; i++) {
    const a = (i / 11) * Math.PI * 2 + 0.3, r = 11 + (i % 3) * 2;
    const x = (Math.cos(a) * r).toFixed(1), y = (Math.sin(a) * r).toFixed(1);
    stamens += `<line x1="0" y1="0" x2="${x}" y2="${y}"/><circle cx="${x}" cy="${y}" r="1.3"/>`;
  }
  return `<defs>
    <filter id="wc" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="4"/>
      <feDisplacementMap in="SourceGraphic" scale="3.5"/>
    </filter>
    ${grad('pA', [[0, '#c93d6b'], [0.35, '#e47c9e'], [0.75, '#f5b9cb'], [1, '#fde4eb']])}
    ${grad('pB', [[0, '#de6990'], [0.4, '#f2a7be'], [1, '#fff0f4']])}
    ${grad('pC', [[0, '#b52a59'], [0.4, '#d9608a'], [1, '#f5c2d1']])}
    <path id="petal" d="${PETAL_D}"/>
    <path id="vein" d="M0-4V-29M0-6L-6-25M0-6L6-25" fill="none" stroke="#b83b64" stroke-width=".8" opacity=".3"/>
    <g id="stamens" stroke="#b8325a" stroke-width=".7" fill="#e8b64f" opacity=".85">${stamens}</g>
  </defs>`;
}

// Gentle breeze: each flower sways a little; the gust sweeps left → right
const windRand = rng(23);
function wind(x, size, loose) {
  const R = windRand;
  const sway = loose ? 1.6 : clamp(30 / size, 0.35, 1.3); // small and loose pieces move more
  const a = (4 + R() * 5) * sway;
  const dx = (2 + R() * 3) * sway;
  const dy = (R() * 2 - 0.6) * sway;
  const dur = 4.2 + R() * 1.8;
  const delay = (x / 400) * 1.4 + R() * 0.35;
  return `class="wind" style="--a:${a.toFixed(1)}deg;--dx:${dx.toFixed(1)}px;--dy:${dy.toFixed(1)}px;--dur:${dur.toFixed(2)}s;--delay:${delay.toFixed(2)}s"`;
}

function blossom(x, y, r, rot, grad, opacity = 1) {
  let petals = '';
  for (let k = 0; k < 5; k++) {
    petals += `<use href="#petal" fill="url(#${grad})" transform="rotate(${k * 72})"/><use href="#vein" transform="rotate(${k * 72})"/>`;
  }
  return `<g ${wind(x, r, false)}><g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(0)}) scale(${(r / 40).toFixed(3)})" opacity="${opacity}">
    ${petals}<circle r="6" fill="#a8284f" opacity=".8"/><use href="#stamens"/></g></g>`;
}

function loosePetal(x, y, s, rot, grad) {
  return `<g ${wind(x, s, true)}><use href="#petal" fill="url(#${grad})" opacity=".9" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(0)}) scale(${(s / 40).toFixed(3)})"/></g>`;
}

function drawBlossoms() {
  const R = rng(7);
  const grads = ['pA', 'pB', 'pC'];
  const g = () => grads[Math.floor(R() * 3)];

  // top band: dense row of small blossoms + a few large ones (as in the design)
  let top = '';
  for (let i = 0; i < 34; i++) {
    const x = -10 + R() * 420, y = -14 + R() * 62 + (i % 4 === 0 ? 20 : 0);
    top += blossom(x, y, 11 + R() * 15, R() * 72, g(), 0.75 + R() * 0.25);
  }
  top += blossom(118, 104, 26, 20, 'pA');
  top += blossom(58, 126, 13, 40, 'pB', 0.9);
  top += blossom(262, 82, 15, 10, 'pB');
  top += blossom(338, 130, 58, 12, 'pA');
  top += blossom(392, 74, 30, 50, 'pC', 0.95);
  for (let i = 0; i < 14; i++) top += loosePetal(R() * 400, 70 + R() * 120, 8 + R() * 8, R() * 360, g());
  // (no watercolor filter here: it would be recomputed every frame while the flowers sway)
  $('blossomsTop').innerHTML = blossomDefs() + top;

  // bottom: scattered petals and a few blossoms
  let bottom = '';
  for (let i = 0; i < 26; i++) bottom += loosePetal(R() * 400, 40 + R() * 180, 9 + R() * 10, R() * 360, g());
  bottom += blossom(34, 196, 24, 15, 'pA');
  bottom += blossom(96, 214, 15, 40, 'pB');
  bottom += blossom(372, 168, 30, 30, 'pB');
  bottom += blossom(318, 212, 18, 0, 'pC', 0.9);
  bottom += blossom(214, 222, 13, 50, 'pA', 0.85);
  $('blossomsBottom').innerHTML = blossomDefs().replace(/id="(wc|pA|pB|pC|petal|vein|stamens)"/g, 'id="$1b"')
    + bottom.replace(/#(pA|pB|pC|petal|vein|stamens)\b/g, '#$1b');

  // falling blossoms and petals
  const dataUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  const grad = (c1, c2) => `<defs><radialGradient id="g" cx=".5" cy="1" r="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient></defs>`;
  const petalSvg = (c1, c2) => dataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-28 -44 56 48">${grad(c1, c2)}<path d="${PETAL_D}" fill="url(#g)"/></svg>`);
  const bloomSvg = (c1, c2) => {
    let petals = '';
    for (let k = 0; k < 5; k++) petals += `<path d="${PETAL_D}" fill="url(#g)" transform="rotate(${k * 72})"/>`;
    let stamens = '';
    for (let k = 0; k < 9; k++) {
      const a = (k / 9) * Math.PI * 2, x = (Math.cos(a) * 11).toFixed(1), y = (Math.sin(a) * 11).toFixed(1);
      stamens += `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="#b8325a" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="1.4" fill="#e8b64f"/>`;
    }
    return dataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-44 -44 88 88">${grad(c1, c2)}${petals}<circle r="6" fill="#a8284f" opacity=".8"/>${stamens}</svg>`);
  };
  const colors = [['#e47c9e', '#fde4eb'], ['#de6990', '#fff0f4'], ['#c93d6b', '#f5c2d1']];
  const petalImgs = colors.map((c) => petalSvg(...c));
  const bloomImgs = colors.map((c) => bloomSvg(...c));
  const rain = $('petalRain');
  for (let i = 0; i < 26; i++) {
    const p = document.createElement('div');
    const isBloom = i % 2 === 0;
    p.className = isBloom ? 'petal bloom' : 'petal';
    const d = 10 + R() * 9;
    const size = isBloom ? 16 + R() * 22 : 9 + R() * 9;
    const img = (isBloom ? bloomImgs : petalImgs)[i % 3];
    p.style.cssText = `--x:${(R() * 100).toFixed(1)}%;--s:${size.toFixed(0)}px;--d:${d.toFixed(1)}s;--delay:${(-R() * d).toFixed(1)}s;--sway:${(18 + R() * 34).toFixed(0)}px;--r:${(R() * 360).toFixed(0)}deg;--img:${img}`;
    p.appendChild(document.createElement('i'));
    rain.appendChild(p);
  }
}

/* =====================================================================
   Wax seal
   ===================================================================== */
function sealMarkup(letter) {
  const R = rng(11);
  const pts = [];
  for (let i = 0; i < 90; i++) {
    const a = (i / 90) * Math.PI * 2;
    const r = 46 + 2.2 * Math.sin(a * 7) + 1.4 * Math.sin(a * 13 + 1) + R() * 1.2;
    pts.push(`${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`);
  }
  const blob = `M${pts.join('L')}Z`;
  return `<svg viewBox="-50 -50 100 100" aria-hidden="true">
    <defs>
      <radialGradient id="sealG" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#fad8bf"/><stop offset=".45" stop-color="#eaa985"/><stop offset=".8" stop-color="#d48a6a"/><stop offset="1" stop-color="#b9694d"/></radialGradient>
      <radialGradient id="sealIn" cx=".6" cy=".65" r=".75"><stop offset="0" stop-color="#f6c7a7"/><stop offset=".6" stop-color="#e9a682"/><stop offset="1" stop-color="#d38966"/></radialGradient>
    </defs>
    <path d="${blob}" fill="url(#sealG)"/>
    <circle r="33" fill="url(#sealIn)" stroke="#b9694d" stroke-opacity=".45" stroke-width="2"/>
    <circle r="31" fill="none" stroke="#ffe6d3" stroke-opacity=".55" stroke-width="1"/>
    <ellipse cx="-14" cy="-22" rx="12" ry="5" fill="#fff" opacity=".22" transform="rotate(-30 -14 -22)"/>
  </svg><span class="seal-letter">${esc(letter)}</span>`;
}

/* =====================================================================
   Invitation pages
   ===================================================================== */
function marigold(x, y, r, varName = '--bead1') {
  return `<g><circle cx="${x}" cy="${y}" r="${r}" style="fill:var(${varName})"/>`
    + `<circle cx="${x}" cy="${y}" r="${(r * 0.62).toFixed(2)}" fill="#000" opacity=".12"/>`
    + `<circle cx="${x}" cy="${y}" r="${(r * 0.25).toFixed(2)}" fill="#a3500c" opacity=".7"/></g>`;
}

function strand(x, len, id) {
  let s = `<line x1="${x}" y1="2" x2="${x}" y2="${len}" stroke="#c9a24a" stroke-width=".35"/>`;
  let i = 0;
  for (let y = 7; y < len - 3; y += 3.6, i++) {
    s += i % 2 ? `<ellipse cx="${x}" cy="${y}" rx=".6" ry="1.2" fill="#6d9a3a"/>` : marigold(x, y, 1.25, i % 4 === 0 ? '--bead1' : '--bead2');
  }
  s += `<g transform="translate(${x} ${len - 1})"><path d="M0 0C2.6 1.6 3.2 5 0 8.5C-3.2 5-2.6 1.6 0 0Z" fill="url(#bud-${id})"/>`
    + `<path d="M-2.3 1.9Q0 3.8 2.3 1.9Q0 .8-2.3 1.9Z" fill="#6d9a3a"/></g>`;
  return s;
}

function decorSVG(t, id) {
  const stops = [0, 0.12, 0.24, 0.36, 0.5, 0.64, 0.78, 0.9, 1]
    .map((o, i) => `<stop offset="${o}" stop-color="${i % 2 ? t.drape2 : t.drape1}"/>`).join('');
  let valance = 'M0 0H100V3.5';
  for (let x = 100; x > 0; x -= 12.5) valance += `Q${x - 6.25} 10 ${x - 12.5} 3.5`;
  valance += 'Z';
  const curtain = 'M0 0H18C15 13 9 25 7 35C9 48 14 62 16 84C10 86.5 4 85.5 0 87Z';
  const strands = [[10, 24], [15, 34], [20, 28]];
  let hang = '';
  for (const [x, len] of strands) hang += strand(x, len, id) + strand(100 - x, len + (x === 10 ? 4 : 0), id);
  return `<svg class="decor" viewBox="0 0 100 141" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="dr-${id}" x1="0" x2="1">${stops}</linearGradient>
      <radialGradient id="bud-${id}" cx=".5" cy=".8" r=".9"><stop offset="0" stop-color="#e2557f"/><stop offset="1" stop-color="#f9bdd0"/></radialGradient>
    </defs>
    <g opacity=".88">
      <path d="${curtain}" fill="url(#dr-${id})"/>
      <path d="${curtain}" fill="url(#dr-${id})" transform="translate(100 0) scale(-1 1)"/>
      <ellipse cx="7" cy="35" rx="3.2" ry="1.5" style="fill:var(--deep)"/>
      <ellipse cx="93" cy="35" rx="3.2" ry="1.5" style="fill:var(--deep)"/>
      <path d="${valance}" fill="url(#dr-${id})"/>
    </g>
    ${hang}
  </svg>`;
}

function illustrationSVG(id) {
  let leaves = '';
  for (let k = 0; k < 7; k++) {
    const a = -66 + k * 22;
    leaves += `<ellipse cx="0" cy="-8" rx="2.1" ry="7.5" fill="${k % 2 ? '#5f8f3a' : '#79a84a'}" transform="rotate(${a})"/>`;
  }
  const plant = (x, s) => `<g transform="translate(${x} 50) scale(${s})">${leaves}${marigold(-5, -9, 1.6)}${marigold(6, -12, 1.4, '--bead2')}</g>`
    + `<path d="M${x - 6} 49.5H${x + 6}L${x + 4.6} 55.5H${x - 4.6}Z" fill="#c98b5a"/>`;
  return `<svg class="fallback" viewBox="0 0 100 56" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    <defs>
      <filter id="blur-${id}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>
      <linearGradient id="brass-${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e8bd58"/><stop offset="1" stop-color="#a87322"/></linearGradient>
    </defs>
    <g filter="url(#blur-${id})" opacity=".55" style="fill:var(--wash)">
      <ellipse cx="50" cy="53" rx="58" ry="11"/><ellipse cx="17" cy="47" rx="22" ry="9"/><ellipse cx="84" cy="48" rx="22" ry="8"/>
    </g>
    ${plant(15, 1)}${plant(85, 0.85)}
    <path d="M44 51.5H56L58.5 55.5H41.5Z" fill="#b8822b"/>
    <path d="M30 44Q50 60 70 44Z" fill="url(#brass-${id})"/>
    <ellipse cx="50" cy="44" rx="20" ry="3" fill="#f0cf78"/>
    <ellipse cx="50" cy="44.1" rx="17" ry="2.1" style="fill:var(--paste)"/>
    ${marigold(43, 43.6, 1.7)}${marigold(50.5, 44.3, 1.9, '--bead2')}${marigold(57, 43.6, 1.6)}
    ${marigold(30, 54, 1.4, '--bead2')}${marigold(69, 54.5, 1.5)}${marigold(74, 53, 1.1, '--bead2')}
  </svg>`;
}

function pageHTML(ev, i) {
  if (ev.cardImage) return `<img class="full-card" src="${esc(ev.cardImage)}" alt="${esc(ev.title)} invitation" draggable="false">`;
  const t = THEMES[ev.theme] || THEMES.haldi;
  const id = `p${i}`;
  const vars = Object.entries(t).map(([k, v]) => `--${k}:${v}`).join(';');
  return `<article class="invite" style="${vars}">
    ${decorSVG(t, id)}
    <div class="illustration">
      ${illustrationSVG(id)}
      ${ev.illustration ? `<img class="art" src="${esc(ev.illustration)}" alt="" draggable="false"
        onload="this.parentNode.classList.add('has-art')" onerror="this.remove()">` : ''}
    </div>
    <div class="invite-text">
      <p class="kicker">${esc(ev.kicker)}</p>
      <h2 class="event-title${ev.title.length > 8 ? ' long' : ''}">${esc(ev.title)}</h2>
      <p class="event-sub">${esc(ev.subtitle)}</p>
      <p class="blessing">${esc(ev.blessing)}</p>
      <svg class="flourish" viewBox="0 0 100 12" aria-hidden="true"><path d="M2 6H40M60 6H98" stroke="currentColor" stroke-width=".8" opacity=".6"/><path d="M50 1L55 6L50 11L45 6Z" fill="currentColor" opacity=".7"/></svg>
      <div class="when">
        <span class="side">${esc(ev.day)}</span>
        <span class="date"><small>${esc(ev.month)}</small><b>${esc(ev.date)}</b><small>${esc(ev.year)}</small></span>
        <span class="side">${esc(ev.time)}</span>
      </div>
      <p class="venue">${esc(ev.venue)}<span>${esc(ev.city)}</span></p>
      <p class="closing">${esc(ev.closing)}</p>
    </div>
  </article>`;
}

/* =====================================================================
   Book — portrait page curl.
   The flipping page is clipped along a fold line; the part beyond the
   fold is drawn as the paper's back, reflected across that line.
   ===================================================================== */
class Book {
  constructor(el, pages, monogram, onChange) {
    this.el = el;
    this.onChange = onChange;
    this.cur = 0;
    this.busy = false;
    this.pages = pages.map((html) => {
      const p = document.createElement('section');
      p.className = 'page';
      p.innerHTML = html;
      el.appendChild(p);
      return p;
    });
    this.foldShadow = this.mk('fold-shadow', el);
    this.flapWrap = this.mk('flap-wrap', el);
    this.flap = this.mk('flap', this.flapWrap);
    this.mk('flap-back', this.flap).innerHTML = `<div class="flap-back-inner"><span>${esc(monogram)}</span></div>`;
    this.flapShade = this.mk('flap-shade', this.flap);
    this.show(0);
    this.bindPointer();
  }

  mk(cls, parent) {
    const d = document.createElement('div');
    d.className = cls;
    parent.appendChild(d);
    return d;
  }

  get count() { return this.pages.length; }

  measure() { this.W = this.el.clientWidth; this.H = this.el.clientHeight; }

  show(i) {
    this.cur = i;
    this.pages.forEach((p, k) => {
      p.classList.toggle('is-visible', k === i);
      p.style.zIndex = k === i ? 1 : 0;
      p.style.clipPath = '';
    });
  }

  begin(dir, cornerY) {
    this.measure();
    const flip = dir === 'fwd' ? this.cur : this.cur - 1;
    const under = dir === 'fwd' ? this.cur + 1 : this.cur;
    this.f = { dir, flip, under, C: { x: this.W, y: cornerY } };
    this.pages.forEach((p, k) => {
      p.classList.toggle('is-visible', k === flip || k === under);
      p.style.zIndex = k === flip ? 3 : 1;
    });
    this.el.classList.add('flipping');
  }

  // keep the page attached at the spine (left edge)
  constrain(P) {
    const { W, H } = this, C = this.f.C;
    const pin = (cx, cy, r) => {
      const dx = P.x - cx, dy = P.y - cy, d = Math.hypot(dx, dy);
      if (d > r) P = { x: cx + (dx / d) * r, y: cy + (dy / d) * r };
    };
    pin(0, C.y, W);
    pin(0, H - C.y, Math.hypot(W, H));
    return P;
  }

  render(P) {
    const { W, H } = this, { C, flip } = this.f;
    const page = this.pages[flip];
    this.P = P;
    const dx = C.x - P.x, dy = C.y - P.y, len = Math.hypot(dx, dy);
    if (len < 0.5) {
      page.style.clipPath = '';
      this.flap.style.clipPath = 'polygon(0 0,0 0,0 0)';
      this.foldShadow.style.opacity = 0;
      return;
    }
    const n = { x: dx / len, y: dy / len };
    const M = { x: (C.x + P.x) / 2, y: (C.y + P.y) / 2 };
    const side = (p) => (p[0] - M.x) * n.x + (p[1] - M.y) * n.y; // > 0 → beyond the fold
    const rect = [[0, 0], [W, 0], [W, H], [0, H]];
    const keep = clipPoly(rect, (p) => -side(p));
    const beyond = clipPoly(rect, side);

    page.style.clipPath = polyCss(keep);
    this.flap.style.clipPath = polyCss(beyond);
    const k = 2 * (M.x * n.x + M.y * n.y);
    this.flap.style.transform = `matrix(${1 - 2 * n.x * n.x},${-2 * n.x * n.y},${-2 * n.x * n.y},${1 - 2 * n.y * n.y},${k * n.x},${k * n.y})`;

    const ang = (Math.atan2(n.y, n.x) * 180) / Math.PI;
    const strip = `translate(${M.x}px,${M.y}px) rotate(${ang}deg) translate(0,-2000px)`;
    const progress = clamp((C.x - P.x) / (2 * W), 0, 1);
    this.flapShade.style.width = `${Math.max(len / 2, 1)}px`;
    this.flapShade.style.transform = strip;
    this.foldShadow.style.width = `${clamp(len / 2, 1, W * 0.45)}px`;
    this.foldShadow.style.transform = strip;
    this.foldShadow.style.opacity = Math.min(1, Math.sin(progress * Math.PI) * 1.6);
  }

  end(completed) {
    const { dir, flip, under } = this.f;
    let next = this.cur;
    if (completed) next = dir === 'fwd' ? under : flip;
    this.el.classList.remove('flipping');
    this.f = null;
    this.show(next);
    if (completed) this.onChange(next);
  }

  tween(from, to, dur, ease, arc = 0) {
    return new Promise((resolve) => {
      const t0 = performance.now();
      const step = (now) => {
        const t = clamp((now - t0) / dur, 0, 1), e = ease(t);
        const P = {
          x: from.x + (to.x - from.x) * e,
          y: from.y + (to.y - from.y) * e - arc * Math.sin(Math.PI * e),
        };
        this.render(this.constrain(P));
        if (t < 1) requestAnimationFrame(step); else resolve();
      };
      requestAnimationFrame(step);
    });
  }

  async flip(dir, dur = 1100) {
    if (this.busy) return;
    if (dir === 'fwd' ? this.cur >= this.count - 1 : this.cur <= 0) return;
    this.busy = true;
    this.measure();
    this.begin(dir, this.H);
    const { W, H } = this;
    const a = { x: W, y: H }, b = { x: -W, y: H };
    await (dir === 'fwd' ? this.tween(a, b, dur, easeInOut, H * 0.32) : this.tween(b, a, dur, easeInOut, H * 0.32));
    this.end(true);
    this.busy = false;
  }

  async goTo(i) {
    while (this.cur !== i) await this.flip(i > this.cur ? 'fwd' : 'back', 700);
  }

  // little corner lift to show the page can be turned
  async tease() {
    if (this.busy || this.count < 2 || this.cur >= this.count - 1) return;
    this.busy = true;
    this.begin('fwd', this.H);
    const { W, H } = this;
    await this.tween({ x: W, y: H }, { x: W * 0.8, y: H * 0.9 }, 650, easeOut);
    await this.tween({ x: W * 0.8, y: H * 0.9 }, { x: W, y: H }, 550, easeInOut);
    this.end(false);
    this.busy = false;
  }

  bindPointer() {
    const el = this.el;
    const local = (e) => {
      const r = el.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (this.W / r.width), y: (e.clientY - r.top) * (this.H / r.height) };
    };
    el.addEventListener('pointerdown', (e) => {
      if (this.busy) return;
      this.measure();
      const p = local(e);
      const dir = p.x > this.W / 2 ? 'fwd' : 'back';
      const can = dir === 'fwd' ? this.cur < this.count - 1 : this.cur > 0;
      this.drag = { dir: can ? dir : null, start: p, started: false, last: p, lastT: performance.now(), vx: 0, cornerY: p.y < this.H / 2 ? 0 : this.H };
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener('pointermove', (e) => {
      const d = this.drag;
      if (!d || !d.dir) return;
      const p = local(e);
      if (!d.started) {
        if (Math.hypot(p.x - d.start.x, p.y - d.start.y) < 8) return;
        d.started = true;
        this.busy = true;
        this.begin(d.dir, d.cornerY);
      }
      const now = performance.now();
      d.vx = (p.x - d.last.x) / Math.max(now - d.lastT, 1);
      d.last = p;
      d.lastT = now;
      const baseX = d.dir === 'fwd' ? this.W : -this.W;
      this.render(this.constrain({ x: baseX + (p.x - d.start.x) * 1.6, y: d.cornerY + (p.y - d.start.y) }));
    });
    const up = async () => {
      const d = this.drag;
      this.drag = null;
      if (!d) return;
      if (!d.started) { // a tap: right half → next, left half → previous
        if (d.dir) this.flip(d.dir);
        return;
      }
      const { W } = this, P = this.P, C = this.f.C;
      const progress = (C.x - P.x) / (2 * W);
      const complete = d.dir === 'fwd' ? progress > 0.28 || d.vx < -0.5 : progress < 0.72 || d.vx > 0.5;
      const toLeft = (d.dir === 'fwd') === complete;
      const target = { x: toLeft ? -W : W, y: C.y };
      const remaining = Math.abs(target.x - P.x) / (2 * W);
      await this.tween({ ...P }, target, 260 + remaining * 520, easeOut);
      this.end(complete);
      this.busy = false;
    };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  }
}

function clipPoly(pts, f) { // keeps the part where f(p) >= 0
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], fa = f(a), fb = f(b);
    if (fa >= 0) out.push(a);
    if ((fa >= 0) !== (fb >= 0)) {
      const t = fa / (fa - fb);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
}
const polyCss = (pts) => (pts.length < 3 ? 'polygon(0 0,0 0,0 0)'
  : `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}px ${y.toFixed(2)}px`).join(',')})`);

/* =====================================================================
   Envelope sequence
   ===================================================================== */
const stage = $('stage');
const envelope = $('envelope');
const card = $('card');
const seal = $('seal');
const dots = $('dots');
const turnHint = $('turnHint');
const venueBox = $('venueBox');
let state = 'closed';
let book;

function layout() {
  const sw = stage.clientWidth, sh = stage.clientHeight;
  const envW = Math.min(sw * 0.92, sh * 0.7 * 0.6), envH = envW / 0.6;
  const envX = (sw - envW) / 2, envY = sh - envH - Math.max(sh * 0.03, 10);
  Object.assign(envelope.style, { left: `${envX}px`, top: `${envY}px`, width: `${envW}px`, height: `${envH}px` });

  const BELOW = 190; // room under the card for the dots, hint and venue box
  const cw = Math.min(sw * 0.92, sh * 0.68 * CARD_RATIO, (sh - BELOW - 64) * CARD_RATIO), ch = cw / CARD_RATIO;
  const cx = (sw - cw) / 2, cy = Math.max(Math.min((sh - ch) / 2 - sh * 0.015, sh - ch - BELOW), 64);
  Object.assign(card.style, { left: `${cx}px`, top: `${cy}px`, width: `${cw}px`, height: `${ch}px` });

  // where the card sits while inside the envelope
  const s = (envW * 0.9) / cw;
  const inX = envX + envW * 0.05, inY = envY + envH * 0.035;
  const peek = ch * s * 0.4;
  const sep = inY + ch * s - peek - envY + 24; // how far the envelope must drop for the card to clear the pocket
  const vars = {
    '--in-tx': `${inX - cx}px`, '--in-ty': `${inY - cy}px`, '--in-s': s,
    '--peek': `${peek}px`, '--sep': `${sep}px`, '--gone': `${sh - envY + envH * 0.45 + 40}px`,
  };
  for (const [k, v] of Object.entries(vars)) stage.style.setProperty(k, v);

  dots.style.top = `${cy + ch + 16}px`;
  turnHint.style.top = `${cy + ch + 28}px`;
  Object.assign(venueBox.style, { left: `${cx}px`, top: `${cy + ch + 58}px`, width: `${cw}px` });
  if (book) book.measure();
}

async function openEnvelope() {
  if (state !== 'closed') return;
  state = 'opening';
  const c = stage.classList;
  c.add('is-opening', 'is-seal-broken');
  await wait(450);
  c.add('is-flap-open');
  await wait(900);
  c.add('is-card-peek');
  await wait(1050);
  c.add('is-env-down');
  await wait(900);
  c.add('is-card-front', 'is-env-gone', 'is-card-out');
  await wait(1200);
  c.add('is-reading');
  state = 'reading';
  let seen = false;
  try { seen = !!localStorage.getItem('turnedOnce'); } catch (e) { /* storage unavailable */ }
  if (!seen) setTimeout(() => state === 'reading' && book.tease(), 600);
}

async function closeEnvelope() {
  if (state !== 'reading' || book.busy) return;
  state = 'closing';
  const c = stage.classList;
  c.remove('is-reading');
  c.remove('is-env-gone', 'is-card-out');
  await wait(1200);
  c.remove('is-card-front', 'is-env-down');
  await wait(950);
  c.remove('is-card-peek');
  await wait(1050);
  c.remove('is-flap-open');
  await wait(900);
  book.show(0);
  setTheme(0);
  seal.classList.add('no-trans');
  c.remove('is-seal-broken');
  void seal.offsetWidth;
  seal.classList.remove('no-trans');
  seal.classList.add('stamp');
  await wait(650);
  seal.classList.remove('stamp');
  c.remove('is-opening');
  state = 'closed';
}

function setTheme(i) {
  const t = THEMES[CONFIG.events[i].theme] || THEMES.haldi;
  stage.style.setProperty('--bg', t.bg);
  stage.style.setProperty('--accent', t.accent);
  stage.style.setProperty('--deep', t.deep);
  [...dots.children].forEach((d, k) => d.setAttribute('aria-selected', String(k === i)));
  setVenue(CONFIG.events[i]);
}

// Venue box: first tap reveals the address, tapping the address opens Google Maps
function setVenue(ev) {
  $('venueName').textContent = [ev.venue, ev.city].filter(Boolean).join(', ');
  $('venueAddress').textContent = ev.address || [ev.venue, ev.city].filter(Boolean).join(', ');
  $('venueMap').href = ev.mapUrl
    || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.mapQuery || `${ev.venue}, ${ev.address || ev.city}`)}`;
}

function toggleVenue(open = !venueBox.classList.contains('is-open')) {
  venueBox.classList.toggle('is-open', open);
  $('venueHead').setAttribute('aria-expanded', String(open));
  $('venueCta').textContent = open ? 'Hide' : 'View address';
}

function onPageChange(i) {
  setTheme(i);
  try { localStorage.setItem('turnedOnce', '1'); } catch (e) { /* storage unavailable */ }
  turnHint.classList.add('is-hidden');
}

/* ---------- init ---------- */
function init() {
  drawBlossoms();
  const sealFace = sealMarkup(CONFIG.monogram);
  seal.querySelectorAll('.seal-half').forEach((h) => { h.innerHTML = sealFace; });

  book = new Book($('book'), CONFIG.events.map(pageHTML), CONFIG.monogram, onPageChange);
  CONFIG.events.forEach((ev, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', ev.title);
    b.addEventListener('click', () => book.goTo(i));
    dots.appendChild(b);
  });
  try { if (localStorage.getItem('turnedOnce')) turnHint.classList.add('is-hidden'); } catch (e) { /* ignore */ }

  layout();
  addEventListener('resize', layout);
  stage.querySelector('.env-back').addEventListener('click', openEnvelope);
  seal.addEventListener('click', openEnvelope);
  $('closeBtn').addEventListener('click', () => { toggleVenue(false); closeEnvelope(); });
  $('venueHead').addEventListener('click', () => toggleVenue());
  addEventListener('keydown', (e) => {
    if (state === 'closed' && (e.key === 'Enter' || e.key === ' ')) openEnvelope();
    if (state !== 'reading') return;
    if (e.key === 'ArrowRight') book.flip('fwd');
    if (e.key === 'ArrowLeft') book.flip('back');
    if (e.key === 'Escape') closeEnvelope();
  });
  setTheme(0);

  // ?open → open automatically (handy for previews)
  if (new URLSearchParams(location.search).has('open')) setTimeout(openEnvelope, 1400);
}

init();
