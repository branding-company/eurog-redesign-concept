import { COLOUR_HEX, type Config } from '../data/pricing';
import { sysById } from '../data/systems';

export interface DrawOpts { view?: 'inside' | 'outside'; dims?: boolean; labels?: { w: string; h: string }; size?: number }

const VB = 600;
/** Front elevation of a window or door, as an SVG string (viewBox 0 0 600 560). */
export function drawWindow(c: Config, o: DrawOpts = {}): string {
  const view = o.view ?? 'inside';
  const sys = sysById(c.system);
  const W = c.w, H = c.h;
  const box = 380;
  const sc = Math.min(box / W, (box + 20) / H);
  const w = W * sc, h = H * sc;
  const ox = (VB - w) / 2 + 10, oy = 70 + (box + 20 - h) / 2;
  const col = COLOUR_HEX[c.colour];
  const dark = c.colour === 'anthracite' || c.colour === 'oak' || c.colour === 'ral';
  const line = dark ? '#0c0e12' : '#1a1d24';
  const hi = dark ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.9)';
  const fw = Math.max(8, Math.min(26, sys.depth * sc * 0.75)); // outer frame face width
  const sw = Math.max(6, fw * 0.8); // sash face width
  const n = c.sashes;
  let s = `<defs>
    <linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfe6ee"/><stop offset="1" stop-color="#7bb7c6"/></linearGradient>
    <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#3a404c" stroke-width="1"/></pattern>
  </defs>`;
  // wall context
  s += `<rect x="${ox - 44}" y="${oy - 44}" width="${w + 88}" height="${h + 88}" fill="url(#hatch)" opacity=".55"/>`;
  s += `<rect x="${ox - 6}" y="${oy - 6}" width="${w + 12}" height="${h + 12}" fill="#1d2027" stroke="#4a5160" stroke-width="1"/>`;
  s += `<g transform="${view === 'outside' ? `translate(${2 * (ox + w / 2)} 0) scale(-1 1)` : ''}">`;
  // outer frame
  s += `<rect x="${ox}" y="${oy}" width="${w}" height="${h}" fill="${col}" stroke="${line}" stroke-width="2"/>`;
  s += `<rect x="${ox + 2}" y="${oy + 2}" width="${w - 4}" height="${h - 4}" fill="none" stroke="${hi}" stroke-width="1"/>`;
  const ix = ox + fw, iy = oy + fw, iw = w - 2 * fw, ih = h - 2 * fw;
  const isDoor = c.product === 'entranceDoor';
  const sliding = c.opening === 'sliding';
  // sashes
  const sashW = sliding ? (iw + (n - 1) * sw * 1.2) / n : iw / n;
  for (let i = 0; i < n; i++) {
    const sx = sliding ? ix + i * (sashW - sw * 1.2) : ix + i * sashW;
    const lastRow = sliding && i % 2 === 1;
    const inset = lastRow ? 3 : 0;
    // sash frame
    s += `<rect x="${sx}" y="${iy + inset}" width="${sashW}" height="${ih - inset * 2}" fill="${col}" stroke="${line}" stroke-width="1.6"/>`;
    const fixed = c.opening === 'fixed';
    const gx = sx + (fixed ? 4 : sw), gy = iy + inset + (fixed ? 4 : sw), gw = sashW - (fixed ? 8 : 2 * sw), gh = ih - inset * 2 - (fixed ? 8 : 2 * sw);
    if (isDoor) {
      const panelH = gh * 0.38;
      s += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh - panelH - 6}" fill="url(#gl)" stroke="${line}" stroke-width="1.2"/>`;
      s += `<rect x="${gx}" y="${gy + gh - panelH}" width="${gw}" height="${panelH}" fill="${col}" stroke="${line}" stroke-width="1.2"/><rect x="${gx + 8}" y="${gy + gh - panelH + 8}" width="${gw - 16}" height="${panelH - 16}" fill="none" stroke="${hi}" stroke-width="1"/>`;
    } else {
      s += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" fill="url(#gl)" stroke="${line}" stroke-width="1.2"/>`;
      s += `<polygon points="${gx + gw * 0.12},${gy + gh} ${gx + gw * 0.5},${gy} ${gx + gw * 0.62},${gy} ${gx + gw * 0.24},${gy + gh}" fill="#fff" opacity=".22"/>`;
    }
    // opening symbols and handle
    const hingeLeft = n === 1 ? true : i < n / 2;
    const hx = hingeLeft ? gx : gx + gw, fx = hingeLeft ? gx + gw : gx;
    const midY = gy + gh / 2;
    const sym = 'stroke="#1a1d24" stroke-width="1.3" fill="none" stroke-linejoin="round"';
    if (c.opening === 'turn' || c.opening === 'tiltTurn') s += `<polyline points="${fx},${gy} ${hx},${midY} ${fx},${gy + gh}" ${sym}/>`;
    if (c.opening === 'tilt' || c.opening === 'tiltTurn') s += `<polyline points="${gx},${gy} ${gx + gw / 2},${gy + gh} ${gx + gw},${gy}" ${sym} stroke-dasharray="${c.opening === 'tiltTurn' ? '5 4' : '0'}"/>`;
    if (sliding) {
      const dir = i % 2 === 0 ? 1 : -1;
      s += `<line x1="${gx + gw / 2 - 24 * dir}" y1="${midY}" x2="${gx + gw / 2 + 24 * dir}" y2="${midY}" stroke="#1a1d24" stroke-width="2"/><polyline points="${gx + gw / 2 + (24 - 8) * dir},${midY - 7} ${gx + gw / 2 + 24 * dir},${midY} ${gx + gw / 2 + (24 - 8) * dir},${midY + 7}" ${sym}/>`;
    }
    if (c.opening !== 'fixed') {
      const hxp = hingeLeft ? sx + sashW - sw / 2 : sx + sw / 2;
      const hy = isDoor ? iy + ih * 0.52 : iy + ih * 0.5;
      s += `<rect x="${hxp - 3}" y="${hy - 15}" width="6" height="30" rx="3" fill="#b8bcc4" stroke="#1a1d24" stroke-width="1"/>`;
    }
  }
  s += `</g>`;
  // dimensions (never mirrored)
  if (o.dims !== false) {
    const L = o.labels ?? { w: '', h: '' };
    const y = oy - 28, x = ox - 28;
    s += `<g stroke="#9aa1ad" stroke-width="1" fill="none"><line x1="${ox}" y1="${y}" x2="${ox + w}" y2="${y}"/><line x1="${ox}" y1="${y - 6}" x2="${ox}" y2="${y + 6}"/><line x1="${ox + w}" y1="${y - 6}" x2="${ox + w}" y2="${y + 6}"/>`;
    s += `<line x1="${x}" y1="${oy}" x2="${x}" y2="${oy + h}"/><line x1="${x - 6}" y1="${oy}" x2="${x + 6}" y2="${oy}"/><line x1="${x - 6}" y1="${oy + h}" x2="${x + 6}" y2="${oy + h}"/></g>`;
    s += `<text x="${ox + w / 2}" y="${y - 8}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="13" fill="#e9ecef">${W}${L.w}</text>`;
    s += `<text transform="translate(${x - 10} ${oy + h / 2}) rotate(-90)" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="13" fill="#e9ecef">${H}${L.h}</text>`;
  }
  return s;
}
