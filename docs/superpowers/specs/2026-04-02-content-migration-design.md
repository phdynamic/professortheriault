# PHIL 1301 Content Migration — Design Spec

## Overview

Sub-project 2 of the PHIL 1301 Canvas-to-website migration. This spec covers extracting and converting ~80 wiki content pages and their assets from the Canvas `.imscc` export into styled Eleventy pages that plug into the course shell built in Sub-project 1.

**Tech stack:** Node.js conversion script using `adm-zip` and `cheerio`, outputting Nunjucks (`.njk`) files with YAML front matter.

## Conversion Script

A one-time Node.js script at `scripts/convert-imscc.js` that transforms the Canvas export into Eleventy-ready content.

### Pipeline Steps

1. **Extract** — Unzips `sand-box-number-1-phil-1301-export.imscc` into a temp directory.

2. **Copy assets** — Moves files from the archive into the site:
   - `web_resources/Uploaded Media/*` → `phil1301/assets/images/`
   - `web_resources/Handouts/*` → `phil1301/assets/handouts/`
   - Other `web_resources/` files (PDFs, images at root level) → `phil1301/assets/images/` or `phil1301/assets/handouts/` based on extension
   - Filenames normalized: lowercase, spaces replaced with hyphens, special characters stripped

3. **Parse `module_meta.xml`** — Reads the Canvas module structure to determine:
   - Which wiki pages belong to which module/unit
   - Page ordering (position within each module)
   - Page titles (from the module item title, not the HTML `<title>`)
   - Content type (WikiPage, DiscussionTopic, Assignment, Quiz, ExternalTool)
   - Only WikiPage items are converted; other types are noted for future sub-projects

4. **Parse `imsmanifest.xml`** — Maps identifier refs from module_meta to actual wiki_content filenames.

5. **For each wiki HTML file** (WikiPage type, body content > 500 bytes):
   - Load HTML with cheerio
   - **Strip metadata:** Remove `<head>` content (Canvas identifiers, meta tags)
   - **Strip inline styles:** Remove all `style` attributes from every element
   - **Remove Canvas attributes:** `data-api-endpoint`, `data-api-returntype`
   - **Remove Canvas classes:** `instructure_file_link`, `instructure_scribd_file`, `inline_disabled`
   - **Resolve asset paths:** Replace `$IMS-CC-FILEBASE$/Uploaded%20Media/[filename]` with `/phil1301/assets/images/[normalized-filename]`. Replace `$IMS-CC-FILEBASE$/Handouts/[filename]` with `/phil1301/assets/handouts/[normalized-filename]`.
   - **Strip Canvas query params:** Remove `?canvas_=1&canvas_qs_wrap=1` from all hrefs
   - **Convert accordions to tabs:** Transform `<details>/<summary>` groups into tabbed panel markup (see Tabbed Panels section)
   - **Convert callout boxes:** Detect colored border/background divs and convert to icon-based callout components (see Callout Boxes section)
   - **Convert argument blocks:** Detect P1/P2/C formatted divs and apply `.argument-block` class
   - **Wrap hero images:** First `<img>` in the page body gets `.page-hero-image` class
   - **Wrap video embeds:** YouTube iframes get wrapped in `.video-embed` responsive container
   - **Convert PDF links:** `<a>` tags pointing to `.pdf` files get `.download-link` class
   - **Extract clean body HTML**
   - **Generate front matter:** layout, title, module slug, position, tags, breadcrumbTitle
   - **Write `.njk` file** to the correct unit directory

6. **Update `course.json`** — Replaces placeholder page entries with all discovered pages per module, in correct order.

7. **Skip rules:**
   - Pages with body content < 500 bytes (empty stubs like `bad-faith.html`, `from-kant-to-hegel.html`)
   - Canvas-specific pages that are being dropped: `canvas-app.html`, `setting-your-notification-preferences.html`, `support-services.html`, `philosophy-library.html`, `support-services.html`
   - External tool items (LTI links to library resources)

### Script Dependencies

- `adm-zip` — Extract the .imscc zip archive
- `cheerio` — Server-side DOM manipulation for HTML transformation
- `xml2js` — Parse module_meta.xml and imsmanifest.xml

These are dev dependencies in `package.json`, not production dependencies.

