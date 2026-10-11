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

t("undated works never get a century question, and their year never supplies a century option", () => {
  const und = Object.assign(W("u", "dance", 1800, "India"), { undated: true });
  const mixed = pool.concat([und]);
  assert.ok(!L.questionKinds(und, mixed).includes("century"));
  assert.ok(L.questionKinds(pool[0], mixed).includes("century"));
  for (let i = 0; i < 100; i++) { const q = L.buildQuestion(pool[i % pool.length], mixed, "century", Math.random); assert.ok(!q.options.includes("18th century") || pool[i % pool.length].year > 1700 && pool[i % pool.length].year <= 1800); }
});

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
