#!/usr/bin/env node
/**
 * generate-interactives.js
 * Reads extracted-content.json and generates quiz and reflection-prompt pages
 * for each unit, plus updates course.json with the new pages.
 */

const fs = require('fs');
const path = require('path');

// ─── Paths ─────────────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, '..');
const CONTENT_FILE = path.join(__dirname, 'extracted-content.json');
const COURSE_JSON = path.join(ROOT, 'phil1301/_data/course.json');

// ─── Load data ──────────────────────────────────────────────────────────────
const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
const course = JSON.parse(fs.readFileSync(COURSE_JSON, 'utf8'));

// ─── Unit configuration ─────────────────────────────────────────────────────
// Maps unit number → { slug, tags, reflectionPos, quizPos }
const UNIT_CONFIG = {
  1: { slug: 'unit-1-socrates',  tags: 'unit1', reflectionPos: 6, quizPos: 7 },
  2: { slug: 'unit-2-descartes', tags: 'unit2', reflectionPos: 7, quizPos: 8 },
  3: { slug: 'unit-3-hume',      tags: 'unit3', reflectionPos: 5, quizPos: 6 },
  4: { slug: 'unit-4-hegel',     tags: 'unit4', reflectionPos: 6, quizPos: 7 },
  5: { slug: 'unit-5-marx',      tags: 'unit5', reflectionPos: 6, quizPos: 7 },
  6: { slug: 'unit-6-sartre',    tags: 'unit6', reflectionPos: 6, quizPos: 7 },
};

