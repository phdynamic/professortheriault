const fs = require("fs");
const path = require("path");

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

function writePage(pageInfo, bodyHtml, siteRoot) {
  const { moduleSlug, tag, title, basename, position, isOverview } = pageInfo;

  const replacement = REPLACEMENT_PAGES[basename];
  const actualSlug = replacement ? replacement.newSlug : basename;
  const actualTitle = replacement ? replacement.newTitle : title;
  const actualContent = replacement ? replacement.content : bodyHtml;

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

function updateCourseJson(modules, siteRoot) {
  const courseJsonPath = path.join(siteRoot, "phil1301", "_data", "course.json");
  const courseData = JSON.parse(fs.readFileSync(courseJsonPath, "utf-8"));

  for (const mod of modules) {
    const jsonMod = courseData.modules.find((m) => m.slug === mod.moduleSlug);
    if (!jsonMod) {
      console.warn(`Module ${mod.moduleSlug} not found in course.json`);
      continue;
    }

    jsonMod.pages = mod.outputPages.map((p) => ({
      slug: p.slug,
      title: p.title,
    }));
  }

  fs.writeFileSync(courseJsonPath, JSON.stringify(courseData, null, 2) + "\n", "utf-8");
  console.log("Updated course.json with real page data.");
}

module.exports = { writePage, updateCourseJson, REPLACEMENT_PAGES };
