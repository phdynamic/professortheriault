# PHIL 1301 Content Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract and convert ~80 Canvas wiki content pages and assets from an .imscc export into styled Eleventy pages with tabbed panels, icon-based callouts, and proper navigation.

**Architecture:** A modular Node.js conversion script (`scripts/convert-imscc.js`) with helper modules in `scripts/lib/`. The script extracts assets, parses Canvas XML for structure, transforms HTML content (strips Canvas markup, converts accordions to tabs, converts callout boxes), generates Eleventy front matter, and writes `.njk` files into the correct unit directories. New CSS and JS for tabs/callouts/components are added to the existing stylesheet and script directory.

**Tech Stack:** Node.js, adm-zip, cheerio, xml2js, Eleventy (existing)

**Important:** Node.js is installed but not in the default bash PATH. All commands must use: `export PATH="$PATH:/c/Program Files/nodejs" &&`

---

## File Structure

| File | Responsibility |
|------|---------------|
| `scripts/convert-imscc.js` | Main orchestrator — runs the full pipeline |
| `scripts/lib/extract.js` | Extracts .imscc zip, copies and normalizes asset files |
| `scripts/lib/parse-structure.js` | Parses module_meta.xml + imsmanifest.xml → ordered page list |
| `scripts/lib/clean-html.js` | Strips Canvas markup, resolves asset paths |
| `scripts/lib/transform-components.js` | Converts accordions→tabs, callout boxes, argument blocks, etc. |
| `scripts/lib/write-pages.js` | Generates front matter, writes .njk files, updates course.json |
| `phil1301/js/tabs.js` | Tab panel interactivity (click, keyboard, ARIA) |
| `phil1301/css/styles.css` | Updated with tab, callout, argument, hero, video, download styles |
| `phil1301/_includes/layouts/base.njk` | Updated to load tabs.js |
| `phil1301/_data/course.json` | Updated with all real pages per module |

---

### Task 1: Install script dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install adm-zip, cheerio, and xml2js as dev dependencies**

```bash
export PATH="$PATH:/c/Program Files/nodejs" && cd "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website" && npm install --save-dev adm-zip cheerio xml2js
```

Expected: Three packages added to `devDependencies` in `package.json`.

- [ ] **Step 2: Verify installation**

```bash
export PATH="$PATH:/c/Program Files/nodejs" && cd "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website" && node -e "require('adm-zip'); require('cheerio'); require('xml2js'); console.log('OK')"
```

Expected: Prints "OK" with no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add adm-zip, cheerio, xml2js dev dependencies for conversion script"
```

---

### Task 2: Asset extraction module

**Files:**
- Create: `scripts/lib/extract.js`

- [ ] **Step 1: Create `scripts/lib/` directory and `extract.js`**

This module handles unzipping the .imscc and copying/normalizing asset files.

```js
const AdmZip = require("adm-zip");
const path = require("path");
const fs = require("fs");

/**
 * Normalize a filename: lowercase, spaces to hyphens, strip problematic chars.
 * Preserves file extension.
 */
function normalizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/-+/g, "-");
}

/**
 * Extract .imscc archive and copy assets to site directories.
 * Returns { tempDir, filenameMap } where filenameMap maps original paths to normalized names.
 */
function extractAndCopyAssets(imsccPath, siteRoot) {
  const zip = new AdmZip(imsccPath);
  const tempDir = path.join(siteRoot, "_temp_imscc");

  // Extract to temp directory
  console.log("Extracting .imscc archive...");
  zip.extractAllTo(tempDir, true);

  // Create asset directories
  const imagesDir = path.join(siteRoot, "phil1301", "assets", "images");
  const handoutsDir = path.join(siteRoot, "phil1301", "assets", "handouts");
  fs.mkdirSync(imagesDir, { recursive: true });
  fs.mkdirSync(handoutsDir, { recursive: true });

  const filenameMap = {}; // original path → normalized filename

  // Copy web_resources files
  const webResDir = path.join(tempDir, "web_resources");
  if (fs.existsSync(webResDir)) {
    copyAssetsRecursive(webResDir, imagesDir, handoutsDir, filenameMap, "");
  }

  console.log(`Copied ${Object.keys(filenameMap).length} asset files.`);
  return { tempDir, filenameMap };
}

/**
 * Recursively copy assets, routing by file extension.
 */
function copyAssetsRecursive(sourceDir, imagesDir, handoutsDir, filenameMap, relativePath) {
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      copyAssetsRecursive(sourcePath, imagesDir, handoutsDir, filenameMap, relPath);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    const normalized = normalizeFilename(entry.name);

    // Route PDFs to handouts, everything else to images
    const isPdf = ext === ".pdf";
    const targetDir = isPdf ? handoutsDir : imagesDir;

    // Skip non-media files (docx, pptx, zip)
    const skipExts = [".docx", ".pptx", ".zip", ".html"];
    if (skipExts.includes(ext)) continue;

    const targetPath = path.join(targetDir, normalized);

    // Handle duplicate filenames by appending a counter
    let finalPath = targetPath;
    let counter = 1;
    while (fs.existsSync(finalPath)) {
      const base = path.basename(normalized, ext);
      finalPath = path.join(targetDir, `${base}-${counter}${ext}`);
      counter++;
    }

    fs.copyFileSync(sourcePath, finalPath);
    const finalName = path.basename(finalPath);

    // Map original path (as it appears in $IMS-CC-FILEBASE$ references) to normalized name
    filenameMap[relPath] = finalName;
    // Also map URL-encoded version
    filenameMap[encodeURIComponent(entry.name).replace(/%20/g, "%20")] = finalName;
    // And the decoded version
    filenameMap[decodeURIComponent(relPath)] = finalName;
  }
}

