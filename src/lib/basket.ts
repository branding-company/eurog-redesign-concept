// Quote list kept in the browser. Shared by the configurator, savings calculator and quote form.
export interface BasketItem {
  id: string;
  kind: 'window' | 'savings';
  label: string; // human label, language of the visitor at the time
  detail: string;
  qty: number;
  unit: number; // AMD per unit, incl. VAT
  area: number; // m2 per unit
  cfg?: Record<string, unknown>;
}
const KEY = 'eurog-quote-v1';
export function readBasket(): BasketItem[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function write(items: BasketItem[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* private mode */ }
  window.dispatchEvent(new CustomEvent('basket:change', { detail: items }));
}
export function addItem(item: Omit<BasketItem, 'id'>) {
  const items = readBasket();
  items.push({ ...item, id: Math.random().toString(36).slice(2, 9) });
  write(items);
}
export function removeItem(id: string) { write(readBasket().filter((i) => i.id !== id)); }
export function clearBasket() { write([]); }
export function basketCount() { return readBasket().reduce((n, i) => n + i.qty, 0); }
