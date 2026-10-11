// Writes huma1301/huma1301.11tydata.json from the unit table. Re-run after adding pages.
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "huma1301");

const UNITS = [
  ["unit-1-the-humanities", "The Humanities: An Introduction", "&#127757;", "What the humanities are, why they matter, and how art expresses human values."],
  ["unit-2-what-is-a-work-of-art", "What Is a Work of Art?", "&#128444;&#65039;", "Subject matter, content, form, and what makes something art."],
  ["unit-3-being-a-critic", "Being a Critic of the Arts", "&#128269;", "Describe, interpret, and evaluate: the tools of the critic."],
  ["unit-4-painting", "Painting", "&#127912;", "Line, color, texture, and composition in the art of the canvas."],
  ["unit-5-sculpture", "Sculpture", "&#128511;", "Form in three dimensions, from carving to installation."],
  ["unit-6-architecture", "Architecture", "&#127963;&#65039;", "How buildings shape space and express the values of a culture."],
  ["unit-7-literature", "Literature", "&#128214;", "Story, poem, and drama as art made of words."],
  ["unit-8-theater", "Theater", "&#127917;", "Live performance and what drama shows about being human."],
  ["unit-9-music", "Music", "&#127925;", "Sound organized in time: rhythm, melody, harmony, and form."],
  ["unit-10-dance", "Dance", "&#128131;", "The body in motion, from ballet to modern dance."],
  ["unit-11-photography", "Photography", "&#128247;", "Light, framing, and the power of the captured moment."],
  ["unit-12-cinema", "Cinema", "&#127910;", "Moving images, editing, and the language of film."],
  ["unit-13-television-and-video-art", "Television and Video Art", "&#128250;", "Broadcast, screen, and video as an art medium."],
];

const front = (file) => {
  const t = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  return { title: (t.match(/^title: "(.*)"$/m) || [])[1], position: Number((t.match(/^position: (\d+)/m) || [])[1]) };
};
const pagesIn = (mod) => fs.readdirSync(path.join(DIR, mod)).filter((f) => f.endsWith(".njk"))
  .map((f) => ({ slug: f.replace(/\.njk$/, ""), ...front(path.join(DIR, mod, f)) }))
  .sort((a, b) => a.position - b.position).map(({ slug, title }) => ({ slug, title }));

const modules = [];
if (fs.existsSync(path.join(DIR, "start-here"))) {
  modules.push({ slug: "start-here", title: "Start Here", icon: "&#128218;", description: "Course orientation, your instructor, and how the Gallery and Experience It activities work.", pages: pagesIn("start-here") });
}
UNITS.forEach(([slug, title, icon, description], i) => {
  if (fs.existsSync(path.join(DIR, slug))) modules.push({ slug, title: `Unit ${i + 1}: ${title}`, icon, description, pages: pagesIn(slug) });
});
if (fs.existsSync(path.join(DIR, "final-paper"))) {
  modules.push({ slug: "final-paper", title: "Final Paper", icon: "&#128196;", description: "Your final project: a critical analysis of a work of art.", pages: pagesIn("final-paper") });
}

const data = { course: { slug: "huma1301", title: "HUMA 1301: Introduction to the Humanities", shortTitle: "HUMA 1301", theme: "gallery", modules } };
fs.writeFileSync(path.join(DIR, "huma1301.11tydata.json"), JSON.stringify(data, null, 2) + "\n");
console.log(`Wrote ${modules.length} modules.`);
