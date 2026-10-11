// Checks the media behind every work in artrandomizer/works.json: image files exist and are web-sized,
// and every YouTube clip is public and embeddable (oEmbed answers 200). One request at a time.
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const works = JSON.parse(fs.readFileSync(path.join(ROOT, "artrandomizer", "works.json"), "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const fails = [], warns = [];
  for (const w of works) {
    if (w.media.type === "image") {
      const p = path.join(ROOT, decodeURIComponent(w.media.src));
      if (!fs.existsSync(p)) { fails.push(`${w.id}: missing ${w.media.src}`); continue; }
      const kb = fs.statSync(p).size / 1024;
      if (kb > 1200) fails.push(`${w.id}: image is ${kb.toFixed(0)} KB (shrink it)`); else if (kb > 700) warns.push(`${w.id}: ${kb.toFixed(0)} KB`);
    } else {
      try {
        const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${w.media.id}&format=json`, { signal: AbortSignal.timeout(15000) });
        if (r.status !== 200) fails.push(`${w.id}: YouTube oEmbed answered ${r.status}`);
      } catch (e) { fails.push(`${w.id}: YouTube check failed (${e.name})`); }
      await sleep(400);
    }
  }
  warns.forEach((m) => console.log("warn " + m));
  console.log(fails.length ? fails.join("\n") + `\n\n${fails.length} problem(s).` : `All ${works.length} works' media OK.`);
  process.exit(fails.length ? 1 : 0);
})();
