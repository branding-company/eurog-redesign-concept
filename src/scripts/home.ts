import { i18n, nf } from './site';
import { drawWindow } from '../lib/windowSvg';
import { priceOf, savingsCalc, CITIES, FUELS, type Config } from '../data/pricing';

const D = i18n<any>();
const $ = (id: string) => document.getElementById(id) as HTMLElement;

// audience tabs
const tabs = [...document.querySelectorAll<HTMLButtonElement>('#audTabs button')];
const panes = [...document.querySelectorAll<HTMLElement>('.aud-pan')];
tabs.forEach((b, i) => b.addEventListener('click', () => { tabs.forEach((x, k) => x.setAttribute('aria-selected', String(k === i))); panes.forEach((p, k) => (p.hidden = k !== i)); }));
tabs.forEach((b, i) => b.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length; tabs[n].focus(); tabs[n].click(); } }));

// counters
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return; io.unobserve(e.target);
  const el = e.target as HTMLElement, to = +el.dataset.count!; const t0 = performance.now();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const step = (t: number) => { const k = Math.min(1, (t - t0) / 1400); el.textContent = nf(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}), { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach((el) => io.observe(el));

// configurator teaser
const cfg: Config = { product: 'window', w: 1200, h: 1400, sashes: 2, opening: 'tiltTurn', system: 'pvc70', glazing: 'lowE', colour: 'white', qty: 1 };
const svg = $('tzSvg') as unknown as SVGSVGElement;
function drawCfg() {
  $('tzWo').textContent = String(cfg.w); $('tzHo').textContent = String(cfg.h);
  svg.innerHTML = drawWindow(cfg, { dims: true });
  $('tzPrice').textContent = nf(priceOf(cfg).unit);
  ($('tzGo') as HTMLAnchorElement).href = `${D.cfgHref}?w=${cfg.w}&h=${cfg.h}`;
}
($('tzW') as HTMLInputElement).addEventListener('input', (e) => { cfg.w = +(e.target as HTMLInputElement).value; drawCfg(); });
($('tzH') as HTMLInputElement).addEventListener('input', (e) => { cfg.h = +(e.target as HTMLInputElement).value; drawCfg(); });
document.querySelectorAll<HTMLButtonElement>('#tzSash button').forEach((b) => b.addEventListener('click', () => {
  cfg.sashes = +b.dataset.n!; document.querySelectorAll('#tzSash button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); drawCfg();
}));
drawCfg();

// savings teaser
function sav() {
  const area = +($('hsArea') as HTMLInputElement).value, city = CITIES.find((c) => c.id === ($('hsCity') as HTMLSelectElement).value)!;
  $('hsAo').textContent = String(area);
  const o = savingsCalc({ hdd: city.hdd, area, old: 'woodDouble', sys: 'pvc70', glazing: 'lowE', price: FUELS.gas.price, co2: FUELS.gas.co2 });
  $('hsOld').textContent = nf(o.cOld); $('hsNew').textContent = nf(o.cNew); $('hsSave').textContent = nf(o.save);
}
$('hsArea').addEventListener('input', sav); $('hsCity').addEventListener('change', sav); sav();
