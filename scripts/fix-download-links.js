const fs = require("fs");
const path = require("path");

const SITE_ROOT = path.resolve(__dirname, "..");
const DIRS = [
  "phil1301/unit-1-socrates",
  "phil1301/unit-2-descartes",
  "phil1301/unit-3-hume",
  "phil1301/unit-4-hegel",
  "phil1301/unit-5-marx",
  "phil1301/unit-6-sartre",
];

let totalFixed = 0;

for (const dir of DIRS) {
  const fullDir = path.join(SITE_ROOT, dir);
  if (!fs.existsSync(fullDir)) continue;

  const files = fs.readdirSync(fullDir).filter((f) => f.endsWith(".njk"));

  for (const file of files) {
    const filePath = path.join(fullDir, file);
    let content = fs.readFileSync(filePath, "utf-8");
    const original = content;

    // Pattern 1 (most units):
    // <div>📄 &nbsp; <a ...class="download-link"...>text</a> <span>PDF</span></div>
    // (with or without a space before <span>)
    content = content.replace(
      /<div>📄 &nbsp; (<a [^>]*class="download-link"[^>]*>)(.*?)<\/a>\s*<span>PDF<\/span><\/div>/gs,
      '<div class="download-row">$1$2<span class="download-link__badge">PDF</span></a></div>'
    );

    // Pattern 2 (Hume unit):
    // <a ...class="download-link"...> 📄 &nbsp; text <span>PDF</span> </a>
    // (emoji and span both inside the <a>, not wrapped in a <div>)
    content = content.replace(
      /(<a [^>]*class="download-link"[^>]*>) 📄 &nbsp; (.*?)\s*<span>PDF<\/span>\s*<\/a>/gs,
      '<div class="download-row">$1$2<span class="download-link__badge">PDF</span></a></div>'
    );

    if (content !== original) {
      fs.writeFileSync(filePath, content, "utf-8");
      const count = (original.match(/📄/g) || []).length;
      totalFixed += count;
      console.log(`Fixed ${count} link(s) in ${dir}/${file}`);
    }
  }
}

console.log(`\nDone. Fixed ${totalFixed} download link(s) total.`);
