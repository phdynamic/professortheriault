// One-shot: harvest the course's gallery works into artrandomizer/works.json, merged with
// the hand-written metadata in scripts/randomizer-meta.js. After the first successful run, edit
// works.json directly; do not re-run this (it would overwrite later additions).
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const META = require("./randomizer-meta.js");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "artrandomizer", "works.json");
if (fs.existsSync(OUT) && !process.argv.includes("--force")) { console.error("works.json exists; pass --force to overwrite"); process.exit(1); }

const GENERIC = {
  painting: ["Where does your eye land first, and where does it travel next?", "Which element (line, color, texture, or composition) does the most work here?"],
  sculpture: ["How would this look from behind or from the side? What would change?", "How big is it compared with your own body, and what does that do to you?"],
  architecture: ["Imagine walking in through the entrance. What do you notice first?", "Where does the light come from, and where does it lead you?"],
  literature: ["Read a few lines aloud. What do you hear in the sound and rhythm?", "What does the form of the page or book tell you about who it was made for?"],
  theater: ["What choices in voice, movement, or space make this feel live?", "What do you learn about the character from how the words are spoken?"],
  music: ["Listen once for the shape, then again for one detail. What changes?", "What feeling does the music express, and which sound produces it?"],
  dance: ["Describe the body, the space, the time, and the energy, one sentence each.", "What does the movement express that words could not?"],
  photography: ["What did the photographer choose to include and to leave out?", "Is this more like evidence or more like art, and why?"],
  cinema: ["What do the shot size and camera angle make you feel?", "What would be lost if this were told in one long take?"],
  "television and video art": ["How does the work use time: fast, slow, repeated, or looping?", "How does the setting in which you watch shape what you notice?"],
};

const harvested = new Map();
for (const unit of fs.readdirSync(path.join(ROOT, "huma1301")).filter((d) => d.startsWith("unit-"))) {
  const file = path.join(ROOT, "huma1301", unit, "lesson.njk");
  if (!fs.existsSync(file)) continue;
  const $ = cheerio.load(fs.readFileSync(file, "utf8"), { decodeEntities: false }, false);
  $(".gallery__thumb").each((i, el) => {
    const video = $(el).attr("data-video");
    const href = $(el).attr("href") || "";
    const key = video || path.basename(href);
    if (harvested.has(key)) return;
    harvested.set(key, {
      key, unit, video,
      src: video ? null : href,
      alt: $(el).find("img").attr("alt") || "",
      credit: $(el).attr("data-credit") || "",
      notice: $(el).attr("data-notice") || "",
      title: $(el).attr("data-title") || "",
    });
  });
}

const unmatched = [...harvested.keys()].filter((k) => !META[k]);
if (unmatched.length) {
  console.error(`${unmatched.length} harvested works have no entry in scripts/randomizer-meta.js:`);
  unmatched.forEach((k) => console.error(`  "${k}": { /* fill in */ },   // ${harvested.get(k).unit} | ${(harvested.get(k).credit || "").slice(0, 70)}`));
  process.exit(1);
}

const works = [...harvested.values()].filter((h) => !META[h.key].skip).map((h) => {
  const m = META[h.key];
  return {
    id: m.id, title: m.title, creator: m.creator, year: m.year, yearLabel: m.yearLabel, region: m.region, form: m.form,
    unit: m.unit || h.unit,
    media: h.video ? { type: "video", id: h.video } : { type: "image", src: h.src, alt: h.alt },
    credit: h.credit, notice: h.notice,
    prompts: m.prompts || [...GENERIC[m.form], "Test this: " + h.notice],
  };
});
fs.writeFileSync(OUT, JSON.stringify(works, null, 2) + "\n");
console.log(`Wrote ${works.length} works to artrandomizer/works.json`);