/**
 * Clean up temp directory after processing.
 */
function cleanupTemp(tempDir) {
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log("Cleaned up temp directory.");
}

module.exports = { extractAndCopyAssets, cleanupTemp, normalizeFilename };
```

- [ ] **Step 2: Verify module loads**

```bash
export PATH="$PATH:/c/Program Files/nodejs" && cd "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website" && node -e "const e = require('./scripts/lib/extract'); console.log(typeof e.extractAndCopyAssets)"
```

Expected: Prints "function".

- [ ] **Step 3: Commit**

```bash
git add scripts/lib/extract.js
git commit -m "feat: add asset extraction module for imscc conversion"
```

---

### Task 3: Module structure parser

**Files:**
- Create: `scripts/lib/parse-structure.js`

- [ ] **Step 1: Create `parse-structure.js`**

This module parses Canvas XML files to build the ordered page structure.

```js
const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");

// Module slug mapping — Canvas module titles to directory names
const MODULE_SLUG_MAP = {
  "Start Here!": "start-here",
  "Unit 1: Socrates and Plato": "unit-1-socrates",
  "Unit 2: Rene Descartes": "unit-2-descartes",
  "Unit 3: David Hume": "unit-3-hume",
  "Unit 4: G. W. F. Hegel": "unit-4-hegel",
  "Unit 5: Karl Marx": "unit-5-marx",
  "Unit 6: Jean-Paul Sartre": "unit-6-sartre",
  "Final Exam": "final-exam",
};

// Eleventy tag mapping
const MODULE_TAG_MAP = {
  "start-here": "starthere",
  "unit-1-socrates": "unit1",
  "unit-2-descartes": "unit2",
  "unit-3-hume": "unit3",
  "unit-4-hegel": "unit4",
  "unit-5-marx": "unit5",
  "unit-6-sartre": "unit6",
  "final-exam": "finalexam",
};

// Pages to skip entirely
const SKIP_PAGES = [
  "canvas-app",
  "setting-your-notification-preferences",
  "support-services",
  "philosophy-library",
];

// Modules to skip entirely (no content pages)
const SKIP_MODULES = [
  "HCC Library Resources",
  "Student Lounge - A Place to Ask Questions",
];

/**
 * Parse module_meta.xml and imsmanifest.xml to build ordered page structure.
 * Returns array of { moduleSlug, moduleTitle, tag, pages: [{ title, wikiFile, position, isOverview }] }
 */
async function parseStructure(tempDir) {
  const parser = new xml2js.Parser({ explicitArray: false });

  // Parse module_meta.xml
  const moduleMetaXml = fs.readFileSync(
    path.join(tempDir, "course_settings", "module_meta.xml"),
    "utf-8"
  );
  const moduleMeta = await parser.parseStringPromise(moduleMetaXml);

  // Parse imsmanifest.xml to get identifier → wiki_content filename mapping
  const manifestXml = fs.readFileSync(
    path.join(tempDir, "imsmanifest.xml"),
    "utf-8"
  );
  const manifest = await parser.parseStringPromise(manifestXml);

  // Build identifier → wiki filename map from manifest resources
  const idToFile = {};
  const resources = manifest.manifest.resources.resource;
  const resourceList = Array.isArray(resources) ? resources : [resources];
  for (const res of resourceList) {
    if (res.$ && res.$.identifier && res.$.type === "webcontent") {
      // For wiki pages, the file child has the path
      if (res.file) {
        const files = Array.isArray(res.file) ? res.file : [res.file];
        for (const f of files) {
          const href = f.$ ? f.$.href : f;
          if (typeof href === "string" && href.startsWith("wiki_content/")) {
            idToFile[res.$.identifier] = href;
          }
        }
      }
    }
  }

  // Build module structure
  const modules = [];
  let rawModules = moduleMeta.modules.module;
  if (!Array.isArray(rawModules)) rawModules = [rawModules];

  for (const mod of rawModules) {
    const title = mod.title;
    if (SKIP_MODULES.includes(title)) continue;

    const slug = MODULE_SLUG_MAP[title];
    if (!slug) {
      console.warn(`Unknown module title: "${title}" — skipping`);
      continue;
    }

    const tag = MODULE_TAG_MAP[slug];
    const pages = [];
    let position = 1;

    if (!mod.items || !mod.items.item) continue;
    let items = mod.items.item;
    if (!Array.isArray(items)) items = [items];

    for (const item of items) {
      const contentType = item.content_type;
      if (contentType !== "WikiPage") continue;

      const pageTitle = item.title;
      const identifierref = item.identifierref;

      // Look up the wiki file via manifest
      const wikiFile = idToFile[identifierref];
      if (!wikiFile) {
        console.warn(`No wiki file found for identifier ${identifierref} (${pageTitle})`);
        continue;
      }

      // Derive page slug from wiki filename
      const basename = path.basename(wikiFile, ".html");

      // Check skip list
      if (SKIP_PAGES.includes(basename)) {
        console.log(`Skipping dropped page: ${basename}`);
        continue;
      }

      // Determine if this is the unit overview (first wiki page in module or title contains "Overview")
      const isOverview = position === 1 || pageTitle.toLowerCase().includes("overview");

      pages.push({
        title: pageTitle,
        wikiFile: wikiFile,
        basename: basename,
        position: position,
        isOverview: isOverview && position === 1,
      });

      position++;
    }

    if (pages.length > 0) {
      modules.push({
        moduleSlug: slug,
        moduleTitle: title,
        tag: tag,
        pages: pages,
      });
    }
  }

  console.log(`Parsed ${modules.length} modules with ${modules.reduce((s, m) => s + m.pages.length, 0)} total pages.`);
  return modules;
}

