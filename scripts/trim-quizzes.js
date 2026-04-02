#!/usr/bin/env node
/**
 * trim-quizzes.js
 * Removes questions 11-15 (index 10-14) from each unit quiz,
 * leaving exactly 10 questions per quiz.
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const WEBSITE_ROOT = path.resolve(__dirname, '..');
const UNITS = [
  'unit-1-socrates',
  'unit-2-descartes',
  'unit-3-hume',
  'unit-4-hegel',
  'unit-5-marx',
  'unit-6-sartre',
];

function splitFrontMatter(raw) {
  // Front matter is delimited by --- on its own line
  const match = raw.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
  if (match) {
    return { frontMatter: match[1], body: match[2] };
  }
  return { frontMatter: '', body: raw };
}

for (const unit of UNITS) {
  const filePath = path.join(WEBSITE_ROOT, 'phil1301', unit, 'quiz.njk');

  if (!fs.existsSync(filePath)) {
    console.warn(`SKIP: ${filePath} not found`);
    continue;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const { frontMatter, body } = splitFrontMatter(raw);

  // Load just the body into cheerio (no <html>/<body> wrapper)
  const $ = cheerio.load(body, { xmlMode: false, decodeEntities: false }, false);

  const questions = $('.quiz__question');
  const total = questions.length;
  console.log(`${unit}: found ${total} questions`);

  if (total <= 10) {
    console.log(`  -> Already 10 or fewer, skipping.`);
    continue;
  }

  // Remove questions at index 10-14 (11th through 15th)
  questions.slice(10).remove();

  const remaining = $('.quiz__question').length;
  console.log(`  -> Trimmed to ${remaining} questions`);

  // Serialize back — cheerio.load with false (fragment mode) renders via $.html()
  const newBody = $.html();
  const newContent = frontMatter + newBody;

  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`  -> Written: ${filePath}`);
}

console.log('\nDone.');
