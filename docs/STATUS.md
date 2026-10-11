# Status — as of 2026-10-11

## Built
- Homepage (`index.html`): cards for PHIL 1301 (live), PHIL 2306 (live), Introduction to Humanities (Coming Soon), Philosophy Games (external link)
- PHIL 1301 Introduction to Philosophy: Start Here, Units 1–6, Final Paper; reflection + 10-question quiz per unit
- PHIL 2306 Introduction to Ethics: same shape as PHIL 1301
- Shared templates/assets: `_includes/layouts`, `/course-assets` (css; nav/accordion/quiz JS); per-course `<slug>/<slug>.11tydata.json`
- Hosting: Netlify, builds on push to `main` via `netlify.toml`

## Tested
- Clean build 2026-10-11: 99 pages, 0 broken internal links
- Phone overflow checked at 390/920/1280px (2026-10-11)
- Quiz grading/Start Over checked in browser (2026-10-11)
- Removed PHIL 2306 remnant pages return 404 live (2026-10-11)

## Not done / not verified
- HTTPS on Netlify: certificate still provisioning 2026-10-11
- PHIL 2306 quiz feedback (60 correct/incorrect pairs) written by Claude; not reviewed by instructor
- Introduction to Humanities: export present (`6271-huma-1301-…imscc`), not started
- Older `scripts/` hardcode phil1301 paths; `scripts/convert-ethics.js` not safely re-runnable (manual edits followed it)