module.exports = { parseStructure, MODULE_SLUG_MAP, MODULE_TAG_MAP };
```

- [ ] **Step 2: Quick verification — parse the actual imscc**

```bash
export PATH="$PATH:/c/Program Files/nodejs" && cd "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website" && node -e "
const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');
const zip = new AdmZip('sand-box-number-1-phil-1301-export.imscc');
const tmp = path.join(__dirname, '_temp_test');
zip.extractAllTo(tmp, true);
const { parseStructure } = require('./scripts/lib/parse-structure');
parseStructure(tmp).then(m => { console.log(JSON.stringify(m.map(x=>({slug:x.moduleSlug,pages:x.pages.length})),null,2)); fs.rmSync(tmp, {recursive:true,force:true}); });
"
```

Expected: JSON output showing each module slug and its page count. Verify the counts look reasonable based on the module structure we extracted earlier.

- [ ] **Step 3: Commit**

```bash
git add scripts/lib/parse-structure.js
git commit -m "feat: add module structure parser for imscc conversion"
```

---

### Task 4: HTML cleanup module

**Files:**
- Create: `scripts/lib/clean-html.js`

- [ ] **Step 1: Create `clean-html.js`**

This module handles stripping Canvas-specific markup and resolving asset paths.

```js
const cheerio = require("cheerio");

/**
 * Clean Canvas HTML: strip metadata, inline styles, Canvas attributes, resolve paths.
 * Returns { $, bodyHtml } where $ is the cheerio instance and bodyHtml is the cleaned inner HTML.
 */
function cleanCanvasHtml(rawHtml, filenameMap) {
  const $ = cheerio.load(rawHtml);

  // Strip all inline style attributes
  $("[style]").removeAttr("style");

  // Remove Canvas-specific attributes
  $("[data-api-endpoint]").removeAttr("data-api-endpoint");
  $("[data-api-returntype]").removeAttr("data-api-returntype");

  // Remove Canvas-specific classes
  $(".instructure_file_link").removeClass("instructure_file_link");
  $(".instructure_scribd_file").removeClass("instructure_scribd_file");
  $(".inline_disabled").removeClass("inline_disabled");

  // Clean up empty class attributes left behind
  $("[class='']").removeAttr("class");

  // Resolve $IMS-CC-FILEBASE$ paths in img src
  $("img").each(function () {
    const src = $(this).attr("src");
    if (src && src.includes("$IMS-CC-FILEBASE$")) {
      const resolved = resolveAssetPath(src, filenameMap, "/phil1301/assets/images/");
      $(this).attr("src", resolved);
    }
  });

  // Resolve $IMS-CC-FILEBASE$ paths in a href
  $("a").each(function () {
    let href = $(this).attr("href");
    if (!href) return;

    // Strip Canvas query params
    href = href.replace(/\?canvas_=1&canvas_qs_wrap=1/g, "");
    href = href.replace(/\?canvas_download=1&canvas_qs_wrap=1/g, "");

    if (href.includes("$IMS-CC-FILEBASE$")) {
      const isPdf = href.toLowerCase().includes(".pdf");
      const baseDir = isPdf
        ? "/phil1301/assets/handouts/"
        : "/phil1301/assets/images/";
      href = resolveAssetPath(href, filenameMap, baseDir);
    }

    $(this).attr("href", href);
  });

  // Extract body content (skip head metadata)
  const bodyHtml = $("body").html() || $.html();

  return { $, bodyHtml: bodyHtml.trim() };
}

/**
 * Resolve a $IMS-CC-FILEBASE$ path to a local asset path using the filename map.
 */
