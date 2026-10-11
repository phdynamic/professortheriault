# Content migration decisions

## One-time Node scripts convert Canvas .imscc exports — 2026-04-02 — `active`
- What: scripts unzip the export and convert wiki pages to Eleventy pages (adm-zip, cheerio, xml2js).
- Why: not stated.
- Source: `superpowers/specs/2026-04-02-content-migration-design.md`, ed93a5d, 646b619

## Conversion scripts are not re-run after hand edits — 2026-10-11 — `active`
- What: once a course is converted and edited by hand, its converter is not re-run; changes go into the pages directly.
- Why: re-running would overwrite manual edits.
- Source: e0c49ca and later commits
