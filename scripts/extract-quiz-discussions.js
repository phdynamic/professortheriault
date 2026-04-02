/**
 * extract-quiz-discussions.js
 *
 * Parses QTI assessment files and IMS discussion topic XML files from the
 * unpacked Canvas course export and writes extracted content to
 * scripts/extracted-content.json.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const BASE   = path.resolve(__dirname, '..', '_temp_extract');
const OUTPUT = path.resolve(__dirname, 'extracted-content.json');

// ---------------------------------------------------------------------------
// Quiz meta: unit number, title, and identifier (= directory/filename stem)
// ---------------------------------------------------------------------------
const QUIZZES = [
  { unit: 1, title: 'Quiz #1: Socrates and Plato',  id: 'g6a34d8808182f5754dd73d745cfe94ec' },
  { unit: 2, title: 'Quiz #2: René Descartes',       id: 'g1f85c8995425d281e49b37cabf44f0f8' },
  { unit: 3, title: 'Quiz #3: David Hume',           id: 'g526cfcdb20c5ef6d9d962f6047fcdebc' },
  { unit: 4, title: 'Quiz #4: G. W. F. Hegel',       id: 'g9ce40a9c88b1ba796c191767a9051ac5' },
  { unit: 5, title: 'Quiz #5: Karl Marx',            id: 'gbca66ba76ac64ba5e207ffc772d5dd35' },
  { unit: 6, title: 'Quiz #6: Jean-Paul Sartre',     id: 'ga278ee554e30eed9edcaf3813a108ee1' },
];

// ---------------------------------------------------------------------------
// Discussion meta: unit number, title, and identifier (= filename stem)
// ---------------------------------------------------------------------------
const DISCUSSIONS = [
  { unit: 1, title: 'Discussion #1: The Examined Life',           id: 'g9edec95d419c481e02aaae145bc23b33' },
  { unit: 2, title: 'Discussion #2: Descartes, Meditations',      id: 'g3484755fd42bf308a43c8a4e3e6f75b4' },
  { unit: 3, title: 'Discussion #3: Hume, Enquiry',               id: 'g90024bdb4c70f711edbf68f611ebbedf' },
  { unit: 4, title: 'Discussion #4: Hegel, History',              id: 'ga9ba17008b02308f03858ee125675301' },
  { unit: 5, title: 'Discussion #5: Marx, Manifesto',             id: 'g5055fad5326567df93dae0504c47f3b0' },
  { unit: 6, title: 'Discussion #6: Sartre, Existentialism',      id: 'gbb1291b1e073aa3fe36c9afb379b4b12' },
];

// ---------------------------------------------------------------------------
// Minimal XML helpers (no external dependencies)
// ---------------------------------------------------------------------------

/**
 * Return the text content of every occurrence of <tagName>…</tagName>
 * in `xml`, including the content of any namespace-prefixed variant.
 * The regex works on the raw (potentially entity-encoded) string.
 */
function getAllTagText(xml, tagName) {
  // Match <tagName ...> or <ns:tagName ...> … </tagName> or </ns:tagName>
  const re = new RegExp(
    `<(?:[\\w]+:)?${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/(?:[\\w]+:)?${tagName}>`,
    'g'
  );
  const results = [];
  let m;
  while ((m = re.exec(xml)) !== null) {
    results.push(m[1]);
  }
  return results;
}

function getFirstTagText(xml, tagName) {
  return getAllTagText(xml, tagName)[0] || '';
}

/** Decode XML character entities and strip HTML tags to get plain text. */
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
 * Get the value of an attribute from the *first* matching tag.
 * e.g. getAttr(xml, 'response_label', 'ident') => '36846'
 */
function getAttr(xml, tagName, attrName) {
  const re = new RegExp(`<(?:[\\w]+:)?${tagName}[^>]+${attrName}="([^"]*)"`, 'i');
  const m = re.exec(xml);
  return m ? m[1] : '';
}

/**
 * Split `xml` into per-item chunks (each <item> … </item> block).
 */
