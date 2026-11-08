# Showcase Websites Playbook — NUVV / Ilona Kalantaryan

Read this whole file before starting any showcase project. It holds everything
already agreed with Ilona. Do not ask her to repeat any of it.

## 1. The goal

Build websites for our portfolio that show our **full capabilities** to
potential clients and give a real **wow effect**: they must be amazed by the
design, the features and everything else. Each site must also show real
**business value**: features that would genuinely win that kind of company
more and better customers.

## 2. The most important rule: every site is different

- No two showcases may share a design style, layout, type pairing, colour
  world, section structure or signature feature.
- Design comes from the **industry and the business type**: who its
  customers are, how they decide, what the best sites in that industry do.
- Before designing, check `style-log.md` and pick a direction that is clearly
  different from everything already used. After approval, add the new
  project's style to the log.
- Ararat Heights is a reference for the **presentation format** (videos,
  screenshots, decks), never for style.

## 3. How one project runs (about one session each)

1. **Research.** A short report on the best sites in that industry (global +
   Armenia): what they do well, what's missing locally, how we stand out.
2. **Concept.** Brand look, structure, and 2–3 directions for the opening
   section, shown as live previews. Ilona approves one before the full build.
3. **Build.** A live demo with all interactive features.
4. **Showcase material.** A walkthrough video (scripted, real-time recording),
   screenshots of every feature (desktop + phone), and a case study
   (for redesigns: Before → After).
5. **Portfolio.** Add the project to both decks and the portfolio page (links
   in section 9).

## 4. The wow standard (put this in every prompt and live by it)

- Amaze within **5 seconds**, keep surprising while scrolling.
- Award level (Awwwards / FWA "Site of the Day"), never a template or a
  generic AI-looking site.
- **One signature moment** per site, unique to that industry, built to the
  highest polish.
- Cinematic, purposeful motion: scroll-driven scenes, page transitions,
  micro-interactions on every control.
- Campaign-quality visuals: one consistent light, colour and photo style.
- Distinctive typography and layout with a clear personality.
- Fast and smooth on phones: the wow must survive on mobile.
- **Self-critique before showing anything**: review as a strict senior
  creative director ("Would this win Site of the Day? What's generic?") and
  fix it first. If something is only "good", say so and push further.

## 5. Standards for every site

- Custom code (Next.js/React or Astro; EURO.G used Astro). Own GitHub repo per
  project: `branding-company/<repo>`. Ilona creates the empty repo on GitHub
  first (Claude sessions can't create repos), then Claude fills it. Deployed to
  a live demo URL (GitHub Pages via Actions works; Vercel/Netlify also fine).
- Copy this `playbook/` folder into each new repo so every session reads it.
- Languages: Armenian, Russian, English. Armenian must read as **natively
  written**, never translated or robotic (Ilona rejects translated-sounding
  Armenian). Same for Russian.
- Prices in AMD (add other currencies only where the business needs it,
  e.g. hotels for tourists).
- Mobile-first, fast loading, SEO titles/descriptions, structured data, FAQ
  where useful.
- Demos can save real form entries and bookings. Showcase checkouts never
  take real payments and say so.
- Sample data (prices, availability, dates) is clearly marked as sample.
- Concept projects for fictional brands are labelled "Concept". Redesigns of
  real client sites are labelled "Redesign concept"; ask Ilona before
  showing a redesign publicly as the client's new site.

## 6. What we can deliver (agreed scope)

**Websites:** fully custom code to agency standard; scroll animation, 3D,
video heroes, micro-interactions; interactive tools (configurators,
calculators, pickers, booking flows, quizzes, maps, filters); multilingual
with SEO; live demo links; full code pushed to GitHub; Shopify custom theme
code; work in Lovable, Shopify or Wix editors when the chat is linked to
Ilona's computer (she approves anything that publishes or saves).

**Design & visuals:** mockups and options on a design canvas; a brand system
per concept (colours, type, components) so each looks distinct; AI images via
Canva (interiors, products, scenery), illustrations, icons and 3D scenes in
code; device mockups and polished presentation images.

**Video & motion:** scroll and real-time recordings of animated sites; short
motion pieces (case-study intros, Instagram/LinkedIn clips).

**Content:** copy in EN/RU/HY written natively; case-study text, SEO,
structured data, FAQs; market and competitor research before designing.

**Portfolio:** slides with videos for both decks, case-study pages, the
portfolio website; team-specific editions (e.g. real estate, e-commerce).

## 7. Plan and order

Done:
- **Ararat Heights** (residential complex, Yerevan; 2 versions; Claude artifacts)
- **EURO.G redesign concept** (repo `branding-company/eurog-redesign-concept`,
  live https://branding-company.github.io/eurog-redesign-concept/; prompt in
  `prompts/eurog-redesign.md`)

Next, in order:
1. **Chocolate bonbons company**
2. **Dental clinic**
3. **Gold jewelry**
4. **Hotel**

Later: winery, VIP Numbers redesign, ITP, Elmaco, Alex & Holding upgrades,
and the team's own web apps (distributor ordering portal, Telegram AI CEO
reports bot) shown with demo data.

