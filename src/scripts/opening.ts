// Opening scene: scroll-driven drawings. Variant A = cross-section assembly, variant B = winter night through the wall.
const root = document.getElementById('opening') as HTMLElement;
const scroller = document.getElementById('openScroll') as HTMLElement;
const svg = document.getElementById('openSvg') as unknown as SVGSVGElement;
const D = JSON.parse(document.getElementById('open-i18n')!.textContent || '{}');
const $ = (id: string) => document.getElementById(id) as HTMLElement;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const seg = (p: number, a: number, b: number) => ease(clamp((p - a) / (b - a)));
const lin = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

type V = 'a' | 'b';
let variant: V = 'a';
let portrait = false;

const F = 'font-family="IBM Plex Mono, ui-monospace, monospace"';

/* ------------------------------------------------------------------ A: cross-section */
const CHAPTERS_A = [0.1, 0.34, 0.5, 0.68, 0.82]; // start of each chapter
function drawA(p: number): string {
  const frame = seg(p, 0.1, 0.2), cham = seg(p, 0.18, 0.32), steel = seg(p, 0.34, 0.44);
  const panes = [seg(p, 0.5, 0.58), seg(p, 0.54, 0.62), seg(p, 0.58, 0.66)];
  const spacer = seg(p, 0.62, 0.68), seal = seg(p, 0.68, 0.78), label = seg(p, 0.82, 0.9), wash = seg(p, 0.8, 0.9);
  const intro = 1 - seg(p, 0.06, 0.14);
  const cx = portrait ? 500 : 590, cy = portrait ? 340 : 292, k = portrait ? 2.5 : 1.5;
  const fade = 1 - 0.72 * seg(p, 0.92, 0.99);
  let s = '';
  // background grid with slow parallax
  const gy = (p * 90) % 40;
  s += `<g stroke="#242831" stroke-width="1" opacity=".9">`;
  for (let x = -40; x <= 1040; x += 40) s += `<line x1="${x}" y1="-40" x2="${x}" y2="700"/>`;
  for (let y = -40 - gy; y <= 700; y += 40) s += `<line x1="-40" y1="${y}" x2="1040" y2="${y}"/>`;
  s += `</g>`;
  // thermal wash (cold left, warm right) in the result chapter
  s += `<defs><linearGradient id="wash" x1="0" x2="1"><stop offset="0" stop-color="#1c3447" stop-opacity=".75"/><stop offset=".55" stop-color="#14161b" stop-opacity="0"/><stop offset="1" stop-color="#5a3a25" stop-opacity=".7"/></linearGradient></defs>`;
  s += `<rect x="0" y="0" width="1000" height="640" fill="url(#wash)" opacity="${wash}"/>`;
  s += `<g opacity="${fade}" transform="translate(${cx} ${cy}) scale(${k})">`;
  // intro ghost outline
  s += `<rect x="-150" y="-105" width="170" height="210" rx="6" fill="none" stroke="#3a404c" stroke-width="1" stroke-dasharray="4 4" opacity="${intro * 0.9}"/>`;
  // frame
  s += `<g transform="translate(${-160 * (1 - frame)} 0)" opacity="${frame}"><rect x="-150" y="-105" width="170" height="210" rx="6" fill="#e9ecef"/></g>`;
  // chambers
  const cells: [number, number, number, number][] = [[-138, -93, 76, 54], [-56, -93, 64, 54], [-138, -33, 146, 66], [-138, 39, 76, 54], [-56, 39, 64, 54]];
  s += `<g>`;
  cells.forEach((c, i) => {
    const kk = clamp(cham * 1.5 - i * 0.12);
    s += `<rect x="${c[0] + (c[2] / 2) * (1 - kk)}" y="${c[1] + (c[3] / 2) * (1 - kk)}" width="${c[2] * kk}" height="${c[3] * kk}" rx="3" fill="#13161b" opacity="${frame}"/>`;
  });
  s += `</g>`;
  // steel
  s += `<g transform="translate(0 ${-120 * (1 - steel)})" opacity="${steel}"><rect x="-104" y="-17" width="76" height="34" rx="2" fill="none" stroke="#8d8e8d" stroke-width="6"/><line x1="-98" y1="0" x2="-34" y2="0" stroke="#8d8e8d" stroke-width="3"/></g>`;
  // glass panes
  [62, 84, 106].forEach((x, i) => {
    s += `<rect x="${x + 220 * (1 - panes[i])}" y="-118" width="6" height="236" fill="#6fc9da" opacity="${panes[i] * 0.9}"/>`;
  });
  s += `<g opacity="${spacer}">`;
  [[68, 84], [90, 106]].forEach(([a, b]) => { s += `<rect x="${a}" y="-118" width="${b - a}" height="12" fill="#8d8e8d"/><rect x="${a}" y="106" width="${b - a}" height="12" fill="#8d8e8d"/>`; });
  s += `</g>`;
  // beads and seals
  s += `<g transform="translate(${60 * (1 - seal)} 0)" opacity="${seal}">
    <rect x="20" y="-70" width="36" height="140" fill="#e9ecef"/><rect x="56" y="-60" width="6" height="120" rx="2" fill="#0b0d11"/>
    <rect x="112" y="-60" width="6" height="120" rx="2" fill="#0b0d11"/><rect x="118" y="-70" width="36" height="140" fill="#e9ecef"/>
    <rect x="8" y="-14" width="12" height="28" rx="4" fill="#0b0d11"/></g>`;
  // dimension: depth
  s += `<g opacity="${label}" stroke="#9aa1ad" stroke-width="1" fill="none"><line x1="-150" y1="-135" x2="20" y2="-135"/><line x1="-150" y1="-141" x2="-150" y2="-129"/><line x1="20" y1="-141" x2="20" y2="-129"/></g>`;
  s += `<text x="-65" y="-142" text-anchor="middle" ${F} font-size="11" fill="#e9ecef" opacity="${label}">70 mm</text>`;
  // callouts (landscape only; portrait relies on the caption text)
  if (!portrait) {
    const wrap = (t: string) => { if (t.includes(', ')) return t.split(', '); const w = t.split(' '); if (t.length < 16 || w.length < 3) return [t]; const m = Math.ceil(w.length / 2); return [w.slice(0, m).join(' '), w.slice(m).join(' ')]; };
    const L = [
      { dx: -120, dy: -70, tx: -166, a: 'end', i: 0 },
      { dx: -104, dy: 0, tx: -166, a: 'end', i: 1 },
      { dx: 115, dy: -40, tx: 166, a: 'start', i: 3 },
      { dx: 95, dy: 62, tx: 166, a: 'start', i: 2 },
    ];
    s += `<g opacity="${label}" fill="#e9ecef" ${F} font-size="10.5">`;
    L.forEach((l) => {
      const lx = l.a === 'end' ? l.tx + 6 : l.tx - 6;
      s += `<polyline points="${l.dx},${l.dy} ${lx},${l.dy}" fill="none" stroke="#6fc9da" stroke-width="1"/><circle cx="${l.dx}" cy="${l.dy}" r="3" fill="#6fc9da"/>`;
      const lines = wrap(D.a.labels[l.i]);
      s += `<text x="${l.tx}" y="${l.dy - (lines.length - 1) * 6 + 4}" text-anchor="${l.a}">${lines.map((t, n) => `<tspan x="${l.tx}" dy="${n ? 13 : 0}">${t}</tspan>`).join('')}</text>`;
    });
    s += `</g>`;
  }
  s += `</g>`;
  s += `<text x="${portrait ? 210 : 60}" y="${portrait ? 110 : 70}" ${F} font-size="13" letter-spacing="2" fill="#6b7280" opacity="${1 - intro * 0.0}">${D.a.illustrative.toUpperCase()}</text>`;
  return s;
}

