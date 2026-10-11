// Writes reflection-prompt.njk and quiz.njk for each unit in huma-content.js, and the Final Paper page.
// Run this BEFORE scripts/shuffle-quiz-answers.js; running it afterward undoes the shuffle.
const fs = require("fs");
const path = require("path");
const content = require("./huma-content.js");
const { FINAL_PAPER } = require("./huma-final-paper.js");

const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "huma1301");
const UNITS = [
  ["unit-1-the-humanities", "The Humanities: An Introduction"], ["unit-2-what-is-a-work-of-art", "What Is a Work of Art?"],
  ["unit-3-being-a-critic", "Being a Critic of the Arts"], ["unit-4-painting", "Painting"], ["unit-5-sculpture", "Sculpture"],
  ["unit-6-architecture", "Architecture"], ["unit-7-literature", "Literature"], ["unit-8-theater", "Theater"],
  ["unit-9-music", "Music"], ["unit-10-dance", "Dance"], ["unit-11-photography", "Photography"],
  ["unit-12-cinema", "Cinema"], ["unit-13-television-and-video-art", "Television and Video Art"],
];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const frontMatter = (title, mod, crumb, position) =>
  `---\nlayout: layouts/page.njk\ntitle: ${JSON.stringify(title)}\nmodule: "${mod}"\nbreadcrumbTitle: ${JSON.stringify(crumb)}\nposition: ${position}\n---\n`;
const nextNav = (href, title) => `<nav class="page-nav" aria-label="Page navigation" style="margin-top: 2.5rem;">
  <a href="${href}" class="page-nav__link page-nav__link--next page-nav__link--filled">
    <span class="page-nav__label">Next &rarr;</span>
    <span class="page-nav__title">${title}</span>
  </a>
</nav>`;

function reflection(r) {
  return `<div class="reflection">
  <div class="reflection__prompt">
<h2>${r.title}</h2>
<p><em>${r.subtitle}</em></p>
${r.html}
  </div>
  <h3>Your Reflection</h3>
  <textarea class="reflection__textarea" placeholder="Write your reflection here..."></textarea>
  <p class="reflection__note">This is a thinking space — your response is not saved or submitted. Copy your work if you want to keep it.</p>
</div>`;
}

function quiz(questions) {
  const qs = questions.map((q, i) => {
    const n = i + 1;
    const ids = q.choices.map((c, j) => `q${n}${"abcd"[j]}`);
    const correctId = ids[q.choices.findIndex((c) => c.correct)];
    const choices = q.choices.map((c, j) => `      <li class="quiz__choice">
        <input type="radio" name="q${n}" value="${ids[j]}" id="${ids[j]}">
        <label for="${ids[j]}">${esc(c.text)}</label>
      </li>`).join("\n");
    return `  <div class="quiz__question" data-correct="${correctId}">
    <div class="quiz__question-text"><span class="quiz__number">${n}</span> ${esc(q.text)}</div>
    <ul class="quiz__choices">
${choices}
    </ul>
    <div class="quiz__feedback quiz__feedback--correct" style="display:none;">${esc(q.right)}</div>
    <div class="quiz__feedback quiz__feedback--incorrect" style="display:none;">${esc(q.wrong)}</div>
  </div>`;
  });
  return `<div class="callout callout--concept"><span class="callout__icon" aria-hidden="true">&#128161;</span><div class="callout__content">
<p><strong>Self-study quiz.</strong> This quiz is for your own review — answers are not recorded. You’ll get instant feedback on each question.</p>
</div></div>

<div class="quiz"><div class="quiz__top-bar"><div class="quiz__score-tracker" style="display:none;"></div><button class="quiz__start-over" type="button" style="display:none;">Start Over</button></div>
${qs.join("\n")}
</div>`;
}

UNITS.forEach(([slug, name], i) => {
  const n = i + 1;
  const c = content[n];
  if (!c) return;
  const dir = path.join(DIR, slug);
  const next = UNITS[i + 1];
  const nav = next
    ? nextNav(`/huma1301/${next[0]}/`, `Continue to Unit ${n + 1}: ${next[1]}`)
    : nextNav("/huma1301/final-paper/", "Continue to Final Paper");
  fs.writeFileSync(path.join(dir, "reflection-prompt.njk"), frontMatter("Reflection Prompt", slug, "Reflection Prompt", 4) + reflection(c.reflection) + "\n");
  fs.writeFileSync(path.join(dir, "quiz.njk"), frontMatter(`Quiz: ${name}`, slug, "Quiz", 5) + quiz(c.quiz) + "\n\n" + nav + "\n");
  console.log(`Unit ${n}: reflection + ${c.quiz.length}-question quiz`);
});

fs.mkdirSync(path.join(DIR, "final-paper"), { recursive: true });
fs.writeFileSync(path.join(DIR, "final-paper", "index.njk"), `---\nlayout: layouts/page.njk\ntitle: "Final Paper"\nmodule: "final-paper"\nposition: 1\n---\n\n${FINAL_PAPER}`);
console.log("Final Paper written.");