// ─── Fallback Sartre quiz questions ─────────────────────────────────────────
// The extracted data for unit 6 is corrupted (all duplicate). These are
// replacement questions based on the unit 6 reading material.
const SARTRE_QUESTIONS = [
  {
    text: '<div><p>Sartre\'s lecture "Existentialism Is a Humanism" opens with the claim that "existence precedes essence." What does he mean by this?</p></div>',
    choices: [
      { text: 'Humans are defined by their biological nature before they are born.', correct: false },
      { text: 'There is no pre-given human nature — we first exist, then define ourselves through our choices.', correct: true },
      { text: 'The physical world existed before human consciousness came into being.', correct: false },
      { text: 'Our existence in the world is more certain than our understanding of who we are.', correct: false },
    ]
  },
  {
    text: '<div><p>Sartre uses the example of a paper-knife (a letter opener) to illustrate "essence precedes existence." What point is he making?</p></div>',
    choices: [
      { text: 'Manufactured objects are more reliable than human beings because their purpose is fixed.', correct: false },
      { text: 'For artifacts, the maker\'s conception (essence) precedes and determines the thing\'s existence — but humans have no maker who designed them with a purpose.', correct: true },
      { text: 'Human beings, like paper-knives, are defined by the uses society assigns to them.', correct: false },
      { text: 'God created humans the way an artisan creates tools — with a definite purpose in mind.', correct: false },
    ]
  },
  {
    text: '<div><p>When Sartre says humans are "condemned to be free," what does he mean?</p></div>',
    choices: [
      { text: 'Freedom is a punishment — humans would prefer to have their choices made for them.', correct: false },
      { text: 'We cannot choose not to choose — even refusing to decide is itself a decision — so freedom is inescapable and with it comes total responsibility.', correct: true },
      { text: 'Political freedom is the highest human value, and we are obligated to fight for it.', correct: false },
      { text: 'God condemned humans to freedom as a consequence of the Fall.', correct: false },
    ]
  },
  {
    text: '<div><p>Sartre describes a waiter who plays at being a waiter — mimicking the role with exaggerated precision. What does this example illustrate?</p></div>',
    choices: [
      { text: 'Some people are naturally suited to service roles and should embrace them.', correct: false },
      { text: 'Professional identity is a form of self-knowledge that Sartre admires.', correct: false },
      { text: 'Bad faith — the self-deception of pretending that one\'s role or situation determines one\'s identity, denying one\'s radical freedom.', correct: true },
      { text: 'The alienation of labor under capitalism, as Marx described it.', correct: false },
    ]
  },
  {
    text: '<div><p>According to Sartre, what is "bad faith" (<em>mauvaise foi</em>)?</p></div>',
    choices: [
      { text: 'Dishonesty toward others — lying to avoid consequences.', correct: false },
      { text: 'A religious concept referring to insincere belief or hypocrisy.', correct: false },
      { text: 'The self-deception by which a person denies their own freedom, treating themselves as a fixed thing rather than a free being.', correct: true },
      { text: 'Acting against one\'s own moral principles under social pressure.', correct: false },
    ]
  },
  {
    text: '<div><p>Sartre responds to critics who call existentialism "quietist" — meaning it leads to passive acceptance. What is his response?</p></div>',
    choices: [
      { text: 'He accepts the charge but argues that individual authenticity is more important than political action.', correct: false },
      { text: 'He denies it: since humans are what they do, existentialism demands action — there is no human nature apart from what we make of ourselves through engagement.', correct: true },
      { text: 'He agrees that existentialism is primarily a private philosophy and not a guide to political life.', correct: false },
      { text: 'He argues that political quietism is itself an authentic choice and therefore acceptable.', correct: false },
    ]
  },
  {
    text: '<div><p>Sartre argues that in choosing for ourselves, we also choose for all humanity. What does he mean by this?</p></div>',
    choices: [
      { text: 'Our individual choices automatically change social norms and institutions for everyone.', correct: false },
      { text: 'When we choose, we implicitly endorse an image of what a human being should be — and this image applies universally, making every choice a statement about what all people ought to do.', correct: true },
      { text: 'Sartre believes in a collective human will that overrides individual decision-making.', correct: false },
      { text: 'We are morally required to consult others before making major decisions.', correct: false },
    ]
  },
  {
    text: '<div><p>What does Sartre mean when he says that "anguish" is the characteristic feeling of authentic existence?</p></div>',
    choices: [
      { text: 'Authentic people suffer more than those in bad faith because they see reality clearly.', correct: false },
      { text: 'Anguish is the recognition that our choices are total and that there is no external authority — God, nature, or reason — that relieves us of responsibility.', correct: true },
      { text: 'Existentialism produces psychological distress, which Sartre sees as unavoidable but regrettable.', correct: false },
      { text: 'The anguish of freedom can be overcome through political commitment and solidarity.', correct: false },
    ]
  },
  {
    text: '<div><p>Sartre uses the example of a student torn between staying to care for his mother and leaving to join the French Resistance. What does this case demonstrate about his ethics?</p></div>',
    choices: [
      { text: 'Family obligations always outweigh political ones in Sartre\'s view.', correct: false },
      { text: 'Ethical theories like Kantianism can resolve such dilemmas if applied correctly.', correct: false },
      { text: 'No moral system can make the choice for us — the student must choose, and in choosing, creates the values by which the choice is made; only after acting does its meaning become clear.', correct: true },
      { text: 'Resistance to fascism is always the right choice because it serves humanity.', correct: false },
    ]
  },
  {
    text: '<div><p>Sartre says that existentialism is a form of humanism. How does he define the humanism he has in mind?</p></div>',
    choices: [
      { text: 'Humanism holds that human beings are the measure of all things and that reason alone guides ethics.', correct: false },
      { text: 'Humanism celebrates human achievement and the dignity of human culture across history.', correct: false },
      { text: 'The humanism Sartre endorses is the view that humans are self-creating — there is no fixed human essence, only what we make of ourselves — and that this places unlimited responsibility on each person.', correct: true },
      { text: 'Humanism is the belief that humans can perfect themselves through education and rational self-improvement.', correct: false },
    ]
  },
  {
    text: '<div><p>One major objection to Sartre\'s existentialism is that radical freedom ignores the constraints placed on individuals by their social circumstances — race, class, poverty. What is the force of this objection?</p></div>',
    choices: [
      { text: 'Sartre\'s view implies that everyone has equal freedom, which ignores how structural inequalities limit real choices.', correct: true },
      { text: 'Sartre denies that social circumstances exist, which is empirically false.', correct: false },
      { text: 'The objection only applies to Sartre\'s early work; his later writings incorporate social constraints.', correct: false },
      { text: 'The objection is based on a misreading — Sartre explicitly acknowledges economic limits on freedom.', correct: false },
    ]
  },
  {
    text: '<div><p>Sartre claims that human beings are "nothing but" what they make of themselves (<em>l\'homme n\'est rien d\'autre que ce qu\'il se fait</em>). What does this deny?</p></div>',
    choices: [
      { text: 'That humans have emotions or bodily needs.', correct: false },
      { text: 'That humans exist in a social world with other people.', correct: false },
      { text: 'Any fixed human nature, divine purpose, biological destiny, or social role that determines who we fundamentally are.', correct: true },
      { text: 'That humans can have consistent values over the course of a lifetime.', correct: false },
    ]
  },
  {
    text: '<div><p>Sartre\'s concept of "facticity" refers to the given facts of one\'s situation — one\'s body, history, social position. How does facticity relate to freedom in his view?</p></div>',
    choices: [
      { text: 'Facticity determines freedom: the more favorable your situation, the more free you are.', correct: false },
      { text: 'Facticity is the raw material freedom acts upon — we cannot change the facts of our situation, but we are always free in how we respond to and interpret them.', correct: true },
      { text: 'Facticity is an illusion — the self is entirely free from any constraints.', correct: false },
      { text: 'Facticity replaces freedom: once one\'s situation is fully understood, the correct choice becomes apparent.', correct: false },
    ]
  },
  {
    text: '<div><p>How does Sartre\'s existentialism differ from Hegel\'s view of freedom as developed in this course?</p></div>',
    choices: [
      { text: 'For Hegel, freedom is realized collectively through history and institutions; for Sartre, freedom is always individual and cannot be delegated to any collective process.', correct: true },
      { text: 'Hegel believes freedom is an illusion; Sartre believes it is real.', correct: false },
      { text: 'Both Hegel and Sartre agree that individual freedom is the highest value, but differ on how to achieve it.', correct: false },
      { text: 'Sartre agrees with Hegel\'s account of freedom but applies it to individual psychology rather than history.', correct: false },
    ]
  },
  {
    text: '<div><p>Sartre argues that we cannot escape responsibility by appealing to passion — claiming we were "swept away" and couldn\'t help ourselves. Why not?</p></div>',
    choices: [
      { text: 'Passions are not real — they are performances we put on to justify our choices after the fact.', correct: false },
      { text: 'Because we are the ones who allow our passions to have authority over us; we choose to give them weight, and this choice is itself an exercise of freedom.', correct: true },
      { text: 'Passions are morally irrelevant — only rational deliberation counts as genuine decision-making.', correct: false },
      { text: 'Legal systems punish passion-driven acts as harshly as premeditated ones, and Sartre follows legal precedent.', correct: false },
    ]
  },
];