/* ------------------------------------------------------------------ B: winter */
const CHAPTERS_B = [0.08, 0.42, 0.6];
function drawB(p: number): string {
  const z = seg(p, 0.06, 0.42), x = seg(p, 0.38, 0.5), h = seg(p, 0.55, 0.92);
  let s = `<defs><linearGradient id="gB" x1="0" x2="1"><stop offset="0" stop-color="#1b2a3a"/><stop offset="1" stop-color="#3a2a22"/></linearGradient><radialGradient id="glowB"><stop offset="0" stop-color="#f0a15c" stop-opacity=".6"/><stop offset="1" stop-color="#f0a15c" stop-opacity="0"/></radialGradient></defs>`;
  const vw = portrait ? 520 : 1000, vh = portrait ? 760 : 640;
  // facade
  const sc = 1 + z * (portrait ? 10 : 8.5);
  const tx = 4 * 120 + 30, ty = 2 * 120 + 70;
  const cx = portrait ? 500 : 500, cy = portrait ? 330 : 300;
  s += `<g opacity="${1 - x}" transform="translate(${cx} ${cy}) scale(${sc}) translate(${-tx} ${-ty})">`;
  s += `<rect x="-900" y="-700" width="2600" height="2000" fill="#232830"/>`;
  s += `<rect x="-900" y="-700" width="2600" height="2000" fill="url(#gB)" opacity=".18"/>`;
  for (let r = 0; r < 6; r++) for (let c = 0; c < 10; c++) {
    const target = r === 2 && c === 4;
    const lit = target || (r * 7 + c * 3) % 5 < 2;
    const xx = c * 120, yy = r * 120;
    s += `<rect x="${xx}" y="${yy}" width="60" height="100" rx="2" fill="${lit ? '#f0a15c' : '#10141a'}" opacity="${lit ? (target ? 1 : 0.75) : 1}"/>`;
    s += `<rect x="${xx}" y="${yy}" width="60" height="100" rx="2" fill="none" stroke="#3a404c" stroke-width="2"/>`;
    if (lit) s += `<rect x="${xx - 14}" y="${yy - 14}" width="88" height="128" fill="url(#glowB)" opacity=".25"/>`;
  }
  s += `</g>`;
  // sectional comparison
  s += `<g opacity="${x}">`;
  const panels = portrait
    ? [{ px: 40, py: 110, w: 440, h: 250, i: 0 }, { px: 40, py: 420, w: 440, h: 250, i: 1 }]
    : [{ px: 70, py: 100, w: 410, h: 350, i: 0 }, { px: 520, py: 100, w: 410, h: 350, i: 1 }];
  panels.forEach((P) => {
    const neu = P.i === 1;
    const col = neu ? '#6fc9da' : '#8d8e8d';
    const wx = P.px + P.w * 0.45; // wall/window x
    s += `<rect x="${P.px}" y="${P.py}" width="${P.w}" height="${P.h}" rx="8" fill="url(#gB)"/>`;
    s += `<rect x="${wx}" y="${P.py}" width="${P.w * 0.1}" height="${P.h}" fill="#2c313b"/>`;
    const gy1 = P.py + P.h * 0.3, gh = P.h * 0.4;
    s += `<rect x="${wx}" y="${gy1}" width="${P.w * 0.1}" height="${gh}" fill="${col}" opacity=".5"/>`;
    const panesN = neu ? 3 : 1;
    for (let i = 0; i < panesN; i++) s += `<rect x="${wx + P.w * 0.05 - (panesN * 4) / 2 + i * 9}" y="${gy1}" width="${neu ? 4 : 5}" height="${gh}" fill="${col}"/>`;
    // arrows (heat from inside right to outside left)
    const rows = portrait ? 5 : 6;
    const leak = neu ? 1 : rows;
    for (let k = 0; k < rows; k++) {
      const y = P.py + 34 + (k * (P.h - 68)) / (rows - 1);
      const pass = k < leak;
      const t = clamp(h * 1.7 - k * 0.07);
      const x0 = P.px + P.w - 20, xEnd = pass ? P.px + 20 : wx + P.w * 0.1 + 8;
      const ax = x0 + (xEnd - x0) * t;
      if (t > 0) s += `<line x1="${x0}" y1="${y}" x2="${ax}" y2="${y}" stroke="#f0a15c" stroke-width="3" stroke-linecap="round" opacity="${pass ? 1 : 0.5}"/><circle cx="${ax}" cy="${y}" r="4.5" fill="#f0a15c" opacity="${pass ? 1 : 0.5}"/>`;
    }
    s += `<text x="${P.px}" y="${P.py - 18}" font-family="Archivo, IBM Plex Sans, Noto Sans Armenian, sans-serif" font-weight="700" font-size="22" fill="#e9ecef">${neu ? D.b.neu : D.b.old}</text>`;
    s += `<text x="${P.px + P.w}" y="${P.py - 18}" text-anchor="end" ${F} font-size="14" fill="${neu ? '#6fc9da' : '#f0a15c'}">U ≈ ${neu ? '0.9' : '2.8'} W/m²K</text>`;
    s += `<text x="${P.px + 14}" y="${P.py + P.h - 14}" ${F} font-size="11" fill="#9aa1ad">${D.b.outside}</text>`;
    s += `<text x="${P.px + P.w - 14}" y="${P.py + P.h - 14}" text-anchor="end" ${F} font-size="11" fill="#9aa1ad">${D.b.inside}</text>`;
  });
  s += `<text x="${vw / 2}" y="${portrait ? 700 : 490}" text-anchor="middle" ${F} font-size="11" letter-spacing="1.5" fill="#6b7280">${D.b.sampleU.toUpperCase()}</text>`;
  s += `</g>`;
  return s;
}

