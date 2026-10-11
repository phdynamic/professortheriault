# Art Randomizer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a "Randomize" art game at `/artrandomizer/` (a wheel of "?" cards that spins and lands on one random work, then asks a rotating multiple-choice question, reveals the credit and a guide, links into the Humanities unit, and keeps a browser-only history), seeded from the course's 72 works and grown to at least 15 works for each of the ten art forms.

**Architecture:** A standalone static page (HTML + CSS + JS + `works.json`) copied through Eleventy untouched, like the homepage. Pure logic (picking, questions, history) lives in one small module with Node unit tests; the page script handles the DOM and the spin. The pool is a hand-curated JSON file guarded by a check script. The initial 72 works are harvested once from the course galleries; the rest are added in approved batches.

**Tech Stack:** Vanilla JS/CSS/HTML, Node 22 (`node:assert` tests), cheerio and the existing Commons/YouTube helper approach already used for the course.

**Spec:** `docs/superpowers/specs/2026-10-12-art-randomizer-design.md`

**Plan ruling (deviation from the spec's "Technical shape"):** the spec said to use the shared course layout and a theme flag. That layout requires course navigation data, so the page is instead a standalone static page using the same palette (burgundy `#6b1d2a`, gold `#d4a843`, cream `#faf6f0`). The spec's goals (palette, accessibility, check script, passthrough) are unchanged.

## Global Constraints

- Page path `/artrandomizer/`; files under `artrandomizer/`: `index.html`, `randomizer.css`, `logic.js`, `randomizer.js`, `works.json`, `assets/images/`.
- Art forms (exact strings): `painting`, `sculpture`, `architecture`, `literature`, `theater`, `music`, `dance`, `photography`, `cinema`, `television and video art`.
- Every form needs **at least 15 works** by the end of Task 9; `check-randomizer.js` enforces it (a `--allow-short` flag exists only for Tasks 2–8 progress runs).
- Each work has exactly these fields: `id`, `title`, `creator`, `year` (number; negative for BCE), `yearLabel`, `region`, `form`, `unit` (a `huma1301` unit slug), `media` (`{"type":"image","src","alt"}` or `{"type":"video","id"}`), `credit`, `notice`, `prompts` (2–3 strings).
- History: `localStorage` key `artRandomizerHistory`, max 50 entries, newest first, each `{ "id", "t" }`; storage must never be required (try/catch around every access).
- The wheel shows only "?" cards. The work is chosen before the animation. No score. No external libraries. Do not set `loading="lazy"` on dynamically created iframes (the course's Watch & Listen strip showed blank embeds with it).
- Images: download only after the developer approves a batch (work, source, license, size). Credits name the creator and license where the license requires it. Shrink images over 700 KB (`scripts/shrink-images.ps1` handles `huma1301/assets/images`; Task 4 generalizes it).
- New works must use only embeddable YouTube clips (verified with the oEmbed check in Task 4's helper) and valid, local image files.
- Commit messages end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Work on branch `art-randomizer`; do not push or merge to `main` without the developer's go-ahead; merge by `git merge --squash` only. Never commit `.claude/settings.local.json`, `*.imscc`, `*.zip`, or `scripts/huma-banks.json`.
- Environment: `export PATH="$PATH:/c/Program Files/nodejs"` before running node or npx in Bash. Shell-written regexes lose backslashes: create files with the Write tool, not shell heredocs, whenever they contain `\`.

## Review Focus

1. **Storage unavailable or corrupt.** Private windows, blocked storage, or hand-edited history JSON must not break the page; history just stays empty. Pinned by Task 1 tests and Task 3 browser checks.
2. **Not enough variety for good questions.** If the pool has fewer than four distinct centuries or regions, that question kind is skipped; options never repeat and the correct answer appears exactly once. Pinned by Task 1 tests.
3. **Fast repeated clicks and reduced motion.** Randomize is ignored while spinning; with reduced motion there is no animation but the same result flow. Pinned by Task 3 browser checks.
4. **A work whose image or video fails to load.** The work area shows a clear message and the guess, reveal, and history still work. Pinned by Task 3.
5. **Wrong credits or broken media in new works.** The check script and the Task 10 verification (embed check for every video, file existence for every image, external-link check) catch these before the review.

---

## File Structure

| File | Responsibility |
|---|---|
| `artrandomizer/logic.js` | Pure functions: `centuryLabel`, `pickWork`, `questionKinds`, `buildQuestion`, history helpers. Works in browser and Node. |
| `scripts/test-randomizer.js` | Node unit tests for `logic.js` |
| `artrandomizer/randomizer.js` | DOM: wheel, spin, rounds, history panel |
| `artrandomizer/randomizer.css` | Page styling (palette, wheel, cards, history, reduced motion) |
| `artrandomizer/index.html` | The page |
| `artrandomizer/works.json` | The curated pool |
| `scripts/check-randomizer.js` | Pool and file checks |
| `scripts/build-randomizer-seed.js` + `scripts/randomizer-meta.js` | One-shot harvest of the course's 72 works, with hand-written metadata |
| `scripts/fetch-randomizer-images.js` + `docs/artrandomizer-media.md` | Approved image downloads and their log |
| `scripts/check-randomizer-media.js` | YouTube embeddability check and image checks |
| `index.html` | The sixth homepage card |

---

### Task 1: Pure logic with unit tests

**Files:**
- Create: `artrandomizer/logic.js`, `scripts/test-randomizer.js`

**Interfaces:**
- Produces (all on `module.exports` and on `window.RandomizerLogic`): `FORMS` (array of the ten form strings), `centuryLabel(year)`, `pickWork(works, recentIds, rng)`, `questionKinds(work, works)`, `buildQuestion(work, works, kind, rng)` → `{ kind, text, options: string[4], answerIndex }`, `loadHistory(storage)`, `addHistory(storage, id, now)`, `clearHistory(storage)`.

- [ ] **Step 1: Write the failing tests** (create `scripts/test-randomizer.js` with the Write tool)

```js
const assert = require("node:assert");
const L = require("../artrandomizer/logic.js");

let n = 0;
const t = (name, fn) => { fn(); n++; console.log("ok  " + name); };
const seq = (...v) => { let i = 0; return () => v[i++ % v.length]; }; // deterministic rng

const W = (id, form, year, region) => ({ id, title: id, creator: "x", year, yearLabel: String(year), region, form, unit: "unit-1-the-humanities", media: { type: "image", src: "/x.jpg", alt: "a" }, credit: "c", notice: "n", prompts: ["p1", "p2"] });
const pool = [
  W("a", "painting", 1889, "Netherlands"), W("b", "sculpture", -450, "Greece"), W("c", "architecture", 126, "Italy"),
  W("d", "music", 1808, "Germany"), W("e", "dance", 1960, "United States"), W("f", "photography", 1936, "United States"),
  W("g", "cinema", 1925, "Russia"), W("h", "theater", 1600, "England"), W("i", "literature", 1855, "United States"), W("j", "painting", 1503, "Italy"),
];

t("centuryLabel: CE", () => { assert.strictEqual(L.centuryLabel(1889), "19th century"); assert.strictEqual(L.centuryLabel(1503), "16th century"); assert.strictEqual(L.centuryLabel(1900), "19th century"); assert.strictEqual(L.centuryLabel(101), "2nd century"); assert.strictEqual(L.centuryLabel(5), "1st century"); });
t("centuryLabel: BCE and prehistory", () => { assert.strictEqual(L.centuryLabel(-530), "6th century BCE"); assert.strictEqual(L.centuryLabel(-447), "5th century BCE"); assert.strictEqual(L.centuryLabel(-25000), "Prehistoric"); });
t("centuryLabel: ordinals 11th-13th", () => { assert.strictEqual(L.centuryLabel(1105), "12th century"); assert.strictEqual(L.centuryLabel(1205), "13th century"); assert.strictEqual(L.centuryLabel(1001), "11th century"); });

t("pickWork skips recent ids", () => { for (let i = 0; i < 50; i++) { const w = L.pickWork(pool, ["a", "b", "c", "d", "e", "f", "g", "h"], Math.random); assert.ok(["i", "j"].includes(w.id)); } });
t("pickWork falls back when everything is recent", () => { const w = L.pickWork(pool, pool.map((p) => p.id), seq(0)); assert.ok(w && w.id); });
t("pickWork is deterministic for a given rng", () => { assert.strictEqual(L.pickWork(pool, [], seq(0.0)).id, "a"); assert.strictEqual(L.pickWork(pool, [], seq(0.999)).id, "j"); });

t("questionKinds: art form is always offered", () => { assert.ok(L.questionKinds(pool[0], pool).includes("form")); });
t("questionKinds: century needs 4 distinct centuries", () => { const few = [W("a", "painting", 1889, "X"), W("b", "music", 1890, "X"), W("c", "dance", 1895, "X"), W("d", "cinema", 1899, "X")]; assert.ok(!L.questionKinds(few[0], few).includes("century")); assert.ok(L.questionKinds(pool[0], pool).includes("century")); });
t("questionKinds: region needs 4 distinct regions", () => { const few = [W("a", "painting", 1889, "X"), W("b", "music", 1990, "X"), W("c", "dance", 1700, "Y"), W("d", "cinema", 1200, "Y")]; assert.ok(!L.questionKinds(few[0], few).includes("region")); assert.ok(L.questionKinds(pool[0], pool).includes("region")); });

for (const kind of ["form", "century", "region"]) {
  t(`buildQuestion(${kind}): 4 distinct options, answer exactly once`, () => {
    for (let i = 0; i < 200; i++) {
      const w = pool[i % pool.length];
      const q = L.buildQuestion(w, pool, kind, Math.random);
      assert.strictEqual(q.options.length, 4);
      assert.strictEqual(new Set(q.options).size, 4);
      const answer = kind === "form" ? w.form : kind === "century" ? L.centuryLabel(w.year) : w.region;
      assert.strictEqual(q.options[q.answerIndex], answer);
      assert.strictEqual(q.options.filter((o) => o === answer).length, 1);
    }
  });
}
t("buildQuestion(form): uses only the ten forms", () => { const q = L.buildQuestion(pool[0], pool, "form", Math.random); q.options.forEach((o) => assert.ok(L.FORMS.includes(o))); });

const mem = () => { const s = {}; return { getItem: (k) => (k in s ? s[k] : null), setItem: (k, v) => { s[k] = String(v); }, removeItem: (k) => { delete s[k]; }, _s: s }; };
t("history: add, newest first, dedupe moves to top", () => { const s = mem(); L.addHistory(s, "a", 1); L.addHistory(s, "b", 2); L.addHistory(s, "a", 3); assert.deepStrictEqual(L.loadHistory(s).map((e) => e.id), ["a", "b"]); });
t("history: capped at 50", () => { const s = mem(); for (let i = 0; i < 60; i++) L.addHistory(s, "w" + i, i); const h = L.loadHistory(s); assert.strictEqual(h.length, 50); assert.strictEqual(h[0].id, "w59"); });
t("history: clear", () => { const s = mem(); L.addHistory(s, "a", 1); L.clearHistory(s); assert.deepStrictEqual(L.loadHistory(s), []); });
t("history: corrupt JSON is treated as empty", () => { const s = mem(); s.setItem("artRandomizerHistory", "{not json"); assert.deepStrictEqual(L.loadHistory(s), []); s.setItem("artRandomizerHistory", JSON.stringify({ not: "an array" })); assert.deepStrictEqual(L.loadHistory(s), []); s.setItem("artRandomizerHistory", JSON.stringify([{ id: 5 }, { id: "ok", t: 1 }, null])); assert.deepStrictEqual(L.loadHistory(s).map((e) => e.id), ["ok"]); });
t("history: storage that throws never throws", () => { const bad = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); }, removeItem() { throw new Error("blocked"); } }; assert.deepStrictEqual(L.loadHistory(bad), []); L.addHistory(bad, "a", 1); L.clearHistory(bad); });
t("history: null storage is fine", () => { assert.deepStrictEqual(L.loadHistory(null), []); L.addHistory(null, "a", 1); });

