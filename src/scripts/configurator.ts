import { i18n, nf, lang, toast } from './site';
import { SYSTEMS, sysById, type Product } from '../data/systems';
import { PRODUCT_RULES, COLOURS, COLOUR_HEX, priceOf, glazingAllowed, type Config, type Opening, type Glazing, type Colour } from '../data/pricing';
import { drawWindow } from '../lib/windowSvg';
import { addItem } from '../lib/basket';

const D = i18n<any>();
const c = D.cfg;
const $ = (s: string) => document.querySelector(s) as HTMLElement;
const panel = $('#cfgPanel'), svg = $('#cfgSvg') as unknown as SVGSVGElement, warn = $('#cfgWarn'), cap = $('#cfgCap');
const KEY = 'eurog-cfg-v1';

let cfg: Config = { product: 'window', w: 1200, h: 1400, sashes: 2, opening: 'tiltTurn', system: 'pvc70', glazing: 'lowE', colour: 'white', qty: 1 };
let view: 'inside' | 'outside' = 'inside';
try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s) cfg = { ...cfg, ...s }; } catch { /* ignore */ }
const q = new URL(location.href).searchParams;
if (q.get('sys') && SYSTEMS.some((s) => s.id === q.get('sys'))) cfg.system = q.get('sys')!;
if (q.get('w')) cfg.w = +q.get('w')!;
if (q.get('h')) cfg.h = +q.get('h')!;
let notes: string[] = [];

function normalize(changed: string) {
  notes = [];
  let sys = sysById(cfg.system);
  const rule = PRODUCT_RULES[cfg.product];
  if (!sys.products.includes(cfg.product)) {
    const alt = SYSTEMS.find((s) => s.products.includes(cfg.product) && s.family === sys.family) ?? SYSTEMS.find((s) => s.products.includes(cfg.product))!;
    notes.push(c.limits.sysNA.replace('{s}', alt.name)); cfg.system = alt.id; sys = alt;
  }
  if (changed === 'product') { cfg.w = rule.defW; cfg.h = rule.defH; cfg.opening = rule.defOpening; cfg.sashes = rule.sashes[0] === 1 ? (cfg.product === 'window' ? 2 : 1) : rule.sashes[0]; }
  if (!rule.openings.includes(cfg.opening)) cfg.opening = rule.defOpening;
  if (!rule.sashes.includes(cfg.sashes)) cfg.sashes = rule.sashes[0];
  const maxW = sys.maxW, maxH = sys.maxH;
  if (cfg.w > maxW) { cfg.w = maxW; notes.push(c.limits.tooWide.replace('{n}', String(maxW))); }
  if (cfg.h > maxH) { cfg.h = maxH; notes.push(c.limits.tooHigh.replace('{n}', String(maxH))); }
  if (cfg.w < rule.minW || cfg.h < rule.minH) { cfg.w = Math.max(cfg.w, rule.minW); cfg.h = Math.max(cfg.h, rule.minH); notes.push(c.limits.tooSmall.replace('{w}', String(rule.minW)).replace('{h}', String(rule.minH))); }
  // sash width
  const limit = cfg.opening === 'fixed' ? sys.maxSash * 1.6 : sys.maxSash;
  const widthPer = (n: number) => cfg.w / n;
  if (widthPer(cfg.sashes) > limit) {
    const ok = rule.sashes.find((n) => n >= cfg.sashes && widthPer(n) <= limit);
    if (ok) { cfg.sashes = ok; } else notes.push(c.limits.sashWide.replace('{n}', String(Math.round(limit))));
  } else if (widthPer(cfg.sashes) < 400 && cfg.sashes > rule.sashes[0]) {
    const ok = [...rule.sashes].reverse().find((n) => n < cfg.sashes && widthPer(n) >= 400);
    if (ok) cfg.sashes = ok;
  }
  if (!glazingAllowed(sys, cfg.glazing)) cfg.glazing = 'lowE';
  if (cfg.glazing === 'triple' && sys.uw3 === null) cfg.glazing = 'lowE';
  if (!COLOURS[sys.family].includes(cfg.colour)) cfg.colour = 'white';
}

