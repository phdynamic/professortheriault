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

## 2026-10-11 — HUMA 1301 Units 1-3 (branch humanities-course)
- theme (body class theme-gallery, generated CSS), Gallery / Watch & Listen component, Experience It callout
- converter + 13-unit skeleton from the Canvas export; check script; 5 Start Here pages
- Units 1-3: textbook wording removed, galleries (6/6/5 works), Experience It, Further Exploration, reflections, 10-question quizzes with feedback, Critic's Practice (Last Supper)
- images: 6 hotlinked/new Commons works downloaded after developer approval; oversized export images shrunk (142 MB -> 6 MB)
- feedback for all quiz answers written by Claude; instructor review pending
- live-tested: preview (gallery, quiz, phone width); not merged

## 2026-10-11 — HUMA 1301 complete (branch humanities-course)
- Units 4-13 built: lessons expanded where thin (Units 5, 6, 7, 8, 9, 10, 11, 12, 13), galleries or Watch & Listen strips (5-7 works each), Experience It, Further Exploration, reflections, 10-question quizzes with feedback, Critic's Practice for Units 3, 7, 11
- Final Paper added; quiz answers shuffled across A-D; homepage card linked on the branch
- media: 36 new Commons images downloaded after developer approval; 40 YouTube clips verified embeddable; export errors fixed (Adams photo mislabeled Moonrise, hotlinked images localized, stray tags removed from alt/title)
- check script passes for the whole course; clean build 161 pages, 0 broken links; PHIL 1301/2306 unchanged
- unverified: instructor review of Claude-written feedback; Smarthistory deep links (bot-blocked); not merged to main