console.log(`\n${n} tests passed`);
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && node scripts/test-randomizer.js`
Expected: FAIL with `Cannot find module '../artrandomizer/logic.js'`.

- [ ] **Step 3: Write `artrandomizer/logic.js`** (Write tool)

```js
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.RandomizerLogic = factory();
})(typeof self !== "undefined" ? self : this, function () {
  var FORMS = ["painting", "sculpture", "architecture", "literature", "theater", "music", "dance", "photography", "cinema", "television and video art"];
  var KEY = "artRandomizerHistory";
  var MAX_HISTORY = 50;

  function ordinal(n) {
    var s = n % 100;
    if (s >= 11 && s <= 13) return n + "th";
    var r = n % 10;
    return n + (r === 1 ? "st" : r === 2 ? "nd" : r === 3 ? "rd" : "th");
  }

  function centuryLabel(year) {
    if (year < -3000) return "Prehistoric";
    if (year > 0) return ordinal(Math.ceil(year / 100)) + " century";
    return ordinal(Math.max(1, Math.ceil(Math.abs(year) / 100))) + " century BCE";
  }

  function shuffle(arr, rng) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function pickWork(works, recentIds, rng) {
    var recent = {};
    (recentIds || []).forEach(function (id) { recent[id] = true; });
    var fresh = works.filter(function (w) { return !recent[w.id]; });
    var list = fresh.length ? fresh : works;
    return list[Math.min(list.length - 1, Math.floor(rng() * list.length))];
  }

  function distinct(works, fn) {
    var seen = {}, out = [];
    works.forEach(function (w) { var v = fn(w); if (v && !seen[v]) { seen[v] = true; out.push(v); } });
    return out;
  }

  var ANSWER = {
    form: function (w) { return w.form; },
    century: function (w) { return centuryLabel(w.year); },
    region: function (w) { return w.region; },
  };
  var TEXT = {
    form: "Which art form is this?",
    century: "Roughly when was this made?",
    region: "Which culture or region made this?",
  };

  function questionKinds(work, works) {
    var kinds = ["form"];
    if (distinct(works, ANSWER.century).length >= 4) kinds.push("century");
    if (distinct(works, ANSWER.region).length >= 4) kinds.push("region");
    return kinds;
  }

  function buildQuestion(work, works, kind, rng) {
    var answer = ANSWER[kind](work);
    var pool = kind === "form" ? FORMS.slice() : distinct(works, ANSWER[kind]);
    var wrong = shuffle(pool.filter(function (o) { return o !== answer; }), rng).slice(0, 3);
    var options = shuffle([answer].concat(wrong), rng);
    return { kind: kind, text: TEXT[kind], options: options, answerIndex: options.indexOf(answer) };
  }

  function loadHistory(storage) {
    try {
      if (!storage) return [];
      var raw = storage.getItem(KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.filter(function (e) { return e && typeof e.id === "string"; }).slice(0, MAX_HISTORY);
    } catch (e) { return []; }
  }

  function addHistory(storage, id, now) {
    try {
      if (!storage) return;
      var list = loadHistory(storage).filter(function (e) { return e.id !== id; });
      list.unshift({ id: id, t: now });
      storage.setItem(KEY, JSON.stringify(list.slice(0, MAX_HISTORY)));
    } catch (e) { /* storage unavailable: history simply stays empty */ }
  }

  function clearHistory(storage) {
    try { if (storage) storage.removeItem(KEY); } catch (e) { /* ignore */ }
  }

  return { FORMS: FORMS, centuryLabel: centuryLabel, pickWork: pickWork, questionKinds: questionKinds, buildQuestion: buildQuestion, loadHistory: loadHistory, addHistory: addHistory, clearHistory: clearHistory };
});
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `node scripts/test-randomizer.js`
Expected: every line `ok  ...` and `19 tests passed` as the last line.

- [ ] **Step 5: Commit**

```bash
git add artrandomizer/logic.js scripts/test-randomizer.js
git commit -m "feat: add Art Randomizer pure logic with unit tests

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Pool schema check and the course-seeded pool

**Files:**
- Create: `scripts/check-randomizer.js`, `scripts/build-randomizer-seed.js`, `scripts/randomizer-meta.js`, `artrandomizer/works.json`

**Interfaces:**
- Consumes: Task 1 `FORMS` (via `require("../artrandomizer/logic.js")`).
- Produces: `node scripts/check-randomizer.js [--allow-short]` (exit 1 on failures); `artrandomizer/works.json` with the 72 course works (`media.src` points at existing `/huma1301/assets/images/...` files; videos use `media.id`).

- [ ] **Step 1: Write the check script** (Write tool)

```js
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
console.log(fails.length ? fails.join("\n") + `\n\n${fails.length} problem(s).` : "All checks passed.");
process.exit(fails.length ? 1 : 0);
```

- [ ] **Step 2: Run it against a missing pool and confirm it fails**

Run: `node scripts/check-randomizer.js --allow-short`
Expected: FAIL with an error that `artrandomizer/works.json` cannot be read (ENOENT).

- [ ] **Step 3: Write the seed script** (Write tool). It harvests every distinct gallery work from `huma1301/unit-*/lesson.njk`, merges the hand-written metadata, and writes `works.json`. It is **one-shot**: after the first successful run, `works.json` is edited directly.

```js
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

const works = [...harvested.values()].map((h) => {
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
```

- [ ] **Step 4: Write `scripts/randomizer-meta.js`.** First run the seed script with an empty meta module (`module.exports = {};`) so it prints a ready-to-fill line for every one of the 72 works (key, unit, and the start of the credit). Then replace each `/* fill in */` with real values. Format and two worked examples:

```js
module.exports = {
  // key = image file name from the course, or the 11-character YouTube id for clips
  "vincent-van-gogh-the-starry-night-1889.jpg": { id: "starry-night", title: "The Starry Night", creator: "Vincent van Gogh", year: 1889, yearLabel: "1889", region: "Netherlands", form: "painting" },
  "fHqhaH6m9pY": { id: "viola-the-crossing", title: "The Crossing", creator: "Bill Viola", year: 1996, yearLabel: "1996", region: "United States", form: "television and video art" },
  // ...one entry per harvested work (72)
};
```

Rules for the entries: `id` unique lowercase-hyphen; `year` is the year the **work** was made (midpoint of a range; negative for BCE; for clips of performances use the work's date, not the recording); `yearLabel` is the display form (for example `"c. 1503–1519"`, `"c. 530 BCE"`); `region` is a short culture or country label used for the "which culture or region" question, spelled identically across works (`"United States"`, `"France"`, `"Italy"`, `"Netherlands"`, `"Spain"`, `"Japan"`, `"Greece"`, `"Germany"`, `"England"`, `"Mexico"`, `"India"`, `"Russia"`, and so on); `form` is one of the ten strings, chosen by what the work **is** (the Great Wave is a woodblock print: use `painting`; Duchamp's *Fountain* is `sculpture`; the Exekias vase is `sculpture`; a First Folio or manuscript page is `literature`; a clip of a play is `theater`). Where the harvested unit slug is not the best unit link (for example Migrant Mother appears in Units 1 and 11), add `unit: "unit-11-photography"`. Optional `prompts: [...]` replaces the generic questions.

- [ ] **Step 5: Run the seed, then the check**

```bash
node scripts/build-randomizer-seed.js
node scripts/check-randomizer.js --allow-short
```
Expected: "Wrote 72 works to artrandomizer/works.json", then "All checks passed." with a per-form count line. Record the counts: they tell Tasks 5–9 how many works each form still needs (target 15).

- [ ] **Step 6: Commit**

```bash
git add scripts/check-randomizer.js scripts/build-randomizer-seed.js scripts/randomizer-meta.js artrandomizer/works.json
git commit -m "feat: seed the Art Randomizer pool from the course's 72 gallery works

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 3: The page, the wheel, the rounds, and the history panel

**Files:**
- Create: `artrandomizer/index.html`, `artrandomizer/randomizer.css`, `artrandomizer/randomizer.js`
- Modify: `.eleventy.js` (passthrough)

**Interfaces:**
- Consumes: Task 1 `window.RandomizerLogic`; Task 2 `artrandomizer/works.json`.
- Produces: the working page at `/artrandomizer/`.

- [ ] **Step 1: Add the passthrough.** In `.eleventy.js`, after the `huma1301/assets` passthrough line, add `eleventyConfig.addPassthroughCopy("artrandomizer");`. The page folder is copied untouched and contains no Eleventy templates.

- [ ] **Step 2: Write `artrandomizer/index.html`** (Write tool)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Art Randomizer | Professor Theriault</title>
  <meta name="description" content="Spin the wheel, land on a work of art, guess its art form, century, or culture, then explore it in the Humanities course.">
  <link rel="stylesheet" href="randomizer.css">
</head>
<body>
  <header class="top">
    <a href="/" class="top__home">Professor Theriault</a>
    <a href="/huma1301/" class="top__course">Humanities course</a>
  </header>

  <main class="page">
    <h1>Art Randomizer</h1>
    <p class="lede">Press <strong>Randomize</strong> and the wheel will land on one work of art. Guess a detail about it, then see the answer and a few questions to look closer. Nothing is scored.</p>

    <noscript><p class="notice">This page needs JavaScript. You can still <a href="/huma1301/">explore the Humanities course</a>.</p></noscript>

    <section class="wheel" aria-label="Wheel">
      <div class="wheel__window" id="wheel-window">
        <div class="wheel__pointer" aria-hidden="true"></div>
        <div class="wheel__track" id="wheel-track" aria-hidden="true"></div>
      </div>
      <button type="button" class="btn" id="randomize">Randomize</button>
      <p class="sr-only" id="status" role="status" aria-live="polite"></p>
    </section>

    <section class="work" id="work" hidden aria-label="Your work of art">
      <div class="work__media" id="work-media"></div>
      <div class="quiz" id="quiz">
        <h2 id="quiz-text"></h2>
        <ul class="quiz__options" id="quiz-options"></ul>
      </div>
      <div class="reveal" id="reveal" hidden>
        <p class="reveal__verdict" id="reveal-verdict"></p>
        <h2 class="reveal__title" id="reveal-title"></h2>
        <p class="reveal__meta" id="reveal-meta"></p>
        <p class="reveal__credit" id="reveal-credit"></p>
        <p class="reveal__notice"><strong>What to notice:</strong> <span id="reveal-notice"></span></p>
        <h3>Try this</h3>
        <ul id="reveal-prompts"></ul>
        <p><a class="link" id="reveal-unit" href="/huma1301/">Explore this in the Humanities course</a></p>
      </div>
    </section>

    <section class="history" aria-label="History">
      <div class="history__bar">
        <h2>History</h2>
        <button type="button" class="btn btn--small" id="clear-history">Clear history</button>
      </div>
      <p class="history__empty" id="history-empty">Works you land on will appear here so you can come back to them.</p>
      <ul class="history__list" id="history-list"></ul>
    </section>
  </main>

  <script src="logic.js"></script>
  <script src="randomizer.js"></script>
</body>
</html>
```

- [ ] **Step 3: Write `artrandomizer/randomizer.css`** (Write tool)

```css
:root { --burgundy: #6b1d2a; --gold: #d4a843; --cream: #faf6f0; --tan: #d0c4b8; --ink: #1a1a1a; }
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; background: var(--cream); color: var(--ink); font-family: Georgia, "Times New Roman", serif; line-height: 1.6; }
a { color: var(--burgundy); }
.top { display: flex; justify-content: space-between; gap: 1rem; background: var(--burgundy); padding: 0.75rem 1.25rem; font-family: -apple-system, "Segoe UI", Roboto, sans-serif; }
.top a { color: #f3ece0; text-decoration: none; font-weight: 600; }
.top a:hover { color: var(--gold); }
.page { max-width: 880px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
h1 { color: var(--burgundy); margin: 0.5rem 0; }
h2, h3 { color: var(--burgundy); }
.lede { font-size: 1.05rem; }
.notice { background: #fff; border-left: 4px solid var(--gold); padding: 0.75rem 1rem; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

.btn { background: var(--burgundy); color: #fff; border: 2px solid var(--burgundy); border-radius: 999px; padding: 0.7rem 2rem; font-size: 1.1rem; font-weight: 700; cursor: pointer; font-family: -apple-system, "Segoe UI", Roboto, sans-serif; }
.btn:hover:not(:disabled) { background: #8a2a3a; border-color: var(--gold); }
.btn:focus-visible { outline: 3px solid var(--gold); outline-offset: 2px; }
.btn:disabled { opacity: 0.6; cursor: wait; }
.btn--small { padding: 0.3rem 0.9rem; font-size: 0.85rem; background: #fff; color: var(--burgundy); }

.wheel { text-align: center; margin: 1.5rem 0; }
.wheel__window { position: relative; overflow: hidden; width: 100%; height: 190px; background: #fff; border: 2px solid var(--tan); border-radius: 12px; margin-bottom: 1rem; }
.wheel__pointer { position: absolute; top: 0; bottom: 0; left: 50%; width: 4px; margin-left: -2px; background: var(--gold); z-index: 2; box-shadow: 0 0 0 1px var(--burgundy); }
.wheel__track { position: absolute; top: 15px; left: 0; display: flex; gap: 14px; will-change: transform; }
.card { flex: 0 0 150px; height: 160px; border-radius: 10px; background: var(--burgundy); color: var(--gold); display: flex; align-items: center; justify-content: center; font-size: 4rem; font-weight: 700; border: 3px solid var(--gold); perspective: 600px; overflow: hidden; }
.card--landed { background: #fff; color: var(--burgundy); border-color: var(--burgundy); }
.card--landed img { width: 100%; height: 100%; object-fit: cover; display: block; }
.card--landed .card__video { font-size: 2.2rem; }
.card--flip { animation: flip 0.5s ease; }
@keyframes flip { from { transform: rotateY(90deg); } to { transform: rotateY(0); } }

.work { background: #fff; border: 1px solid var(--tan); border-radius: 10px; padding: 1rem; margin: 1.5rem 0; }
.work__media img { display: block; max-width: 100%; max-height: 70vh; margin: 0 auto; }
.work__video { position: relative; height: 0; padding-bottom: 56.25%; }
.work__video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.work__missing { text-align: center; color: #666; padding: 1.5rem 0; }
.quiz__options { list-style: none; padding: 0; display: grid; gap: 0.5rem; }
.quiz__options button { width: 100%; text-align: left; padding: 0.7rem 1rem; border: 2px solid var(--tan); border-radius: 8px; background: var(--cream); font-size: 1rem; font-family: inherit; cursor: pointer; }
.quiz__options button:hover:not(:disabled) { border-color: var(--gold); }
.quiz__options button:focus-visible { outline: 3px solid var(--burgundy); outline-offset: 2px; }
.quiz__options button.is-right { border-color: #2d6a4f; background: #ecfdf5; }
.quiz__options button.is-wrong { border-color: #b42318; background: #fef2f2; }
.reveal { border-top: 2px solid var(--tan); margin-top: 1rem; padding-top: 1rem; }
.reveal__verdict { font-weight: 700; }
.reveal__title { margin: 0.2rem 0; }
.reveal__meta { margin: 0; color: #555; }
.reveal__credit { font-size: 0.85rem; color: #666; }

.history { margin-top: 2rem; }
.history__bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.history__empty { color: #666; }
.history__list { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem; }
.history__list button { width: 100%; text-align: left; background: #fff; border: 1px solid var(--tan); border-radius: 8px; padding: 0.4rem; cursor: pointer; font-family: inherit; }
.history__list button:hover { border-color: var(--gold); }
.history__list button:focus-visible { outline: 3px solid var(--burgundy); }
.history__list .thumb { height: 90px; display: flex; align-items: center; justify-content: center; background: var(--cream); font-size: 1.6rem; margin-bottom: 0.3rem; overflow: hidden; }
.history__list .thumb img { width: 100%; height: 100%; object-fit: cover; }
.history__list .name { font-size: 0.85rem; line-height: 1.3; display: block; }

@media (prefers-reduced-motion: reduce) { .card--flip { animation: none; } .wheel__track { transition: none !important; } }
@media (max-width: 480px) { .card { flex-basis: 120px; height: 130px; font-size: 3rem; } .wheel__window { height: 160px; } }
```

- [ ] **Step 4: Write `artrandomizer/randomizer.js`** (Write tool). Behavior contract: the work is chosen before the spin; the track holds 24 "?" cards plus the landing card at index 20; the spin is a single CSS transition (2800 ms, ease-out) of the track so the landing card stops under the pointer; the landing card then flips to show the work's thumbnail; then the work area opens with the guess. With `prefers-reduced-motion`, the spin is skipped (status text "Choosing…" for 400 ms).

```js
(function () {
  var L = window.RandomizerLogic;
  var $ = function (id) { return document.getElementById(id); };
  var storage = null;
  try { storage = window.localStorage; storage.getItem("artRandomizerHistory"); } catch (e) { storage = null; }

  var works = [], byId = {}, spinning = false, current = null, answered = false;
  var CARDS = 24, LAND = 20, SPIN_MS = 2800;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function unitLink(w) { return "/huma1301/" + w.unit + "/lesson/"; }
  function unitNumber(w) { var m = /unit-(\d+)/.exec(w.unit); return m ? m[1] : ""; }

  function thumbFor(w) {
    if (w.media.type === "image") { var img = el("img"); img.src = w.media.src; img.alt = ""; return img; }
    return el("span", "card__video", "▶");
  }

  function renderHistory() {
    var list = $("history-list"), empty = $("history-empty");
    clear(list);
    var h = L.loadHistory(storage).filter(function (e) { return byId[e.id]; });
    empty.hidden = h.length > 0;
    $("clear-history").hidden = h.length === 0;
    h.forEach(function (e) {
      var w = byId[e.id], li = el("li"), b = el("button");
      b.type = "button";
      var t = el("span", "thumb"); t.appendChild(thumbFor(w));
      b.appendChild(t); b.appendChild(el("span", "name", w.title + " — " + w.creator));
      b.addEventListener("click", function () { showWork(w, true); window.scrollTo({ top: $("work").offsetTop - 20, behavior: reduce ? "auto" : "smooth" }); });
      li.appendChild(b); list.appendChild(li);
    });
  }

  function buildTrack(landingWork) {
    var track = $("wheel-track");
    clear(track);
    track.style.transition = "none"; track.style.transform = "translateX(0)";
    for (var i = 0; i < CARDS; i++) track.appendChild(el("div", "card", "?"));
    return track;
  }

  function landOffset(track) {
    var win = $("wheel-window").clientWidth;
    var card = track.children[LAND];
    return -(card.offsetLeft + card.offsetWidth / 2 - win / 2);
  }

  function mediaNode(w) {
    var box = el("div");
    if (w.media.type === "image") {
      var img = el("img"); img.alt = w.media.alt;
      img.onerror = function () { clear(box); box.appendChild(el("p", "work__missing", "This image could not be loaded. You can still guess below.")); };
      img.src = w.media.src; box.appendChild(img);
    } else {
      var wrap = el("div", "work__video"), f = el("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + w.media.id;
      f.title = "Video: " + w.title;
      f.setAttribute("allow", "accelerometer; encrypted-media; gyroscope; picture-in-picture");
      f.allowFullscreen = true;
      wrap.appendChild(f); box.appendChild(wrap);
    }
    return box;
  }

  function showWork(w, fromHistory) {
    current = w; answered = false;
    $("work").hidden = false;
    clear($("work-media")); $("work-media").appendChild(mediaNode(w));
    $("reveal").hidden = true;
    var kinds = L.questionKinds(w, works);
    var q = L.buildQuestion(w, works, kinds[Math.floor(Math.random() * kinds.length)], Math.random);
    $("quiz-text").textContent = q.text;
    var ul = $("quiz-options"); clear(ul);
    q.options.forEach(function (opt, i) {
      var li = el("li"), b = el("button", "", opt); b.type = "button";
      b.addEventListener("click", function () { answer(q, i, ul); });
      li.appendChild(b); ul.appendChild(li);
    });
    $("status").textContent = fromHistory ? "Showing a work from your history. Guess, then see the answer." : "Landed. Make a guess.";
    if (fromHistory) { /* history entries re-open as a fresh guess, revealing on answer */ }
  }

  function answer(q, i, ul) {
    if (answered) return;
    answered = true;
    var buttons = ul.querySelectorAll("button");
    buttons.forEach(function (b, k) { b.disabled = true; if (k === q.answerIndex) b.classList.add("is-right"); else if (k === i) b.classList.add("is-wrong"); });
    var w = current;
    $("reveal-verdict").textContent = i === q.answerIndex ? "Yes! That's right." : "Not quite. The answer is " + q.options[q.answerIndex] + ".";
    $("reveal-title").textContent = w.title;
    $("reveal-meta").textContent = w.creator + ", " + w.yearLabel + " · " + w.region + " · " + w.form;
    $("reveal-credit").textContent = w.credit;
    $("reveal-notice").textContent = w.notice;
    var pl = $("reveal-prompts"); clear(pl);
    w.prompts.forEach(function (p) { pl.appendChild(el("li", "", p)); });
    var a = $("reveal-unit"); a.href = unitLink(w); a.textContent = "Explore this in Unit " + unitNumber(w) + " of the Humanities course";
    $("reveal").hidden = false;
    $("status").textContent = $("reveal-verdict").textContent + " " + w.title + " by " + w.creator + ".";
  }

  function randomize() {
    if (spinning || !works.length) return;
    spinning = true;
    $("randomize").disabled = true;
    $("work").hidden = true;
    var recent = L.loadHistory(storage).slice(0, 10).map(function (e) { return e.id; });
    var chosen = L.pickWork(works, recent, Math.random);   // decided BEFORE the animation
    var track = buildTrack(chosen);
    $("status").textContent = "Choosing a work…";

    function land() {
      var card = track.children[LAND];
      card.className = "card card--landed card--flip";
      clear(card); card.appendChild(thumbFor(chosen));
      L.addHistory(storage, chosen.id, Date.now());
      renderHistory();
      showWork(chosen, false);
      spinning = false; $("randomize").disabled = false;
    }

    if (reduce) { track.style.transform = "translateX(" + landOffset(track) + "px)"; setTimeout(land, 400); return; }
    var off = landOffset(track);
    track.getBoundingClientRect(); // flush
    track.style.transition = "transform " + SPIN_MS + "ms cubic-bezier(0.12, 0.65, 0.12, 1)";
    track.style.transform = "translateX(" + off + "px)";
    var done = false;
    function finish() { if (done) return; done = true; land(); }
    track.addEventListener("transitionend", finish, { once: true });
    setTimeout(finish, SPIN_MS + 300);
  }

  function init() {
    fetch("works.json").then(function (r) { return r.json(); }).then(function (data) {
      works = data; data.forEach(function (w) { byId[w.id] = w; });
      buildTrack(null);
      $("randomize").addEventListener("click", randomize);
      $("clear-history").addEventListener("click", function () { L.clearHistory(storage); renderHistory(); });
      renderHistory();
    }).catch(function () {
      $("status").textContent = "The art pool could not be loaded.";
      $("randomize").disabled = true;
    });
  }
  init();
})();
```

- [ ] **Step 5: Verify in the browser** (`preview_start` name `site`; open `/artrandomizer/`). Checks, each with a `javascript_tool` read or a screenshot:
  1. Initial state: 24 "?" cards in the track, Randomize enabled, history panel shows the empty message.
  2. Click Randomize: button becomes disabled; after about 3 seconds a card flips to the work; the work area opens; the question has 4 distinct options.
  3. During the spin no card contains an artwork or title (all `.card` text is "?" until the landing).
  4. Double-click Randomize quickly: only one spin runs.
  5. Answer a question: verdict text, title, credit, "What to notice," prompts, and a unit link that returns 200 appear; the history list gains one entry; reload the page and the entry is still there; click it and the work re-opens.
  6. "Clear history" empties the list.
  7. With `localStorage` blocked (in `javascript_tool`: override `Storage.prototype.getItem`/`setItem` to throw, reload) the page still works and history stays empty.
  8. Reduced motion: emulate via `resize_window` colorScheme is not enough; instead set `matchMedia` override before load is not possible, so test by calling the page with the CSS media query forced through the browser's rendering emulation if available; otherwise read the code path and test by temporarily setting `reduce = true` in the console before clicking Randomize (record that in the ledger).
  9. A work with a broken image: in the console, set `works[0].media.src = "/nope.jpg"`, force it with the history entry, and confirm "This image could not be loaded" appears and the guess still works.
  10. 390px width: `scrollWidth <= innerWidth`; the wheel fits; the work area and history are readable.
  Expected: all pass; fix any failure before continuing.

- [ ] **Step 6: Commit**

```bash
git add artrandomizer .eleventy.js
git commit -m "feat: add the Art Randomizer page with wheel, rounds, and history

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Media helpers for growing the pool

**Files:**
- Create: `scripts/fetch-randomizer-images.js`, `scripts/check-randomizer-media.js`, `docs/artrandomizer-media.md`, `artrandomizer/assets/images/.gitkeep`
- Modify: `scripts/shrink-images.ps1` (accept `-Dir`)

**Interfaces:**
- Produces: `node scripts/fetch-randomizer-images.js` (downloads `planned` rows from the log into `artrandomizer/assets/images/`); `node scripts/check-randomizer-media.js` (every image file exists and every video id answers 200 on YouTube oEmbed); `powershell -File scripts/shrink-images.ps1 -Dir artrandomizer\assets\images`.

- [ ] **Step 1: `docs/artrandomizer-media.md`** with this header (Write tool):

```markdown
# Art Randomizer media log

New works added beyond the course's 72. Status: `planned`, `downloaded`, `embedded` (YouTube), or `gap`.

| Form | Work | Download URL | License / status | File | Size | Status |
|---|---|---|---|---|---|---|

## Gaps (wanted but not obtainable)
```

- [ ] **Step 2: `scripts/fetch-randomizer-images.js`.** Copy `scripts/fetch-huma-images.js`; change `LOG` to `docs/artrandomizer-media.md` and `OUT` to `artrandomizer/assets/images`. Everything else (column positions: URL is column 3, file column 5, size column 6, status column 7) stays. Run `node --check scripts/fetch-randomizer-images.js`.

- [ ] **Step 3: `scripts/check-randomizer-media.js`** (Write tool): reads `works.json`; for each image checks the file exists and is under 1.2 MB (warn above 700 KB); for each video requests `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json` and requires 200, one request at a time with a 400 ms pause; prints a failure line per problem and exits 1 on any.

```js
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const works = JSON.parse(fs.readFileSync(path.join(ROOT, "artrandomizer", "works.json"), "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const fails = [], warns = [];
  for (const w of works) {
    if (w.media.type === "image") {
      const p = path.join(ROOT, decodeURIComponent(w.media.src));
      if (!fs.existsSync(p)) { fails.push(`${w.id}: missing ${w.media.src}`); continue; }
      const kb = fs.statSync(p).size / 1024;
      if (kb > 1200) fails.push(`${w.id}: image is ${kb.toFixed(0)} KB (shrink it)`); else if (kb > 700) warns.push(`${w.id}: ${kb.toFixed(0)} KB`);
    } else {
      try {
        const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${w.media.id}&format=json`, { signal: AbortSignal.timeout(15000) });
        if (r.status !== 200) fails.push(`${w.id}: YouTube oEmbed answered ${r.status}`);
      } catch (e) { fails.push(`${w.id}: YouTube check failed (${e.name})`); }
      await sleep(400);
    }
  }
  warns.forEach((m) => console.log("warn " + m));
  console.log(fails.length ? fails.join("\n") + `\n\n${fails.length} problem(s).` : `All ${works.length} works' media OK.`);
  process.exit(fails.length ? 1 : 0);
})();
```

- [ ] **Step 4: Generalize the shrinker.** In `scripts/shrink-images.ps1` change the param line to `param([int]$MinKB = 700, [int]$MaxSide = 1600, [string]$Dir = "huma1301\assets\images")` and the `$dir` assignment to `$dir = Join-Path (Split-Path $PSScriptRoot -Parent) $Dir`.

- [ ] **Step 5: Run `node scripts/check-randomizer-media.js`** on the seeded pool. Expected: `All 72 works' media OK.` If a course image or clip fails, fix the course data or drop the work (record in the ledger).

- [ ] **Step 6: Commit**

```bash
git add scripts docs/artrandomizer-media.md artrandomizer/assets
git commit -m "chore: add media helpers for growing the Art Randomizer pool

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Tasks 5-8: Grow the pool in four approved batches

Each task follows the **Batch Procedure** below. Targets come from the per-form counts printed in Task 2 Step 5 (re-run `node scripts/check-randomizer.js --allow-short` to see current counts). The aim is **at least 15 works per form**; adding a few beyond 15 for the forms with plenty of material is welcome but not required.

**Batch Procedure** (for the forms in each task):
1. **Count the gap** per form with the check script.
2. **Propose candidates** (about 1.5 per needed slot, so some can be dropped): for each, art form, title, creator, date, region, and the source. Use these sources and tests:
   - *Images (painting, sculpture, architecture, literature pages and book art, photography):* Wikimedia Commons (find with the `find.js`-style search against `commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6`, then read license and size from the `imageinfo` / `extmetadata` API). Prefer Public domain and CC0; allow CC BY / CC BY-SA only with the credit naming author and license. Reject non-free files.
   - *Clips (theater, music, dance, cinema, television and video art):* YouTube videos from official, museum, institutional, or clearly public-domain-film channels, found with a web search and then verified with `node -e` oEmbed checks (status 200) and a look at the channel name via oEmbed `author_name`. Prefer 1–6 minute clips of the work itself.
   - Mix cultures and centuries so the century and region questions have good wrong answers (aim for at least 8 distinct regions and 8 distinct centuries across the whole pool).
3. **Approval gate (stop):** show the developer a table (form, work, source URL or YouTube id, license/channel, size) via the question tool and wait for a yes. Anything declined is dropped. Images are downloaded only after the yes.
4. **Log, then download:** append rows (status `planned`) to `docs/artrandomizer-media.md`; run `node scripts/fetch-randomizer-images.js`; run `powershell -ExecutionPolicy Bypass -File scripts/shrink-images.ps1 -Dir artrandomizer\assets\images`; **look at each downloaded image** (Read tool) to confirm it is the right work.
5. **Write the works entries** into `artrandomizer/works.json`, one object per work with every field from Global Constraints. `unit` is the best-fit `huma1301` unit slug. `credit` names creator, title, date, medium/location where known, source, and license. `notice` is one specific sentence of "what to notice." `prompts` are 2–3 questions specific to the work (not generic). Write them in the course's voice: second person, plain, warm. Keep `yearLabel` human-readable and `year` numeric.
6. **Verify:** `node scripts/check-randomizer.js --allow-short` and `node scripts/check-randomizer-media.js` pass. Fix and re-run.
7. **Spot-check in the browser:** open `/artrandomizer/`, click history entries for three new works (use the console to call `showWork` is not exposed, so instead temporarily check the JSON loads and render at least three new works by setting `localStorage.artRandomizerHistory` to their ids and reloading, then clicking each history entry). Confirm media loads and the credit shows.
8. **Commit** `feat: add <forms> works to the Art Randomizer pool` and append a ledger line with counts.

### Task 5: Batch 1 — painting, sculpture, architecture, photography
Apply the Batch Procedure. Painting, sculpture, architecture, and photography draw mostly on Commons images.

### Task 6: Batch 2 — literature, theater
Literature uses images (manuscripts, title pages, illustrated pages, portraits of authors with their book) from Commons; theater uses verified clips (performances, productions, introductions to traditions such as Noh, Kabuki, Greek tragedy, Shakespeare, modern drama, musical theater).

### Task 7: Batch 3 — music, dance
Both use verified clips from official or institutional channels, across periods and cultures (for example Baroque, Romantic, jazz, blues, folk, Indian classical, West African drumming; ballet, modern, tap, hip-hop, flamenco, Bharatanatyam, Kathak).

### Task 8: Batch 4 — cinema, television and video art
Both use verified clips; use public-domain films where possible (silent-era classics) and official trailers or scenes from institutional channels for others; for video art use museum and institution uploads.

---

### Task 9: The homepage card

**Files:**
- Modify: `index.html`

- [ ] **Step 1:** Add the sixth card after the EthicsLens card (so the grid is a full 3 × 2):

```html
      <a href="/artrandomizer/" class="card-link">
        <div class="card-body">
          <span class="card-icon" role="img" aria-label="Art Randomizer">&#127922;</span>
          <h2>Art Randomizer</h2>
          <p>Spin the wheel and see what you land on: guess the art form, century, or culture, then explore it in the Humanities course.</p>
        </div>
      </a>
```

- [ ] **Step 2: Verify** with `grep -c 'href="/artrandomizer/"' index.html` (expected 1) and a browser look at the homepage at 1280 and 390 px (six cards, no overflow).

- [ ] **Step 3: Commit** `feat: add the Art Randomizer card to the homepage`.

---

### Task 10: Whole-feature verification and docs

**Files:**
- Modify: `docs/STATUS.md`, `docs/NEXT-SESSION.txt`, `docs/TESTING-OWED.md`, `docs/build-log/2026-initial-build.md`, `docs/decisions/site-and-hosting.md`, `docs/CLAUDE.md`, `docs/standing-rules.md`

- [ ] **Step 1: Automated checks.** Run in order, all must pass: `node scripts/test-randomizer.js`, `node scripts/check-randomizer.js` (now with the 15-per-form minimum, no `--allow-short`), `node scripts/check-randomizer-media.js`, `node scripts/check-huma.js`.
- [ ] **Step 2: Clean build.** Build `git archive HEAD` to a temp directory with `npx @11ty/eleventy --output=<temp>`; confirm `artrandomizer/index.html`, `logic.js`, `randomizer.js`, `randomizer.css`, `works.json`, and the new images are in the output; scan for broken internal links as in the course verification; confirm PHIL 1301, PHIL 2306, and HUMA 1301 pages are unchanged from `main`'s build (except the homepage).
- [ ] **Step 3: Pool quality.** Print counts per form (all ≥ 15), the number of distinct regions and centuries (each ≥ 8), the number of works with `unit` links that return 200 on the built site, and a sample of 10 random works' credits read for accuracy. Re-check any license that needs attribution appears in the `credit`.
- [ ] **Step 4: Browser pass.** Repeat Task 3 Step 5 checks 1–10 against the final pool; additionally run 30 spins and confirm no immediate repeats within the last ten and that every form appears at least once over 150 spins (use a `javascript_tool` loop with `Math.random` in the page's `pickWork` — read the counts, not screenshots).
- [ ] **Step 5: Docs.** Update STATUS (feature built, tested items, not-verified items such as the copyright position of modern works and third-party clips), TESTING-OWED (developer reviews: sample of credits/notices/prompts, clips from private uploaders, the spin feel on a phone), NEXT-SESSION (branch `art-randomizer`, squash-merge only, nothing pushed), build log, a decision entry (curated pool, standalone page, history in browser, no score), CLAUDE.md architecture line, and a standing rule about running `check-randomizer.js` before committing pool changes.
- [ ] **Step 6: Stop for review.** Tell the developer the feature is complete on the branch, give the preview steps, list items needing their review, and wait for the go-ahead before merging. After approval: squash-merge to `main`, keep `.claude/settings.local.json` unstaged, push, wait for Netlify, verify `https://professortheriault.com/artrandomizer/`, the homepage card, `/ethicslens/`, and the course; update docs.
