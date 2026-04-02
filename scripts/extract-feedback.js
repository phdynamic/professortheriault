/**
 * extract-feedback.js
 *
 * Extracts per-question correct/incorrect feedback text from Canvas QTI files
 * and merges it into scripts/extracted-content.json.
 *
 * Runs from the website root:
 *   node scripts/extract-feedback.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const SITE_ROOT  = path.resolve(__dirname, '..');
const IMSCC_PATH = path.join(SITE_ROOT, 'sand-box-number-1-phil-1301-export.imscc');
const JSON_PATH  = path.join(__dirname, 'extracted-content.json');
const TEMP_DIR   = path.join(SITE_ROOT, '_temp_feedback');

// ---------------------------------------------------------------------------
// Quiz identifiers (same as extract-quiz-discussions.js)
// ---------------------------------------------------------------------------
const QUIZZES = [
  { unit: 1, id: 'g6a34d8808182f5754dd73d745cfe94ec' },
  { unit: 2, id: 'g1f85c8995425d281e49b37cabf44f0f8' },
  { unit: 3, id: 'g526cfcdb20c5ef6d9d962f6047fcdebc' },
  { unit: 4, id: 'g9ce40a9c88b1ba796c191767a9051ac5' },
  { unit: 5, id: 'gbca66ba76ac64ba5e207ffc772d5dd35' },
  { unit: 6, id: 'ga278ee554e30eed9edcaf3813a108ee1' },
];

// ---------------------------------------------------------------------------
// Minimal XML helpers (no external deps beyond adm-zip)
// ---------------------------------------------------------------------------
function getAllTagText(xml, tagName) {
  const re = new RegExp(
    `<(?:[\\w]+:)?${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/(?:[\\w]+:)?${tagName}>`,
    'g'
  );
  const results = [];
  let m;
  while ((m = re.exec(xml)) !== null) results.push(m[1]);
  return results;
}

function decodeEntities(str) {
  return str
    .replace(/&lt;/g,  '<')
    .replace(/&gt;/g,  '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g,  "'")
    .replace(/&#34;/g,  '"');
}

function stripHtml(str) {
  return str.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Split xml into per-<item> chunks.
 */
function splitItems(xml) {
  const chunks = [];
  const open  = /<item\b[^>]*>/g;
  const close = /<\/item>/g;
  let openMatch;
  while ((openMatch = open.exec(xml)) !== null) {
    const start = openMatch.index;
    close.lastIndex = open.lastIndex;
    const closeMatch = close.exec(xml);
    if (!closeMatch) break;
    chunks.push(xml.slice(start, closeMatch.index + '</item>'.length));
    open.lastIndex = closeMatch.index + '</item>'.length;
  }
  return chunks;
}

/**
 * Parse a QTI XML string, returning an array of:
 *   { correctFeedback: string, incorrectFeedback: string }
 * one entry per question, in order.
 */
function parseFeedbackFromQTI(xmlContent) {
  const items = splitItems(xmlContent);
  return items.map(itemXml => {
    // Find itemfeedback blocks
    const fbRe = /<itemfeedback\b([^>]*)>([\s\S]*?)<\/itemfeedback>/g;
    let correctFeedback   = '';
    let incorrectFeedback = '';
    let m;
    while ((m = fbRe.exec(itemXml)) !== null) {
      const attrs   = m[1];
      const content = m[2];
      // Get the mattext content inside this feedback block
      const mattexts = getAllTagText(content, 'mattext');
      const raw = mattexts[0] || '';
      const text = stripHtml(decodeEntities(raw)).trim();

      if (/ident="correct_fb"/.test(attrs)) {
        correctFeedback = text;
      } else if (/ident="general_incorrect_fb"/.test(attrs)) {
        incorrectFeedback = text;
      }
    }
    return { correctFeedback, incorrectFeedback };
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
(function main() {
  // 1. Load adm-zip
  let AdmZip;
  try {
    AdmZip = require('adm-zip');
  } catch (e) {
    console.error('adm-zip not found. Run: npm install adm-zip');
    process.exit(1);
  }

  // 2. Unzip imscc to temp dir
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

  console.log('Unzipping imscc...');
  const zip = new AdmZip(IMSCC_PATH);
  zip.extractAllTo(TEMP_DIR, true);
  console.log(`  Extracted to ${TEMP_DIR}`);

  // 3. Load existing extracted-content.json
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

  // 4. For each quiz, read QTI, extract feedback, merge
  let totalWithFeedback = 0;
  let totalMissing      = 0;

  for (const quizMeta of QUIZZES) {
    const qtiPath = path.join(TEMP_DIR, 'non_cc_assessments', `${quizMeta.id}.xml.qti`);
    if (!fs.existsSync(qtiPath)) {
      console.warn(`  WARNING: QTI not found for unit ${quizMeta.unit}: ${qtiPath}`);
      continue;
    }

    const xmlContent = fs.readFileSync(qtiPath, 'utf8');
    const feedbackList = parseFeedbackFromQTI(xmlContent);

    // Find the matching quiz in extracted-content.json by unit number
    const quiz = data.quizzes.find(q => q.unit === quizMeta.unit);
    if (!quiz) {
      console.warn(`  WARNING: No quiz found in JSON for unit ${quizMeta.unit}`);
      continue;
    }

    // Match by order — feedbackList[i] corresponds to quiz.questions[i]
    quiz.questions.forEach((question, i) => {
      if (i < feedbackList.length) {
        const fb = feedbackList[i];
        question.correctFeedback   = fb.correctFeedback;
        question.incorrectFeedback = fb.incorrectFeedback;
        if (fb.correctFeedback || fb.incorrectFeedback) {
          totalWithFeedback++;
        } else {
          totalMissing++;
          console.warn(`  WARNING: No feedback for unit ${quizMeta.unit} Q${i + 1}`);
        }
      } else {
        question.correctFeedback   = '';
        question.incorrectFeedback = '';
        totalMissing++;
        console.warn(`  WARNING: feedbackList shorter than questions for unit ${quizMeta.unit} Q${i + 1}`);
      }
    });

    console.log(
      `  Unit ${quizMeta.unit}: merged feedback for ${quiz.questions.length} questions` +
      ` (QTI had ${feedbackList.length} items)`
    );
  }

  // 5. Write updated JSON
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log(`\nWrote updated ${JSON_PATH}`);
  console.log(`Questions with feedback: ${totalWithFeedback}`);
  console.log(`Questions missing feedback: ${totalMissing}`);

  // 6. Clean up temp dir
  console.log('\nCleaning up temp directory...');
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  console.log('  Done.');
})();
