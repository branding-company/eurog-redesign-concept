import { i18n } from './site';
const D = i18n<any>();
const p = D.p;
const $ = (id: string) => document.getElementById(id)!;
const pins = [...document.querySelectorAll<SVGGElement>('.pin')];
const cards = [...document.querySelectorAll<HTMLElement>('.prj-card')];
const filter = [...document.querySelectorAll<HTMLButtonElement>('#prjFilter button')];
let type = 'all', sel = '';
function detail() {
  const x = D.data.find((d: any) => d.id === sel);
  const el = $('prjDetail');
  if (!x) { el.innerHTML = `<div class="body"><p class="eye" style="margin:0">${p.details}</p><p style="color:var(--mut)">${p.pick}</p></div>`; return; }
  el.innerHTML = `<div class="photo"><img src="${x.img}" alt="${x.name}, ${x.city}" width="800" height="500"></div>
    <div class="body"><span class="sample-tag" style="justify-self:start">${p.sample}</span><h3>${x.name}</h3>
    <dl><div><dt>${p.location}</dt><dd>${x.city}</dd></div><div><dt>${p.year}</dt><dd>${x.year}</dd></div><div><dt>${D.common.m2}</dt><dd>${x.area} ${D.common.m2}</dd></div><div><dt>${p.systems}</dt><dd>${x.systems.join(', ')}</dd></div></dl>
    <p class="mono" style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent)">${p.types[x.type]}</p>
    <a class="btn btn-ink sm" href="${D.quote}">${p.quoteSimilar}</a></div>`;
}
function apply() {
  let n = 0;
  pins.forEach((g) => { const ok = type === 'all' || g.dataset.t === type; g.classList.toggle('off', !ok); g.classList.toggle('on', g.dataset.id === sel && ok); });
  cards.forEach((c) => { const ok = type === 'all' || c.dataset.t === type; c.hidden = !ok; c.classList.toggle('on', c.dataset.id === sel); if (ok) n++; });
  $('prjCount').textContent = String(n);
  $('prjNone').hidden = n > 0;
  const x = D.data.find((d: any) => d.id === sel);
  if (x && type !== 'all' && x.type !== type) { sel = ''; }
  detail();
}
filter.forEach((b) => b.addEventListener('click', () => { type = b.dataset.t!; filter.forEach((x) => x.setAttribute('aria-pressed', String(x === b))); apply(); }));
const choose = (id: string) => { sel = id; apply(); if (innerWidth < 900) $('prjDetail').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); };
pins.forEach((g) => { g.addEventListener('click', () => choose(g.dataset.id!)); g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(g.dataset.id!); } }); });
cards.forEach((c) => { c.addEventListener('click', () => choose(c.dataset.id!)); c.addEventListener('keydown', (e) => { if (e.key === 'Enter') choose(c.dataset.id!); }); });
sel = 'p3';
apply();
