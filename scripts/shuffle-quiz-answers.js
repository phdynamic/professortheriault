// Reorders answer choices in every quiz page so the correct answer is spread evenly across
// A–D (no letter correct more than twice in a row). Deterministic: seeded by file path, so a
// re-run produces the same order. Two-choice (True/False) questions keep their order.

const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const QUIZZES = ["phil1301", "phil2306"].flatMap((course) =>
  fs.readdirSync(path.join(ROOT, course))
    .filter((d) => d.startsWith("unit-") && fs.existsSync(path.join(ROOT, course, d, "quiz.njk")))
    .map((d) => path.join(ROOT, course, d, "quiz.njk")));

function rng(seedText) {
  let h = 2166136261;
  for (const ch of seedText) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
const shuffle = (arr, rand) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

function targetPositions(count, rand) {
  const balanced = Array.from({ length: count }, (_, i) => i % 4);
  for (;;) {
    const order = shuffle(balanced, rand);
    if (!order.some((p, i) => i >= 2 && p === order[i - 1] && p === order[i - 2])) return order;
  }
}

for (const file of QUIZZES) {
  const [, fm, body] = fs.readFileSync(file, "utf8").match(/^(---[\s\S]*?---\n)([\s\S]*)$/);
  const $ = cheerio.load(body, { decodeEntities: false }, false);
  const rand = rng(path.relative(ROOT, file).replace(/\\/g, "/"));
  const questions = $(".quiz__question").toArray();
  const fourChoice = questions.filter((q) => $(q).find(".quiz__choice").length === 4);
  const targets = targetPositions(fourChoice.length, rand);

  questions.forEach((q, qi) => {
    const n = qi + 1;
    const $q = $(q);
    const list = $q.find(".quiz__choices");
    let items = list.children(".quiz__choice").toArray();
    const correctItem = items.find((li) => $(li).find("input").attr("value") === $q.attr("data-correct"));

    const t = fourChoice.indexOf(q);
    if (t >= 0) {
      const others = shuffle(items.filter((li) => li !== correctItem), rand);
      others.splice(targets[t], 0, correctItem);
      items = others;
    }

    items.forEach((li, i) => {
      const id = `q${n}${"abcd"[i]}`;
      $(li).find("input").attr("value", id).attr("id", id).attr("name", `q${n}`);
      $(li).find("label").attr("for", id);
      if (li === correctItem) $q.attr("data-correct", id);
    });
    list.empty();
    items.forEach((li) => list.append("\n      ").append(li));
    list.append("\n    ");
  });

  fs.writeFileSync(file, fm + $.html());
  const letters = questions.map((q) => $(q).attr("data-correct").slice(-1).toUpperCase()).join("");
  console.log(`${path.relative(ROOT, file).replace(/\\/g, "/").padEnd(32)} ${letters}`);
}