function resolveAssetPath(originalPath, filenameMap, baseDir) {
  // Remove the $IMS-CC-FILEBASE$ prefix
  let cleaned = originalPath.replace(/\$IMS-CC-FILEBASE\$\/?/, "");

  // Remove query params
  cleaned = cleaned.split("?")[0];

  // Try to find in filename map
  const decoded = decodeURIComponent(cleaned);

  // Try various path formats
  const candidates = [
    cleaned,
    decoded,
    cleaned.replace(/^Uploaded%20Media\//, "Uploaded Media/"),
    decoded.replace(/^Uploaded Media\//, ""),
    cleaned.replace(/^Uploaded%20Media\//, ""),
    cleaned.replace(/^Handouts\//, ""),
    decoded.replace(/^Handouts\//, ""),
  ];

  for (const candidate of candidates) {
    if (filenameMap[candidate]) {
      return baseDir + filenameMap[candidate];
    }
  }

  // Fallback: normalize the filename directly
  const filename = decoded.split("/").pop();
  const normalized = filename
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/-+/g, "-");

  console.warn(`Asset path not found in map: "${decoded}" — using normalized: "${normalized}"`);
  return baseDir + normalized;
}

module.exports = { cleanCanvasHtml, resolveAssetPath };
```

- [ ] **Step 2: Commit**

```bash
git add scripts/lib/clean-html.js
git commit -m "feat: add HTML cleanup module for Canvas markup stripping"
```

---

### Task 5: Component transform module

**Files:**
- Create: `scripts/lib/transform-components.js`

- [ ] **Step 1: Create `transform-components.js`**

This module handles converting accordions to tabs, callout boxes, and other content components.

```js
const cheerio = require("cheerio");

/**
 * Apply all content transforms to cleaned HTML.
 * Takes a cheerio body HTML string, returns transformed HTML string.
 */
function transformComponents(bodyHtml) {
  const $ = cheerio.load(bodyHtml, { decodeEntities: false });

  transformAccordionsToTabs($);
  transformCalloutBoxes($);
  transformArgumentBlocks($);
  transformHeroImage($);
  transformVideoEmbeds($);
  transformPdfLinks($);

  return $("body").html() || $.html();
}

/**
 * Convert <details>/<summary> groups into tabbed panels.
 */
function transformAccordionsToTabs($) {
  const detailsElements = $("details");
  if (detailsElements.length === 0) return;

  // Group consecutive details elements
  const groups = [];
  let currentGroup = [];
  let lastElement = null;

  detailsElements.each(function () {
    const el = $(this);
    // Check if this details follows the previous one (siblings with no significant content between)
    if (lastElement && areSiblings($, lastElement, el)) {
      currentGroup.push(el);
    } else {
      if (currentGroup.length > 0) groups.push([...currentGroup]);
      currentGroup = [el];
    }
    lastElement = el;
  });
  if (currentGroup.length > 0) groups.push(currentGroup);

  // Convert each group to tabs
  let tabGroupId = 0;
  for (const group of groups) {
    const prefix = `tabs-${tabGroupId}`;
    let tabsHtml = `<div class="tabs">`;
    tabsHtml += `<div class="tabs__bar" role="tablist">`;

    // Build tab buttons
    group.forEach((el, i) => {
      const summary = el.find("summary").first().text().trim();
      const isActive = i === 0;
      tabsHtml += `<button class="tabs__tab${isActive ? " tabs__tab--active" : ""}" role="tab" aria-selected="${isActive}" aria-controls="${prefix}-panel-${i}" id="${prefix}-tab-${i}">${summary}</button>`;
    });
    tabsHtml += `</div>`;

    // Build tab panels
    group.forEach((el, i) => {
      const isActive = i === 0;
      // Get inner content (everything except the summary)
      const clone = el.clone();
      clone.find("summary").remove();
      const content = clone.html().trim();

      tabsHtml += `<div class="tabs__panel${isActive ? " tabs__panel--active" : ""}" role="tabpanel" id="${prefix}-panel-${i}" aria-labelledby="${prefix}-tab-${i}"${!isActive ? " hidden" : ""}>${content}</div>`;
    });

    tabsHtml += `</div>`;

    // Replace the group in the DOM
    group[0].before(tabsHtml);
    group.forEach((el) => el.remove());

    tabGroupId++;
  }
}

/**
 * Check if two elements are adjacent siblings (possibly with only whitespace/subheaders between).
 */
function areSiblings($, el1, el2) {
  let next = el1.next();
  let attempts = 0;
  while (next.length && attempts < 5) {
    if (next[0] === el2[0]) return true;
    // Skip whitespace text nodes and subheader divs
    const tagName = next.prop("tagName");
    if (tagName && tagName.toLowerCase() === "details") return false;
    next = next.next();
    attempts++;
  }
  return false;
}

/**
 * Convert colored callout divs to icon-based callout components.
 * Detects by examining the original inline styles (which are in the raw HTML before cleaning).
 * Since styles are already stripped, we detect by structure: divs with specific border/background patterns.
 */
function transformCalloutBoxes($) {
  // Since inline styles are stripped before this runs, we need a different detection strategy.
  // Look for divs that contain a nested structure typical of callout boxes:
  // a div > div > p pattern with no other significant structure, and
  // that are not inside tabs/details/other components.
  // Alternative: detect callouts BEFORE stripping styles in the pipeline.
  // For now, detect by looking for div > div patterns that match callout structure.

  // Actually, the better approach: in the pipeline, we should detect callouts BEFORE stripping
  // inline styles. We'll handle this by accepting pre-processed markers.
  // See the main orchestrator for how this integrates.

  // This function handles divs that have been pre-marked with data-callout-type attribute
  // by the pre-processing step in the main orchestrator.
  $("[data-callout-type]").each(function () {
    const el = $(this);
    const type = el.attr("data-callout-type");
    el.removeAttr("data-callout-type");

    const icons = {
      concept: "&#128161;",
      note: "&#8505;&#65039;",
      connection: "&#10145;&#65039;",
    };

    const icon = icons[type] || icons.note;
    const innerHtml = el.html();

    el.replaceWith(
      `<div class="callout callout--${type}"><span class="callout__icon" aria-hidden="true">${icon}</span><div class="callout__content">${innerHtml}</div></div>`
    );
  });
}

/**
 * Detect and mark argument reconstruction blocks (P1/P2/C format).
 */
function transformArgumentBlocks($) {
  // Look for divs whose text content matches premise/conclusion patterns
  $("div").each(function () {
    const el = $(this);
    const text = el.text().trim();
    // Match patterns like "P1." or "P1:" or "C." or "C:" at start of lines
    if (/^P1[.:]/m.test(text) && /^C[.:]/m.test(text)) {
      el.addClass("argument-block");
    }
  });
}

/**
 * Mark first image as hero image.
 */
function transformHeroImage($) {
  const firstImg = $("img").first();
  if (firstImg.length) {
    firstImg.addClass("page-hero-image");
  }
}

/**
 * Wrap YouTube iframes in responsive container.
 */
function transformVideoEmbeds($) {
  $("iframe").each(function () {
    const el = $(this);
    const src = el.attr("src") || "";
    if (src.includes("youtube") || src.includes("youtu.be")) {
      const outerHtml = $.html(el);
      el.replaceWith(`<div class="video-embed">${outerHtml}</div>`);
    }
  });
}

/**
 * Add download-link class to PDF links.
 */
function transformPdfLinks($) {
  $("a").each(function () {
    const el = $(this);
    const href = el.attr("href") || "";
    if (href.toLowerCase().endsWith(".pdf")) {
      el.addClass("download-link");
    }
  });
}

module.exports = { transformComponents, transformCalloutBoxes };
```

- [ ] **Step 2: Commit**

```bash
git add scripts/lib/transform-components.js
git commit -m "feat: add component transform module (tabs, callouts, arguments, hero, video, PDF)"
```

---

### Task 6: Page writer module

**Files:**
- Create: `scripts/lib/write-pages.js`

- [ ] **Step 1: Create `write-pages.js`**

This module generates front matter, writes .njk files, and updates course.json.

```js
const fs = require("fs");
const path = require("path");

// Start Here replacement pages
const REPLACEMENT_PAGES = {
  "technical-setup": {
    newSlug: "how-to-use-this-site",
    newTitle: "How to Use This Site",
    content:
      '<!-- NEEDS REWRITE -->\n<p>This page will explain how to navigate and use this course website.</p>\n<p><em>Content coming soon.</em></p>',
  },
  "course-scavenger-hunt-assignment": {
    newSlug: "website-orientation",
    newTitle: "Website Orientation Activity",
    content:
      '<!-- NEEDS REWRITE -->\n<p>This orientation activity will help you get familiar with the course website.</p>\n<p><em>Content coming soon.</em></p>',
  },
};

/**
 * Write a single page as a .njk file with Eleventy front matter.
 */
function writePage(pageInfo, bodyHtml, siteRoot) {
  const { moduleSlug, tag, title, basename, position, isOverview } = pageInfo;

  // Check for replacement pages
  const replacement = REPLACEMENT_PAGES[basename];
  const actualSlug = replacement ? replacement.newSlug : basename;
  const actualTitle = replacement ? replacement.newTitle : title;
  const actualContent = replacement ? replacement.content : bodyHtml;

  // Determine output path
  const moduleDir = path.join(siteRoot, "phil1301", moduleSlug);
  fs.mkdirSync(moduleDir, { recursive: true });

  let outputPath;
  let layout;
  if (isOverview) {
    outputPath = path.join(moduleDir, "index.njk");
    layout = "layouts/unit.njk";
  } else {
    outputPath = path.join(moduleDir, `${actualSlug}.njk`);
    layout = "layouts/page.njk";
  }

  // Generate front matter
  let frontMatter = "---\n";
  frontMatter += `layout: ${layout}\n`;
  frontMatter += `title: "${actualTitle.replace(/"/g, '\\"')}"\n`;
  frontMatter += `module: "${moduleSlug}"\n`;
  if (!isOverview) {
    frontMatter += `breadcrumbTitle: "${actualTitle.replace(/"/g, '\\"')}"\n`;
  }
  frontMatter += `position: ${position}\n`;
  frontMatter += `tags: ${tag}\n`;
  frontMatter += "---\n\n";

  const fullContent = frontMatter + actualContent + "\n";
  fs.writeFileSync(outputPath, fullContent, "utf-8");

  console.log(`  Wrote: ${path.relative(siteRoot, outputPath)}`);

  return {
    slug: isOverview ? "index" : actualSlug,
    title: actualTitle,
  };
}

/**
 * Update course.json with all discovered pages.
 */
function updateCourseJson(modules, siteRoot) {
  const courseJsonPath = path.join(siteRoot, "phil1301", "_data", "course.json");
  const courseData = JSON.parse(fs.readFileSync(courseJsonPath, "utf-8"));

  for (const mod of modules) {
    // Find the matching module in course.json
    const jsonMod = courseData.modules.find((m) => m.slug === mod.moduleSlug);
    if (!jsonMod) {
      console.warn(`Module ${mod.moduleSlug} not found in course.json`);
      continue;
    }

    // Replace pages with the real discovered pages
    jsonMod.pages = mod.outputPages.map((p) => ({
      slug: p.slug,
      title: p.title,
    }));
  }

  fs.writeFileSync(courseJsonPath, JSON.stringify(courseData, null, 2) + "\n", "utf-8");
  console.log("Updated course.json with real page data.");
}

module.exports = { writePage, updateCourseJson, REPLACEMENT_PAGES };
```

- [ ] **Step 2: Commit**

```bash
git add scripts/lib/write-pages.js
git commit -m "feat: add page writer module with front matter generation and course.json updater"
```

---

### Task 7: Main orchestrator script

**Files:**
- Create: `scripts/convert-imscc.js`

- [ ] **Step 1: Create `scripts/convert-imscc.js`**

This is the main entry point that ties all modules together.

```js
#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const cheerio = require("cheerio");
const { extractAndCopyAssets, cleanupTemp } = require("./lib/extract");
const { parseStructure } = require("./lib/parse-structure");
const { cleanCanvasHtml } = require("./lib/clean-html");
const { transformComponents } = require("./lib/transform-components");
const { writePage, updateCourseJson } = require("./lib/write-pages");

const SITE_ROOT = path.resolve(__dirname, "..");
const IMSCC_PATH = path.join(SITE_ROOT, "sand-box-number-1-phil-1301-export.imscc");
const MIN_CONTENT_BYTES = 500;

async function main() {
  console.log("=== IMSCC to Eleventy Converter ===\n");

  // Step 1: Extract archive and copy assets
  console.log("[1/5] Extracting archive and copying assets...");
  const { tempDir, filenameMap } = extractAndCopyAssets(IMSCC_PATH, SITE_ROOT);

  try {
    // Step 2: Parse module structure
    console.log("\n[2/5] Parsing module structure...");
    const modules = await parseStructure(tempDir);

    // Step 3: Process each page
    console.log("\n[3/5] Converting wiki pages...");
    for (const mod of modules) {
      console.log(`\n  Module: ${mod.moduleTitle}`);
      mod.outputPages = [];

      for (const page of mod.pages) {
        const wikiPath = path.join(tempDir, page.wikiFile);
        if (!fs.existsSync(wikiPath)) {
          console.warn(`  Wiki file not found: ${page.wikiFile}`);
          continue;
        }

        const rawHtml = fs.readFileSync(wikiPath, "utf-8");

        // Check minimum content size
        const $ = cheerio.load(rawHtml);
        const bodyText = $("body").text().trim();
        if (bodyText.length < MIN_CONTENT_BYTES) {
          console.log(`  Skipping stub page: ${page.basename} (${bodyText.length} chars)`);
          continue;
        }

        // Pre-process: detect callout boxes BEFORE stripping styles
        preMarkCallouts($);

        // Clean Canvas HTML (strips styles, resolves paths)
        const { bodyHtml } = cleanCanvasHtml($.html(), filenameMap);

        // Transform components (tabs, callouts, hero, video, PDF)
        const transformed = transformComponents(bodyHtml);

        // Write the page
        const outputInfo = writePage(
          {
            moduleSlug: mod.moduleSlug,
            tag: mod.tag,
            title: page.title,
            basename: page.basename,
            position: page.position,
            isOverview: page.isOverview,
          },
          transformed,
          SITE_ROOT
        );

        mod.outputPages.push(outputInfo);
      }
    }

    // Step 4: Update course.json
    console.log("\n[4/5] Updating course.json...");
    updateCourseJson(modules, SITE_ROOT);

    // Step 5: Summary
    const totalPages = modules.reduce((s, m) => s + m.outputPages.length, 0);
    console.log(`\n[5/5] Done! Converted ${totalPages} pages across ${modules.length} modules.`);
    console.log("\nNext steps:");
    console.log("  1. Run: npm run build");
    console.log("  2. Run: npm run dev");
    console.log("  3. Review each page in the browser");
  } finally {
    // Always clean up
    cleanupTemp(tempDir);
  }
}

/**
 * Pre-mark callout boxes by detecting colored border/background styles
 * BEFORE styles are stripped. Adds data-callout-type attribute.
 */
function preMarkCallouts($) {
  $("div[style]").each(function () {
    const el = $(this);
    const style = el.attr("style") || "";

    let type = null;

    // Detect by border-left color
    if (/border-left.*#1e3a5f/i.test(style) || /border-left.*#1a2332/i.test(style)) {
      type = "concept";
    } else if (/border-left.*#2d6a4f/i.test(style)) {
      type = "note";
    } else if (/border-left.*#c07a00/i.test(style) || /border-left.*#b45309/i.test(style)) {
      type = "connection";
    }

    // Also detect by background-color
    if (!type) {
      if (/background.*#f0f4f8/i.test(style) && /border.*#1e3a5f/i.test(style)) {
        type = "concept";
      } else if (/background.*#fffbeb/i.test(style) || /background.*#fef3c7/i.test(style)) {
        type = "connection";
      } else if (/background.*#ecfdf5/i.test(style) || /background.*#d1fae5/i.test(style)) {
        type = "note";
      }
    }

    if (type) {
      el.attr("data-callout-type", type);
    }
  });
}

main().catch((err) => {
  console.error("Conversion failed:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Add a convenience script to package.json**

In `package.json`, add to the `"scripts"` section:

```json
"convert": "node scripts/convert-imscc.js"
```

- [ ] **Step 3: Commit**

```bash
git add scripts/convert-imscc.js package.json
git commit -m "feat: add main imscc conversion orchestrator script"
```

---

### Task 8: Tab styles and JavaScript

**Files:**
- Create: `phil1301/js/tabs.js`
- Modify: `phil1301/css/styles.css`
- Modify: `phil1301/_includes/layouts/base.njk`

- [ ] **Step 1: Create `phil1301/js/tabs.js`**

```js
(function () {
  document.querySelectorAll(".tabs").forEach(function (tabContainer) {
    var tabs = tabContainer.querySelectorAll(".tabs__tab");
    var panels = tabContainer.querySelectorAll(".tabs__panel");

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        // Deactivate all
        tabs.forEach(function (t) {
          t.classList.remove("tabs__tab--active");
          t.setAttribute("aria-selected", "false");
        });
        panels.forEach(function (p) {
          p.classList.remove("tabs__panel--active");
          p.setAttribute("hidden", "");
        });

        // Activate clicked
        tab.classList.add("tabs__tab--active");
        tab.setAttribute("aria-selected", "true");
        var panelId = tab.getAttribute("aria-controls");
        var panel = document.getElementById(panelId);
        if (panel) {
          panel.classList.add("tabs__panel--active");
          panel.removeAttribute("hidden");
        }
      });

      // Keyboard navigation
      tab.addEventListener("keydown", function (e) {
        var index = Array.from(tabs).indexOf(tab);
        var newIndex = -1;

        if (e.key === "ArrowRight") {
          newIndex = (index + 1) % tabs.length;
        } else if (e.key === "ArrowLeft") {
          newIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === "Home") {
          newIndex = 0;
        } else if (e.key === "End") {
          newIndex = tabs.length - 1;
        }

        if (newIndex >= 0) {
          e.preventDefault();
          tabs[newIndex].focus();
          tabs[newIndex].click();
        }
      });
    });
  });
})();
```

- [ ] **Step 2: Add tab, callout, and component CSS to `styles.css`**

Append the following to the end of `phil1301/css/styles.css` (before the responsive media queries section — insert before `/* === Responsive === */`):

```css
/* === Tabs === */
.tabs {
  margin: 1.5rem 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.tabs__bar {
  display: flex;
  background-color: #f0f4f8;
  border-bottom: 2px solid #e0e0e0;
  overflow-x: auto;
}

.tabs__tab {
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  white-space: nowrap;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
  margin-bottom: -2px;
}

.tabs__tab:hover {
  color: #0ea5e9;
  background-color: #e2e8f0;
}

.tabs__tab--active {
  color: #1a2332;
  font-weight: 700;
  border-bottom-color: #0ea5e9;
  background-color: #fff;
}

.tabs__panel {
  padding: 1.5rem;
  min-height: 100px;
}

.tabs__panel[hidden] {
  display: none;
}

/* === Callout Boxes === */
.callout {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  margin: 1rem 0;
  border-left: 4px solid #e0e0e0;
  border-radius: 0 8px 8px 0;
  background-color: #f5f7fa;
}

.callout__icon {
  font-size: 1.3rem;
  flex-shrink: 0;
  line-height: 1.6;
}

.callout__content {
  flex: 1;
}

.callout__content p:last-child {
  margin-bottom: 0;
}

.callout--concept {
  border-left-color: #0ea5e9;
  background-color: #f0f9ff;
}

.callout--note {
  border-left-color: #2d6a4f;
  background-color: #ecfdf5;
}

.callout--connection {
  border-left-color: #d97706;
  background-color: #fffbeb;
}

/* === Argument Blocks === */
.argument-block {
  background-color: #f8f9fa;
  border-left: 4px solid #6b7280;
  padding: 1rem 1.5rem;
  margin: 1rem 0;
  border-radius: 0 8px 8px 0;
  font-family: 'Georgia', serif;
  line-height: 1.8;
}

/* === Hero Image === */
.page-hero-image {
  width: 100%;
  max-height: 350px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

/* === Video Embeds === */
.video-embed {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
  margin: 1.5rem 0;
  border-radius: 8px;
}

.video-embed iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

/* === Download Links === */
.download-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  color: #1a2332;
  font-weight: 500;
  text-decoration: none;
  transition: border-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
  margin: 0.5rem 0;
}

.download-link::before {
  content: "\1F4C4";
}

.download-link:hover {
  border-color: #0ea5e9;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  text-decoration: none;
}
```

- [ ] **Step 3: Update `base.njk` to load `tabs.js`**

In `phil1301/_includes/layouts/base.njk`, find the line:

```html
  <script src="/phil1301/js/nav.js"></script>
```

Add after it:

```html
  <script src="/phil1301/js/tabs.js"></script>
```

- [ ] **Step 4: Commit**

```bash
git add phil1301/js/tabs.js phil1301/css/styles.css phil1301/_includes/layouts/base.njk
git commit -m "feat: add tab JS, callout/component CSS, and load tabs.js in base layout"
```

---

### Task 9: Run the conversion script

**Files:**
- Many generated files in `phil1301/` directories
- Modified: `phil1301/_data/course.json`

- [ ] **Step 1: Remove the existing placeholder pages (they'll be replaced by real content)**

```bash
cd "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website" && rm -f phil1301/start-here/index.njk phil1301/unit-1-socrates/index.njk phil1301/unit-1-socrates/socrates-life.njk phil1301/unit-2-descartes/index.njk phil1301/unit-3-hume/index.njk phil1301/unit-4-hegel/index.njk phil1301/unit-5-marx/index.njk phil1301/unit-6-sartre/index.njk phil1301/final-exam/index.njk
```

- [ ] **Step 2: Run the conversion script**

```bash
export PATH="$PATH:/c/Program Files/nodejs" && cd "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website" && node scripts/convert-imscc.js
```

Expected output: Progress messages for each step, ending with a count of converted pages and modules. No fatal errors. Warnings about unresolved asset paths are OK (we'll check those in the review).

- [ ] **Step 3: Verify the build works**

```bash
export PATH="$PATH:/c/Program Files/nodejs" && cd "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website" && npx @11ty/eleventy
```

Expected: Build succeeds. Significantly more files written than before (should be 40+ HTML files). No template errors.

- [ ] **Step 4: Verify key output files exist**

```bash
ls "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website/phil1301/unit-1-socrates/"
```

Expected: `index.njk` plus several content page `.njk` files (socrates-life-and-context, the-euthyphro, the-apology, the-crito, etc.).

```bash
ls "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website/phil1301/assets/images/" | head -20
```

Expected: Normalized image filenames (lowercase, hyphens).

- [ ] **Step 5: Commit all generated content**

```bash
cd "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website" && git add phil1301/ && git add -u && git commit -m "feat: convert all Canvas wiki content to Eleventy pages via imscc script"
```

---

### Task 10: Visual review and fixes

**Files:**
- Possibly modify: various `.njk` files, `styles.css`, script modules

- [ ] **Step 1: Start dev server**

```bash
export PATH="$PATH:/c/Program Files/nodejs" && cd "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website" && npx @11ty/eleventy --serve
```

- [ ] **Step 2: Review the course landing page**

Open `http://localhost:8080/phil1301/`. Verify all module cards are present and link to their unit overviews.

- [ ] **Step 3: Review Unit 1 (Socrates) end-to-end**

Walk through every page in Unit 1:
- Unit overview: table of contents shows all pages, "Begin Unit" works
- Each content page: tabs render, callout boxes have icons, hero image displays, prev/next navigation works
- Sidebar shows all Unit 1 pages, highlights current page

- [ ] **Step 4: Spot-check one page from each remaining unit**

For Units 2-6, open one content page and verify: tabs work, images load, callouts render, navigation works.

- [ ] **Step 5: Check Start Here module**

Verify: Meet Your Instructor, Getting Started, Assessments migrate cleanly. "How to Use This Site" and "Website Orientation Activity" show the NEEDS REWRITE placeholder text.

- [ ] **Step 6: Fix any issues found**

Apply fixes to the conversion script modules, CSS, or individual pages as needed. Re-run the script if systematic issues are found, or edit individual pages for one-off problems.

- [ ] **Step 7: Commit fixes**

```bash
git add -A && git commit -m "fix: visual review corrections for converted content"
```

Only create this commit if changes were needed.

---

### Task 11: Start Here module rewrites (collaborative)

**Files:**
- Modify: `phil1301/start-here/how-to-use-this-site.njk`
- Modify: `phil1301/start-here/website-orientation.njk`

This task requires collaboration with the user. The implementer should:

- [ ] **Step 1: Read the current placeholder content for both pages**

Read `phil1301/start-here/how-to-use-this-site.njk` and `phil1301/start-here/website-orientation.njk`.

- [ ] **Step 2: Draft "How to Use This Site" content**

Write content covering:
- How to navigate the site (sidebar, tabs, prev/next)
- Browser recommendations
- How to access readings, handouts, and other resources
- Keep the tone consistent with the rest of the course (professional, welcoming)

Present the draft to the user for review before writing.

- [ ] **Step 3: Draft "Website Orientation Activity" content**

Write an orientation activity that:
- Guides students through the website
- Has them explore each section
- Replaces the Canvas Scavenger Hunt concept for a website context

Present the draft to the user for review before writing.

- [ ] **Step 4: Write final content after user approval**

Replace the placeholder content with the approved versions.

- [ ] **Step 5: Commit**

```bash
git add phil1301/start-here/
git commit -m "feat: write Start Here module content for website orientation"
```