// ─── HTML helpers ───────────────────────────────────────────────────────────

/**
 * Strip inline styles, tables (rubrics), and Canvas instructions from HTML.
 * Keep the philosophical content intact.
 */
function cleanDiscussionHTML(html) {
  // Remove inline style attributes
  let cleaned = html.replace(/\s*style="[^"]*"/gi, '');

  // Remove <table>...</table> blocks (grading rubrics)
  cleaned = cleaned.replace(/<table[\s\S]*?<\/table>/gi, '');

  // Remove the dark-blue header banner div that contains unit/course labels
  // It starts with a div containing h2 and a "Unit X — Discussion" paragraph
  // We'll keep the h2 content but strip the wrapper
  cleaned = cleaned.replace(/<div[^>]*>\s*<p[^>]*>(?:Unit \d+|PHIL 1301)[^<]*<\/p>\s*<h2[^>]*>([\s\S]*?)<\/h2>(?:\s*<p[^>]*>[\s\S]*?<\/p>)?\s*<\/div>/gi, '<h2>$1</h2>');

  // Remove outer wrapper div
  cleaned = cleaned.replace(/^<div[^>]*>\s*/i, '');
  cleaned = cleaned.replace(/\s*<\/div>\s*$/i, '');

  // Remove "How to Post" / submission instruction blocks
  // Look for common Canvas instruction patterns
  cleaned = cleaned.replace(/<(?:div|p)[^>]*>(?:\s*<(?:strong|b)>)?(?:How to post|To receive full credit|Submission instructions?|Grading|Rubric|Discussion requirements?|Minimum word count|Reply requirements?)[\s\S]*?(?=<(?:h[1-6]|p style=|div style=|$))/gi, '');

  // Strip word count / reply requirement sentences
  cleaned = cleaned.replace(/<p[^>]*>[^<]*(?:word[s]?|repl(?:y|ies)|respond|initial post|response)[^<]*<\/p>/gi, '');

  // Remove empty divs and paragraphs
  cleaned = cleaned.replace(/<(?:div|p)[^>]*>\s*<\/(?:div|p)>/gi, '');

  // Collapse excessive whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

  return cleaned;
}

