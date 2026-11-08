const grid = document.getElementById('sysGrid')!;
document.querySelectorAll<HTMLButtonElement>('#famTabs button').forEach((b) => b.addEventListener('click', () => {
  document.querySelectorAll('#famTabs button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  const f = b.dataset.f!;
  grid.querySelectorAll<HTMLElement>('.sys-card').forEach((c) => { c.hidden = !(f === 'all' || c.dataset.f === f); });
}));
const pick = document.getElementById('cmpPick')!;
const table = document.getElementById('cmpTable')!;
const count = document.getElementById('cmpCount')!;
function apply() {
  const on = new Set([...pick.querySelectorAll<HTMLButtonElement>('button[aria-pressed="true"]')].map((b) => b.dataset.id));
  table.querySelectorAll<HTMLElement>('[data-id]').forEach((c) => c.classList.toggle('hide', !on.has(c.dataset.id)));
  count.textContent = `${on.size} / 4`;
  // highlight the lowest value per numeric row among visible columns
  table.querySelectorAll<HTMLElement>('tr[data-row]').forEach((tr) => {
    const cells = [...tr.querySelectorAll<HTMLElement>('td[data-v]')].filter((c) => c.dataset.v !== '' && !c.classList.contains('hide'));
    cells.forEach((c) => c.classList.remove('best'));
    if (!cells.length) return;
    const min = Math.min(...cells.map((c) => +c.dataset.v!));
    if (min < 99) cells.filter((c) => +c.dataset.v! === min).forEach((c) => c.classList.add('best'));
  });
}
pick.querySelectorAll<HTMLButtonElement>('button').forEach((b) => b.addEventListener('click', () => {
  const on = pick.querySelectorAll('button[aria-pressed="true"]').length;
  if (b.getAttribute('aria-pressed') === 'true') { if (on > 1) b.setAttribute('aria-pressed', 'false'); }
  else if (on < 4) b.setAttribute('aria-pressed', 'true');
  apply();
}));
apply();
