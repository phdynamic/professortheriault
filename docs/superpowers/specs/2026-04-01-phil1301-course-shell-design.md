# PHIL 1301 Course Shell & Navigation — Design Spec

## Overview

Sub-project 1 of the PHIL 1301 Canvas-to-website migration. This spec covers the Eleventy project setup, shared layouts/templates, navigation system, styling, GitHub Pages deployment, and homepage integration. Content migration, quizzes, and asset extraction are separate sub-projects that plug into this shell.

**Tech stack:** Eleventy (11ty) static site generator, Nunjucks templates, CSS (consistent with homepage palette), minimal JS for mobile nav toggle and sidebar accordion.

## Project Structure

```
website/
├── index.html                    (homepage — already exists, passed through by Eleventy)
├── phil1301/                     (Eleventy source for the course)
│   ├── .eleventy.js              (Eleventy config)
│   ├── package.json              (dependencies: @11ty/eleventy)
│   ├── _includes/
│   │   └── layouts/
│   │       ├── base.njk          (HTML shell — head, top nav, sidebar, footer)
│   │       ├── unit.njk          (extends base — unit overview pages)
│   │       └── page.njk          (extends base — regular content/reading pages)
│   ├── _data/
│   │   └── course.json           (course metadata and full nav structure)
│   ├── css/
│   │   └── styles.css            (all course styles)
│   ├── js/
│   │   └── nav.js                (sidebar toggle, accordion, mobile hamburger)
│   ├── assets/
│   │   ├── images/               (extracted from imscc — later sub-project)
│   │   └── handouts/             (PDFs extracted from imscc — later sub-project)
│   ├── index.njk                 (course landing page)
│   ├── start-here/               (Module 1 content pages — placeholder for now)
│   ├── unit-1-socrates/          (Unit 1 pages — placeholder)
│   ├── unit-2-descartes/         (Unit 2 pages — placeholder)
│   ├── unit-3-hume/              (Unit 3 pages — placeholder)
│   ├── unit-4-hegel/             (Unit 4 pages — placeholder)
│   ├── unit-5-marx/              (Unit 5 pages — placeholder)
│   ├── unit-6-sartre/            (Unit 6 pages — placeholder)
│   └── final-exam/               (Final exam page — placeholder)
├── .github/
│   └── workflows/
│       └── deploy.yml            (GitHub Actions: build Eleventy + deploy to Pages)
└── _site/                        (Eleventy output — gitignored, built by CI)
```

## Eleventy Configuration

**`.eleventy.js`:**
- Input directory: `.` (project root, so it picks up both `index.html` and `phil1301/`)
- Output directory: `_site/`
- Template formats: `njk`, `html`, `md`
- Ignore: `docs/`, `.claude/`, `node_modules/`, `sand-box-number-1-phil-1301-export.imscc`, `.git/`, `.github/`
- Passthrough copy: `phil1301/css/`, `phil1301/js/`, `phil1301/assets/`, `index.html`
- Collections: one per unit, ordered by `position` front matter field, used for prev/next navigation
- The homepage `index.html` is copied as-is into `_site/` so everything deploys together

**`package.json`:**
- Dependencies: `@11ty/eleventy`
- Scripts: `dev` (eleventy --serve), `build` (eleventy)

## Navigation System

### Top Nav Bar

