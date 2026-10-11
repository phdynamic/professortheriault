# Testing owed

Live checks owed on the developer's machine. Remove an item once confirmed.

## Netlify button hidden from visitors (added 2026-10-11)
- How: open professortheriault.com in a private window
- Expect: no Netlify button in the lower right (it should appear only when signed in to Netlify)

## PHIL 2306 quiz feedback review (added 2026-10-11)
- How: read each answer's feedback in the six PHIL 2306 unit quizzes
- Expect: feedback is accurate and in the instructor's voice (all 60 pairs were written by Claude)

## HUMA 1301 content review (added 2026-10-11)
- How: read each unit's quiz feedback, the reflection prompts, the Final Paper page, and the Further Exploration links
- Expect: accurate, in the instructor's voice; anything wrong gets corrected in scripts/huma-content/unit-NN.js (then rebuild: node scripts/build-huma-interactives.js, then node scripts/shuffle-quiz-answers.js) or in the lesson .njk

## HUMA 1301 Smarthistory links (added 2026-10-11)
- How: open each smarthistory.org link in a normal browser (they are in Units 1, 2, 3 Further Exploration)
- Expect: each opens the named essay; automated checks get a 403 from Smarthistory's bot protection, so these are unverified by machine

## HUMA 1301 third-party clips and credits (added 2026-10-11)
- How: skim docs/huma1301-media.md and the Watch & Listen strips in Units 8-13
- Expect: you are comfortable with the clips that come from private uploaders (Beethoven, Strange Fruit, Ravi Shankar, Graham, Bausch, Citizen Kane opening, Odessa Steps, Viola, Paik) and with the credit lines on modern copyrighted works

## Art Randomizer notices and clips (added 2026-10-12)
- How: spin a few dozen times; read the notice and "Try this" prompts; skim docs/artrandomizer-media.md for the clips and images
- Expect: the descriptions are accurate to what you know of each work (clips were not watched by Claude), and you are comfortable with the third-party clips and the credits
