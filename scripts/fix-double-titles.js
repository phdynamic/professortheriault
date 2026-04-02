const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const SITE_ROOT = path.resolve(__dirname, "..");
const UNIT_DIRS = [
  "phil1301/unit-1-socrates",
  "phil1301/unit-2-descartes",
  "phil1301/unit-3-hume",
  "phil1301/unit-4-hegel",
  "phil1301/unit-5-marx",
  "phil1301/unit-6-sartre",
  "phil1301/final-exam",
];

let fixedCount = 0;

for (const dir of UNIT_DIRS) {
  const fullDir = path.join(SITE_ROOT, dir);
  if (!fs.existsSync(fullDir)) continue;

  const files = fs.readdirSync(fullDir).filter(f => f.endsWith(".njk"));

  for (const file of files) {
    const filePath = path.join(fullDir, file);
    const content = fs.readFileSync(filePath, "utf-8");

    // Split front matter from body
    const parts = content.split("---");
    if (parts.length < 3) continue;

    const frontMatter = "---" + parts[1] + "---";
    const body = parts.slice(2).join("---");

    const $ = cheerio.load(body, { decodeEntities: false });

    // Find the header pattern: a div containing a <p> with "Unit X" or "PHIL 1301" and an <h2>
    // The pattern is typically the first or second div on the page
    let found = false;

    $("div").each(function() {
      if (found) return;
      const el = $(this);
      const h2 = el.find("> h2").first();
      const unitP = el.find("> p").first();

      if (h2.length === 0) return;

      const pText = unitP.length ? unitP.text().trim() : "";
      // Check if this looks like a header block (contains "Unit" or "PHIL" or "Start Here" or "Reference")
      if (pText.match(/^(Unit \d|PHIL 1301|Start Here|Reference)/i) ||
          (h2.length && unitP.length && el.children().length <= 4)) {

        // Check if there's a subtitle <p> after the <h2> (not a callout, not a long paragraph)
        const children = el.children().toArray();
        let subtitle = null;

        for (let i = 0; i < children.length; i++) {
          const child = $(children[i]);
          const tag = children[i].tagName;
          if (tag === "h2") {
            // Next sibling might be subtitle
            if (i + 1 < children.length) {
              const next = $(children[i + 1]);
              const nextTag = children[i + 1].tagName;
              if (nextTag === "p" && next.text().trim().length < 200 && !next.hasClass("callout")) {
                subtitle = next.clone();
              }
            }
            break;
          }
        }

        // Check if this div is the ONLY child of a parent div (nested wrapper pattern)
        const parent = el.parent();
        if (parent.is("div") && parent.children().length === 1) {
          // Remove the parent wrapper too
          if (subtitle) {
            parent.before(subtitle);
          }
          parent.remove();
        } else if (parent.is("div")) {
          // Just remove this inner header div
          if (subtitle) {
            el.before(subtitle);
          }
          el.remove();
        } else {
          // It's at the top level
          if (subtitle) {
            el.before(subtitle);
          }
          el.remove();
        }

        found = true;
      }
    });

    if (found) {
      const newBody = $("body").html() || $.html();
      const newContent = frontMatter + "\n\n" + newBody.trim() + "\n";
      fs.writeFileSync(filePath, newContent, "utf-8");
      fixedCount++;
      console.log(`Fixed: ${dir}/${file}`);
    }
  }
}

console.log(`\nDone. Fixed ${fixedCount} files.`);
