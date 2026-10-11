# ProfessorTheriault.com — docs entry point

**Concept:** Personal educational site for Professor Theriault: a homepage of course cards plus self-paced course sites converted from Canvas `.imscc` exports (no Canvas, no due dates, no discussions or exams).

## Reading order
1. `../comments.md` — how these docs are maintained
2. `NEXT-SESSION.txt` — where work was left off
3. `STATUS.md` — what's built, tested, not
4. `TESTING-OWED.md` — live checks owed
5. Decisions and build log as needed (below)

## Routing
| Need | File |
|---|---|
| Current build state | `STATUS.md` |
| Where we left off | `NEXT-SESSION.txt` (update at the end of **every** session) |
| Checks owed on the developer's machine | `TESTING-OWED.md` |
| Why something is the way it is | `DECISIONS.md` → `decisions/<theme>.md` |
| When something happened | `BUILD-LOG.md` → `build-log/<era>.md` |
| Recurring technical lessons | `standing-rules.md` |
| Original April designs/plans | `superpowers/specs/`, `superpowers/plans/` |

## Architecture (rarely changes)
- Eleventy 3 + Nunjucks. Input `.`, output `_site/`, includes `_includes/`. `docs/**` and `comments.md` are excluded from the build.
- Homepage `index.html` is passed through as-is.
- Each course is a folder `<slug>/` with `<slug>.11tydata.json` (course title, modules, page lists → sidebar and landing page). Page front matter: `layout`, `title`, `module`, `breadcrumbTitle`, `position`.
- Shared layouts `_includes/layouts/{base,page,unit,course-home}.njk`; shared assets `/course-assets/{css,js}`.
- `.eleventy.js`: `modulePages` filter (prev/next and unit TOC, sorted by `position`); `wrapTables` transform (tables scroll on phones).
- Courses: `phil1301/` Introduction to Philosophy, `phil2306/` Introduction to Ethics.
- Hosting: Netlify, builds on push to `main` (`netlify.toml`, Node 22). DNS at GoDaddy.

## Working rules (set by developer)
- Ask before pushing to `main` unless the developer has approved going live for that work.
- Never commit `.claude/settings.local.json`, `*.imscc`, or `*.zip`.
- Update `NEXT-SESSION.txt` at the end of every session.
