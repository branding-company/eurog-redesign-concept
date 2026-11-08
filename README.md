# EURO.G Systems: redesign concept

A redesign concept for [EURO.G Systems](https://eurog.lovable.app) (PVC and aluminium windows, doors, facades and glass systems, made in Armenia). Not the official site. Prices, U-values, projects and dealer terms are **sample data**.

Live: https://branding-company.github.io/eurog-redesign-concept/

## What is in it

| Feature | Route |
| --- | --- |
| Opening scene, variant A (profile cross-section assembles on scroll) and variant B (winter night through the wall). Switch with the A/B control or `?opening=b` | `/{lang}/` |
| Window configurator: type, size, sashes, opening, system, glazing, colour, live drawing, AMD estimate, add to quote | `/{lang}/configurator/` |
| Energy savings calculator (old windows vs EURO.G, AMD per year, payback, CO₂) | `/{lang}/savings/` |
| Profile systems catalogue and comparison table | `/{lang}/systems/` |
| Technical sheet per system (printable, also exported to PDF) | `/{lang}/systems/sheet/{id}/` |
| Projects on a map of Armenia with building-type filters | `/{lang}/projects/` |
| Production story with scroll animation | `/{lang}/production/` |
| Smart quote: 5 steps, file upload, measurement visit booking | `/{lang}/quote/` |
| Paths: homeowners, architects (downloads), developers, dealers (programme + application) | `/{lang}/homeowners/` … |

Languages: `hy` (default), `ru`, `en`, each with its own URL, `hreflang`, canonical and sitemap entries.

## Stack

Astro (static output), TypeScript, no UI framework. Fonts are self-hosted through Fontsource. The quote list lives in `localStorage`; nothing is sent anywhere.

```bash
npm install
npm run dev        # http://localhost:4321/eurog-redesign-concept/
npm run build
npm run preview
```

## Where to change things

- `src/i18n/{en,ru,hy}.ts`: all copy (`en.ts` defines the shape).
- `src/data/systems.ts`: profile systems and their technical values.
- `src/data/pricing.ts`: the sample price model and the savings model. Replace the tables with the EURO.G price list.
- `src/data/projects.ts`: projects and the stylised map outline.
- `scripts/make-sheets.mjs`: regenerates `public/downloads/*.pdf` from the sheet pages (run against `npm run preview`).

Photos in `public/img/site` are taken from the current EURO.G site.
