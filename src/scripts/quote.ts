import { i18n, nf, lang } from './site';
import { readBasket, clearBasket } from '../lib/basket';

const D = i18n<any>();
const q = D.qt;
const $ = (id: string) => document.getElementById(id)!;
interface St { step: number; type: string; need: string[]; city: string; notes: string; files: { name: string; size: number; url?: string }[]; name: string; phone: string; email: string; role: string; clang: string; skip: boolean; day: string; time: string; addr: string }
let S: St = { step: 0, type: '', need: [], city: '', notes: '', files: [], name: '', phone: '', email: '', role: 'owner', clang: lang, skip: false, day: '', time: '', addr: '' };
try { const x = JSON.parse(localStorage.getItem('eurog-quote-draft') || 'null'); if (x) S = { ...S, ...x, files: [], step: 0 }; } catch { /* ignore */ }
const save = () => { try { localStorage.setItem('eurog-quote-draft', JSON.stringify({ ...S, files: [] })); } catch { /* ignore */ } };
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
let errors: Record<string, string> = {};
const fileObjs: File[] = [];

function days() {
  const out: { iso: string; wd: string; d: number; m: string }[] = [];
  const d = new Date(); d.setHours(0, 0, 0, 0);
  while (out.length < 14) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) continue;
    out.push({ iso: d.toISOString().slice(0, 10), wd: q.weekdays[(d.getDay() + 6) % 7], d: d.getDate(), m: q.months[d.getMonth()] });
  }
  return out;
}
const SLOTS = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
const taken = (iso: string, t: string) => ((iso.charCodeAt(9) + t.charCodeAt(1) + t.charCodeAt(3)) % 5) === 0;

function opts(key: 'type', items: [string, string][]) {
  return `<div class="opts">${items.map(([v, l]) => `<button type="button" class="opt" data-k="${key}" data-v="${v}" aria-pressed="${S[key] === v}">${l}</button>`).join('')}</div>`;
}
const field = (id: string, label: string, val: string, extra = '', type = 'text') => `<div class="field"><label for="${id}">${label}</label><input class="input ${errors[id] ? 'bad' : ''}" id="${id}" type="${type}" value="${esc(val)}" ${extra}>${errors[id] ? `<span class="err">${errors[id]}</span>` : ''}</div>`;