## Tabbed Panels

The conversion script transforms `<details>/<summary>` accordion groups into a tabbed panel component.

### Detection Logic

The script groups consecutive `<details>` elements at the same DOM level. Each group becomes one tabbed panel set. Content before the first `<details>` (hero images, intro text) stays above the tabs as regular content.

### Output HTML Structure

```html
<div class="tabs">
  <div class="tabs__bar" role="tablist">
    <button class="tabs__tab tabs__tab--active" role="tab" aria-selected="true" aria-controls="tab-panel-0" id="tab-0">The Story</button>
    <button class="tabs__tab" role="tab" aria-selected="false" aria-controls="tab-panel-1" id="tab-1">Watch First</button>
    <button class="tabs__tab" role="tab" aria-selected="false" aria-controls="tab-panel-2" id="tab-2">Readings</button>
  </div>
  <div class="tabs__panel tabs__panel--active" role="tabpanel" id="tab-panel-0" aria-labelledby="tab-0">
    <!-- Content from first accordion -->
  </div>
  <div class="tabs__panel" role="tabpanel" id="tab-panel-1" aria-labelledby="tab-1" hidden>
    <!-- Content from second accordion -->
  </div>
  <div class="tabs__panel" role="tabpanel" id="tab-panel-2" aria-labelledby="tab-2" hidden>
    <!-- Content from third accordion -->
  </div>
</div>
```

### Tab JavaScript (`phil1301/js/tabs.js`)

- First tab active by default
- Clicking a tab shows its panel, hides others
- ARIA attributes updated on each switch
- Keyboard navigation: left/right arrow keys move between tabs, Home/End jump to first/last
- Loaded alongside `nav.js` in `base.njk`

### Tab CSS (added to `styles.css`)

