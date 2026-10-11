// Checks artrandomizer/works.json against the spec.
// Usage: node scripts/check-randomizer.js [--allow-short]   (--allow-short skips the 15-per-form minimum)
const fs = require("fs");
const path = require("path");
const { FORMS } = require("../artrandomizer/logic.js");

const ROOT = path.resolve(__dirname, "..");
const FILE = path.join(ROOT, "artrandomizer", "works.json");
const allowShort = process.argv.includes("--allow-short");
const fails = [];
const fail = (m) => fails.push(m);

const works = JSON.parse(fs.readFileSync(FILE, "utf8"));
const units = fs.readdirSync(path.join(ROOT, "huma1301")).filter((d) => d.startsWith("unit-") && fs.statSync(path.join(ROOT, "huma1301", d)).isDirectory());
const ids = new Set();
const FIELDS = ["id", "title", "creator", "year", "yearLabel", "region", "form", "unit", "media", "credit", "notice", "prompts"];
const BANNED = /textbook|\bin Connect\b|McGraw|\bChapter \d/i;

for (const w of works) {
  const where = `work "${w.id || w.title || "?"}"`;
  for (const f of FIELDS) if (w[f] === undefined || w[f] === null || w[f] === "") fail(`${where}: missing ${f}`);
  if (ids.has(w.id)) fail(`${where}: duplicate id`);
  ids.add(w.id);
  if (!/^[a-z0-9-]+$/.test(w.id || "")) fail(`${where}: id must be lowercase letters, digits, hyphens`);
  if (!FORMS.includes(w.form)) fail(`${where}: unknown form "${w.form}"`);
  if (!units.includes(w.unit)) fail(`${where}: unknown unit "${w.unit}"`);
  if (typeof w.year !== "number" || !Number.isFinite(w.year)) fail(`${where}: year must be a number`);
  if (!Array.isArray(w.prompts) || w.prompts.length < 2 || w.prompts.length > 3 || w.prompts.some((p) => typeof p !== "string" || p.length < 10)) fail(`${where}: prompts must be 2-3 strings`);
  if ((w.credit || "").length < 20) fail(`${where}: credit too short`);
  if ((w.notice || "").length < 15) fail(`${where}: notice too short`);
  if (BANNED.test(JSON.stringify(w))) fail(`${where}: contains banned wording`);
  const m = w.media || {};
  if (m.type === "image") {
    if (!m.alt) fail(`${where}: image without alt`);
    if (!m.src || !m.src.startsWith("/")) fail(`${where}: image src must be a site path`);
    else if (!fs.existsSync(path.join(ROOT, decodeURIComponent(m.src)))) fail(`${where}: image file missing ${m.src}`);
  } else if (m.type === "video") {
    if (!/^[A-Za-z0-9_-]{11}$/.test(m.id || "")) fail(`${where}: bad YouTube id`);
  } else fail(`${where}: media.type must be image or video`);
}

const counts = Object.fromEntries(FORMS.map((f) => [f, works.filter((w) => w.form === f).length]));
if (!allowShort) for (const f of FORMS) if (counts[f] < 15) fail(`form "${f}" has ${counts[f]} works (minimum 15)`);

console.log("works:", works.length, JSON.stringify(counts));
// Region labels are quiz answer options: no parentheses, and no label may contain another, so two options are never both defensible.
{
  const regions = [...new Set(works.map((w) => w.region))];
  regions.forEach((r) => { if (/[()]/.test(r)) fail(`region "${r}" has parentheses`); });
  ["Hong Kong", "Central Europe"].forEach((r) => { if (regions.includes(r)) fail(`region "${r}" overlaps a country label`); });
  regions.forEach((a) => regions.forEach((b) => { if (a !== b && a.includes(b)) fail(`region "${a}" contains "${b}"`); }));
}
console.log(fails.length ? fails.join("\n") + `\n\n${fails.length} problem(s).` : "All checks passed.");
process.exit(fails.length ? 1 : 0);
