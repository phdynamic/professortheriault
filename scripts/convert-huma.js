// One-shot conversion of the HUMA 1301 Canvas export into Eleventy pages under huma1301/.
// Converts each chapter's Overview and Content wiki pages to a unit Overview and Lesson page.
// Applies the PHIL 1301/2306 cleanups at conversion time: accordions, icon callouts, no duplicate
// title header, real lists, Canvas markup removed, only referenced assets copied.

const AdmZip = require("adm-zip");
const cheerio = require("cheerio");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const IMSCC = path.join(ROOT, "6271-huma-1301-intro-to-the-humanities-i-ss-15970-export.imscc");
const SLUG = "huma1301";
const OUT = path.join(ROOT, SLUG);

const UNITS = [
  ["unit-1-the-humanities", "The Humanities: An Introduction", 1],
  ["unit-2-what-is-a-work-of-art", "What Is a Work of Art?", 2],
  ["unit-3-being-a-critic", "Being a Critic of the Arts", 3],
  ["unit-4-painting", "Painting", 4],
  ["unit-5-sculpture", "Sculpture", 5],
  ["unit-6-architecture", "Architecture", 6],
  ["unit-7-literature", "Literature", 7],
  ["unit-8-theater", "Theater", 8],
  ["unit-9-music", "Music", 9],
  ["unit-10-dance", "Dance", 10],
  ["unit-11-photography", "Photography", 11],
  ["unit-12-cinema", "Cinema", 12],
  ["unit-13-television-and-video-art", "Television and Video Art", 13],
];
// [module slug, output page slug ("index" = unit overview), title, source wiki page, fixed position]
const MANIFEST = UNITS.flatMap(([mod, name, n]) => [
  [mod, "index", "Unit " + n + ": Overview", "chapter-" + n + "-overview", 1],
  [mod, "lesson", "Lesson: " + name, "chapter-" + n + "-content", 2],
]);

const ICONS = { concept: "&#128161;", note: "&#8505;&#65039;", connection: "&#10145;&#65039;", experience: "&#128065;&#65039;" };

function normalizeFilename(name) {
  const clean = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9._-]/g, "").replace(/-+/g, "-");
  const ext = path.extname(clean);
  // Windows can't commit very long paths; editor-generated image names run past 140 characters.
  return clean.length <= 60 ? clean : clean.slice(0, 60 - ext.length).replace(/-+$/, "") + ext;
}