function splitItems(xml) {
  const chunks = [];
  // Use a balanced-tag approach via a simple scanner
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
 * Split xml into per-<response_label> blocks.
 */
function splitResponseLabels(xml) {
  const chunks = [];
  const open  = /<response_label\b[^>]*>/g;
  const close = /<\/response_label>/g;
  let openMatch;
  while ((openMatch = open.exec(xml)) !== null) {
    const start = openMatch.index;
    close.lastIndex = open.lastIndex;
    const closeMatch = close.exec(xml);
    if (!closeMatch) break;
    chunks.push(xml.slice(start, closeMatch.index + '</response_label>'.length));
    open.lastIndex = closeMatch.index + '</response_label>'.length;
  }
  return chunks;
}

// ---------------------------------------------------------------------------
// Parse a QTI file → array of question objects
// ---------------------------------------------------------------------------
function parseQTI(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const questions = [];

  const itemChunks = splitItems(raw);
  for (const itemXml of itemChunks) {
    // ----- Question text -----
    // The question lives in <presentation><material><mattext>…</mattext>
    // which may contain HTML-encoded markup
    const mattextBlocks = getAllTagText(itemXml, 'mattext');
    let questionHtml = '';
    if (mattextBlocks.length > 0) {
      // The first mattext in <presentation> is usually the question
      // Find the one inside <presentation> first
      const presentationMatch = /<presentation[\s\S]*?<\/presentation>/.exec(itemXml);
      if (presentationMatch) {
        const presBlocks = getAllTagText(presentationMatch[0], 'mattext');
        if (presBlocks.length > 0) questionHtml = presBlocks[0];
      }
      if (!questionHtml) questionHtml = mattextBlocks[0];
    }
    // Decode entity-encoded HTML (Canvas stores HTML inside mattext as entities)
    const questionText = decodeEntities(questionHtml).trim();

    // ----- Determine correct answer ident -----
    // <respcondition> that sets SCORE to 100 contains <varequal>IDENT</varequal>
    let correctIdent = '';
    // Find the respcondition block that has setvar SCORE=100
    const respcondRe = /<respcondition[\s\S]*?<\/respcondition>/g;
    let rc;
    while ((rc = respcondRe.exec(itemXml)) !== null) {
      const block = rc[0];
      // Check if this sets score to 100
      if (/setvar[^>]*>100<\/setvar>/.test(block) || /varname="SCORE"[^>]*>[\s]*100/.test(block)) {
        const veMatch = /<varequal[^>]*>([^<]+)<\/varequal>/.exec(block);
        if (veMatch) { correctIdent = veMatch[1].trim(); break; }
      }
      // Also: score="100" attribute on respcondition
      if (/score="100"/.test(block)) {
        const veMatch = /<varequal[^>]*>([^<]+)<\/varequal>/.exec(block);
        if (veMatch) { correctIdent = veMatch[1].trim(); break; }
      }
    }

    // ----- Choices -----
    const choices = [];
    const labelChunks = splitResponseLabels(itemXml);
    for (const labelXml of labelChunks) {
      // Get ident attribute
      const identMatch = /<response_label\b[^>]*\bident="([^"]*)"/.exec(labelXml);
      const ident = identMatch ? identMatch[1] : '';
      // Get text
      const mattexts = getAllTagText(labelXml, 'mattext');
      const choiceRaw = mattexts[0] || '';
      // Choice text is usually plain text, but decode entities just in case
      const choiceText = stripHtml(decodeEntities(choiceRaw)).trim();
      if (choiceText) {
        choices.push({
          text: choiceText,
          correct: ident === correctIdent,
        });
      }
    }

    if (questionText || choices.length) {
      questions.push({ text: questionText, choices });
    }
  }

  return questions;
}

// ---------------------------------------------------------------------------
// Parse a discussion XML file → prompt string (raw HTML)
// ---------------------------------------------------------------------------
function parseDiscussion(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  // The prompt is in <text texttype="text/html"> … </text>
  // which contains entity-encoded HTML
  const textBlocks = getAllTagText(raw, 'text');
  if (!textBlocks.length) return '';
  // Decode the entity-encoded HTML
  return decodeEntities(textBlocks[0]).trim();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const output = { quizzes: [], discussions: [] };

console.log('Extracting quizzes...');
for (const q of QUIZZES) {
  const qtiPath = path.join(BASE, 'non_cc_assessments', `${q.id}.xml.qti`);
  if (!fs.existsSync(qtiPath)) {
    console.warn(`  WARNING: QTI file not found: ${qtiPath}`);
    continue;
  }
  const questions = parseQTI(qtiPath);
  console.log(`  Unit ${q.unit}: "${q.title}" — ${questions.length} questions`);
  output.quizzes.push({
    unit: q.unit,
    title: q.title,
    questions,
  });
}

console.log('\nExtracting discussions...');
for (const d of DISCUSSIONS) {
  const xmlPath = path.join(BASE, `${d.id}.xml`);
  if (!fs.existsSync(xmlPath)) {
    console.warn(`  WARNING: Discussion file not found: ${xmlPath}`);
    continue;
  }
  const prompt = parseDiscussion(xmlPath);
  console.log(`  Unit ${d.unit}: "${d.title}" — ${prompt.length} chars`);
  output.discussions.push({
    unit: d.unit,
    title: d.title,
    prompt,
  });
}

fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2), 'utf8');
console.log(`\nWrote ${OUTPUT}`);

// Summary
const totalQ  = output.quizzes.reduce((s, q) => s + q.questions.length, 0);
const byQuiz  = output.quizzes.map(q => `  Unit ${q.unit}: ${q.questions.length} questions`).join('\n');
console.log(`\nSummary:\n${byQuiz}\n  Total questions: ${totalQ}`);
console.log(`  Discussions: ${output.discussions.length}`);
