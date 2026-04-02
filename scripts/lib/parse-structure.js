const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");

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

const SKIP_PAGES = [
  "canvas-app",
  "setting-your-notification-preferences",
  "support-services",
  "philosophy-library",
];

const SKIP_MODULES = [
  "HCC Library Resources",
  "Student Lounge - A Place to Ask Questions",
];

async function parseStructure(tempDir) {
  const parser = new xml2js.Parser({ explicitArray: false });

  const moduleMetaXml = fs.readFileSync(
    path.join(tempDir, "course_settings", "module_meta.xml"),
    "utf-8"
  );
  const moduleMeta = await parser.parseStringPromise(moduleMetaXml);

  const manifestXml = fs.readFileSync(
    path.join(tempDir, "imsmanifest.xml"),
    "utf-8"
  );
  const manifest = await parser.parseStringPromise(manifestXml);

  const idToFile = {};
  const resources = manifest.manifest.resources.resource;
  const resourceList = Array.isArray(resources) ? resources : [resources];
  for (const res of resourceList) {
    if (res.$ && res.$.identifier && res.$.type === "webcontent") {
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

      const wikiFile = idToFile[identifierref];
      if (!wikiFile) {
        console.warn(`No wiki file found for identifier ${identifierref} (${pageTitle})`);
        continue;
      }

      const basename = path.basename(wikiFile, ".html");

      if (SKIP_PAGES.includes(basename)) {
        console.log(`Skipping dropped page: ${basename}`);
        continue;
      }

      const isOverview = position === 1;

      pages.push({
        title: pageTitle,
        wikiFile: wikiFile,
        basename: basename,
        position: position,
        isOverview: isOverview,
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
