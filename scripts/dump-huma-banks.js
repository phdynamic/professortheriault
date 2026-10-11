// Dumps the 13 chapter question banks from the HUMA 1301 export to scripts/huma-banks.json
// so questions can be triaged (kept, rewritten, replaced) when writing scripts/huma-content.js.
const AdmZip = require("adm-zip");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const zip = new AdmZip(path.join(ROOT, "6271-huma-1301-intro-to-the-humanities-i-ss-15970-export.imscc"));
const plain = (h) => cheerio.load(h).text().replace(/\s+/g, " ").trim();
const out = {};

for (const e of zip.getEntries().filter((x) => /^non_cc_assessments\/.*\.qti$/.test(x.entryName))) {
  const $ = cheerio.load(e.getData().toString("utf8"), { xmlMode: true });
  const title = $("fieldlabel:contains('bank_title')").next().text().trim();
  const m = title.match(/^Chapter (\d+)$/);
  if (!m) continue;
  out[m[1]] = $("item").toArray().map((item) => {
    const type = $(item).find("fieldlabel:contains('question_type')").next().text().trim();
    const correct = $(item).find("respcondition").toArray().find((r) => $(r).find("setvar").text().trim() === "100");
    const correctId = $(correct).find("varequal").text().trim();
    const text = plain($(item).find("presentation > material mattext").first().text());
    return {
      type,
      text,
      feedback: $(item).find("itemfeedback").toArray().map((f) => plain($(f).find("mattext").text())).filter(Boolean),
      choices: $(item).find("response_label").toArray().map((l) => ({
        text: plain($(l).find("mattext").text()),
        correct: $(l).attr("ident") === correctId,
      })),
      flags: [
        type !== "multiple_choice_question" ? "NOT-SINGLE-CHOICE" : "",
        /textbook|chapter|figure|image|pictured|shown above|reading/i.test(text) ? "REWRITE" : "",
      ].filter(Boolean),
    };
  });
}

fs.writeFileSync(path.join(ROOT, "scripts", "huma-banks.json"), JSON.stringify(out, null, 2));
console.log(Object.entries(out).map(([k, v]) => `Chapter ${k}: ${v.length} questions, ${v.filter((q) => q.flags.length).length} flagged`).join("\n"));
