import { i18n, nf, toast } from './site';
import { CITIES, FUELS, OLD_WINDOWS, savingsCalc, type Glazing } from '../data/pricing';
import { sysById } from '../data/systems';
import { addItem } from '../lib/basket';

const D = i18n<any>();
const s = D.sav;
const $ = (id: string) => document.getElementById(id) as HTMLElement;
const st = { city: 'yerevan', area: 18, old: 'woodDouble', sys: 'pvc70', gl: 'lowE' as Glazing, fuel: 'gas', price: FUELS.gas.price };
try { const x = JSON.parse(localStorage.getItem('eurog-sav-v1') || 'null'); if (x) Object.assign(st, x); } catch { /* ignore */ }

($('sCity') as HTMLSelectElement).innerHTML = D.cities.map((c: any) => `<option value="${c.id}">${c.name}</option>`).join('');
($('sSys') as HTMLSelectElement).innerHTML = D.systems.map((c: any) => `<option value="${c.id}">${c.name}</option>`).join('');
function chips(id: string, items: [string, string][], key: keyof typeof st, on?: () => void) {
  const el = $(id);
  el.innerHTML = items.map(([v, l]) => `<button type="button" class="pill" data-v="${v}" aria-pressed="${String(st[key]) === v}">${l}</button>`).join('');
  el.querySelectorAll<HTMLButtonElement>('button').forEach((b) => b.addEventListener('click', () => { (st as any)[key] = b.dataset.v; on?.(); ui(); run(); }));
}
function ui() {
  ($('sCity') as HTMLSelectElement).value = st.city;
  ($('sSys') as HTMLSelectElement).value = st.sys;
  ($('sAreaR') as HTMLInputElement).value = String(st.area); $('sAreaO').textContent = String(st.area);
  ($('sPrice') as HTMLInputElement).value = String(st.price);
  chips('sOld', Object.keys(OLD_WINDOWS).map((k) => [k, s.olds[k]]), 'old');
  chips('sFuel', Object.keys(FUELS).map((k) => [k, s.fuels[k]]), 'fuel', () => { st.price = FUELS[st.fuel].price; ($('sPrice') as HTMLInputElement).value = String(st.price); });
  const sys = sysById(st.sys);
  const gl = Object.keys(D.glazings).filter((g) => (g === 'triple' ? sys.uw3 !== null : true));
  if (!gl.includes(st.gl)) st.gl = 'lowE';
  chips('sGl', gl.map((g) => [g, D.glazings[g]]), 'gl');
}
function chart(o: ReturnType<typeof savingsCalc>) {
  const max = Math.max(o.cOld, 1);
  const bar = (y: number, v: number, label: string, col: string) => {
    const w = Math.max(6, (v / max) * 330);
    return `<text x="0" y="${y + 16}" font-family="IBM Plex Mono, monospace" font-size="16" fill="#9aa1ad">${label}</text>
      <rect x="0" y="${y + 28}" width="${w}" height="34" rx="4" fill="${col}"/>
      <text x="${w + 12}" y="${y + 52}" font-family="IBM Plex Mono, monospace" font-size="18" fill="#e9ecef">${nf(v)}</text>`;
  };
  $('sChart').innerHTML = bar(0, o.cOld, s.before + ` · U ${o.uOld.toFixed(1)}`, '#f0a15c') + bar(86, o.cNew, s.after + ` · U ${o.uNew.toFixed(1)}`, '#6fc9da');
}
function run() {
  try { localStorage.setItem('eurog-sav-v1', JSON.stringify(st)); } catch { /* ignore */ }
  const city = CITIES.find((c) => c.id === st.city)!;
  const o = savingsCalc({ hdd: city.hdd, area: st.area, old: st.old, sys: st.sys, glazing: st.gl, price: st.price, co2: FUELS[st.fuel].co2 });
  chart(o);
  $('rSave').textContent = nf(o.save);
  $('rPct').textContent = `−${o.pct}%`;
  $('rPay').textContent = Number.isFinite(o.payback) ? `${o.payback < 10 ? o.payback.toFixed(1) : Math.round(o.payback)} ${D.common.years}` : s.noPayback;
  $('rCo2').textContent = nf(o.co2);
  $('rNote').textContent = `${s.paybackNote} ${D.common.amd} ${nf(o.invest)}.`;
  (window as any).__sav = o;
}
$('sCity').addEventListener('change', (e) => { st.city = (e.target as HTMLSelectElement).value; run(); });
$('sSys').addEventListener('change', (e) => { st.sys = (e.target as HTMLSelectElement).value; ui(); run(); });
$('sAreaR').addEventListener('input', (e) => { st.area = +(e.target as HTMLInputElement).value; $('sAreaO').textContent = String(st.area); run(); });
$('sPrice').addEventListener('input', (e) => { const v = +(e.target as HTMLInputElement).value; if (v > 0) { st.price = v; run(); } });
$('sAdd').addEventListener('click', () => {
  const o = (window as any).__sav; const sys = sysById(st.sys);
  addItem({ kind: 'savings', label: `${s.title}: ${st.area} ${D.common.m2}`, detail: `${sys.name} · ${s.saving} ${nf(o.save)} ${D.common.amd} ${D.common.perYear}`, qty: 1, unit: o.invest, area: st.area });
  toast(D.common.added, { href: D.quote, label: D.common.requestQuote });
});
ui(); run();