- Fixed position at top of viewport
- Dark navy background (#1a2332), light text (#f0f4f8)
- Left side: "Professor Theriault" linking to homepage (`/`)
- Center: "PHIL 1301: Introduction to Philosophy"
- Right side: hamburger icon (visible on mobile only, toggles sidebar)

### Sidebar

- Left side, 280px wide on desktop
- Light background (#f0f4f8), subtle right border
- Accordion-style module list:
  - Start Here
  - Unit 1: Socrates and Plato
  - Unit 2: Rene Descartes
  - Unit 3: David Hume
  - Unit 4: G. W. F. Hegel
  - Unit 5: Karl Marx
  - Unit 6: Jean-Paul Sartre
  - Final Exam
- Clicking a module heading expands/collapses its sub-page list
- The module containing the current page is auto-expanded
- Current page is highlighted with a teal left border and bold text
- Sub-pages listed with slight indent, showing page titles

**Responsive behavior:**
- Desktop (900px+): sidebar always visible beside content
- Mobile (<900px): sidebar hidden by default, slides in from left as an overlay when hamburger is tapped. Dark backdrop behind it. Close on backdrop click or X button.

### Prev/Next Navigation

- Bottom of every content page
- Two buttons: "Previous: [Page Title]" and "Next: [Page Title]"
- Styled as teal-bordered buttons matching the card hover aesthetic
- Order driven by `position` front matter within each unit's collection
- First page of a unit links back to the unit overview as "Previous"
- Last page of a unit links to the next unit's overview as "Next"

### Breadcrumbs

- Below the top nav, above the content
- Format: `Home > PHIL 1301 > Unit 1: Socrates and Plato > The Euthyphro`
- Each segment is a link

## Page Templates

### Base Layout (`base.njk`)

The HTML shell that all pages inherit. Contains:
- `<head>` with meta tags, CSS link, viewport meta
- Top nav bar
- Sidebar (rendered from `course.json` data)
- Content block (child templates inject content here)
- Footer (dark navy, copyright, matching homepage)
- JS for nav (`nav.js`) loaded at end of body

### Unit Overview Layout (`unit.njk`)

Extends `base.njk`. Used for "Unit X: Overview" pages. Contains:
- Unit title as a large heading
- Introduction/overview text (from the content)
- Table of contents: auto-generated list of all pages in the unit, linked
- "Begin Unit" button linking to the first content page

### Content Page Layout (`page.njk`)

Extends `base.njk`. Used for all reading/lecture pages. Contains:
- Page title as heading
- Content area: centered, max-width 750px for comfortable reading
- Prev/Next navigation at the bottom

### Course Landing Page (`index.njk`)

Not a layout — a standalone page using `base.njk`. Contains:
- Hero section: "Introduction to Philosophy — PHIL 1301" with a subtitle
- Card grid showing all modules as clickable cards (same hover effect as homepage)
- Each card: module icon, title, brief description, status indicator

## Styling (`styles.css`)

Consistent with the homepage palette:

| Element | Value |
|---------|-------|
| Nav/footer background | #1a2332 |
| Nav/footer text | #f0f4f8 |
| Page background | #f5f7fa |
| Sidebar background | #f0f4f8 |
| Content background | #fff |
| Accent color | #0ea5e9 (teal — hover, links, active states) |
| Badge/button color | #0369a1 (darker teal — WCAG compliant) |
| Body text | #333 |
| Muted text | #666 |
| Font stack | -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif |

**Content typography** (reading pages):
- Headings: navy (#1a2332), bold
- Body: 1rem/1.8 line-height for comfortable reading
- Block quotes: left teal border, light gray background
- Images: max-width 100%, centered with optional captions
- PDF download links: styled as buttons with a document icon

**Card styles** on the course landing page reuse the homepage card CSS: white background, light border, 12px radius, hover lift with teal border.

## GitHub Actions Deployment

**`.github/workflows/deploy.yml`:**
- Triggers on push to `main` branch
- Steps: checkout, install Node.js, `npm ci`, `npx eleventy`, deploy `_site/` to GitHub Pages
- Uses `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`

## Homepage Integration

Update the "Introduction to Philosophy" card on `index.html`:
- Change from `<div>` to `<a href="/phil1301/">`
- Update badge from "Coming Soon" to "Enter Course" (or similar)
- Card becomes a live link to the course landing page

## Placeholder Content

This sub-project creates the shell with placeholder content pages. Each unit directory gets one placeholder `index.html` (the unit overview) to verify navigation works end-to-end. Actual content migration is Sub-project 2.

Placeholder pages contain:
- Correct front matter (layout, title, unit, module, position, tags)
- A heading and "Content coming soon" paragraph
- This proves the nav, sidebar, prev/next, breadcrumbs, and responsive layout all work before we migrate 80+ real pages

## What This Spec Does NOT Cover

These are separate sub-projects with their own spec/plan cycles:

1. **Content migration** — Converting ~80 wiki_content HTML pages from the imscc export into styled Eleventy pages. Includes the Start Here module revision (Canvas references need rewriting) and Sartre supplementary materials (user will provide).
2. **Interactive elements** — Self-study quizzes (JS-driven, instant feedback), reflection exercises (replacing Canvas discussions).
3. **Asset extraction** — Pulling all images and PDFs from the imscc, organizing them in `assets/`, updating content page references.
