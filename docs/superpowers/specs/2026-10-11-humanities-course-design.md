# HUMA 1301 Introduction to the Humanities — Course Design

Date: 2026-10-11 · Status: draft for developer review

## Goal
Convert the current Canvas version of Introduction to the Humanities (`6271-huma-1301-intro-to-the-humanities-i-ss-15970-export.imscc`) into a self-paced Eleventy course at `/huma1301/`, styled like PHIL 1301/2306 but adapted to the subject. Remove all textbook (*The Humanities Through the Arts*) and McGraw Hill Connect references, expand the lighter sections to make up for the missing readings, and add many more artwork examples in every art form. Link the homepage "Introduction to Humanities" card to the course.

## Same rules as the other courses
Self-paced; no Canvas, Connect, due dates, grading weights, or discussion boards; accordions; icon callouts; reflection prompts instead of discussions; 10-question self-study quizzes with instant feedback; Final Paper instead of a final exam.

## Decisions from developer (2026-10-11)
- **13 units**, one per art form/topic (not the 6 two-chapter units of the export).
- **Gallery first, plus Experience It:** each lesson page opens with a Gallery strip, then the lesson, then a hands-on Experience It activity.
- **Warm "museum" palette** (burgundy/charcoal header, gold accents, cream background), same layout and navigation. No grouping of units into families.
- **Readings replaced by** expanded lessons plus 2–4 free "Further Exploration" links per unit.
- **Artwork:** show works as in Canvas, including modern copyrighted works, each with a credit line.
- **Start Here** mirrors PHIL 2306 without the AI-use policy page.
- **Quiz questions** may be replaced with new ones (with feedback) where the existing ones are less vital or where the new artworks warrant more variety.

## Structure

| # | Unit | Source chapter |
|---|---|---|
| 1 | The Humanities: An Introduction | 1 |
| 2 | What Is a Work of Art? | 2 |
| 3 | Being a Critic of the Arts | 3 |
| 4 | Painting | 4 |
| 5 | Sculpture | 5 |
| 6 | Architecture | 6 |
| 7 | Literature | 7 |
| 8 | Theater | 8 |
| 9 | Music | 9 |
| 10 | Dance | 10 |
| 11 | Photography | 11 |
| 12 | Cinema | 12 |
| 13 | Television and Video Art | 13 |

Course sidebar order: Start Here, Units 1–13, Final Paper.

**Start Here (5 pages):** Welcome / Getting Started (overview), Meet Your Instructor, Assessments, Website Orientation Activity, and a short page orienting students to the Gallery / Experience It format (replaces Technical Setup). Dropped: Technical Setup, Support Services, AI policy, Introductions, Scavenger Hunt, Syllabus Quiz, Student Q&A, all due-date reminders, and the two unplaced video pages ("Chapter 1 Presentation", "New Insights: LGBT Community") unless their video fits a lesson.

**Each unit (4 pages, `position` order):**
1. Unit Overview: objectives, short intro, task checklist (from Chapter N Overview).
2. Lesson: Gallery strip (or "Watch & Listen" for Music, Theater, Dance, Cinema, TV), then the lesson in accordions, then Experience It, then Further Exploration links.
3. Reflection prompt (6 adapted from the export's discussions; 7 new).
4. Quiz (10 questions).

**Critic's Practice writing exercises** (a fifth page in the unit): Unit 3 *The Last Supper*, Unit 7 Whitman's "A Noiseless Patient Spider", Unit 11 Stieglitz's *Paula*, adapted from Essays 1–3 as guided, ungraded exercises.

**Final Paper:** new. Replaces the empty Final Exam; the student chooses a work from any unit and writes a critical analysis using the describe / interpret / evaluate approach taught in Unit 3. Prompt drafted for developer review.

## Look and feel
- Shared layouts and scripts reused. The course data file sets a theme flag; shared CSS defines the palette as overrides under that flag so PHIL 1301/2306 are unchanged.
- New shared component: **Gallery** (5–8 thumbnails; click to enlarge with credit and a one-line "what to notice"; keyboard and phone friendly; works with images that fail to load). New JS `course-assets/js/gallery.js`, CSS in `styles.css`.
- **Watch & Listen** uses the same strip with embedded video thumbnails instead of images.
- **Experience It** is a styled callout (new variant of the existing callout) with a work and 3 prompts.

## Content work
- Remove every reference to the textbook, Connect, and McGraw Hill; rewrite sentences such as "the textbook calls this…" to teach the concept directly.
- Chapters 1–6 (1,000–2,700 words) are kept and lightly generalized; Chapters 7–13 (700–1,150 words) are expanded toward the same depth.
- **Images:** keep the export's roughly 25 images with credits. Add new examples per unit from sources I can legitimately obtain (Wikimedia Commons, museum collections). Any work I cannot obtain becomes a labeled gap on a list for the developer, not a silent substitute.
- Videos: keep the 24 YouTube embeds; verify each loads; replace dead ones; add clips for performing-art units.
- Further Exploration: free links only (e.g., museum collection pages, Smarthistory, Poetry Foundation, Project Gutenberg); each link checked before it is added.

## Quizzes
- Start from the 13 chapter question banks (10–16 multiple-choice questions each); keep 10 per unit.
- Rewrite textbook-dependent wording. Replace less vital questions with new ones tied to the added artworks and to material added to the lessons, each with a correct-answer and incorrect-answer feedback pair.
- Write feedback for every question (many banks have none). **All new and previously missing feedback is authored by Claude and flagged for developer review.**
- Spread correct answers across A–D with the existing deterministic shuffle script (`scripts/shuffle-quiz-answers.js`, updated to include `huma1301`).

## Process
- One-shot converter `scripts/convert-huma.js` (modeled on `convert-ethics.js`), then a script to build reflections/quizzes. Not re-run after hand edits.
- Work on a branch `humanities-course`; developer reviews the finished course before anything is merged to `main`.
- Link the homepage Introduction to Humanities card to `/huma1301/` (and remove its "Coming Soon" badge) only when the course is merged.
- Verification: clean build with zero broken links; overflow checks at 390/920/1280px; gallery and quiz tested in the browser; no textbook/Connect strings remain (grep).
- Update `docs/` (STATUS, decisions, build log, NEXT-SESSION) as work proceeds.

## Open items
- Final Paper prompt wording (draft for review).
- Which new artworks can actually be obtained; list of gaps delivered with the course.
- Whether the "Courses" folder name should be `huma1301` (assumed) to match `phil1301`/`phil2306`.
