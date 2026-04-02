const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const SITE_ROOT = path.resolve(__dirname, "..");
const DIRS = [
  "phil1301/start-here",
  "phil1301/unit-1-socrates",
  "phil1301/unit-2-descartes",
  "phil1301/unit-3-hume",
  "phil1301/unit-4-hegel",
  "phil1301/unit-5-marx",
  "phil1301/unit-6-sartre",
  "phil1301/final-exam",
];

let totalConverted = 0;

for (const dir of DIRS) {
  const fullDir = path.join(SITE_ROOT, dir);
  if (!fs.existsSync(fullDir)) continue;

  const files = fs.readdirSync(fullDir).filter((f) => f.endsWith(".njk"));

  for (const file of files) {
    const filePath = path.join(fullDir, file);
    let content = fs.readFileSync(filePath, "utf-8");

    if (!content.includes('class="tabs"') && !content.includes("class=\"tabs\"")) continue;

    // Split front matter
    const parts = content.split("---");
    if (parts.length < 3) continue;
    const frontMatter = "---" + parts[1] + "---";
    const body = parts.slice(2).join("---");

    const $ = cheerio.load(body, { decodeEntities: false });

    $(".tabs").each(function () {
      const tabsEl = $(this);
      const tabs = tabsEl.find(".tabs__tab");
      const panels = tabsEl.find(".tabs__panel");

      let accordionHtml = '<div class="accordion">';

      tabs.each(function (i) {
        const tabText = $(this).text().trim();
        // Remove the "▸ " prefix and number prefix if present
        const cleanText = tabText.replace(/^[▸►▹]\s*/, "").replace(/^\d+\s*[—–-]\s*/, "").trim();
        const panelContent = panels.eq(i).html() || "";
        // Remove inner wrapper div if present
        const $panel = cheerio.load(panelContent, { decodeEntities: false });
        let innerContent = panelContent;
        // Check if panel content is wrapped in a single div
        const bodyChildren = $panel("body").children();
        if (bodyChildren.length === 1 && bodyChildren.first().is("div") && !bodyChildren.first().attr("class")) {
          innerContent = bodyChildren.first().html();
        }

        const num = i + 1;
        accordionHtml += `
<div class="accordion__item">
  <button class="accordion__header" aria-expanded="false" type="button">
    <span class="accordion__number">${num}</span>
    ${cleanText}
    <span class="accordion__chevron" aria-hidden="true">&#9660;</span>
  </button>
  <div class="accordion__content">
    <div class="accordion__body">
      ${innerContent.trim()}
    </div>
  </div>
</div>`;
      });

      accordionHtml += "\n</div>";
      tabsEl.replaceWith(accordionHtml);
    });

    const newBody = $("body").html() || $.html();
    const newContent = frontMatter + "\n\n" + newBody.trim() + "\n";
    fs.writeFileSync(filePath, newContent, "utf-8");
    totalConverted++;
    console.log(`Converted: ${dir}/${file}`);
  }
}

console.log(`\nDone. Converted ${totalConverted} files.`);
