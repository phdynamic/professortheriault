// Downloads the works listed in docs/huma1301-media.md with status "planned" into huma1301/assets/images.
// Wikimedia sources use Special:FilePath with ?width= so files stay web-sized.
// Run only after the developer has approved the batch.
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const LOG = path.join(ROOT, "docs", "huma1301-media.md");
const OUT = path.join(ROOT, "huma1301", "assets", "images");
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const lines = fs.readFileSync(LOG, "utf8").replace(/\r\n/g, "\n").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const c = lines[i].split("|").map((s) => s.trim());
    if (c.length < 9 || c[7] !== "planned") continue;
    const url = c[3], file = c[5];
    const res = await fetch(url, { headers: { "User-Agent": "professortheriault-site/1.0 (educational; normand.theriault@gmail.com)" } });
    if (!res.ok) { console.warn(`FAILED ${res.status}: ${url}`); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(OUT, file), buf);
    c[6] = `${(buf.length / 1024).toFixed(0)} KB`;
    c[7] = "downloaded";
    lines[i] = c.slice(1, 8).join(" | ").replace(/^/, "| ").replace(/$/, " |");
    console.log(`ok ${file} (${c[6]})`);
  }
  fs.writeFileSync(LOG, lines.join("\n"));
})();
