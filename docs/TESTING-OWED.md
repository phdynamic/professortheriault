# Testing owed

Live checks owed on the developer's machine. Remove an item once confirmed.

## HTTPS on Netlify (added 2026-10-11)
- How: open https://professortheriault.com and https://www.professortheriault.com
- Expect: padlock, no warning; www redirects to the bare domain. If still failing after ~24h: Netlify > Domain management > HTTPS > Verify DNS configuration > Provision certificate.

## Netlify button hidden from visitors (added 2026-10-11)
- How: open professortheriault.com in a private window
- Expect: no Netlify button in the lower right (it should appear only when signed in to Netlify)

## PHIL 2306 quiz feedback review (added 2026-10-11)
- How: read each answer's feedback in the six PHIL 2306 unit quizzes
- Expect: feedback is accurate and in the instructor's voice (all 60 pairs were written by Claude)
