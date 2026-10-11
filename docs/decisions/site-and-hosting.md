# Site and hosting decisions

## Eleventy + Nunjucks static site — 2026-04-01 — `active`
- What: Eleventy generates static pages from Nunjucks templates; homepage passed through as plain HTML.
- Why: not stated.
- Source: `superpowers/specs/2026-04-01-phil1301-course-shell-design.md`, 34cd359

## Hosting on GitHub Pages via Actions — 2026-04-01 — `superseded`
> Superseded by "Hosting on Netlify" (2026-10-11).
- What: GitHub Actions workflow built Eleventy and deployed `_site/` to Pages.
- Why: not stated.
- Source: 2779ace

## Shared templates across courses — 2026-10-11 — `active`
- What: one set of layouts/assets; per-course data file; single `modulePages` filter for prev/next and unit TOCs (replaces per-unit tag collections).
- Why: so a second course can't collide with the first.
- Source: cbe0f45

## Tables scroll; content column may shrink — 2026-10-11 — `active`
- What: `wrapTables` transform wraps every table in `.table-wrap` (overflow-x auto); `.content` gets `min-width:0`; long URLs wrap.
- Why: wide tables pushed pages past the screen edge on phones.
- Source: 8c49c78

## Hosting on Netlify — 2026-10-11 — `active`
- What: Netlify builds on push to `main` (`netlify.toml`); GitHub Pages workflow and CNAME removed.
- Why: GitHub never issued an HTTPS certificate for the custom domain. Source: developer, not in repo.
- Source: 2760b03, 738853b