function panel(): string {
  const s1 = q.s1, s2 = q.s2, s3 = q.s3, s4 = q.s4, s5 = q.s5;
  if (S.step === 0) return `<h2>${s1.t}</h2>
    <div class="field"><span class="lb">${s1.type}</span>${opts('type', Object.entries(s1.types) as [string, string][])}</div>
    <div class="field"><span class="lb">${s1.need}</span><div class="opts">${Object.entries(s1.needs).map(([v, l]) => `<button type="button" class="opt" data-need="${v}" aria-pressed="${S.need.includes(v)}">${l}</button>`).join('')}</div></div>
    ${field('city', s1.city, S.city, `placeholder="${s1.cityPh}" autocomplete="address-level2"`)}`;
  if (S.step === 1) {
    const items = readBasket();
    const area = items.reduce((a, i) => a + i.area * i.qty, 0);
    return `<h2>${s2.t}</h2><p style="color:var(--mut)">${s2.lead}</p>
      ${items.length ? `<div>${items.map((i) => `<div class="b-item"><div><b>${esc(i.label)}</b><small>${esc(i.detail)}</small></div><div class="num"><b>${nf(i.unit * i.qty)} ${D.common.amd}</b><small>× ${i.qty}</small></div></div>`).join('')}</div>
      <p class="mono" style="font-size:13px">${s2.area}: ${area.toFixed(1)} ${D.common.m2}</p>` : `<p>${s2.empty}</p>`}
      <div><a class="btn btn-line sm" href="${D.cfg}">${s2.openCfg}</a></div>
      <div class="field"><label for="notes">${s2.notes}</label><textarea class="textarea" id="notes" placeholder="${s2.notesPh}">${esc(S.notes)}</textarea></div>`;
  }
  if (S.step === 2) return `<h2>${s3.t}</h2><p style="color:var(--mut)">${s3.lead}</p>
    <label class="drop" id="drop"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"/></svg><b>${s3.drop}</b><span class="btn btn-ink sm">${s3.choose}</span><small style="color:var(--mut)">${s3.hint}</small><input type="file" id="fileIn" multiple accept="image/*,application/pdf" class="sr"></label>
    <div class="files" id="fileList">${S.files.length ? '' : `<p style="color:var(--mut)">${s3.none}</p>`}</div>`;
  if (S.step === 3) return `<h2>${s4.t}</h2>
    <div class="row2">${field('name', s4.name, S.name, 'autocomplete="name"')}${field('phone', s4.phone, S.phone, 'autocomplete="tel" inputmode="tel" placeholder="+374 44 000 000"', 'tel')}</div>
    ${field('email', s4.email, S.email, 'autocomplete="email" inputmode="email"', 'email')}
    <div class="row2"><div class="field"><label for="role">${s4.role}</label><select class="select" id="role">${Object.entries(s4.roles).map(([v, l]) => `<option value="${v}" ${S.role === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
    <div class="field"><label for="clang">${s4.lang}</label><select class="select" id="clang"><option value="hy" ${S.clang === 'hy' ? 'selected' : ''}>Հայերեն</option><option value="ru" ${S.clang === 'ru' ? 'selected' : ''}>Русский</option><option value="en" ${S.clang === 'en' ? 'selected' : ''}>English</option></select></div></div>`;
  const ds = days();
  return `<h2>${s5.t}</h2><p style="color:var(--mut)">${s5.lead}</p>
    <label style="display:flex;gap:10px;align-items:center;font-weight:600"><input type="checkbox" id="skip" ${S.skip ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--accent)">${s5.skip}</label>
    <div id="visitBox" ${S.skip ? 'hidden' : ''} style="display:grid;gap:18px">
      <div class="field"><span class="lb">${s5.day} · <span style="color:var(--mut);font-weight:400">${s5.sundays}</span></span><div class="days">${ds.map((d) => `<button type="button" class="day" data-day="${d.iso}" aria-pressed="${S.day === d.iso}"><small>${d.wd}</small><b>${d.d}</b><small>${d.m}</small></button>`).join('')}</div></div>
      <div class="field"><span class="lb">${s5.time}</span><div class="slots">${SLOTS.map((t) => `<button type="button" class="slot" data-time="${t}" aria-pressed="${S.time === t}" ${S.day && taken(S.day, t) ? 'disabled' : ''}>${t}</button>`).join('')}</div></div>
      ${field('addr', s5.address, S.addr, `placeholder="${s5.addressPh}" autocomplete="street-address"`)}
    </div>`;
}

function stepsUI() {
  $('qtSteps').innerHTML = q.steps.map((l: string, i: number) => `<li class="${i === S.step ? 'on' : i < S.step ? 'done' : ''}" ${i === S.step ? 'aria-current="step"' : ''}>${l}</li>`).join('');
  ($('qtBack') as HTMLButtonElement).style.visibility = S.step === 0 ? 'hidden' : 'visible';
  $('qtNext').textContent = S.step === 4 ? q.send : D.common.next;
}
function summary() {
  const items = readBasket();
  const area = items.reduce((a, i) => a + i.area * i.qty, 0);
  const total = items.reduce((a, i) => a + i.unit * i.qty, 0);
  const r = (k: string, v: string) => (v ? `<div class="r"><span>${k}</span><span>${v}</span></div>` : '');
  const visit = S.skip ? q.noVisit : S.day ? `${S.day} ${S.time}` : '';
  $('qtSum').innerHTML = `<h3>${q.summary}</h3>${r(q.s1.type, S.type ? q.s1.types[S.type] : '')}${r(q.s1.need, S.need.map((n) => q.s1.needs[n]).join(', '))}${r(q.s1.city, esc(S.city))}${r(q.s2.items, items.length ? String(items.reduce((a, i) => a + i.qty, 0)) : '')}${r(q.s2.area, area ? `${area.toFixed(1)} ${D.common.m2}` : '')}${total ? r(D.cfgTxt.estimate, `${nf(total)} ${D.common.amd}`) : ''}${r(q.steps[2], S.files.length ? String(S.files.length) : '')}${r(q.s4.name, esc(S.name))}${r(q.s4.phone, esc(S.phone))}${r(q.s5.t, visit)}`;
}
function renderFiles() {
  const el = document.getElementById('fileList'); if (!el) return;
  el.innerHTML = S.files.length ? S.files.map((f, i) => `<div class="file">${f.url ? `<img src="${f.url}" alt="">` : `<div class="ph">PDF</div>`}<div><span>${esc(f.name)}</span><button type="button" data-rm="${i}" aria-label="${q.s3.remove}">×</button></div></div>`).join('') : `<p style="color:var(--mut)">${q.s3.none}</p>`;
  el.querySelectorAll<HTMLButtonElement>('[data-rm]').forEach((b) => b.addEventListener('click', () => { const i = +b.dataset.rm!; S.files.splice(i, 1); fileObjs.splice(i, 1); renderFiles(); summary(); }));
}
function addFiles(list: FileList | null) {
  if (!list) return;
  [...list].slice(0, 12).forEach((f) => { fileObjs.push(f); S.files.push({ name: f.name, size: f.size, url: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined }); });
  renderFiles(); summary();
}
function bind() {
  const body = $('qtBody');
  body.querySelectorAll<HTMLButtonElement>('[data-k="type"]').forEach((b) => b.addEventListener('click', () => { S.type = b.dataset.v!; body.querySelectorAll('[data-k="type"]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); save(); summary(); }));
  body.querySelectorAll<HTMLButtonElement>('[data-need]').forEach((b) => b.addEventListener('click', () => { const v = b.dataset.need!; S.need = S.need.includes(v) ? S.need.filter((x) => x !== v) : [...S.need, v]; b.setAttribute('aria-pressed', String(S.need.includes(v))); save(); summary(); }));
  const bindIn = (id: string, key: keyof St) => { const el = document.getElementById(id) as HTMLInputElement | null; el?.addEventListener('input', () => { (S as any)[key] = el.value; el.classList.remove('bad'); save(); summary(); }); };
  ['city', 'notes', 'name', 'phone', 'email', 'addr'].forEach((k) => bindIn(k, k as keyof St));
  document.getElementById('role')?.addEventListener('change', (e) => { S.role = (e.target as HTMLSelectElement).value; save(); });
  document.getElementById('clang')?.addEventListener('change', (e) => { S.clang = (e.target as HTMLSelectElement).value; save(); });
  const drop = document.getElementById('drop');
  const fin = document.getElementById('fileIn') as HTMLInputElement | null;
  fin?.addEventListener('change', () => { addFiles(fin.files); fin.value = ''; });
  drop?.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over'); });
  drop?.addEventListener('dragleave', () => drop.classList.remove('over'));
  drop?.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('over'); addFiles((e as DragEvent).dataTransfer?.files ?? null); });
  renderFiles();
  document.getElementById('skip')?.addEventListener('change', (e) => { S.skip = (e.target as HTMLInputElement).checked; $('visitBox').hidden = S.skip; save(); summary(); });
  body.querySelectorAll<HTMLButtonElement>('[data-day]').forEach((b) => b.addEventListener('click', () => { S.day = b.dataset.day!; if (S.time && taken(S.day, S.time)) S.time = ''; save(); render(); }));
  body.querySelectorAll<HTMLButtonElement>('[data-time]').forEach((b) => b.addEventListener('click', () => { S.time = b.dataset.time!; save(); body.querySelectorAll('[data-time]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); summary(); }));
}
function validate(): boolean {
  errors = {};
  if (S.step === 3) {
    if (!S.name.trim()) errors.name = q.s4.required;
    if (S.phone.replace(/\D/g, '').length < 8) errors.phone = q.s4.badPhone;
    if (S.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(S.email)) errors.email = q.s4.badEmail;
  }
  if (S.step === 4 && !S.skip && (!S.day || !S.time || !S.addr.trim())) { if (!S.addr.trim()) errors.addr = q.s5.pick; if (!S.day || !S.time) errors.visit = q.s5.pick; }
  return !Object.keys(errors).length;
}
function render() {
  $('qtBody').innerHTML = panel() + (errors.visit ? `<p class="err">${errors.visit}</p>` : '');
  stepsUI(); bind(); summary();
}
$('qtBack').addEventListener('click', () => { if (S.step > 0) { S.step--; errors = {}; render(); scrollTo({ top: $('qtSteps').offsetTop - 140, behavior: 'smooth' }); } });
$('qtNext').addEventListener('click', () => {
  if (!validate()) { render(); const bad = document.querySelector<HTMLElement>('.bad, .err'); bad?.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
  if (S.step < 4) { S.step++; render(); scrollTo({ top: $('qtSteps').offsetTop - 140, behavior: 'smooth' }); return; }
  // submit (concept: stored locally only)
  const ref = 'EG-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const items = readBasket();
  const rec = { ref, at: new Date().toISOString(), ...S, files: S.files.map((f) => f.name), items };
  try { const all = JSON.parse(localStorage.getItem('eurog-requests') || '[]'); all.push(rec); localStorage.setItem('eurog-requests', JSON.stringify(all)); localStorage.removeItem('eurog-quote-draft'); } catch { /* ignore */ }
  const total = items.reduce((a, i) => a + i.unit * i.qty, 0);
  $('qtForm').hidden = true; $('qtSteps').hidden = true; $('qtSum').hidden = true;
  const done = $('qtDone'); done.hidden = false;
  done.innerHTML = `<div class="ok-ic"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7"/></svg></div><h2>${q.doneTitle}</h2><p style="color:var(--mut)">${q.doneBody}</p>
    <dl><div class="r" style="display:flex;justify-content:space-between;border-top:1px solid var(--line);padding:10px 0"><dt>${q.ref}</dt><dd class="mono" style="margin:0;font-weight:700">${ref}</dd></div>
    <div style="display:flex;justify-content:space-between;border-top:1px solid var(--line);padding:10px 0"><dt>${q.s4.name}</dt><dd style="margin:0;font-weight:600">${esc(S.name)}</dd></div>
    <div style="display:flex;justify-content:space-between;border-top:1px solid var(--line);padding:10px 0"><dt>${q.visit}</dt><dd style="margin:0;font-weight:600">${S.skip ? q.noVisit : `${S.day} ${S.time}`}</dd></div>
    ${total ? `<div style="display:flex;justify-content:space-between;border-top:1px solid var(--line);padding:10px 0"><dt>${D.cfgTxt.estimate}</dt><dd style="margin:0;font-weight:600">${nf(total)} ${D.common.amd}</dd></div>` : ''}</dl>
    <button class="btn btn-ink" id="again">${q.newReq}</button>`;
  clearBasket();
  $('again').addEventListener('click', () => location.reload());
  scrollTo({ top: 0, behavior: 'smooth' });
});
window.addEventListener('basket:change', () => { if (S.step === 1) render(); else summary(); });
render();
