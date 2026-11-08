import type { System } from '../data/systems';

/** Illustrative cross-section of a profile. Not a manufacturing drawing. */
export function sectionSvg(sys: System, o: { dark?: boolean; labels?: boolean } = {}): string {
  const dark = o.dark ?? false;
  const body = dark ? '#e9ecef' : '#ffffff';
  const stroke = dark ? '#0c0e12' : '#1a1d24';
  const void_ = dark ? '#13161b' : '#d9dde2';
  const W = Math.round(sys.depth * 2.3), H = 150, x0 = 24, y0 = 28;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 210" role="img" aria-label="${sys.name}">`;
  if (sys.family === 'pvc') {
    s += `<rect x="${x0}" y="${y0}" width="${W}" height="${H}" rx="6" fill="${body}" stroke="${stroke}" stroke-width="2"/>`;
    const n = sys.chambers, wall = 4;
    // main chamber is double width
    const weights = Array.from({ length: n }, (_, i) => (i === Math.floor(n / 2) ? 2.2 : 1));
    const sum = weights.reduce((a, b) => a + b, 0);
    const avail = W - wall * (n + 1);
    let x = x0 + wall;
    weights.forEach((wt, i) => {
      const w = (avail * wt) / sum;
      s += `<rect x="${x}" y="${y0 + 8}" width="${w}" height="${H - 16}" rx="2" fill="${void_}"/>`;
      if (wt > 1) s += `<rect x="${x + w * 0.2}" y="${y0 + H / 2 - 20}" width="${w * 0.6}" height="40" fill="none" stroke="#8d8e8d" stroke-width="4"/>`;
      x += w + wall;
    });
    s += `<rect x="${x0 + W}" y="${y0 + 30}" width="26" height="${H - 60}" fill="#6fc9da" opacity=".5"/>`;
  } else if (sys.family === 'alu' && !sys.thermal) {
    s += `<rect x="${x0}" y="${y0}" width="${W}" height="${H}" rx="4" fill="#8d8e8d" stroke="${stroke}" stroke-width="2"/>`;
    const ww = (W - 12) / 2;
    s += `<rect x="${x0 + 4}" y="${y0 + 14}" width="${ww - 2}" height="${H - 28}" rx="2" fill="${void_}"/><rect x="${x0 + 8 + ww}" y="${y0 + 14}" width="${ww - 4}" height="${H - 28}" rx="2" fill="${void_}"/>`;
    s += `<rect x="${x0 + W}" y="${y0 + 30}" width="26" height="${H - 60}" fill="#6fc9da" opacity=".5"/>`;
  } else {
    const half = (W - 14) / 2;
    s += `<rect x="${x0}" y="${y0}" width="${half}" height="${H}" rx="4" fill="#8d8e8d" stroke="${stroke}" stroke-width="2"/>`;
    s += `<rect x="${x0 + half + 14}" y="${y0}" width="${half}" height="${H}" rx="4" fill="#8d8e8d" stroke="${stroke}" stroke-width="2"/>`;
    s += `<rect x="${x0 + half}" y="${y0 + 16}" width="14" height="${H - 32}" fill="#f0a15c" stroke="${stroke}" stroke-width="1.5"/>`;
    s += `<rect x="${x0 + 6}" y="${y0 + 14}" width="${half - 12}" height="${H - 28}" rx="2" fill="${void_}"/><rect x="${x0 + half + 20}" y="${y0 + 14}" width="${half - 12}" height="${H - 28}" rx="2" fill="${void_}"/>`;
    s += `<rect x="${x0 + W}" y="${y0 + 30}" width="26" height="${H - 60}" fill="#6fc9da" opacity=".5"/>`;
  }
  // depth dimension
  const lc = dark ? '#9aa1ad' : '#5a606b';
  s += `<g stroke="${lc}" stroke-width="1" fill="none"><line x1="${x0}" y1="${y0 + H + 18}" x2="${x0 + W}" y2="${y0 + H + 18}"/><line x1="${x0}" y1="${y0 + H + 13}" x2="${x0}" y2="${y0 + H + 23}"/><line x1="${x0 + W}" y1="${y0 + H + 13}" x2="${x0 + W}" y2="${y0 + H + 23}"/></g>`;
  s += `<text x="${x0 + W / 2}" y="${y0 + H + 34}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="${dark ? '#e9ecef' : '#1a1d24'}">${sys.depth} mm</text>`;
  s += `</svg>`;
  return s;
}
