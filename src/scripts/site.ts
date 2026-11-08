import { readBasket, removeItem } from '../lib/basket';

const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
export function i18n<T = any>(id = 'i18n'): T { const el = document.getElementById(id); return el ? JSON.parse(el.textContent || '{}') : ({} as T); }
export const lang = document.documentElement.lang as 'en' | 'ru' | 'hy';
export const nf = (n: number) => new Intl.NumberFormat(lang === 'hy' ? 'hy-AM' : lang === 'ru' ? 'ru-RU' : 'en-US', { maximumFractionDigits: 0 }).format(Math.round(n)).replace(/ /g, ' ');

document.documentElement.classList.add('js');

// header
const hdr = $('#hdr');
const onScroll = () => hdr?.classList.toggle('solid', window.scrollY > 40 || hdr.dataset.solid === '1');
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });
const menuBtn = $('#menuBtn');
menuBtn?.addEventListener('click', () => {
  const open = hdr!.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

// reveal on scroll
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
// safety net: never leave content hidden
setTimeout(() => document.querySelectorAll('.reveal:not(.in)').forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add('in'); }), 1200);

// basket drawer + toast
const S = i18n<any>('site-i18n');
const countEl = $('#basketN');
const drawer = $('#drawer');
const list = $('#drawerList');
function renderBasket() {
  const items = readBasket();
  const n = items.reduce((a, i) => a + i.qty, 0);
  if (countEl) countEl.textContent = String(n);
  if (!list) return;
  if (!items.length) { list.innerHTML = `<p class="mut" style="color:var(--mut)">${S.empty}</p>`; $('#drawerTotal')!.textContent = ''; return; }
  list.innerHTML = items.map((i) => `<div class="b-item"><div><b>${i.label}</b><small>${i.detail}</small></div><div class="num"><b>${nf(i.unit * i.qty)} ${S.amd}</b><small>× ${i.qty}</small></div><span></span><button data-rm="${i.id}">${S.remove}</button></div>`).join('');
  const total = items.reduce((a, i) => a + i.unit * i.qty, 0);
  $('#drawerTotal')!.textContent = total ? `${nf(total)} ${S.amd}` : '';
  list.querySelectorAll<HTMLButtonElement>('[data-rm]').forEach((b) => b.addEventListener('click', () => removeItem(b.dataset.rm!)));
}
window.addEventListener('basket:change', renderBasket);
renderBasket();
const open = (v: boolean) => { drawer?.classList.toggle('open', v); if (v) renderBasket(); };
$('#basketBtn')?.addEventListener('click', () => open(true));
$('#drawerClose')?.addEventListener('click', () => open(false));
$('.drawer-bg')?.addEventListener('click', () => open(false));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') open(false); });
export function toast(msg: string, link?: { href: string; label: string }) {
  const t = $('#toast'); if (!t) return;
  t.innerHTML = `<span>${msg}</span>${link ? `<a href="${link.href}">${link.label}</a>` : ''}`;
  t.classList.add('show');
  clearTimeout((t as any)._t);
  (t as any)._t = setTimeout(() => t.classList.remove('show'), 4200);
}
