// Renders the technical-sheet pages (src/pages/[lang]/systems/sheet/[id].astro) to A4 PDFs in public/downloads.
// Usage: npm run build && npx astro preview --port 4321 & ; npm run sheets
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright')); }
import { mkdirSync } from 'node:fs';

const BASE = process.env.SHEET_BASE || 'http://localhost:4321/eurog-redesign-concept';
const ids = ['pvc60', 'pvc70', 'pvc82', 'alrox45', 'alrox65', 'alrox500'];
const langs = ['hy', 'ru', 'en'];
mkdirSync('public/downloads', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
for (const lang of langs) {
  for (const id of ids) {
    await page.goto(`${BASE}/${lang}/systems/sheet/${id}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: `public/downloads/eurog-${id}-${lang}.pdf`, format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    console.log('pdf', lang, id);
  }
}
await browser.close();
