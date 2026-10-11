# Status — as of 2026-10-11 (branch humanities-course, not merged)

## Built
- Homepage (`index.html`): cards for PHIL 1301 (live), PHIL 2306 (live), Introduction to Humanities (Coming Soon), Philosophy Games (external link)
- PHIL 1301 Introduction to Philosophy: Start Here, Units 1–6, Final Paper; reflection + 10-question quiz per unit
- PHIL 2306 Introduction to Ethics: same shape as PHIL 1301
- HUMA 1301 Introduction to the Humanities (branch `humanities-course`, awaiting review): Start Here (5 pages), 13 units (Overview, Lesson with Gallery or Watch & Listen + Experience It + Further Exploration, Reflection, 10-question Quiz), Critic's Practice in Units 3, 7, 11, Final Paper; burgundy/gold/cream theme; homepage card linked on the branch
- Shared templates/assets: `_includes/layouts`, `/course-assets` (css; nav/accordion/quiz JS); per-course `<slug>/<slug>.11tydata.json`
- Hosting: Netlify, builds on push to `main` via `netlify.toml`

## Tested
- HUMA 1301 (branch): `node scripts/check-huma.js` passes for all pages; clean build 161 pages, 0 broken internal links, no textbook/Connect strings; PHIL 1301/2306 output identical to main; no sideways scroll at 390px on 11 sampled pages; 40 YouTube videos public and embeddable; 41 external links checked (Smarthistory answers bots with 403, see TESTING-OWED)
- Clean build 2026-10-11: 99 pages, 0 broken internal links
- Phone overflow checked at 390/920/1280px (2026-10-11)
- Quiz grading/Start Over checked in browser (2026-10-11)
- Removed PHIL 2306 remnant pages return 404 live (2026-10-11)
- HTTPS live with valid certificate; http and www redirect to https://professortheriault.com (2026-10-11)

## Not done / not verified
- HUMA 1301 quiz feedback (130 questions) and 7 new reflection prompts, Further Exploration blurbs, and the Final Paper wording were written by Claude; instructor review pending
- HUMA 1301 shows modern copyrighted works with credit lines, as in Canvas (developer decision); several Watch & Listen clips are third-party uploads carried over from the export (see docs/huma1301-media.md)
- PHIL 2306 quiz feedback (60 correct/incorrect pairs) written by Claude; not reviewed by instructor
- Older `scripts/` hardcode phil1301 paths; `scripts/convert-ethics.js` not safely re-runnable (manual edits followed it)
