# Art Randomizer — Design

Date: 2026-10-12 · Status: draft for developer review

## Goal
A small game on its own page, `/artrandomizer/`, that goes with the Introduction to the Humanities course and fills the last homepage card slot. A visitor presses **Randomize**, a row of "?" cards spins and slows, and it lands on one random work of art. The visitor then guesses one thing about it, sees the answer with the credit and a short guide to looking, and can follow a link into the matching Humanities unit. A browser-only history lets them return to works they have seen.

## Decisions from developer (2026-10-12)
- **Purpose:** a combination of a prompt to look closely, a doorway into the course, and a challenge.
- **Spin:** a Randomize button. The wheel cycles through "?" cards (never real works), so nothing the visitor wanted can be "passed by," then lands on one work.
- **Challenge:** rotating multiple-choice questions (art form, century, culture or region).
- **No score** at all.
- **History** stored only in the visitor's browser, so people can return to a work.
- **Pool:** curated, built by hand, **at least 15 works for each of the course's ten art forms** (painting, sculpture, architecture, literature, theater, music, dance, photography, cinema, television and video art), so at least 150 works.

## The page
Title "Art Randomizer," in the Humanities palette (burgundy, gold, cream), with a short line of instructions, the wheel, the Randomize button, the work area, and a History panel.

## One round
1. **Randomize.** The work is chosen first (random, skipping the last ten seen). Then the wheel plays: five or so "?" cards scroll sideways, fast, then slower and slower, and stop with the chosen card in the center. Total about 2.5 seconds. The card flips to reveal the work (an image, or an embedded clip for performing arts).
2. **Guess.** One multiple-choice question, picked at random from those the work supports: *Which art form is this?*; *Roughly which century was it made?*; *Which culture or region made it?* The three wrong choices are drawn from other works in the pool.
3. **Reveal.** Right or wrong, with the answer, then: title, creator, date, credit line, a "What to notice" sentence, two or three questions to try, and a link "Explore this in Unit N."
4. **Again.** The Randomize button starts a new round.

Wrong answers do not lock anything and nothing is scored or recorded other than the history below.

## The spin
- Pure CSS/JS; no external libraries. The outcome is decided before the animation starts, so the animation can never change the result.
- Decorative "?" cards only; the animation shows no artwork and no text that hints at the result.
- **Reduced motion:** with `prefers-reduced-motion`, skip the spin; show a brief "Choosing…" state, then the work.
- Screen readers get "Choosing a work" while it spins and the work's title only after the guess.
- The button is disabled while spinning. Keyboard: Enter or Space on the button.

## History
- Stored in the browser (`localStorage`), key `artRandomizerHistory`, max 50 entries, newest first; each entry is a work id and a timestamp.
- Shown as a list of small thumbnails with title and creator. Clicking an entry re-opens that work in the work area (reveal state, with the credit and prompts). A "Clear history" button empties it.
- Works the visitor has seen may show their title in History, since they have already met them.
- If storage is unavailable (private window, blocked), the page works normally without history and says so quietly.

## Data
`artrandomizer/works.json`, one object per work:
`id`, `title`, `creator`, `year` (number; negative for BCE), `yearLabel`, `region` (culture or region label), `form` (one of the ten art forms), `unit` (course unit slug), `media` (`image` with `src`/`alt`, or `video` with a YouTube id), `credit`, `notice`, `prompts` (two or three strings).
Works already in the course reuse their credits, notices, and images; new works get new ones.

## Pool
- About 70 works already exist in the Humanities course with credits and "what to notice" lines; they become the starting pool.
- The rest (at least 80) are new. Sources: Wikimedia Commons and museum open-access collections for images; embedded, verified YouTube clips from official or institutional channels for performing arts; book and manuscript pages for literature. Every new image is downloaded only after the developer approves a batch (work, source, license, size), as with the course. Works that cannot be obtained legitimately go on a gaps list.
- The pool is built and approved one batch of art forms at a time; the page works from the first batch on.
- Question quality: the "century" and "region" questions are only offered when the pool has enough variety for good wrong answers; the art-form question works for every work.

## Technical shape
- A static Eleventy page, `artrandomizer/index.njk`, using the shared base layout and a new course theme flag so it shares the Humanities palette.
- `course-assets/js/randomizer.js` (spin, rounds, history) and a CSS block in `course-assets/css/styles.css`.
- `index.html`: replace nothing; add the last card (title "Art Randomizer") linking to `/artrandomizer/`.
- `scripts/check-randomizer.js`: fails the build step if any work lacks required fields, uses an unknown art form or unit, points to a missing image, has a bad YouTube id, has fewer than 15 works for an art form, or has a duplicate id. Runs before every commit that touches the pool.
- Eleventy passthrough for `artrandomizer/assets` and the JSON file.

## Quality bars
- Phone, tablet, desktop: no sideways scroll; the wheel fits at 390px.
- Keyboard and screen-reader operable; contrast at least 4.5:1.
- Works with JavaScript disabled in a limited way: the page shows an explanatory message and a link to the Humanities course.
- Credits for every work, including modern works shown "as in Canvas" per the developer's earlier decision.

## Process
Spec approved → implementation plan → build on branch `art-randomizer` → fresh whole-branch review → developer review → squash-merge to main (never push the branch history) → live checks. New downloads need the developer's approval per batch. Docs under `docs/` are updated as the work proceeds.

## Open items
- Final page title and card wording (draft: "Art Randomizer", "Spin the wheel and see what you land on: guess the art form, century, or culture, then explore it in the Humanities course.").
- The exact number of "?" cards and spin length (starting values above; tuned in the browser).
- Which new works go into the pool (proposed batch by batch for approval).
