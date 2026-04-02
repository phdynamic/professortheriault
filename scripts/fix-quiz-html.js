const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const SITE_ROOT = path.resolve(__dirname, "..");
const DIRS = [
  "phil1301/unit-1-socrates",
  "phil1301/unit-2-descartes",
  "phil1301/unit-3-hume",
  "phil1301/unit-4-hegel",
  "phil1301/unit-5-marx",
  "phil1301/unit-6-sartre",
];

for (const dir of DIRS) {
  const filePath = path.join(SITE_ROOT, dir, "quiz.njk");
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, "utf-8");
  const parts = content.split("---");
  if (parts.length < 3) continue;
  const frontMatter = "---" + parts[1] + "---";
  const body = parts.slice(2).join("---");

  const $ = cheerio.load(body, { decodeEntities: false });

  // Remove submit button and results div
  $(".quiz__submit").remove();
  $(".quiz__results").remove();

  // Add score tracker after opening .quiz div
  $(".quiz").prepend('<div class="quiz__score-tracker" style="display:none;"></div>');

  // Add clear button to each question
  $(".quiz__question").each(function () {
    $(this).find(".quiz__choices").after('<button class="quiz__clear" type="button" style="display:none;">Clear</button>');
  });

  const newBody = $("body").html() || $.html();
  fs.writeFileSync(filePath, frontMatter + "\n\n" + newBody.trim() + "\n", "utf-8");
  console.log("Fixed: " + dir + "/quiz.njk");
}
console.log("Done.");