const squash = (s) => s.replace(/\s+/g, " ").trim();
const sameText = (a, b) => squash(a).toLowerCase().replace(/[’']/g, "'") === squash(b).toLowerCase().replace(/[’']/g, "'");

// Colors from the Humanities template; anything unrecognized stays a plain div.
function calloutType(style) {
  if (/border-left:[^;]*#d4a843/i.test(style) && /background-color:\s*#faf6f0/i.test(style)) return "experience"; // "Try this" boxes
  if (/border-left:[^;]*#6b1d2a/i.test(style)) return "note";
  if (/border-left:[^;]*#2d6a4f/i.test(style) || /background-color:\s*#eef6f1/i.test(style)) return "connection";
  if (/background-color:\s*#fdf7ec/i.test(style)) return "note";
  return null;
}

function convertPage(html, title, urlBySource, copyAsset) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const body = $("body");

  // Header banner: drop it, keep its most informative line as the subtitle.
  let subtitle = null;
  const header = body.find("div").filter((i, el) => /background-color:\s*#6b1d2a/i.test($(el).attr("style") || "")).first();
  if (header.length && !header.closest("details").length) {
    const h2 = header.find("h2").first().text();
    const italic = header.find("p").filter((i, el) => /font-style:\s*italic/i.test($(el).attr("style") || "")).first().text();
    if (h2 && !sameText(h2, title) && !/^life and context/i.test(squash(h2))) subtitle = squash(h2);
    else if (italic && !sameText(italic, title)) subtitle = squash(italic);
    header.remove();
  }

  // Mark callouts before inline styles are stripped.
  body.find("div[style]").each((i, el) => {
    const t = calloutType($(el).attr("style"));
    if (t) $(el).attr("data-callout", t);
  });

  body.find("[style]").removeAttr("style");
  body.find("*").each((i, el) => {
    for (const name of Object.keys(el.attribs || {})) {
      if (name.startsWith("data-") && name !== "data-callout") $(el).removeAttr(name);
    }
    const id = $(el).attr("id");
    if (id && /^\d+$/.test(id)) $(el).removeAttr("id");
  });
  body.find("[class]").removeAttr("class");

  body.find("h1").each((i, el) => { el.tagName = "h2"; });
  body.find("h1,h2,h3,h4").find("br").first().each((i, el) => { if (!$(el).prev().length) $(el).remove(); });

  // Assets and internal links.
  body.find("img[src]").each((i, el) => {
    const src = $(el).attr("src");
    if (src.includes("$IMS-CC-FILEBASE$")) $(el).attr("src", copyAsset(src, "images", $(el).attr("alt")));
  });
  body.find("a[href]").each((i, el) => {
    let href = $(el).attr("href").replace(/\?canvas_[^"]*$/, "").replace(/[?&]wrap=1$/, "");
    if (href.includes("$IMS-CC-FILEBASE$")) {
      href = copyAsset(href, /\.pdf$/i.test(href.split("?")[0]) ? "handouts" : "images");
    } else if (href.includes("$WIKI_REFERENCE$") || href.includes("$CANVAS_")) {
      const target = decodeURIComponent(href.split("/").pop().split("?")[0]);
      if (urlBySource[target]) href = urlBySource[target];
      else { $(el).replaceWith($(el).html()); return; }
    }
    $(el).attr("href", href);
    if (/^https?:/.test(href)) $(el).attr("target", "_blank").attr("rel", "noopener noreferrer");
  });

  // <details>/<summary> runs become one numbered accordion.
  const groups = [];
  body.find("details").each((i, el) => {
    const prev = $(el).prevAll().filter((j, s) => $(s).text().trim() || $(s).find("img,iframe").length).first();
    const last = groups[groups.length - 1];
    if (last && prev.length && prev[0] === last[last.length - 1]) last.push(el);
    else groups.push([el]);
  });
  for (const group of groups) {
    const items = group.map((el, n) => {
      const label = squash($(el).children("summary").text()).replace(/^[▸►▹]\s*/, "").replace(/^\d+\s*[—–-]\s*/, "");
      $(el).children("summary").remove();
      let inner = $(el).html().trim();
      const kids = $(el).children();
      if (kids.length === 1 && kids.first().is("div") && !kids.first().attr("class") && !kids.first().attr("data-callout")) inner = kids.first().html().trim();
      return `<div class="accordion__item">
  <button class="accordion__header" aria-expanded="false" type="button">
    <span class="accordion__number">${n + 1}</span>
    ${label}
    <span class="accordion__chevron" aria-hidden="true">&#9660;</span>
  </button>
  <div class="accordion__content">
    <div class="accordion__body">
${inner}
    </div>
  </div>
</div>`;
    });
    $(group[0]).before(`<div class="accordion">\n${items.join("\n")}\n</div>`);
    group.forEach((el) => $(el).remove());
  }

  // Callouts get the shared icon component.
  body.find("[data-callout]").each((i, el) => {
    const t = $(el).attr("data-callout");
    $(el).replaceWith(`<div class="callout callout--${t}"><span class="callout__icon" aria-hidden="true">${ICONS[t]}</span><div class="callout__content">${$(el).html()}</div></div>`);
  });

  // Typed bullets ("• item", "— item", "○ item") become real lists. The source writes them three
  // ways: <div>• item</div> runs, <p>• item</p> runs, and divs wrapping those <p>s.
  const bullet = /^[\s ]*(—|–|•|○|‣|-)(\s| |&nbsp;)+/;
  const strongBullet = /^[\s ]*(•|○|‣)/; // dashes alone are too often ordinary sentences
  const isItem = (el) => {
    const $el = $(el);
    if (!(el.tagName === "p" || el.tagName === "div") || $el.attr("class")) return false;
    if (el.tagName === "div" && $el.children("p,div,ul,ol,h2,h3,h4").length) return false;
    return bullet.test($el.text());
  };
  body.find("div").each((i, el) => {
    const kids = $(el).children();
    if (!$(el).attr("class") && kids.length && kids.toArray().every((k) => k.tagName === "p" && isItem(k))) $(el).replaceWith(kids);
  });
  body.find("p, div").each((i, el) => {
    const prev = $(el).prev()[0];
    if (!$(el).parent().length || !isItem(el) || (prev && isItem(prev))) return; // only start at the head of a run
    const run = [el];
    for (let n = $(el).next(); n.length && isItem(n[0]); n = n.next()) run.push(n[0]);
    if (run.length < 2 && !strongBullet.test($(el).text())) return;
    const lis = run.map((d) => `<li>${$(d).html().trim().replace(bullet, "").trim()}</li>`).join("\n");
    $(el).before(`<ul>\n${lis}\n</ul>`);
    run.forEach((d) => $(d).remove());
  });

  // Hero image, video embeds, PDF buttons.
  const hero = body.find("img").first();
  if (hero.length && !hero.closest(".accordion, .callout").length) hero.addClass("page-hero-image");
  body.find("iframe").each((i, el) => {
    const src = $(el).attr("src") || "";
    if (!/youtube/.test(src)) return;
    const p = $(el).parent("p");
    if (p.length && p.children().length === 1) p.replaceWith($(el));
    $(el).attr("src", src.replace("www.youtube.com/embed/", "www.youtube-nocookie.com/embed/"));
    if (!$(el).attr("title")) $(el).attr("title", "Video lecture");
    if (!$(el).parent().hasClass("video-embed")) $(el).wrap('<div class="video-embed"></div>');
  });
  body.find('a[href$=".pdf"]').each((i, el) => {
    if (!/^\//.test($(el).attr("href"))) return;
    $(el).addClass("download-link").append('<span class="download-link__badge">PDF</span>');
    const parent = $(el).parent();
    if (parent.text().trim() === $(el).text().trim()) parent.addClass("download-row");
  });

  body.find("p").filter((i, el) => !$(el).text().replace(/ |&nbsp;/g, "").trim() && !$(el).find("img,iframe").length).remove();

  return { subtitle, html: body.html().trim() };
}

function main() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "huma1301-"));
  new AdmZip(IMSCC).extractAllTo(tmp, true);

  const urlBySource = {};
  for (const [mod, slug, , src] of MANIFEST) urlBySource[src] = `/${SLUG}/${mod}/${slug === "index" ? "" : slug + "/"}`;

  const copied = new Map();
  const copyAsset = (ref, kind, altHint) => {
    const rel = decodeURIComponent(ref.replace(/^\$IMS-CC-FILEBASE\$\/?/, "").split("?")[0]);
    let srcFile = path.join(tmp, "web_resources", rel);
    if (!fs.existsSync(srcFile)) {
      // The export shortens some very long names to "head....ext"; match those by head and extension.
      const dir = path.dirname(srcFile);
      const hit = fs.existsSync(dir) && fs.readdirSync(dir).find((n) => {
        const [head, tail] = n.split("....");
        return tail !== undefined && path.basename(rel).startsWith(head) && path.basename(rel).endsWith(tail);
      });
      if (hit) srcFile = path.join(dir, hit);
    }
    const ext = path.extname(rel).toLowerCase();
    const base = altHint ? altHint.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 55) : "";
    const name = (base || crypto.createHash("sha1").update(rel).digest("hex").slice(0, 10)) + ext;
    const url = "/" + SLUG + "/assets/" + kind + "/" + name;
    if (!copied.has(url)) {
      if (!fs.existsSync(srcFile)) { console.warn("  missing asset:", rel); copied.set(url, false); return url; }
      fs.mkdirSync(path.join(OUT, "assets", kind), { recursive: true });
      fs.copyFileSync(srcFile, path.join(OUT, "assets", kind, name));
      copied.set(url, true);
    }
    return url;
  };

  for (const [mod, slug, title, src, fixedPos] of MANIFEST) {
    const position = fixedPos;
    const raw = fs.readFileSync(path.join(tmp, "wiki_content", src + ".html"), "utf8");
    const { subtitle, html } = convertPage(raw, title, urlBySource, copyAsset);
    const isOverview = slug === "index" && mod !== "start-here";
    const fm = ["---",
      `layout: layouts/${isOverview ? "unit" : "page"}.njk`,
      `title: ${JSON.stringify(title)}`,
      `module: "${mod}"`,
      ...(slug === "index" ? [] : [`breadcrumbTitle: ${JSON.stringify(title)}`]),
      `position: ${position}`,
      "---", ""].join("\n");
    const dir = path.join(OUT, mod);
    fs.mkdirSync(dir, { recursive: true });
    const lead = ""; // the export's banner subtitle is "Chapter N: ...", which the course does not use
    fs.writeFileSync(path.join(dir, `${slug}.njk`), fm + lead + html + "\n");
    console.log(`  ${mod}/${slug}.njk${subtitle ? "  — " + subtitle : ""}`);
  }

  fs.rmSync(tmp, { recursive: true, force: true });
  const ok = [...copied.values()].filter(Boolean).length;
  console.log(`\nConverted ${MANIFEST.length} pages, copied ${ok} assets (${copied.size - ok} missing).`);
}

main();