/* ------------------------------------------------------------------ driver */
const copy = $('openCopy'), chap = $('openChap'), fin = $('openFin'), rail = $('openRail');
const chapterOf = (p: number) => {
  const starts = variant === 'a' ? CHAPTERS_A : CHAPTERS_B;
  let idx = -1;
  starts.forEach((s, i) => { if (p >= s) idx = i; });
  return idx;
};
function buildRail() {
  const n = variant === 'a' ? 5 : 3;
  rail.innerHTML = Array.from({ length: n }, () => '<li><i></i></li>').join('');
}
function setTexts() {
  const T = D[variant];
  $('oKick').textContent = T.kicker; $('oH1').textContent = T.h1; $('oLead').textContent = T.lead;
  $('oFinT').textContent = T.finaleTitle; $('oFin1').textContent = T.finaleCta1; $('oFin2').textContent = T.finaleCta2;
  ($('oFin1') as HTMLAnchorElement).href = variant === 'a' ? D.hrefs.cfg : D.hrefs.sav;
  ($('oFin2') as HTMLAnchorElement).href = D.hrefs.quote;
  svg.setAttribute('aria-label', T.chapters[T.chapters.length - 1].t);
  buildRail();
}
function fit() {
  portrait = innerWidth / innerHeight < 0.95;
  const vb = variant === 'a' ? (portrait ? '190 40 620 680' : '0 0 1000 640') : portrait ? '0 0 520 760' : '0 0 1000 640';
  svg.setAttribute('viewBox', vb);
}

