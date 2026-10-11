// Reflection prompts and 10-question quizzes for every unit, one file per unit in scripts/huma-content/.
// Quiz choices are written with the correct one first; scripts/shuffle-quiz-answers.js spreads the
// correct answers across A-D afterward. Feedback is written by Claude and awaits the instructor's review.
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "huma-content");
const out = {};
for (const f of fs.readdirSync(dir).filter((n) => /^unit-\d+\.js$/.test(n))) {
  out[Number(f.match(/^unit-(\d+)\.js$/)[1])] = require(path.join(dir, f));
}
module.exports = out;
