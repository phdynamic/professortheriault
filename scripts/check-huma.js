// Mechanical checks for huma1301 (see docs/superpowers/specs/2026-10-11-humanities-course-design.md).
// Usage: node scripts/check-huma.js [path-fragment]   e.g. node scripts/check-huma.js unit-4
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "huma1301");
const only = process.argv[2];
// "canvas" (the painting surface) is fine; the LMS name is capitalized, so that term is matched case-sensitively.
const BANNED = /textbook|\bin Connect\b|\bConnect (assignment|account|platform|course|login)|McGraw|SmartBook|\bChapter \d|first essay|essay assignment|your essay|due date|this chapter|the figure above/i;
const BANNED_CASE = /\bCanvas\b/;
const LESSON_MIN_WORDS = 1200;
const fails = [];
const fail = (file, msg) => fails.push(`${path.relative(ROOT, file).replace(/\\/g, "/")}: ${msg}`);

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? (e.name === "assets" ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);
const fileFor = (url) => path.join(ROOT, decodeURIComponent(url.split("?")[0]));

for (const file of walk(DIR).filter((f) => f.endsWith(".njk"))) {
  if (only && !file.replace(/\\/g, "/").includes(only)) continue;
  const raw = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const end = raw.indexOf("\n---", 3);
  const fm = raw.slice(0, end);
  const body = raw.slice(end + 4);
  const $ = cheerio.load(body, { decodeEntities: false }, false);
  const text = $.root().text().replace(/\s+/g, " ").trim();
  const name = path.basename(file);

  const banned = (fm + " " + text).match(BANNED) || (fm + " " + text).match(BANNED_CASE);
  if (banned) fail(file, `banned phrase "${banned[0]}"`);

  $("img").each((i, el) => {
    const src = $(el).attr("src") || "";
    if (!$(el).attr("alt")) fail(file, `image without alt: ${src}`);
    if (src.startsWith("/") && !fs.existsSync(fileFor(src))) fail(file, `image file missing: ${src}`);
  });

  $(".gallery__thumb").each((i, el) => {
    if (!$(el).find("img").length) fail(file, `gallery work ${i + 1} has no <img> (gallery.js needs one)`);
    if (!$(el).attr("data-credit")) fail(file, `gallery work ${i + 1} has no data-credit`);
    if (!$(el).attr("data-notice")) fail(file, `gallery work ${i + 1} has no data-notice`);
    const h = $(el).attr("href") || "";
    if (h.startsWith("/") && !fs.existsSync(fileFor(h))) fail(file, `gallery file missing: ${h}`);
    const v = $(el).attr("data-video");
    if (v && !/^[A-Za-z0-9_-]{11}$/.test(v)) fail(file, `bad YouTube id: ${v}`);
  });

  if (name === "lesson.njk") {
    // Lesson words exclude the Gallery, the Experience It activity, and the Further Exploration links.
    const c = cheerio.load(body, { decodeEntities: false }, false);
    c(".gallery").remove();
    c(".callout--experience").filter((i, e) => /Experience It:/.test(c(e).text())).remove();
    c("h3:contains('Further Exploration')").next("ul").remove();
    c("h3:contains('Further Exploration')").remove();
    const words = c.root().text().replace(/\s+/g, " ").trim().split(" ").length;
    if (words < LESSON_MIN_WORDS) fail(file, `lesson has ${words} words (minimum ${LESSON_MIN_WORDS})`);
    if ($(".gallery__thumb[data-video]").length && /Gallery above/.test(text)) fail(file, "Watch & Listen lesson refers to \"the Gallery above\"");
    const n = $(".gallery .gallery__thumb").length;
    if (n < 5 || n > 8) fail(file, `gallery has ${n} works (expected 5-8)`);
    if (!$(".callout--experience").length) fail(file, "no Experience It block");
    if (!/Further Exploration/.test(body)) fail(file, "no Further Exploration section");
    const links = $("h3:contains('Further Exploration')").nextAll().find("a[href^='http']").length
      + $("h3:contains('Further Exploration')").nextAll("a[href^='http']").length;
    if (links < 2 || links > 4) fail(file, `Further Exploration has ${links} links (expected 2-4)`);
  }

  if (name === "quiz.njk") {
    const qs = $(".quiz__question");
    if (qs.length !== 10) fail(file, `quiz has ${qs.length} questions (expected 10)`);
    qs.each((i, q) => {
      const ids = $(q).find("input").map((j, e) => $(e).attr("value")).get();
      if (ids.length < 2) fail(file, `question ${i + 1} has fewer than 2 choices`);
      if (!ids.includes($(q).attr("data-correct"))) fail(file, `question ${i + 1}: data-correct not among choices`);
      ["correct", "incorrect"].forEach((k) => {
        if ($(q).find(`.quiz__feedback--${k}`).text().trim().length < 20) fail(file, `question ${i + 1}: missing ${k} feedback`);
      });
    });
  }

  if (name === "reflection-prompt.njk" && !$("textarea.reflection__textarea").length) fail(file, "reflection has no textarea");
}

if (!only) {
  for (const u of ["unit-3-being-a-critic", "unit-7-literature", "unit-11-photography"]) {
    if (!fs.existsSync(path.join(DIR, u, "critics-practice.njk"))) fail(path.join(DIR, u), "missing critics-practice.njk");
  }
  if (!fs.existsSync(path.join(DIR, "final-paper", "index.njk"))) fail(path.join(DIR, "final-paper"), "missing Final Paper page");
}

console.log(fails.length ? fails.join("\n") + `\n\n${fails.length} problem(s).` : "All checks passed.");
process.exit(fails.length ? 1 : 0);