let target = 0, cur = 0, raf = 0, lastChap = -2;
function render(p: number) {
  svg.innerHTML = variant === 'a' ? drawA(p) : drawB(p);
  const T = D[variant];
  // headline
  const introEnd = variant === 'a' ? 0.06 : 0.05;
  const hOut = seg(p, introEnd, introEnd + 0.07);
  copy.style.opacity = String(1 - hOut);
  copy.style.transform = `translateY(${-30 * hOut}px)`;
  copy.style.pointerEvents = hOut > 0.9 ? 'none' : '';
  // chapters
  const ci = chapterOf(p);
  const finaleAt = variant === 'a' ? 0.92 : 0.86;
  const inFinale = p >= finaleAt;
  if (ci !== lastChap) {
    lastChap = ci;
    if (ci >= 0) { $('oCk').textContent = `${String(ci + 1).padStart(2, '0')} / ${String(T.chapters.length).padStart(2, '0')} · ${T.chapters[ci].k}`; $('oCt').textContent = T.chapters[ci].t; }
  }
  chap.style.opacity = ci >= 0 && !inFinale ? '1' : '0';
  fin.style.opacity = String(seg(p, finaleAt, finaleAt + 0.06));
  fin.classList.toggle('on', inFinale);
  fin.style.transform = `translateY(${(1 - seg(p, finaleAt, finaleAt + 0.06)) * 24}px)`;
  // rail
  const starts = variant === 'a' ? CHAPTERS_A : CHAPTERS_B;
  [...rail.children].forEach((li, i) => {
    const a = starts[i], b = starts[i + 1] ?? 1;
    ((li as HTMLElement).firstElementChild as HTMLElement).style.transform = `scaleY(${lin(p, a, b)})`;
  });
}
function progress() {
  const r = scroller.getBoundingClientRect();
  return clamp(-r.top / (r.height - innerHeight));
}
function tick() {
  const d = target - cur;
  cur = RM ? target : Math.abs(d) < 0.0004 ? target : cur + d * 0.16;
  render(cur);
  raf = Math.abs(target - cur) > 0.0004 ? requestAnimationFrame(tick) : 0;
}
function onScroll() { target = progress(); if (!raf) raf = requestAnimationFrame(tick); }
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', () => { fit(); lastChap = -2; render(cur); });

function setVariant(v: V, scrollTop = false) {
  variant = v; root.dataset.variant = v; lastChap = -2;
  root.querySelectorAll<HTMLButtonElement>('[data-var]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.var === v)));
  try { localStorage.setItem('eurog-opening', v); } catch { /* ignore */ }
  const u = new URL(location.href); u.searchParams.set('opening', v); history.replaceState(null, '', u);
  setTexts(); fit();
  if (scrollTop) { scrollTo({ top: root.offsetTop, behavior: 'instant' as ScrollBehavior }); }
  target = progress(); cur = target; render(cur);
}
root.querySelectorAll<HTMLButtonElement>('[data-var]').forEach((b) => b.addEventListener('click', () => setVariant(b.dataset.var as V, true)));

let initial: V = 'a';
try {
  const q = new URL(location.href).searchParams.get('opening');
  const ls = localStorage.getItem('eurog-opening');
  initial = (q === 'b' || q === 'a' ? q : ls === 'b' ? 'b' : 'a') as V;
} catch { /* ignore */ }
setVariant(initial);
// a poster frame for people who land mid-way or have no scroll yet
if (target < 0.01) { cur = 0; render(0); }