/**
 * Build quiz HTML for one unit's questions.
 */
function buildQuizHTML(questions) {
  const lines = [];
  lines.push('<div class="quiz">');

  questions.forEach(function(q, qi) {
    const qNum = qi + 1;
    // Find correct choice index
    const correctIdx = q.choices.findIndex(c => c.correct);
    const correctId = 'q' + qNum + String.fromCharCode(97 + correctIdx); // e.g. q1b

    lines.push('  <div class="quiz__question" data-correct="' + correctId + '">');
    lines.push('    <div class="quiz__question-text"><span class="quiz__number">' + qNum + '</span> ' + q.text + '</div>');
    lines.push('    <ul class="quiz__choices">');

    q.choices.forEach(function(choice, ci) {
      const letter = String.fromCharCode(97 + ci); // a, b, c, d
      const choiceId = 'q' + qNum + letter;
      lines.push('      <li class="quiz__choice">');
      lines.push('        <input type="radio" name="q' + qNum + '" value="' + choiceId + '" id="' + choiceId + '">');
      lines.push('        <label for="' + choiceId + '">' + choice.text + '</label>');
      lines.push('      </li>');
    });

    lines.push('    </ul>');
    lines.push('  </div>');
  });

  lines.push('  <button class="quiz__submit" type="button">Check Answers</button>');
  lines.push('  <div class="quiz__results"></div>');
  lines.push('</div>');

  return lines.join('\n');
}

/**
 * Callout block for quiz pages.
 */
const QUIZ_CALLOUT = `<div class="callout callout--concept"><span class="callout__icon" aria-hidden="true">💡</span><div class="callout__content">
<p><strong>Self-study quiz.</strong> This quiz is for your own review — answers are not recorded. You'll get instant feedback and can retake it as many times as you like.</p>
</div></div>`;

// ─── Generate pages ─────────────────────────────────────────────────────────

const PHILOSOPHER_NAMES = {
  1: 'Socrates and Plato',
  2: 'René Descartes',
  3: 'David Hume',
  4: 'G. W. F. Hegel',
  5: 'Karl Marx',
  6: 'Jean-Paul Sartre',
};

content.quizzes.forEach(function(quiz) {
  const unitNum = quiz.unit;
  const cfg = UNIT_CONFIG[unitNum];
  if (!cfg) return;

  const unitDir = path.join(ROOT, 'phil1301', cfg.slug);
  if (!fs.existsSync(unitDir)) {
    fs.mkdirSync(unitDir, { recursive: true });
  }

  // Use fallback questions for Sartre (unit 6) — data is corrupted
  const questions = (unitNum === 6) ? SARTRE_QUESTIONS : quiz.questions;

  // ── Quiz page ──────────────────────────────────────────────────────────
  const quizFrontMatter = [
    '---',
    'layout: layouts/page.njk',
    'title: "Quiz: ' + PHILOSOPHER_NAMES[unitNum] + '"',
    'module: "' + cfg.slug + '"',
    'breadcrumbTitle: "Quiz"',
    'position: ' + cfg.quizPos,
    'tags: ' + cfg.tags,
    '---',
    '',
  ].join('\n');

  const quizBody = QUIZ_CALLOUT + '\n\n' + buildQuizHTML(questions);
  fs.writeFileSync(path.join(unitDir, 'quiz.njk'), quizFrontMatter + quizBody + '\n');
  console.log('Wrote quiz.njk for unit', unitNum, '(' + questions.length + ' questions)');
});