When Ilona asks for a project's prompt: write it complete and self-contained
(goal, research step, distinct design direction, signature moment, business
features, wow standard, process, tech, portfolio links), following this file.
Save each prompt to `prompts/<project>.md`.

## 8. Agreed upgrades for existing client sites

| Project | What holds it back | Edit that makes it stand out |
|---|---|---|
| EURO.G | Stock-photo hero, placeholder project cards, generic card grid | Window configurator (choose a profile system, see the cross-section and thermal rating), production line that animates on scroll, real projects with before/after photos |
| ITP | Standard dark "tech" look | Hero with live AI detection (boxes tracking helmets on video), simple savings calculator, case-study numbers that count up |
| VIP Numbers | Busy layout, mixed fonts, stock photo | Number search as the whole hero, pattern highlighted while typing ("777"), metallic tier cards, cleaner mobile-first design |
| Elmaco | Text-heavy, icon grids | Module builder (stack modules, see area and price estimate), projects on a map |
| Alex & Holding | Friendly but generic | Product categories with real photos, moving strip of brand logos, animated delivery-coverage map of Armenia |
| Kristelle | Strongest design; placeholders remain | Real product photos and prices; make it the opening project |
| Fleykanzo | Character art on a default Shopify theme; a "Cart Error" shows | Product pages built around each animal character |
| Yan Floral, Insta Mobile, Calea, Lemon | Templates, dated | One "More work" slide, or drop them |

## 9. Portfolio links (Claude artifacts, Ilona's account)

- Portfolio page: https://claude.ai/artifact/NuWabpkGZWdcmSLz6tsW73
- English deck: https://claude.ai/artifact/NGj4wd1WLoKaKQHNdnAyv6
- Armenian deck: https://claude.ai/artifact/PtM2Z3u6HbF7PQzFerNLm6
- Ararat Heights v1 (illustrated, interactive): https://claude.ai/artifact/4oLGhUjH6CuTj2HspRej6w
- Ararat Heights v2 (photographic): https://claude.ai/artifact/VL4GPsBj1ic9wQ5wyi7Gdj

How projects are presented there (keep this format):
- **Portfolio page:** a project block with description, spec list (industry,
  built with, languages, delivered in, scope), live links, a walkthrough
  video, a grid of labelled feature screenshots (click to enlarge), and 3
  phone screenshots. Numbering and filter counts updated.
- **Decks (EN + HY, HY written natively):** an overview slide on the best
  visual, a video slide with a feature list, and a grid of 8 key screens per
  version. Renumber later slides and add a row to the summary table.
- Delivery times are estimates; flag them for Ilona to confirm.

## 10. Practical lessons from Ararat Heights

- Keep the Claude desktop app open on Ilona's Mac while working: it enables
  the built-in browser and moving files to and from her computer.
- Instagram can't be read automatically; ask for photos as attachments.
- Canva AI images: generate → place on pages of one export design → export
  JPG → Ilona downloads the ZIP (or the Mac link copies it) → attach. Plan
  for this; it was the slowest step.
- Walkthrough videos: script a real browser session (Playwright), smooth
  eased scrolling, use every feature, then speed up to ~60–80 s and trim
  slow holds. Grab a strong poster frame.
- Screenshots: 1440×900 desktop at 1.25× and 390×844 phone at 2×; capture
  each feature in its "best" state (hover tooltips, open panels, filled
  forms, night modes).
- One project per chat: long chats lose detail.