- Tab bar: horizontal strip, light background (#f0f4f8), bottom border
- Active tab: teal (#0ea5e9) bottom border, bold text, white background
- Inactive tabs: gray text (#666), hover shows teal underline
- Panel: white background, padding, min-height to prevent layout shift
- Responsive (<600px): tabs shrink text or wrap to multiple rows

## Callout Boxes

Colored inline-styled divs are converted to semantic, icon-based callout components.

### Detection Logic

The script identifies callout divs by their inline `border-left` or `background-color` styles containing specific color values:
- Navy/dark blue (#1e3a5f, #1a2332) → `.callout--concept`
- Green (#2d6a4f) → `.callout--note`
- Amber/warm (#c07a00, #b45309, #fffbeb) → `.callout--connection`
- Any unrecognized colored div → `.callout--note` (safe default)

### Output HTML

```html
<div class="callout callout--concept">
  <span class="callout__icon" aria-hidden="true">&#128161;</span>
  <div class="callout__content">
    <!-- Original div content, inline styles stripped -->
  </div>
</div>
```

### Icons

| Type | Icon | Unicode |
|------|------|---------|
| Concept | Lightbulb | &#128161; (`💡`) |
| Note | Info circle | &#8505;&#65039; (`ℹ️`) |
| Connection | Right arrow | &#10145;&#65039; (`➡️`) |

### Callout CSS (added to `styles.css`)

- Base: left border (4px), light background, rounded right corners, padding, flex layout with icon
- `.callout--concept`: teal border (#0ea5e9), light teal background
- `.callout--note`: green border (#2d6a4f), light green background
- `.callout--connection`: amber border (#d97706), light amber background

## Other Content Components

### Argument Reconstruction Blocks

Divs containing premise/conclusion format (P1/P2/C lines) get `.argument-block` class:
- Monospace-adjacent styling, indented premises
- Numbered labels bolded
- Light gray background with left border

### Hero Images

The first image in each page's body content gets `.page-hero-image`:
- Full content width, rounded corners
- Sits above the tab bar

### Video Embeds

YouTube iframes wrapped in `.video-embed`:
- 16:9 responsive aspect ratio container
- Max-width 100%, centered

### PDF Download Links

Anchor tags pointing to `.pdf` files get `.download-link`:
- Button-like styling with a document icon (📄)
- Teal border, hover lift effect matching the site's card aesthetic

## Start Here Module

### Pages migrated as-is (content still relevant):
- Meet Your Instructor
- Getting Started
- Assessments

### Pages dropped entirely:
- Canvas App
- Setting Your Notification Preferences
- Support Services
- Philosophy Library (external Canvas LTI tool)

### Pages replaced with new shells:
- "Technical Setup" → "How to Use This Site" — Shell page with `<!-- NEEDS REWRITE -->` comment and placeholder text. Will be written during manual polish.
- "Course Scavenger Hunt Assignment" → "Website Orientation Activity" — Shell page with `<!-- NEEDS REWRITE -->` comment. Will be rewritten for the website format during manual polish.

## Sartre Unit (Unit 6)

All existing Sartre content from the export is migrated normally. A missing PDF and external link will be added during the manual polish pass when the user provides them.

## File Output Structure

After the script runs, the directory structure looks like:

```
phil1301/
├── assets/
│   ├── images/          (all images extracted, filenames normalized)
│   └── handouts/        (all PDFs extracted, filenames normalized)
├── js/
│   ├── nav.js           (existing)
│   └── tabs.js          (new — tab panel interactivity)
├── css/
│   └── styles.css       (updated with tab, callout, and component styles)
├── start-here/
│   ├── index.njk        (overview — updated from placeholder)
│   ├── meet-your-instructor.njk
│   ├── getting-started.njk
│   ├── assessments.njk
│   ├── how-to-use-this-site.njk    (NEEDS REWRITE)
│   └── website-orientation.njk     (NEEDS REWRITE)
├── unit-1-socrates/
│   ├── index.njk        (unit overview — real content)
│   ├── introducing-philosophy.njk
│   ├── logic-reference.njk
│   ├── socrates-life-and-context.njk
│   ├── the-euthyphro.njk
│   ├── the-apology.njk
│   └── the-crito.njk
├── unit-2-descartes/
│   ├── index.njk
│   ├── descartes-life-and-context.njk
│   ├── meditation-i.njk
│   ├── meditation-ii.njk
│   ├── meditation-iii-v.njk
│   ├── cogito-ergo-sum.njk
│   └── paper-preparation-exercise.njk
│   (... plus term paper topic pages)
├── unit-3-hume/
│   ├── index.njk
│   ├── humes-life-and-context.njk
│   ├── impressions-ideas-and-association.njk
│   └── causation-induction-and-limits.njk
├── unit-4-hegel/
│   ├── index.njk
│   ├── hegels-life-and-context.njk
│   ├── the-dialectic.njk
│   ├── reason-spirit-and-history.njk
│   └── freedom-progress-and-limits.njk
├── unit-5-marx/
│   ├── index.njk
│   ├── marxs-life-and-context.njk
│   ├── class-struggle-and-historical-materialism.njk
│   ├── the-manifesto-argument-and-program.njk
│   └── ideology-alienation-and-what-marx-got-right.njk
├── unit-6-sartre/
│   ├── index.njk
│   ├── sartres-life-and-context.njk
│   ├── existence-precedes-essence.njk
│   ├── radical-freedom-and-bad-faith.njk
│   └── ethics-responsibility-and-humanism.njk
└── final-exam/
    └── index.njk
```

Note: Exact filenames will be derived from the wiki_content source filenames. The listing above is approximate based on the module structure.

## Manual Polish Pass

After the script runs and the site builds, a unit-by-unit review:

1. **Build and verify** — Run `npm run build`, check for errors
2. **Visual review per unit** — Walk through each page in the dev server, verify:
   - Tabs work correctly (right content in each tab)
   - Callout boxes render with correct icons/colors
   - Images display (paths resolved correctly)
   - PDF links work
   - YouTube embeds are responsive
   - Hero images appear above tabs
   - Navigation (sidebar, breadcrumbs, prev/next) reflects real page titles
3. **Start Here rewrites** — Write new content for "How to Use This Site" and "Website Orientation Activity"
4. **Sartre supplements** — Add the missing PDF and link when user provides them
5. **Edge case fixes** — Any pages that didn't convert cleanly

## What This Spec Does NOT Cover

- **Interactive quizzes** — Self-study quiz functionality (Sub-project 3)
- **Reflection exercises** — Discussion-to-reflection conversion (Sub-project 3)
- **Discussion/assignment pages** — Content for these page types is deferred to Sub-project 3
