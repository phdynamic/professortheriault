# Build log — 2026 initial build

## 2026-04-01 – 2026-04-02 — Homepage and PHIL 1301 (backfill)
- Homepage: hero, course cards, responsive breakpoints, footer, accessibility fixes
- Eleventy shell: layouts, course nav data, placeholder pages, GitHub Actions Pages workflow
- Canvas .imscc conversion scripts (adm-zip, cheerio, xml2js); 42 wiki pages converted
- Start Here rewritten; Canvas references removed site-wide
- Tabs → numbered accordions; table styling; video/reading link fixes
- Reflections replace discussions; quizzes with instant per-question feedback; Final Exam → Final Paper
- source: commits 2e7c8c9..7b57c8d
- backfilled: yes

## 2026-10-10 – 2026-10-11 — Hosting, PHIL 2306, Netlify (backfill)
- Deployment zip untracked, *.zip ignored; CNAME added/removed several times (10-10)
- Layouts/styles/scripts shared across courses (cbe0f45)
- PHIL 2306 converted (36 pages), then reflections, quizzes, Final Paper; homepage card linked
- Phone overflow fix, both courses (8c49c78)
- Quiz answers shuffled across A–D, all 12 quizzes (91ec99f)
- PHIL 2306: duplicate videos removed; old-version remnant pages removed (e52d626, 9ecd9e3)
- Hosting moved to Netlify; GitHub Pages workflow and CNAME removed (2760b03, 738853b)
- source: commits 2e1c348..738853b
- backfilled: yes
- gap: no commits 2026-04-03 – 2026-10-09; deploy method in that period not recorded in repo

## 2026-10-11 — docs structure
- docs/ set up per comments.md; history and decisions backfilled from git, reviewed by developer
- comments.md excluded from the Eleventy build (otherwise publishable at /comments/)
- NEXT-SESSION.txt updated at the end of every session (developer)
- live-tested: build only

## 2026-10-11 — HTTPS live; comments.md briefly public
- Netlify certificate issued; Force HTTPS on; www redirects to bare domain
- comments.md uploaded via GitHub web (a09f486) was published at /comments/ until a282547 deployed; now 404
- live-tested: yes (curl)
