# HUMA 1301 Introduction to the Humanities Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a self-paced Introduction to the Humanities course (13 units plus Start Here and Final Paper) at `/huma1301/`, converted from the Canvas export and generalized (no textbook, no Connect), with a gallery of artworks in every unit.

**Architecture:** Reuse the shared Eleventy layouts and scripts. Add a `theme` flag in the course data file that puts a class on `<body>`, and a generated CSS block that re-colors the shared stylesheet under that class (PHIL 1301/2306 untouched). Add one new shared component (Gallery / Watch & Listen) and one new callout variant (Experience It). A one-shot converter produces the page skeletons from the export; all course writing then lives in the `.njk` pages and one data module for quizzes and reflections. A check script enforces the spec's rules mechanically.

**Tech Stack:** Eleventy 3.1.5, Nunjucks, cheerio, adm-zip (already installed), Node 22, vanilla JS/CSS.

**Spec:** `docs/superpowers/specs/2026-10-11-humanities-course-design.md`

## Global Constraints

- Course slug `huma1301`; folder `huma1301/`; data file `huma1301/huma1301.11tydata.json`; title "HUMA 1301: Introduction to the Humanities"; shortTitle "HUMA 1301".
- 13 units, one per art form, each with pages `index` (Unit N: Overview, position 1), `lesson` (position 2), `critics-practice` (position 3, units 3, 7, 11 only), `reflection-prompt` (position 4), `quiz` (position 5).
- No textbook, McGraw Hill, Connect, Canvas, due dates, grading weights, or discussion-board language anywhere. Check script bans: `textbook`, `Connect`, `McGraw`, `SmartBook`, `Canvas`, `Chapter \d`.
- Palette (from the export's own styling): burgundy `#6b1d2a`, gold `#d4a843`, cream `#faf6f0`, tan border `#d0c4b8`.
- Every gallery work has alt text, a credit line, and a one-sentence "what to notice".
- Quizzes: exactly 10 multiple-choice questions, each with correct and incorrect feedback; correct answers spread across A–D by `scripts/shuffle-quiz-answers.js`.
- Quiz and reflection markup must match the PHIL 2306 markup (shared `quiz.js` and CSS depend on it).
- Do not commit `.claude/settings.local.json`, `*.imscc`, `*.zip`. Work on branch `humanities-course`; do not push or merge to `main` without the developer's go-ahead.
- Commit messages end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- New files at the repo root outside `docs/` must be added to the Eleventy ignores before pushing.
- Environment: `export PATH="$PATH:/c/Program Files/nodejs"` before running node/npx in Bash.
- Authoring voice: second person, plain and warm, no jargon without a definition, matching the PHIL 1301 pages.

## Review Focus

1. **A gallery image is missing or fails to load.** The viewer shows "Image unavailable" plus the credit; the page stays readable. Pinned by Task 1 (fixture with a broken image) and Task 3 check (every `href`/`src` file exists).
2. **JavaScript is off.** Each thumbnail is a real link to the image (or the YouTube page), so every work is still reachable. Pinned by Task 1 (step: view fixture with scripts disabled).
3. **Phone width (390px).** The thumbnail strip scrolls inside its own box; no sideways page scroll. Pinned by Task 1 and the Task 11 overflow check.
4. **Quiz bank questions that cannot work as-is.** Multiple-answer items (Chapter 9 bank), short-answer items, and questions that depend on a textbook figure or say "according to the textbook" are rewritten or dropped. Pinned by Task 4 (dump flags them) and the check script (10 questions, feedback present, banned words).
5. **Credits and external links.** An image without a credit, or a Further Exploration/YouTube link that is dead, ships silently. Pinned by the check script (credit and alt required) and Task 11 (link check of every external URL).

---

## File Structure

| File | Responsibility |
|---|---|
| `course-assets/css/styles.css` | Gallery, Experience It, and (generated) `.theme-gallery` blocks |
| `course-assets/js/gallery.js` | Gallery / Watch & Listen viewer behavior |
| `_includes/layouts/base.njk` | Body class from `course.theme`; load `gallery.js` |
| `scripts/make-theme.js` | Generates the `.theme-gallery` CSS block from the shared stylesheet |
| `scripts/convert-huma.js` | One-shot export → page skeletons (units' Overview and Lesson pages, Start Here source text) |
| `scripts/dump-huma-banks.js` | Dumps the 13 question banks to `scripts/huma-banks.json` for triage |
| `scripts/huma-content.js` | Data module: per-unit reflection and 10 quiz questions with feedback |
| `scripts/build-huma-interactives.js` | Writes `reflection-prompt.njk`, `quiz.njk` per unit and the Final Paper |
| `scripts/fetch-huma-images.js` | Downloads the approved image list into `huma1301/assets/images/` |
| `scripts/check-huma.js` | Mechanical checks for every rule in the spec |
| `docs/huma1301-media.md` | Planned and downloaded media: source, license/status, size, gaps |
| `huma1301/**` | The course |

## Unit Reference

| # | Slug | Title | Media label | Candidate works (confirmed at the download gate) |
|---|---|---|---|---|
| 1 | `unit-1-the-humanities` | The Humanities: An Introduction | Gallery | export's 6 (Echo of a Scream, The Eternal City, Mona Lisa, Guernica, Great Wave, Migrant Mother); Lascaux cave painting; Chartres Cathedral |
| 2 | `unit-2-what-is-a-work-of-art` | What Is a Work of Art? | Gallery | Duchamp *Fountain*; Warhol *Brillo Boxes*; Van Gogh *Starry Night*; Michelangelo *David*; a Greek vase; a Kente cloth |
| 3 | `unit-3-being-a-critic` | Being a Critic of the Arts | Gallery | *The Last Supper*; Vermeer *Girl with a Pearl Earring*; Wood *American Gothic*; Hopper *Nighthawks*; Munch *The Scream* |
| 4 | `unit-4-painting` | Painting | Gallery | Kahlo *The Two Fridas*; Rothko *No. 61*; Lawrence *Migration Series* panel 1 (all in export); Velázquez *Las Meninas*; Pollock *Autumn Rhythm*; Rembrandt self-portrait; Mondrian |
| 5 | `unit-5-sculpture` | Sculpture | Gallery | export's 3; Bernini *Apollo and Daphne*; Rodin *The Thinker*; Giacometti *Walking Man*; Calder mobile; Lin *Vietnam Veterans Memorial*; Venus of Willendorf |
| 6 | `unit-6-architecture` | Architecture | Gallery | export's 3; Parthenon; Pantheon; Fallingwater; Guggenheim Bilbao; Taj Mahal; Sydney Opera House |
| 7 | `unit-7-literature` | Literature | Gallery (manuscripts, title pages, illustrations) | Dickinson manuscript; Shakespeare First Folio; Doré's *Inferno*; *Frankenstein* 1818 title page; Basho scroll; *Leaves of Grass* frontispiece |
| 8 | `unit-8-theater` | Theater | Watch & Listen | Hamlet soliloquy performances; a Greek tragedy; Noh; a musical; Globe Theatre |
| 9 | `unit-9-music` | Music | Watch & Listen | Beethoven Fifth; Armstrong; Bach cello suite; Copland; Coltrane; Nina Simone |
| 10 | `unit-10-dance` | Dance | Watch & Listen | the export's two dance videos; *Swan Lake*; Graham; Ailey *Revelations*; Bausch; Astaire |
| 11 | `unit-11-photography` | Photography | Gallery | export's 2 (Migrant Mother, *Paula*); Adams *Moonrise*; Cartier-Bresson; Muybridge; Arbus; Hine |
| 12 | `unit-12-cinema` | Cinema | Watch & Listen | *Battleship Potemkin* Odessa Steps; *Citizen Kane*; *Psycho*; *Metropolis*; a recent film |
| 13 | `unit-13-television-and-video-art` | Television and Video Art | Watch & Listen | Paik *TV Buddha*/*Electronic Superhighway*; Viola; a Lucy episode; the moon-landing broadcast |

## Unit Procedure (applied to every unit in Tasks 5–8)

For each unit in the task, in this order:

1. **Read** the converted `index.njk` and `lesson.njk`. List every sentence mentioning the textbook, "your reading", "the chapter", or Connect.
2. **Rewrite** each such sentence so the page teaches the idea itself ("the textbook calls this all-at-onceness" becomes "this quality is sometimes called all-at-onceness"). Rewrite the Overview's reading assignment into a short "In this unit" paragraph plus a 3–5 item task checklist (watch/look at the Gallery, work through the lesson, Experience It, reflection, quiz). No due dates.
3. **Expand** the lesson to at least 1,200 words by deepening existing sections and adding new ones: key terms with definitions, how to look/listen/read, one worked example that walks through a specific work step by step, and the history/context that the missing reading used to supply. Keep accordions (`accordion` markup from PHIL 2306) for each major section.
4. **Gallery**: draft 5–8 works from the Unit Reference (export images first). Write each work's alt text, credit line (artist, title, date, medium/location where known, source and license), and one-sentence "what to notice". Add them to `docs/huma1301-media.md` with status `planned`. Place the Gallery block at the top of the lesson, above the accordions (use the markup in Task 1). Units labeled Watch & Listen use `data-video` thumbnails (YouTube IDs verified in the browser from official or museum channels).
5. **Experience It**: one block at the end of the lesson (before Further Exploration): a single work or clip, three prompts that ask students to look/listen first and then answer. Start from the export's "Try this" boxes where they exist.
6. **Further Exploration**: `<h3>Further Exploration</h3>` with 2–4 free links (museum collection page, Smarthistory, Poetry Foundation, Project Gutenberg, etc.), each opened in the browser and confirmed to load.
7. **Reflection**: add the unit's entry to `scripts/huma-content.js` (units 2, 4, 6, 8, 10, 12 adapt the export's discussions with all posting/reply/grading instructions removed; units 1, 3, 5, 7, 9, 11, 13 are new).
8. **Quiz**: add the unit's 10 questions to `scripts/huma-content.js` (triage from `scripts/huma-banks.json`; replace less vital questions with new ones about the added works; write correct and incorrect feedback for all 10).
9. **Critic's Practice** (units 3, 7, 11 only): convert the matching essay assignment from the export (`Essay #1/#2/#3`) to `critics-practice.njk`: the work shown, a guided description/interpretation/evaluation prompt, no grading language, "Your Notes" textarea in `reflection` markup.
10. Run `node scripts/check-huma.js` for the unit; fix failures.

Image downloads are not part of this procedure. They happen once per batch at the **download gate** (see Task 5 Step 5).

---

### Task 1: Theme, Gallery, and Experience It components

**Files:**
- Create: `scripts/make-theme.js`, `course-assets/js/gallery.js`, `huma1301/gallery-fixture.njk` (temporary), `huma1301/huma1301.11tydata.json` (stub, expanded in Task 2)
- Modify: `_includes/layouts/base.njk`, `course-assets/css/styles.css`

**Interfaces:**
- Produces: body class `theme-gallery` when `course.theme == "gallery"`; Gallery markup below; `.callout--experience`.

Gallery markup (the contract every lesson uses):

```html
<section class="gallery" aria-labelledby="gallery-title">
  <h2 class="gallery__title" id="gallery-title">&#127912; Gallery: Painting</h2>
  <ul class="gallery__strip">
    <li>
      <a class="gallery__thumb" href="/huma1301/assets/images/frida-kahlo-the-two-fridas-1939.jpg"
         data-credit="Frida Kahlo, The Two Fridas, 1939. Oil on canvas. Museo de Arte Moderno, Mexico City."
         data-notice="The exposed heart and the artery that joins the two selves.">
        <img src="/huma1301/assets/images/frida-kahlo-the-two-fridas-1939.jpg" alt="Two women in white dresses sit side by side holding hands, their hearts exposed.">
      </a>
    </li>
  </ul>
  <figure class="gallery__viewer" hidden>
    <div class="gallery__media"></div>
    <figcaption><p class="gallery__credit"></p><p class="gallery__notice"></p></figcaption>
  </figure>
</section>
```

For Watch & Listen the title reads `&#127916; Watch &amp; Listen: Music`, and each thumb is:

```html
<a class="gallery__thumb" href="https://www.youtube.com/watch?v=VIDEOID" data-video="VIDEOID" data-title="Beethoven, Symphony No. 5, first movement"
   data-credit="Beethoven, Symphony No. 5, 1808. Performance: ORCHESTRA, CHANNEL (YouTube)." data-notice="How the four-note motif returns in every section.">
  <img src="https://i.ytimg.com/vi/VIDEOID/hqdefault.jpg" alt="Video thumbnail: Beethoven, Symphony No. 5">
</a>
```

- [ ] **Step 1: Write the fixture (the failing "test")**

`huma1301/gallery-fixture.njk` (one image gallery with a deliberately broken image path, one video gallery, one Experience It callout):

```njk
---
layout: layouts/page.njk
title: "Gallery Fixture"
module: "fixture"
position: 1
---
<section class="gallery" aria-labelledby="g1">
  <h2 class="gallery__title" id="g1">Gallery: Fixture</h2>
  <ul class="gallery__strip">
    <li><a class="gallery__thumb" href="/course-assets/does-not-exist.jpg" data-credit="Broken image credit." data-notice="Notice A."><img src="/course-assets/does-not-exist.jpg" alt="Broken"></a></li>
    <li><a class="gallery__thumb" href="/index.html" data-credit="Second credit." data-notice="Notice B."><img src="/course-assets/does-not-exist.jpg" alt="Second"></a></li>
  </ul>
  <figure class="gallery__viewer" hidden><div class="gallery__media"></div><figcaption><p class="gallery__credit"></p><p class="gallery__notice"></p></figcaption></figure>
</section>
<section class="gallery" aria-labelledby="g2">
  <h2 class="gallery__title" id="g2">Watch &amp; Listen: Fixture</h2>
  <ul class="gallery__strip">
    <li><a class="gallery__thumb" href="https://www.youtube.com/watch?v=aqz-KE-bpKQ" data-video="aqz-KE-bpKQ" data-title="Fixture video" data-credit="Video credit." data-notice="Video notice."><img src="https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg" alt="Video thumbnail"></a></li>
  </ul>
  <figure class="gallery__viewer" hidden><div class="gallery__media"></div><figcaption><p class="gallery__credit"></p><p class="gallery__notice"></p></figcaption></figure>
</section>
<div class="callout callout--experience"><span class="callout__icon" aria-hidden="true">&#128065;&#65039;</span><div class="callout__content">
<p><strong>Experience It: Fixture</strong></p><p>Look at the work, then answer: 1. 2. 3.</p>
</div></div>
```

Stub data file `huma1301/huma1301.11tydata.json` (needed for the fixture to build):

```json
{
  "course": {
    "slug": "huma1301",
    "title": "HUMA 1301: Introduction to the Humanities",
    "shortTitle": "HUMA 1301",
    "theme": "gallery",
    "modules": [
      { "slug": "fixture", "title": "Fixture", "icon": "&#127912;", "description": "Temporary.", "pages": [ { "slug": "gallery-fixture", "title": "Gallery Fixture" } ] }
    ]
  }
}
```

- [ ] **Step 2: Run it and confirm it fails**

Start the preview (`preview_start` name `site`), open `/huma1301/fixture/gallery-fixture/`. Expected: thumbnails are plain links with no viewer, the page uses the navy palette, and the callout has no Experience It styling.

- [ ] **Step 3: Add `gallery.js`**

```js
(function () {
  document.querySelectorAll(".gallery").forEach(function (g) {
    var thumbs = g.querySelectorAll(".gallery__thumb");
    var viewer = g.querySelector(".gallery__viewer");
    if (!thumbs.length || !viewer) return;
    var media = viewer.querySelector(".gallery__media");
    var credit = viewer.querySelector(".gallery__credit");
    var notice = viewer.querySelector(".gallery__notice");

    function show(t) {
      thumbs.forEach(function (x) {
        x.classList.toggle("gallery__thumb--current", x === t);
        x.setAttribute("aria-current", x === t ? "true" : "false");
      });
      media.innerHTML = "";
      media.classList.remove("gallery__media--video");
      var video = t.getAttribute("data-video");
      if (video) {
        var f = document.createElement("iframe");
        f.src = "https://www.youtube-nocookie.com/embed/" + video;
        f.title = t.getAttribute("data-title") || "Video";
        f.setAttribute("allow", "accelerometer; encrypted-media; gyroscope; picture-in-picture");
        f.setAttribute("loading", "lazy");
        f.allowFullscreen = true;
        media.classList.add("gallery__media--video");
        media.appendChild(f);
      } else {
        var img = document.createElement("img");
        img.alt = t.querySelector("img").alt;
        img.onerror = function () {
          media.innerHTML = '<p class="gallery__missing">Image unavailable. See the credit below.</p>';
        };
        img.src = t.getAttribute("href");
        media.appendChild(img);
      }
      credit.textContent = t.getAttribute("data-credit") || "";
      notice.textContent = t.getAttribute("data-notice") || "";
    }

    thumbs.forEach(function (t) {
      t.addEventListener("click", function (e) { e.preventDefault(); show(t); });
    });
    viewer.hidden = false;
    show(thumbs[0]);
  });
})();
```

- [ ] **Step 4: Wire the layout**

In `_includes/layouts/base.njk` change `<body>` to:

```njk
<body{% if course.theme %} class="theme-{{ course.theme }}"{% endif %}>
```

and add after the `quiz.js` script tag:

```html
  <script src="/course-assets/js/gallery.js"></script>
```

- [ ] **Step 5: Add component CSS** (append to `course-assets/css/styles.css`, before the generated theme block that Step 6 adds)

```css
/* === Gallery / Watch & Listen === */
.gallery { margin: 0 0 2rem; }
.gallery__title { margin: 0 0 0.75rem; font-size: 1.15rem; }
.gallery__strip { display: flex; gap: 0.5rem; list-style: none; margin: 0 0 1rem; padding: 0 0 0.5rem; overflow-x: auto; }
.gallery__strip li { flex: 0 0 auto; margin: 0; }
.gallery__thumb { display: block; width: 110px; height: 84px; border: 2px solid #d0c4b8; border-radius: 4px; overflow: hidden; background: #fff; }
.content .gallery__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; margin: 0; }
.gallery__thumb--current { border-color: #d4a843; outline: 2px solid #6b1d2a; }
.gallery__thumb:focus-visible { outline: 3px solid #6b1d2a; outline-offset: 2px; }
.gallery__viewer { margin: 0; padding: 1rem; background: #fff; border: 1px solid #d0c4b8; border-radius: 4px; }
.content .gallery__media img { display: block; max-width: 100%; max-height: 70vh; width: auto; height: auto; margin: 0 auto; }
.gallery__media--video { position: relative; height: 0; padding-bottom: 56.25%; }
.gallery__media--video iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
.gallery__missing { text-align: center; color: #666; margin: 1rem 0; }
.gallery__credit { margin: 0.6rem 0 0; font-size: 0.8rem; color: #666; text-align: center; }
.gallery__notice { margin: 0.5rem 0 0; }
.gallery__notice:not(:empty)::before { content: "What to notice: "; font-weight: 700; }

/* === Experience It === */
.callout--experience { border-left-color: #d4a843; background: #faf6f0; }
```

- [ ] **Step 6: Write `scripts/make-theme.js`**

```js
// Generates the .theme-gallery block at the end of the shared stylesheet by re-mapping the
// navy/sky-blue palette to the Humanities palette. Idempotent: replaces its own block.
const fs = require("fs");
const path = require("path");

const FILE = path.resolve(__dirname, "..", "course-assets", "css", "styles.css");
const START = "/* === Theme: gallery (generated by scripts/make-theme.js) === */";
const BURGUNDY = "#6b1d2a", GOLD = "#d4a843";
const MAP = { "#1a2332": BURGUNDY, "#0ea5e9": GOLD, "#0369a1": BURGUNDY, "#f5f7fa": "#faf6f0", "#f0f4f8": "#f3ece0", "#e2e8f0": "#d0c4b8", "#e0e0e0": "#d0c4b8" };

function parse(s) {
  const out = []; let i = 0, media = null;
  while (i < s.length) {
    const open = s.indexOf("{", i); if (open < 0) break;
    const prelude = s.slice(i, open).replace(/\/\*[\s\S]*?\*\//g, "").trim();
    if (/^@(media|supports)/.test(prelude)) { media = prelude; i = open + 1; continue; }
    if (prelude.startsWith("@")) { let d = 1, j = open + 1; while (d && j < s.length) { d += s[j] === "{" ? 1 : s[j] === "}" ? -1 : 0; j++; } i = j; continue; }
    const close = s.indexOf("}", open);
    out.push({ media, selector: prelude, body: s.slice(open + 1, close) });
    i = close + 1;
    let j = i; while (/\s/.test(s[j] || "")) j++;
    if (media && s[j] === "}") { media = null; i = j + 1; }
  }
  return out;
}

const remap = (prop, val) => val.replace(/#[0-9a-f]{6}/gi, (c) => {
  const m = MAP[c.toLowerCase()]; if (!m) return c;
  if (c.toLowerCase() === "#0ea5e9" && /^(color|background(-color)?)$/.test(prop)) return BURGUNDY; // gold fails contrast as text or under white text
  return m;
});

const lum = (hex) => { const v = [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

let css = fs.readFileSync(FILE, "utf8");
const at = css.indexOf(START);
if (at >= 0) css = css.slice(0, at).trimEnd() + "\n";

const rules = [];
for (const r of parse(css)) {
  const decls = r.body.split(";").map((d) => d.trim()).filter(Boolean).map((d) => { const k = d.indexOf(":"); return [d.slice(0, k).trim(), d.slice(k + 1).trim()]; });
  const changed = decls.filter(([p, v]) => /#[0-9a-f]{6}/i.test(v) && Object.keys(MAP).some((c) => v.toLowerCase().includes(c))).map(([p, v]) => [p, remap(p, v)]);
  if (!changed.length) continue;
  const sels = r.selector.split(",").map((s) => s.trim()).filter((s) => s && s !== "*" && s !== "html")
    .map((s) => (/^body\b/.test(s) ? s.replace(/^body/, "body.theme-gallery") : `.theme-gallery ${s}`));
  const text = `${sels.join(",\n")} { ${changed.map(([p, v]) => `${p}: ${v}`).join("; ")}; }`;
  rules.push(r.media ? `${r.media} {\n${text}\n}` : text);
  const fg = (decls.find(([p]) => p === "color") || [])[1], bg = (changed.find(([p]) => /^background(-color)?$/.test(p)) || [])[1];
  const fgNew = (changed.find(([p]) => p === "color") || [null, fg])[1];
  if (fgNew && bg && /^#[0-9a-f]{6}$/i.test(fgNew) && /^#[0-9a-f]{6}$/i.test(bg) && ratio(fgNew, bg) < 4.5) console.warn(`LOW CONTRAST ${ratio(fgNew, bg).toFixed(2)}: ${r.selector}`);
}
fs.writeFileSync(FILE, css + "\n" + START + "\n" + rules.join("\n") + "\n");
console.log(`Wrote ${rules.length} theme rules.`);
```

- [ ] **Step 7: Generate the theme and review contrast warnings**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && node scripts/make-theme.js`
Expected: "Wrote N theme rules." Any `LOW CONTRAST` line names a selector: open that rule in `styles.css`, and add a manual override line *above* the generated block (so regeneration keeps it) setting a readable foreground/background under `.theme-gallery`. Re-run until no warnings.

- [ ] **Step 8: Verify in the browser**

Restart the preview (`preview_stop`, `preview_start` name `site`) and open `/huma1301/fixture/gallery-fixture/`. Check with `read_page`/`javascript_tool`/screenshot:
- `body.theme-gallery` exists; header background computes to `rgb(107, 29, 42)`.
- Gallery 1: the viewer is visible and shows "Image unavailable" with credit "Broken image credit."; clicking thumb 2 swaps credit to "Second credit." and notice to "Notice B."
- Gallery 2: clicking nothing shows an `iframe` whose src begins `https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ`.
- Callout has cream background and gold left border.
- At 390px width (`resize_window` mobile): `document.documentElement.scrollWidth <= window.innerWidth`.
- With scripts disabled (`javascript_tool`: `document.querySelectorAll('.gallery__viewer').forEach(v=>v.hidden)` is not needed; instead confirm in the served HTML that each thumb has an `href`).
- Open `/phil1301/` and `/phil2306/`: body has no `theme-` class and header is still `rgb(26, 35, 50)`.

- [ ] **Step 9: Remove the fixture, keep the stub, commit**

```bash
rm huma1301/gallery-fixture.njk
git add scripts/make-theme.js course-assets _includes/layouts/base.njk huma1301/huma1301.11tydata.json
git commit -m "feat: add gallery theme, Gallery component, and Experience It callout

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Converter and course skeleton

**Files:**
- Create: `scripts/convert-huma.js`, `huma1301/index.njk`, generated `huma1301/<unit-slug>/{index,lesson}.njk`, `huma1301/assets/images/*`, `scripts/build-huma-data.js`
- Modify: `huma1301/huma1301.11tydata.json` (rewritten by `build-huma-data.js`), `.eleventy.js` (passthrough)

**Interfaces:**
- Consumes: Unit Reference slugs and titles; Task 1 `theme` flag.
- Produces: per-unit `index.njk` (position 1, layout `layouts/unit.njk`) and `lesson.njk` (position 2, layout `layouts/page.njk`) with converted content; `copyAsset` naming scheme `alt-slug.ext`; `scripts/build-huma-data.js` that rewrites the data file from a unit table.

- [ ] **Step 1: Add passthrough**

In `.eleventy.js` add after the `phil2306/assets` line:

```js
  eleventyConfig.addPassthroughCopy("huma1301/assets");
```

- [ ] **Step 2: Write `scripts/convert-huma.js`**

Copy `scripts/convert-ethics.js` to `scripts/convert-huma.js`, then make exactly these changes (everything else — `normalizeFilename`, `squash`, `sameText`, accordion, bullet, video, PDF handling — stays):

1. Header comment: "One-shot conversion of the HUMA 1301 Canvas export…".
2. Constants:

```js
const IMSCC = path.join(ROOT, "6271-huma-1301-intro-to-the-humanities-i-ss-15970-export.imscc");
const SLUG = "huma1301";
```

3. Replace `MANIFEST` with (the export's Chapter N Overview → unit `index`, Chapter N Content → `lesson`; Start Here pages are written by hand in Task 3 and are not converted):

```js
const UNITS = [
  ["unit-1-the-humanities", "The Humanities: An Introduction", 1],
  ["unit-2-what-is-a-work-of-art", "What Is a Work of Art?", 2],
  ["unit-3-being-a-critic", "Being a Critic of the Arts", 3],
  ["unit-4-painting", "Painting", 4],
  ["unit-5-sculpture", "Sculpture", 5],
  ["unit-6-architecture", "Architecture", 6],
  ["unit-7-literature", "Literature", 7],
  ["unit-8-theater", "Theater", 8],
  ["unit-9-music", "Music", 9],
  ["unit-10-dance", "Dance", 10],
  ["unit-11-photography", "Photography", 11],
  ["unit-12-cinema", "Cinema", 12],
  ["unit-13-television-and-video-art", "Television and Video Art", 13],
];
const MANIFEST = UNITS.flatMap(([mod, name, n]) => [
  [mod, "index", `Unit ${n}: Overview`, `chapter-${n}-overview`, 1],
  [mod, "lesson", `Lesson: ${name}`, `chapter-${n}-content`, 2],
]);
```

4. `calloutType` replaced with the export's palette:

```js
function calloutType(style) {
  if (/border-left:[^;]*#d4a843/i.test(style) && /background-color:\s*#faf6f0/i.test(style)) return "experience"; // "Try this" boxes
  if (/border-left:[^;]*#6b1d2a/i.test(style)) return "note";
  if (/border-left:[^;]*#2d6a4f/i.test(style) || /background-color:\s*#eef6f1/i.test(style)) return "connection";
  if (/background-color:\s*#fdf7ec/i.test(style)) return "note";
  return null;
}
const ICONS = { concept: "&#128161;", note: "&#8505;&#65039;", connection: "&#10145;&#65039;", experience: "&#128065;&#65039;" };
```

5. Header-banner detection: change the color test to `#6b1d2a` (the export's banner `div`; it still skips anything inside `details`).
6. Image naming. The export's image file names are long identical-prefix tokens that collide when shortened, so name copied images from the `alt` text. Change `copyAsset` to take an alt hint and name files `<alt-slug><ext>` (falling back to a 10-character hash of the path):

```js
const crypto = require("crypto");
const copyAsset = (ref, kind, altHint) => {
  const rel = decodeURIComponent(ref.replace(/^\$IMS-CC-FILEBASE\$\/?/, "").split("?")[0]);
  const srcFile = path.join(tmp, "web_resources", rel);
  const ext = path.extname(rel).toLowerCase();
  const base = altHint ? altHint.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 55) : "";
  const name = (base || crypto.createHash("sha1").update(rel).digest("hex").slice(0, 10)) + ext;
  const url = `/${SLUG}/assets/${kind}/${name}`;
  // ...rest unchanged
};
```

and in `convertPage` pass the alt: `copyAsset(src, "images", $(el).attr("alt"))` for `img[src]`; links keep `copyAsset(href, kind)`.
7. Front-matter writer: overview pages (`slug === "index"`) use `layouts/unit.njk`; lessons use `layouts/page.njk`; keep `breadcrumbTitle` for lessons; `position` comes from the manifest's fixed value (replace the `positions[mod]` bookkeeping with `const position = fixedPos`).
8. The converted body keeps the export's "Supplemental Works" section and "Try this" boxes (now `callout--experience`); the Unit Procedure reorganizes them.

Add `"convert:huma": "node scripts/convert-huma.js"` to the `scripts` block of `package.json`.

- [ ] **Step 3: Run the converter**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && node scripts/convert-huma.js`
Expected: 26 pages listed (13 × index+lesson), "copied N assets (0 missing)". If any asset is reported missing, list it in `docs/huma1301-media.md` under Gaps.

- [ ] **Step 4: Write `scripts/build-huma-data.js` and run it**

```js
// Writes huma1301/huma1301.11tydata.json from the unit table. Re-run after adding pages.
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "huma1301");

const UNITS = [
  ["unit-1-the-humanities", "The Humanities: An Introduction", "&#127965;&#65039;", "What the humanities are, why they matter, and how art expresses human values."],
  ["unit-2-what-is-a-work-of-art", "What Is a Work of Art?", "&#128444;&#65039;", "Subject matter, content, form, and what makes something art."],
  ["unit-3-being-a-critic", "Being a Critic of the Arts", "&#128269;", "Describe, interpret, and evaluate: the tools of the critic."],
  ["unit-4-painting", "Painting", "&#127912;", "Line, color, texture, and composition in the art of the canvas."],
  ["unit-5-sculpture", "Sculpture", "&#128511;", "Form in three dimensions, from carving to installation."],
  ["unit-6-architecture", "Architecture", "&#127963;&#65039;", "How buildings shape space and express the values of a culture."],
  ["unit-7-literature", "Literature", "&#128214;", "Story, poem, and drama as art made of words."],
  ["unit-8-theater", "Theater", "&#127917;", "Live performance and what drama shows about being human."],
  ["unit-9-music", "Music", "&#127925;", "Sound organized in time: rhythm, melody, harmony, and form."],
  ["unit-10-dance", "Dance", "&#128131;", "The body in motion, from ballet to modern dance."],
  ["unit-11-photography", "Photography", "&#128247;", "Light, framing, and the power of the captured moment."],
  ["unit-12-cinema", "Cinema", "&#127910;", "Moving images, editing, and the language of film."],
  ["unit-13-television-and-video-art", "Television and Video Art", "&#128250;", "Broadcast, screen, and video as an art medium."],
];

const front = (file) => { const t = fs.readFileSync(file, "utf8"); return { title: (t.match(/^title: "(.*)"$/m) || [])[1], position: Number((t.match(/^position: (\d+)/m) || [])[1]) }; };
const pagesIn = (mod) => fs.readdirSync(path.join(DIR, mod)).filter((f) => f.endsWith(".njk")).map((f) => ({ slug: f.replace(/\.njk$/, ""), ...front(path.join(DIR, mod, f)) })).sort((a, b) => a.position - b.position).map(({ slug, title }) => ({ slug, title }));

const modules = [];
const startHere = path.join(DIR, "start-here");
if (fs.existsSync(startHere)) modules.push({ slug: "start-here", title: "Start Here", icon: "&#128218;", description: "Course orientation, your instructor, and how the Gallery and Experience It activities work.", pages: pagesIn("start-here") });
for (const [slug, title, icon, description] of UNITS) {
  const n = UNITS.findIndex((u) => u[0] === slug) + 1;
  if (fs.existsSync(path.join(DIR, slug))) modules.push({ slug, title: `Unit ${n}: ${title}`, icon, description, pages: pagesIn(slug) });
}
const fp = path.join(DIR, "final-paper");
if (fs.existsSync(fp)) modules.push({ slug: "final-paper", title: "Final Paper", icon: "&#128196;", description: "Your final project: a critical analysis of a work of art.", pages: pagesIn("final-paper") });

const data = { course: { slug: "huma1301", title: "HUMA 1301: Introduction to the Humanities", shortTitle: "HUMA 1301", theme: "gallery", modules } };
fs.writeFileSync(path.join(DIR, "huma1301.11tydata.json"), JSON.stringify(data, null, 2) + "\n");
console.log(`Wrote ${modules.length} modules.`);
```

Run: `node scripts/build-huma-data.js`. Expected: "Wrote 13 modules." (Start Here and Final Paper are added by Tasks 3 and 10, which re-run this script.)

- [ ] **Step 5: Course landing page**

Create `huma1301/index.njk`:

```njk
---
layout: layouts/course-home.njk
title: "Introduction to the Humanities"
subtitle: "Explore painting, sculpture, architecture, literature, theater, music, dance, photography, cinema, and television at your own pace."
---
```

- [ ] **Step 6: Build and check**

Run: `npx @11ty/eleventy --output=/tmp/huma-build --quiet` (use the scratchpad build directory used earlier). Expected: no errors; `huma1301/unit-4-painting/lesson/index.html` exists. Start the preview, open `/huma1301/` and `/huma1301/unit-4-painting/lesson/`; confirm burgundy theme, sidebar lists 13 units each with Overview and Lesson, "In This Unit" TOC on an Overview page, and prev/next works. Banned strings are still present at this stage (removed in Tasks 5–8).

- [ ] **Step 7: Commit**

```bash
git add scripts/convert-huma.js scripts/build-huma-data.js package.json .eleventy.js huma1301
git commit -m "feat: convert HUMA 1301 export into course skeleton

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Check script (the course's test suite)

**Files:**
- Create: `scripts/check-huma.js`

**Interfaces:**
- Produces: `node scripts/check-huma.js [unit-slug]` exits 1 and prints one line per failure; checks the Global Constraints.

- [ ] **Step 1: Write the script**

```js
// Mechanical checks for huma1301 (see docs/superpowers/specs/2026-10-11-humanities-course-design.md).
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "huma1301");
const only = process.argv[2];
const BANNED = /textbook|\bConnect\b|McGraw|SmartBook|\bCanvas\b|\bChapter \d/i;
const LESSON_MIN_WORDS = 1200;
const fails = [];
const fail = (file, msg) => fails.push(`${path.relative(ROOT, file)}: ${msg}`);

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (e.name === "assets" ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]));
const fileFor = (url) => path.join(ROOT, decodeURIComponent(url.split("?")[0]));

for (const file of walk(DIR).filter((f) => f.endsWith(".njk"))) {
  if (only && !file.includes(only)) continue;
  const raw = fs.readFileSync(file, "utf8");
  const fm = (raw.match(/^---\n([\s\S]*?)\n---/) || [, ""])[1];
  const body = raw.slice(raw.indexOf("---", 3) + 3);
  const $ = cheerio.load(body, { decodeEntities: false }, false);
  const text = $.root().text().replace(/\s+/g, " ").trim();
  const name = path.basename(file);

  const banned = (fm + " " + text).match(BANNED);
  if (banned) fail(file, `banned phrase "${banned[0]}"`);

  $("img").each((i, el) => {
    const src = $(el).attr("src") || "";
    if (!$(el).attr("alt")) fail(file, `image without alt: ${src}`);
    if (src.startsWith("/") && !fs.existsSync(fileFor(src))) fail(file, `image file missing: ${src}`);
  });

  $(".gallery__thumb").each((i, el) => {
    if (!$(el).attr("data-credit")) fail(file, `gallery work ${i + 1} has no data-credit`);
    if (!$(el).attr("data-notice")) fail(file, `gallery work ${i + 1} has no data-notice`);
    const h = $(el).attr("href") || "";
    if (h.startsWith("/") && !fs.existsSync(fileFor(h))) fail(file, `gallery file missing: ${h}`);
    const v = $(el).attr("data-video");
    if (v && !/^[A-Za-z0-9_-]{11}$/.test(v)) fail(file, `bad YouTube id: ${v}`);
  });

  if (name === "lesson.njk") {
    const words = text.split(" ").length;
    if (words < LESSON_MIN_WORDS) fail(file, `lesson has ${words} words (minimum ${LESSON_MIN_WORDS})`);
    const n = $(".gallery .gallery__thumb").length;
    if (n < 5 || n > 8) fail(file, `gallery has ${n} works (expected 5-8)`);
    if (!$(".callout--experience").length) fail(file, "no Experience It block");
    if (!/Further Exploration/.test(body)) fail(file, "no Further Exploration section");
    const links = $("h3:contains('Further Exploration')").nextAll().find("a[href^='http']").length;
    if (links < 2 || links > 4) fail(file, `Further Exploration has ${links} links (expected 2-4)`);
  }

  if (name === "quiz.njk") {
    const qs = $(".quiz__question");
    if (qs.length !== 10) fail(file, `quiz has ${qs.length} questions (expected 10)`);
    qs.each((i, q) => {
      const ids = $(q).find("input").map((j, e) => $(e).attr("value")).get();
      if (ids.length < 2) fail(file, `question ${i + 1} has fewer than 2 choices`);
      if (!ids.includes($(q).attr("data-correct"))) fail(file, `question ${i + 1}: data-correct not among choices`);
      ["correct", "incorrect"].forEach((k) => { if ($(q).find(`.quiz__feedback--${k}`).text().trim().length < 20) fail(file, `question ${i + 1}: missing ${k} feedback`); });
    });
  }

  if (name === "reflection-prompt.njk" && !$("textarea.reflection__textarea").length) fail(file, "reflection has no textarea");
}

console.log(fails.length ? fails.join("\n") + `\n\n${fails.length} problem(s).` : "All checks passed.");
process.exit(fails.length ? 1 : 0);
```

- [ ] **Step 2: Run it against the raw skeleton and confirm it fails as expected**

Run: `node scripts/check-huma.js`
Expected: FAIL with banned phrases ("textbook", "Chapter N"), lessons under the word floor, galleries missing, no Experience It blocks, no Further Exploration, no quizzes yet (nothing reports a missing quiz; those files do not exist). This is the baseline the next tasks drive to zero.

- [ ] **Step 3: Commit**

```bash
git add scripts/check-huma.js
git commit -m "test: add mechanical checks for the Humanities course

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Start Here pages

**Files:**
- Create: `huma1301/start-here/{index,meet-your-instructor,assessments,how-this-course-works,website-orientation}.njk`
- Modify: `huma1301/huma1301.11tydata.json` (via `build-huma-data.js`)

**Interfaces:**
- Consumes: PHIL 2306 pages `phil2306/start-here/{index,meet-your-instructor,assessments,website-orientation}.njk` as the model for tone and structure; export wiki pages `welcome-to-the-course`, `getting-started`, `meet-your-instructor`, `assessments-and-grading`.
- Produces: five Start Here pages at positions 1–5 in the order above, layout `layouts/page.njk`, `module: "start-here"`.

- [ ] **Step 1: Read the sources.** Read the four PHIL 2306 Start Here pages and the export's four wiki pages (the extracted export is in the scratchpad `huma-export/wiki_content/`, or re-extract with adm-zip).

- [ ] **Step 2: Write the pages.**

  - `index.njk` ("Getting Started", position 1): welcome, what the course covers (13 art forms), how each unit works (Overview, Lesson with Gallery and Experience It, Reflection, Quiz), pace-yourself advice, no due dates. Source: PHIL 2306 Getting Started adapted with the export's welcome text. Remove all Connect/Canvas/textbook references.
  - `meet-your-instructor.njk` (position 2): the export's instructor text, with the Canvas references removed; reuse the PHIL 2306 page's image handling and layout.
  - `assessments.njk` (position 3): reflections (13, unscored), quizzes (13, self-study with instant feedback, unlimited use), three Critic's Practice exercises, Final Paper; no grading weights, no discussion expectations.
  - `how-this-course-works.njk` (position 4): explain the Gallery (click a work, read the credit and "what to notice"), Watch & Listen, Experience It, accordions, and the quiz.
  - `website-orientation.njk` (position 5): adapt the PHIL 2306 orientation activity to HUMA 1301's pages (the Gallery, an accordion, a quiz, a reflection). It replaces the export's Scavenger Hunt. Describe accordions, not tabs.

- [ ] **Step 3: Rebuild data, run checks**

```bash
node scripts/build-huma-data.js
node scripts/check-huma.js start-here
```
Expected: "All checks passed." Open `/huma1301/start-here/` in the preview and click through all five pages.

- [ ] **Step 4: Commit**

```bash
git add huma1301
git commit -m "feat: add HUMA 1301 Start Here pages

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Quiz banks, content data module, interactives builder, and Units 1–3

**Files:**
- Create: `scripts/dump-huma-banks.js`, `scripts/huma-banks.json`, `scripts/huma-content.js`, `scripts/build-huma-interactives.js`, `scripts/fetch-huma-images.js`, `docs/huma1301-media.md`
- Modify: `huma1301/unit-{1,2,3}-*/{index,lesson}.njk`; create `huma1301/unit-3-being-a-critic/critics-practice.njk`

**Interfaces:**
- Consumes: Unit Procedure; Task 3 check script.
- Produces: `scripts/huma-content.js` exporting `{ [unitNumber]: { reflection: { title, subtitle, html }, quiz: [ { text, choices: [ { text, correct } ], right, wrong } ] } }` (each quiz entry written with the correct choice first; the shuffle script reorders later); `build-huma-interactives.js` writes `reflection-prompt.njk` (position 4) and `quiz.njk` (position 5) for every unit present in `huma-content.js`.

- [ ] **Step 1: Dump the question banks**

`scripts/dump-huma-banks.js`:

```js
const AdmZip = require("adm-zip");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const zip = new AdmZip(path.join(ROOT, "6271-huma-1301-intro-to-the-humanities-i-ss-15970-export.imscc"));
const plain = (h) => cheerio.load(h).text().replace(/\s+/g, " ").trim();
const out = {};
for (const e of zip.getEntries().filter((e) => /^non_cc_assessments\/.*\.qti$/.test(e.entryName))) {
  const $ = cheerio.load(e.getData().toString("utf8"), { xmlMode: true });
  const title = $("fieldlabel:contains('bank_title')").next().text().trim();
  const m = title.match(/^Chapter (\d+)$/);
  if (!m) continue;
  out[m[1]] = $("item").toArray().map((item) => {
    const type = $(item).find("fieldlabel:contains('question_type')").next().text().trim();
    const correct = $(item).find("respcondition").toArray().find((r) => $(r).find("setvar").text().trim() === "100");
    const correctId = $(correct).find("varequal").text().trim();
    const fb = $(item).find("itemfeedback").toArray().map((f) => plain($(f).find("mattext").text())).filter(Boolean);
    const text = plain($(item).find("presentation > material mattext").first().text());
    return {
      type, text, feedback: fb,
      choices: $(item).find("response_label").toArray().map((l) => ({ text: plain($(l).find("mattext").text()), correct: $(l).attr("ident") === correctId })),
      flags: [type !== "multiple_choice_question" ? "NOT-SINGLE-CHOICE" : "", /textbook|chapter|figure|image|pictured|shown above/i.test(text) ? "REWRITE" : ""].filter(Boolean),
    };
  });
}
fs.writeFileSync(path.join(ROOT, "scripts", "huma-banks.json"), JSON.stringify(out, null, 2));
console.log(Object.entries(out).map(([k, v]) => `Chapter ${k}: ${v.length} questions, ${v.filter((q) => q.flags.length).length} flagged`).join("\n"));
```

Run: `node scripts/dump-huma-banks.js`. Expected: 13 lines, one per chapter bank. Flagged items must be rewritten or dropped.

- [ ] **Step 2: Write `scripts/build-huma-interactives.js`**

```js
// Writes reflection-prompt.njk and quiz.njk for each unit in huma-content.js, and the Final Paper page.
const fs = require("fs");
const path = require("path");
const content = require("./huma-content.js");
const { FINAL_PAPER } = require("./huma-final-paper.js");

const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "huma1301");
const UNITS = [
  ["unit-1-the-humanities", "The Humanities: An Introduction"], ["unit-2-what-is-a-work-of-art", "What Is a Work of Art?"],
  ["unit-3-being-a-critic", "Being a Critic of the Arts"], ["unit-4-painting", "Painting"], ["unit-5-sculpture", "Sculpture"],
  ["unit-6-architecture", "Architecture"], ["unit-7-literature", "Literature"], ["unit-8-theater", "Theater"],
  ["unit-9-music", "Music"], ["unit-10-dance", "Dance"], ["unit-11-photography", "Photography"],
  ["unit-12-cinema", "Cinema"], ["unit-13-television-and-video-art", "Television and Video Art"],
];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const frontMatter = (title, mod, crumb, position) => `---\nlayout: layouts/page.njk\ntitle: ${JSON.stringify(title)}\nmodule: "${mod}"\nbreadcrumbTitle: ${JSON.stringify(crumb)}\nposition: ${position}\n---\n`;
const nextNav = (href, title) => `<nav class="page-nav" aria-label="Page navigation" style="margin-top: 2.5rem;">
  <a href="${href}" class="page-nav__link page-nav__link--next page-nav__link--filled">
    <span class="page-nav__label">Next &rarr;</span>
    <span class="page-nav__title">${title}</span>
  </a>
</nav>`;

function reflection(r) {
  return `<div class="reflection">
  <div class="reflection__prompt">
<h2>${r.title}</h2>
<p><em>${r.subtitle}</em></p>
${r.html}
  </div>
  <h3>Your Reflection</h3>
  <textarea class="reflection__textarea" placeholder="Write your reflection here..."></textarea>
  <p class="reflection__note">This is a thinking space — your response is not saved or submitted. Copy your work if you want to keep it.</p>
</div>`;
}

function quiz(questions) {
  const qs = questions.map((q, i) => {
    const n = i + 1;
    const ids = q.choices.map((c, j) => `q${n}${"abcd"[j]}`);
    const correctId = ids[q.choices.findIndex((c) => c.correct)];
    const choices = q.choices.map((c, j) => `      <li class="quiz__choice">
        <input type="radio" name="q${n}" value="${ids[j]}" id="${ids[j]}">
        <label for="${ids[j]}">${esc(c.text)}</label>
      </li>`).join("\n");
    return `  <div class="quiz__question" data-correct="${correctId}">
    <div class="quiz__question-text"><span class="quiz__number">${n}</span> ${esc(q.text)}</div>
    <ul class="quiz__choices">
${choices}
    </ul>
    <div class="quiz__feedback quiz__feedback--correct" style="display:none;">${esc(q.right)}</div>
    <div class="quiz__feedback quiz__feedback--incorrect" style="display:none;">${esc(q.wrong)}</div>
  </div>`;
  });
  return `<div class="callout callout--concept"><span class="callout__icon" aria-hidden="true">&#128161;</span><div class="callout__content">
<p><strong>Self-study quiz.</strong> This quiz is for your own review — answers are not recorded. You’ll get instant feedback on each question.</p>
</div></div>

<div class="quiz"><div class="quiz__top-bar"><div class="quiz__score-tracker" style="display:none;"></div><button class="quiz__start-over" type="button" style="display:none;">Start Over</button></div>
${qs.join("\n")}
</div>`;
}

UNITS.forEach(([slug, name], i) => {
  const n = i + 1;
  const c = content[n];
  if (!c) return;
  const dir = path.join(DIR, slug);
  const next = UNITS[i + 1];
  const nav = next ? nextNav(`/huma1301/${next[0]}/`, `Continue to Unit ${n + 1}: ${next[1]}`) : nextNav("/huma1301/final-paper/", "Continue to Final Paper");
  fs.writeFileSync(path.join(dir, "reflection-prompt.njk"), frontMatter("Reflection Prompt", slug, "Reflection Prompt", 4) + reflection(c.reflection) + "\n");
  fs.writeFileSync(path.join(dir, "quiz.njk"), frontMatter(`Quiz: ${name}`, slug, "Quiz", 5) + quiz(c.quiz) + "\n\n" + nav + "\n");
  console.log(`Unit ${n}: reflection + ${c.quiz.length}-question quiz`);
});

fs.mkdirSync(path.join(DIR, "final-paper"), { recursive: true });
fs.writeFileSync(path.join(DIR, "final-paper", "index.njk"), `---\nlayout: layouts/page.njk\ntitle: "Final Paper"\nmodule: "final-paper"\nposition: 1\n---\n\n${FINAL_PAPER}`);
console.log("Final Paper written.");
```

- [ ] **Step 3: Write `scripts/huma-final-paper.js`**

```js
exports.FINAL_PAPER = `<p>Your final assignment is a critical analysis of one work of art from this course.</p>

<h2>Instructions</h2>

<p>Choose one work from any unit — a painting, a building, a poem, a film, a piece of music, a dance, a photograph, anything we have looked at or listened to — and write a critical analysis of it using the three steps from Unit 3: <strong>describe</strong> it, <strong>interpret</strong> it, and <strong>evaluate</strong> it.</p>

<h3>Requirements</h3>
<ul>
<li>Minimum three pages, double-spaced, MLA format</li>
<li>Name the work, its creator, and its date, and say where a reader can see or hear it</li>
<li><strong>Describe</strong> what is actually there, using the vocabulary of the art form (line, color, composition, rhythm, montage, and so on)</li>
<li><strong>Interpret</strong> what the work means or expresses, and support your reading with specific details from the work</li>
<li><strong>Evaluate</strong> how well the work succeeds, and say what standard you are using to judge it</li>
<li>Relate your analysis to at least one idea from the course units (for example subject matter and content, form, or the revelatory function of art)</li>
</ul>

<h3>Suggested Approaches</h3>
<ul>
<li><strong>Look closely</strong> at a work from the Gallery and show how a single detail carries the whole meaning</li>
<li><strong>Compare</strong> two works in different art forms that treat the same subject, such as a war, a city, or a loss</li>
<li><strong>Respond to a performance</strong> you can watch or listen to online, and explain what happens moment by moment</li>
<li><strong>Test a claim</strong> from the course, for example that a work reveals the values of its culture, against a work you choose</li>
</ul>

<div class="callout callout--concept"><span class="callout__icon" aria-hidden="true">&#128161;</span><div class="callout__content">
<p><strong>Choose a work that holds your attention.</strong> You will spend several pages with it. The best papers come from works the writer finds puzzling, moving, or even irritating, because there is something to work out.</p>
</div></div>

<div class="callout callout--connection"><span class="callout__icon" aria-hidden="true">&#10145;&#65039;</span><div class="callout__content">
<p><strong>Need help getting started?</strong> Review your Experience It notes and reflections from each unit. The work you kept coming back to is usually the right one.</p>
</div></div>
`;
```

- [ ] **Step 4: Create `scripts/huma-content.js` with a first entry and the media log**

```js
// Reflection prompts and 10-question quizzes for every unit. Quiz choices are written with the
// correct one first; scripts/shuffle-quiz-answers.js spreads the correct answers across A-D later.
// Feedback is written by Claude and awaits the instructor's review.
module.exports = {
  // 1: { reflection: { title, subtitle, html }, quiz: [ { text, choices: [ { text, correct: true }, { text }, ... ], right, wrong } ] },
};
```

Create `docs/huma1301-media.md`:

```markdown
# HUMA 1301 media log

Every image and clip used in the course. Status: planned | downloaded | gap.

| Unit | Work | Download URL | License / status | File | Size | Status |
|---|---|---|---|---|---|---|

## Gaps (works wanted but not obtainable)
```

- [ ] **Step 5: Units 1–3 content, then the download gate**

Apply the Unit Procedure to units 1, 2, and 3 (steps 1–6 and 9 write pages; steps 7–8 write `huma-content.js` entries 1, 2, 3; step 9 is Critic's Practice for Unit 3, from the *Last Supper* essay). Keep the export's own images where they fit the Gallery.

**Download gate:** before downloading anything, show the developer the planned downloads for units 1–3 (from `docs/huma1301-media.md`: work, source URL, license/status, approximate size) and wait for a yes. Then write `scripts/fetch-huma-images.js`:

```js
// Downloads the works listed in docs/huma1301-media.md with status "planned" into huma1301/assets/images.
// Wikimedia sources use Special:FilePath with ?width=1200 so files stay web-sized.
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const LOG = path.join(ROOT, "docs", "huma1301-media.md");
const OUT = path.join(ROOT, "huma1301", "assets", "images");
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const lines = fs.readFileSync(LOG, "utf8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const c = lines[i].split("|").map((s) => s.trim());
    if (c.length < 9 || c[7] !== "planned") continue;
    const url = c[3], file = c[5];
    const res = await fetch(url, { headers: { "User-Agent": "professortheriault-site/1.0 (educational)" } });
    if (!res.ok) { console.warn(`FAILED ${res.status}: ${url}`); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(OUT, file), buf);
    c[6] = `${(buf.length / 1024).toFixed(0)} KB`; c[7] = "downloaded";
    lines[i] = c.join(" | ").trim();
    console.log(`ok ${file} (${(buf.length / 1024).toFixed(0)} KB)`);
  }
  fs.writeFileSync(LOG, lines.join("\n"));
})();
```

(Log columns: `| Unit | Work | Download URL | License / status | File | Size | Status |`. Run only after the developer's yes.)

- [ ] **Step 6: Build interactives and verify**

```bash
node scripts/build-huma-interactives.js
node scripts/build-huma-data.js
node scripts/check-huma.js unit-1
node scripts/check-huma.js unit-2
node scripts/check-huma.js unit-3
```
Expected: "All checks passed." for all three. Preview units 1–3: Gallery switches works, credits show, Experience It renders, quiz gives feedback (click a wrong and a right answer), reflection textarea accepts text, 390px has no sideways scroll.

- [ ] **Step 7: Log and commit**

Append to `docs/build-log/2026-initial-build.md` bullets: Humanities Units 1–3 built; check script passing; media downloaded count; gaps. Add decision entries to `docs/decisions/course-experience.md` (Gallery/Experience It, 13 units, warm theme: source: developer 2026-10-11; spec path) and `docs/decisions/site-and-hosting.md` (course theme via body class). Then:

```bash
git add scripts docs huma1301
git commit -m "feat: build HUMA 1301 Units 1-3 with galleries, reflections, quizzes

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Units 4–6 (Painting, Sculpture, Architecture)

**Files:**
- Modify: `huma1301/unit-{4,5,6}-*/{index,lesson}.njk`, `scripts/huma-content.js`, `docs/huma1301-media.md`
- Create (generated): `reflection-prompt.njk`, `quiz.njk` per unit

- [ ] **Step 1:** Apply the Unit Procedure to units 4, 5, 6 (steps 1–8, 10). The export's Chapter 4 images (Kahlo, Rothko, Lawrence), Chapter 5 images, and Chapter 6 images are the starting Gallery works.
- [ ] **Step 2: Download gate** — present planned downloads for units 4–6 and wait for a yes; then run `node scripts/fetch-huma-images.js`; record gaps.
- [ ] **Step 3:** Run `node scripts/build-huma-interactives.js && node scripts/build-huma-data.js && node scripts/check-huma.js unit-4 && node scripts/check-huma.js unit-5 && node scripts/check-huma.js unit-6`. Expected: all pass. Preview each unit (Gallery, Experience It, quiz, phone width).
- [ ] **Step 4:** Append build-log bullets; commit:

```bash
git add scripts docs huma1301
git commit -m "feat: build HUMA 1301 Units 4-6

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Units 7–9 (Literature, Theater, Music)

**Files:**
- Modify: `huma1301/unit-{7,8,9}-*/{index,lesson}.njk`, `scripts/huma-content.js`, `docs/huma1301-media.md`
- Create: `huma1301/unit-7-literature/critics-practice.njk` (Whitman essay)

- [ ] **Step 1:** Apply the Unit Procedure to units 7, 8, 9 (all steps; step 9 for Unit 7). Units 8 and 9 use Watch & Listen: the export's existing YouTube embeds become the first thumbnails (convert each `video-embed` iframe's video ID into a `data-video` thumbnail); add more clips from official or museum channels. Each video is opened in the browser and confirmed to play before its ID is written. Unit 7's Gallery shows manuscripts, title pages, and illustrations; the Whitman poem appears in full in Critic's Practice (public domain).
- [ ] **Step 2: Download gate** for units 7 (images) — video thumbnails come from YouTube and need no download; list them in the media log with status `embedded`.
- [ ] **Step 3:** Run `node scripts/build-huma-interactives.js && node scripts/build-huma-data.js && node scripts/check-huma.js unit-7 && node scripts/check-huma.js unit-8 && node scripts/check-huma.js unit-9`. Expected: all pass. Preview: videos load in Watch & Listen.
- [ ] **Step 4:** Append build-log bullets; commit with message `feat: build HUMA 1301 Units 7-9` (include the Co-Authored-By line).

---

### Task 8: Units 10–13 (Dance, Photography, Cinema, Television and Video Art)

**Files:**
- Modify: `huma1301/unit-{10,11,12,13}-*/{index,lesson}.njk`, `scripts/huma-content.js`, `docs/huma1301-media.md`
- Create: `huma1301/unit-11-photography/critics-practice.njk` (Stieglitz *Paula* essay)

- [ ] **Step 1:** Apply the Unit Procedure to units 10–13 (all steps; step 9 for Unit 11). Units 10, 12, 13 use Watch & Listen (confirm every video plays); Unit 11 uses Gallery.
- [ ] **Step 2: Download gate** for unit 11 images (and any stills); record gaps.
- [ ] **Step 3:** Run `node scripts/build-huma-interactives.js && node scripts/build-huma-data.js && node scripts/check-huma.js unit-10 && node scripts/check-huma.js unit-11 && node scripts/check-huma.js unit-12 && node scripts/check-huma.js unit-13`. Expected: all pass.
- [ ] **Step 4:** Append build-log bullets; commit with message `feat: build HUMA 1301 Units 10-13`.

---

### Task 9: Final Paper, shuffle, and whole-course checks

**Files:**
- Modify: `scripts/shuffle-quiz-answers.js`, generated `huma1301/final-paper/index.njk`, `huma1301/huma1301.11tydata.json`

- [ ] **Step 1:** In `scripts/shuffle-quiz-answers.js` change the course list from `["phil1301", "phil2306"]` to `["phil1301", "phil2306", "huma1301"]`. The shuffle is deterministic and seeded by file path, so the first two courses' files must be byte-identical afterward; confirm with `git status` showing only `huma1301/` quiz files changed.
- [ ] **Step 2:** Run `node scripts/shuffle-quiz-answers.js`; each `huma1301` quiz line should print a balanced letter string with no letter more than twice in a row.
- [ ] **Step 3:** Run `node scripts/build-huma-interactives.js` first only if content changed (the shuffle rewrites quiz files; do not re-run the interactives builder after shuffling, or it will undo the shuffle). Run `node scripts/build-huma-data.js` so the data file lists Final Paper.
- [ ] **Step 4:** Run `node scripts/check-huma.js`. Expected: "All checks passed." with no unit filter.
- [ ] **Step 5:** Commit: `feat: add HUMA 1301 Final Paper and shuffle quiz answers`.

---

### Task 10: Homepage link and integration

**Files:**
- Modify: `index.html`

- [ ] **Step 1:** Replace the Humanities card (currently a `div` with a "Coming Soon" badge) with a link matching the other cards:

```html
      <a href="/huma1301/" class="card-link">
        <div class="card-body">
          <span class="card-icon" role="img" aria-label="Humanities">&#127963;&#65039;</span>
          <h2>Introduction to Humanities</h2>
          <p>Discover how art, literature, history, and culture shape our understanding of the human experience.</p>
        </div>
      </a>
```

- [ ] **Step 2:** Run the preview and click the card from the homepage; confirm it opens `/huma1301/`.
- [ ] **Step 3:** Commit: `feat: link the homepage Humanities card to HUMA 1301`.

---

### Task 11: Verification

**Files:** none modified unless a check fails.

- [ ] **Step 1: Clean build and links.** Build `git archive HEAD` to a temp directory (as in earlier tasks) and run the broken-link scan used before (all `href`/`src` starting `/` resolve). Expected: 0 broken links; PHIL 1301 and PHIL 2306 page counts unchanged.
- [ ] **Step 2: Banned strings across the repo output.** In the built `_site/huma1301/`: `grep -ril "textbook\|mheducation\|connect.mcgraw" _site/huma1301` returns nothing.
- [ ] **Step 3: Other courses unchanged.** Compare built `phil1301/` and `phil2306/` HTML against a build from `main` after normalizing line endings and the added `gallery.js` script tag; the only difference allowed is that script tag and the CSS file contents.
- [ ] **Step 4: Responsive and interactive.** In the preview at 390, 920, and 1280px, on one unit of each type (Painting, Music, Literature with Critic's Practice) check: no horizontal overflow; Gallery and Watch & Listen switch works; accordions open; quiz right/wrong/Start Over; reflection textarea; sidebar and prev/next across a unit boundary.
- [ ] **Step 5: External links.** Extract every `http(s)` URL from `huma1301/**/*.njk` (excluding YouTube embed IDs already verified) and request each with `curl -sIL -o /dev/null -w "%{http_code}"`; any non-2xx is opened in the browser to confirm, then fixed or replaced.
- [ ] **Step 6: Contrast spot-check.** In the preview use `javascript_tool` to compute the contrast ratio for sidebar links, page-nav buttons, accordion headers, and quiz buttons; each is at least 4.5:1 or fixed.

---

### Task 12: Docs and review gate

**Files:**
- Modify: `docs/STATUS.md`, `docs/NEXT-SESSION.txt`, `docs/TESTING-OWED.md`, `docs/build-log/2026-initial-build.md`, `docs/decisions/*.md`, `docs/CLAUDE.md`, `docs/standing-rules.md`

- [ ] **Step 1:** Update `STATUS.md` (HUMA 1301 built; tested: check script, clean build, responsive; not verified: quiz feedback authored by Claude, listed gaps, image rights). Add to `TESTING-OWED.md`: review of HUMA 1301 quiz feedback, review of Final Paper wording, review of gaps in `docs/huma1301-media.md`, confirm modern-artwork credits. Update `docs/CLAUDE.md` architecture (third course, `theme` flag, Gallery component). Add standing rules learned during the build (e.g., image names derived from alt text because export names collide).
- [ ] **Step 2:** Update `NEXT-SESSION.txt` (branch `humanities-course` awaiting review; nothing merged).
- [ ] **Step 3:** Commit docs: `docs: record HUMA 1301 build`.
- [ ] **Step 4: Stop for review.** Tell the developer: the course is complete on branch `humanities-course`, give the preview steps, list gaps and items needing their review, and ask for approval before merging to `main`. Do not push or merge until they say so. After approval: merge to `main` (keeping `.claude/settings.local.json` unstaged), push, wait for the Netlify deploy, verify `https://professortheriault.com/huma1301/` and the homepage card live, and update `docs/` again.