// ---------- build static controls once ----------
function group(label: string, id: string) { return `<div class="cfg-group"><span class="lb">${label}</span><div id="${id}"></div></div>`; }
panel.innerHTML = `
  ${group(c.type, 'gProduct')}
  <div class="cfg-group"><span class="lb">${c.size}</span>
    <div class="sz"><label for="inW">${c.width}</label><input type="range" id="rgW" aria-label="${c.width}"><input class="input" id="inW" inputmode="numeric" aria-label="${c.width} ${c.mmUnit}"></div>
    <div class="sz"><label for="inH">${c.height}</label><input type="range" id="rgH" aria-label="${c.height}"><input class="input" id="inH" inputmode="numeric" aria-label="${c.height} ${c.mmUnit}"></div>
  </div>
  ${group(c.sashes, 'gSashes')}
  ${group(c.opening, 'gOpening')}
  ${group(c.system, 'gSystem')}
  ${group(c.glazing, 'gGlazing')}
  ${group(c.colour, 'gColour')}
  <div class="price-card">
    <div class="mono" style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent-2)">${c.estimate}</div>
    <div class="price-big"><span id="pTotal"></span><small>${D.common.amd}</small></div>
    <div class="price-meta"><span>${c.incl}</span><span>${c.each}: <b id="pUnit"></b></span></div>
    <div class="price-meta"><span>${c.area}: <b id="pArea"></b> ${D.common.m2}</span><span>${c.uw}: <b id="pUw"></b> W/m²K</span><span><b id="pM2"></b> ${D.common.amd} ${D.common.perM2}</span></div>
    <div class="bd" id="pBd"></div>
    <div class="price-act">
      <div class="qty" role="group" aria-label="${c.qty}"><button type="button" id="qMinus" aria-label="−">−</button><output id="qVal">1</output><button type="button" id="qPlus" aria-label="+">+</button></div>
      <button type="button" class="btn btn-light" id="btnAdd">${D.common.addToQuote}</button>
      <a class="btn btn-line sm" href="${D.quote}">${D.common.requestQuote}</a>
    </div>
    <p class="sample-line">${c.range} ${c.samplePrice}</p>
  </div>`;

function seg(el: string, items: { v: string; label: string; disabled?: boolean }[], cur: string, on: (v: string) => void, cls = 'seg') {
  const root = $(el);
  root.innerHTML = `<div class="${cls}" role="group">${items.map((i) => `<button type="button" data-v="${i.v}" aria-pressed="${i.v === cur}" ${i.disabled ? 'disabled' : ''}>${i.label}</button>`).join('')}</div>`;
  root.querySelectorAll<HTMLButtonElement>('button').forEach((b) => b.addEventListener('click', () => on(b.dataset.v!)));
}

function renderControls() {
  const sys = sysById(cfg.system);
  const rule = PRODUCT_RULES[cfg.product];
  seg('#gProduct', (Object.keys(PRODUCT_RULES) as Product[]).map((p) => ({ v: p, label: c.types[p] })), cfg.product, (v) => { cfg.product = v as Product; update('product'); });
  seg('#gSashes', rule.sashes.map((n) => ({ v: String(n), label: String(n) })), String(cfg.sashes), (v) => { cfg.sashes = +v; update('sashes'); });
  seg('#gOpening', rule.openings.map((o) => ({ v: o, label: c.openings[o] })), cfg.opening, (v) => { cfg.opening = v as Opening; update('opening'); });
  seg('#gGlazing', (Object.keys(c.glazings) as Glazing[]).map((g) => ({ v: g, label: c.glazings[g], disabled: !glazingAllowed(sys, g) })), cfg.glazing, (v) => { cfg.glazing = v as Glazing; update('glazing'); });
  $('#gSystem').innerHTML = `<div class="sys-list">${SYSTEMS.map((s) => {
    const ok = s.products.includes(cfg.product);
    return `<button type="button" class="sys-opt" data-v="${s.id}" aria-pressed="${s.id === cfg.system}" ${ok ? '' : 'disabled'}><span><b>${s.name}</b><br><small>${s.depth} ${D.common.mm} · ${s.chambers} ${D.sys.rows.chambers.toLowerCase()}</small></span><span class="mono">Uw ${s.uwDouble.toFixed(1)}</span></button>`;
  }).join('')}</div>`;
  $('#gSystem').querySelectorAll<HTMLButtonElement>('button').forEach((b) => b.addEventListener('click', () => { cfg.system = b.dataset.v!; update('system'); }));
  $('#gColour').innerHTML = `<div class="swatches">${COLOURS[sys.family].map((k) => `<button type="button" class="sw" data-v="${k}" aria-pressed="${k === cfg.colour}"><i style="background:${COLOUR_HEX[k]}"></i>${c.colours[k]}</button>`).join('')}</div>`;
  $('#gColour').querySelectorAll<HTMLButtonElement>('button').forEach((b) => b.addEventListener('click', () => { cfg.colour = b.dataset.v as Colour; update('colour'); }));
}