content.discussions.forEach(function(discussion) {
  const unitNum = discussion.unit;
  const cfg = UNIT_CONFIG[unitNum];
  if (!cfg) return;

  const unitDir = path.join(ROOT, 'phil1301', cfg.slug);

  // ── Reflection prompt page ─────────────────────────────────────────────
  const cleanedPrompt = cleanDiscussionHTML(discussion.prompt);

  const reflFrontMatter = [
    '---',
    'layout: layouts/page.njk',
    'title: "Reflection Prompt"',
    'module: "' + cfg.slug + '"',
    'breadcrumbTitle: "Reflection Prompt"',
    'position: ' + cfg.reflectionPos,
    'tags: ' + cfg.tags,
    '---',
    '',
  ].join('\n');

  const reflBody = [
    '<div class="reflection">',
    '  <div class="reflection__prompt">',
    cleanedPrompt,
    '  </div>',
    '  <h3>Your Reflection</h3>',
    '  <textarea class="reflection__textarea" placeholder="Write your reflection here..."></textarea>',
    '  <p class="reflection__note">This is a thinking space — your response is not saved or submitted. Copy your work if you want to keep it.</p>',
    '</div>',
  ].join('\n');

  fs.writeFileSync(path.join(unitDir, 'reflection-prompt.njk'), reflFrontMatter + reflBody + '\n');
  console.log('Wrote reflection-prompt.njk for unit', unitNum);
});

// ─── Update course.json ─────────────────────────────────────────────────────

const newPages = {
  'unit-1-socrates':  [{ slug: 'reflection-prompt', title: 'Reflection Prompt' }, { slug: 'quiz', title: 'Quiz' }],
  'unit-2-descartes': [{ slug: 'reflection-prompt', title: 'Reflection Prompt' }, { slug: 'quiz', title: 'Quiz' }],
  'unit-3-hume':      [{ slug: 'reflection-prompt', title: 'Reflection Prompt' }, { slug: 'quiz', title: 'Quiz' }],
  'unit-4-hegel':     [{ slug: 'reflection-prompt', title: 'Reflection Prompt' }, { slug: 'quiz', title: 'Quiz' }],
  'unit-5-marx':      [{ slug: 'reflection-prompt', title: 'Reflection Prompt' }, { slug: 'quiz', title: 'Quiz' }],
  'unit-6-sartre':    [{ slug: 'reflection-prompt', title: 'Reflection Prompt' }, { slug: 'quiz', title: 'Quiz' }],
};

course.modules.forEach(function(mod) {
  if (newPages[mod.slug]) {
    // Remove any existing reflection-prompt or quiz entries (idempotent)
    mod.pages = mod.pages.filter(p => p.slug !== 'reflection-prompt' && p.slug !== 'quiz');
    mod.pages = mod.pages.concat(newPages[mod.slug]);
  }
});

// Update Final Exam → Final Paper title (idempotent)
course.modules.forEach(function(mod) {
  if (mod.slug === 'final-exam') {
    mod.title = 'Final Paper';
    mod.icon = '&#128196;';
    mod.description = 'Final paper assignment covering one philosopher from the course.';
    mod.pages = mod.pages.map(p => p.slug === 'index' ? { slug: 'index', title: 'Final Paper' } : p);
  }
});

fs.writeFileSync(COURSE_JSON, JSON.stringify(course, null, 2) + '\n');
console.log('Updated course.json');
console.log('Done.');
