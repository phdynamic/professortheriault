/**
 * rebuild-quizzes.js
 *
 * Reads scripts/extracted-content.json and regenerates all 6 quiz .njk pages.
 * Each question now includes .quiz__feedback divs for correct/incorrect feedback.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const JSON_PATH = path.join(__dirname, 'extracted-content.json');

// ---------------------------------------------------------------------------
// Front-matter and file-path config for each quiz
// ---------------------------------------------------------------------------
const QUIZ_META = [
  {
    unit:          1,
    filePath:      path.join(SITE_ROOT, 'phil1301/unit-1-socrates/quiz.njk'),
    frontMatter:   `---
layout: layouts/page.njk
title: "Quiz: Socrates and Plato"
module: "unit-1-socrates"
breadcrumbTitle: "Quiz"
position: 7
tags: unit1
---`,
  },
  {
    unit:          2,
    filePath:      path.join(SITE_ROOT, 'phil1301/unit-2-descartes/quiz.njk'),
    frontMatter:   `---
layout: layouts/page.njk
title: "Quiz: René Descartes"
module: "unit-2-descartes"
breadcrumbTitle: "Quiz"
position: 8
tags: unit2
---`,
  },
  {
    unit:          3,
    filePath:      path.join(SITE_ROOT, 'phil1301/unit-3-hume/quiz.njk'),
    frontMatter:   `---
layout: layouts/page.njk
title: "Quiz: David Hume"
module: "unit-3-hume"
breadcrumbTitle: "Quiz"
position: 6
tags: unit3
---`,
  },
  {
    unit:          4,
    filePath:      path.join(SITE_ROOT, 'phil1301/unit-4-hegel/quiz.njk'),
    frontMatter:   `---
layout: layouts/page.njk
title: "Quiz: G. W. F. Hegel"
module: "unit-4-hegel"
breadcrumbTitle: "Quiz"
position: 7
tags: unit4
---`,
  },
  {
    unit:          5,
    filePath:      path.join(SITE_ROOT, 'phil1301/unit-5-marx/quiz.njk'),
    frontMatter:   `---
layout: layouts/page.njk
title: "Quiz: Karl Marx"
module: "unit-5-marx"
breadcrumbTitle: "Quiz"
position: 7
tags: unit5
---`,
  },
  {
    unit:          6,
    filePath:      path.join(SITE_ROOT, 'phil1301/unit-6-sartre/quiz.njk'),
    frontMatter:   `---
layout: layouts/page.njk
title: "Quiz: Jean-Paul Sartre"
module: "unit-6-sartre"
breadcrumbTitle: "Quiz"
position: 7
tags: unit6
---`,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Escape HTML special chars for attribute values and text content. */
function escHtml(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

/**
 * Convert a question index (0-based) and choice index (0-based) to an id/value
 * like q1a, q1b, ... using letters a-z.
 * questionNum is 1-based.
 */
function choiceId(questionNum, choiceIndex) {
  return `q${questionNum}${'abcdefghijklmnopqrstuvwxyz'[choiceIndex]}`;
}

/**
 * Build the HTML body for one quiz (array of question objects).
 * Each question object has: text, choices[], correctFeedback, incorrectFeedback
 */
function buildQuizBody(questions) {
  const lines = [];

  // Callout
  lines.push(
    '<div class="callout callout--concept">' +
    '<span class="callout__icon" aria-hidden="true">💡</span>' +
    '<div class="callout__content">'
  );
  lines.push(
    '<p><strong>Self-study quiz.</strong> This quiz is for your own review — ' +
    'answers are not recorded. You\'ll get instant feedback and can retake it ' +
    'as many times as you like.</p>'
  );
  lines.push('</div></div>');
  lines.push('');

  // Quiz wrapper + top bar with score tracker and Start Over button
  lines.push('<div class="quiz"><div class="quiz__top-bar"><div class="quiz__score-tracker" style="display:none;"></div><button class="quiz__start-over" type="button" style="display:none;">Start Over</button></div>');

  questions.forEach((q, qi) => {
    const qNum = qi + 1;

    // Determine the correct choice id
    const correctIndex = q.choices.findIndex(c => c.correct);
    const correctValue = correctIndex >= 0 ? choiceId(qNum, correctIndex) : '';

    lines.push(`  <div class="quiz__question" data-correct="${correctValue}">`);

    // Question text — use the raw HTML from the JSON (it may contain tags)
    lines.push(
      `    <div class="quiz__question-text"><span class="quiz__number">${qNum}</span> ${q.text}</div>`
    );

    // Choices
    lines.push('    <ul class="quiz__choices">');
    q.choices.forEach((choice, ci) => {
      const id = choiceId(qNum, ci);
      const name = `q${qNum}`;
      lines.push('      <li class="quiz__choice">');
      lines.push(`        <input type="radio" name="${name}" value="${id}" id="${id}">`);
      lines.push(`        <label for="${id}">${escHtml(choice.text)}</label>`);
      lines.push('      </li>');
    });
    lines.push('    </ul>');

    // Feedback divs (always present; hidden by default)
    const correctFb   = (q.correctFeedback   || '').trim();
    const incorrectFb = (q.incorrectFeedback || '').trim();
    lines.push(
      `    <div class="quiz__feedback quiz__feedback--correct" style="display:none;">${escHtml(correctFb)}</div>`
    );
    lines.push(
      `    <div class="quiz__feedback quiz__feedback--incorrect" style="display:none;">${escHtml(incorrectFb)}</div>`
    );

    lines.push('  </div>');
  });

  // Close quiz wrapper
  lines.push('  ');
  lines.push('');
  lines.push('</div>');
  lines.push('');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

for (const meta of QUIZ_META) {
  const quiz = data.quizzes.find(q => q.unit === meta.unit);
  if (!quiz) {
    console.warn(`WARNING: No quiz data found for unit ${meta.unit}`);
    continue;
  }

  const body = buildQuizBody(quiz.questions);
  const fileContent = meta.frontMatter + '\n\n' + body;

  fs.writeFileSync(meta.filePath, fileContent, 'utf8');
  console.log(`Wrote unit ${meta.unit}: ${meta.filePath} (${quiz.questions.length} questions)`);
}

console.log('\nDone. All quiz pages rebuilt.');
