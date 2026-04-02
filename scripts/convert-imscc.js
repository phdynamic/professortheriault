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

  console.log("[1/5] Extracting archive and copying assets...");
  const { tempDir, filenameMap } = extractAndCopyAssets(IMSCC_PATH, SITE_ROOT);

  try {
    console.log("\n[2/5] Parsing module structure...");
    const modules = await parseStructure(tempDir);

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

        const $ = cheerio.load(rawHtml);
        const bodyText = $("body").text().trim();
        if (bodyText.length < MIN_CONTENT_BYTES) {
          console.log(`  Skipping stub page: ${page.basename} (${bodyText.length} chars)`);
          continue;
        }

        // Pre-process: detect callout boxes BEFORE stripping styles
        preMarkCallouts($);

        const { bodyHtml } = cleanCanvasHtml($.html(), filenameMap);

        const transformed = transformComponents(bodyHtml);

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

    console.log("\n[4/5] Updating course.json...");
    updateCourseJson(modules, SITE_ROOT);

    const totalPages = modules.reduce((s, m) => s + m.outputPages.length, 0);
    console.log(`\n[5/5] Done! Converted ${totalPages} pages across ${modules.length} modules.`);
    console.log("\nNext steps:");
    console.log("  1. Run: npm run build");
    console.log("  2. Run: npm run dev");
    console.log("  3. Review each page in the browser");
  } finally {
    cleanupTemp(tempDir);
  }
}

function preMarkCallouts($) {
  $("div[style]").each(function () {
    const el = $(this);
    const style = el.attr("style") || "";

    let type = null;

    if (/border-left.*#1e3a5f/i.test(style) || /border-left.*#1a2332/i.test(style)) {
      type = "concept";
    } else if (/border-left.*#2d6a4f/i.test(style)) {
      type = "note";
    } else if (/border-left.*#c07a00/i.test(style) || /border-left.*#b45309/i.test(style)) {
      type = "connection";
    }

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