const inW = $('#inW') as HTMLInputElement, inH = $('#inH') as HTMLInputElement, rgW = $('#rgW') as HTMLInputElement, rgH = $('#rgH') as HTMLInputElement;
function syncSize() {
  const sys = sysById(cfg.system), rule = PRODUCT_RULES[cfg.product];
  rgW.min = String(rule.minW); rgW.max = String(sys.maxW); rgW.step = '10'; rgW.value = String(cfg.w);
  rgH.min = String(rule.minH); rgH.max = String(sys.maxH); rgH.step = '10'; rgH.value = String(cfg.h);
  if (document.activeElement !== inW) inW.value = String(cfg.w);
  if (document.activeElement !== inH) inH.value = String(cfg.h);
}
rgW.addEventListener('input', () => { cfg.w = +rgW.value; update('w'); });
rgH.addEventListener('input', () => { cfg.h = +rgH.value; update('h'); });
const numIn = (el: HTMLInputElement, key: 'w' | 'h') => {
  el.addEventListener('input', () => { const v = parseInt(el.value.replace(/\D/g, ''), 10); if (v >= 300) { cfg[key] = v; update(key, true); } });
  el.addEventListener('blur', () => { el.value = String(cfg[key]); });
};
numIn(inW, 'w'); numIn(inH, 'h');

function renderResult() {
  const sys = sysById(cfg.system);
  const r = priceOf(cfg);
  $('#pTotal').textContent = nf(r.total); $('#pUnit').textContent = `${nf(r.unit)} ${D.common.amd}`;
  $('#pArea').textContent = r.area.toFixed(2); $('#pUw').textContent = r.uw.toFixed(1); $('#pM2').textContent = nf(r.perM2);
  const rows: [string, number][] = [[c.bProfile, r.profile], [c.bGlass, r.glass], [c.bHardware, r.hardware]];
  if (r.door) rows.push([c.bDoor, r.door]);
  if (r.colour) rows.push([c.bColour, r.colour]);
  $('#pBd').innerHTML = rows.map(([k, v]) => `<div><span>${k}</span><span>${v < 0 ? '−' : ''}${nf(Math.abs(v))}</span></div>`).join('');
  $('#qVal').textContent = String(cfg.qty);
  cap.textContent = `${c.types[cfg.product]} · ${sys.name} · ${cfg.w} × ${cfg.h} ${c.mmUnit}`;
  svg.innerHTML = drawWindow(cfg, { view, labels: { w: '', h: '' } });
  warn.textContent = notes[0] || '';
}

function update(changed: string, fromTyping = false) {
  normalize(changed);
  try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch { /* ignore */ }
  if (!fromTyping || changed === 'product' || changed === 'system') renderControls();
  else { /* keep inputs focused, refresh sash/system availability cheaply */ renderControls(); }
  syncSize(); renderResult();
}
document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((b) => b.addEventListener('click', () => {
  view = b.dataset.view as 'inside' | 'outside';
  document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  renderResult();
}));
$('#qMinus').addEventListener('click', () => { cfg.qty = Math.max(1, cfg.qty - 1); update('qty'); });
$('#qPlus').addEventListener('click', () => { cfg.qty = Math.min(99, cfg.qty + 1); update('qty'); });
$('#btnAdd').addEventListener('click', () => {
  const r = priceOf(cfg), sys = sysById(cfg.system);
  addItem({ kind: 'window', label: `${c.types[cfg.product]} · ${sys.name}`, detail: `${cfg.w} × ${cfg.h} ${c.mmUnit} · ${c.openings[cfg.opening]} · ${c.glazings[cfg.glazing]} · ${c.colours[cfg.colour]}`, qty: cfg.qty, unit: r.unit, area: r.area, cfg: { ...cfg } });
  toast(D.common.added, { href: D.quote, label: D.common.requestQuote });
});
update('init');
