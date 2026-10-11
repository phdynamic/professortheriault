# Standing rules

Recurring technical lessons. Each line points to its source.

- Use straight quotes in HTML attributes; curly quotes silently break CSS classes and iframe src. (868550d, de4f752)
- Regenerating quiz pages from a script overwrote a manual fix; re-check manual edits after any regeneration. (83670be → c327bcf)
- Any .md/.njk/.html file outside docs/ is published by Eleventy; add new root files to the ignores in .eleventy.js before pushing. (a09f486 → a282547)
- Export image names are long tokens that collide when shortened; name copied images from alt text. Large export images must be shrunk (scripts/shrink-images.ps1) and hotlinked images localized before commit. (HUMA 1301 conversion)
- Re-running scripts/build-huma-interactives.js after scripts/shuffle-quiz-answers.js undoes the shuffle (the builder rewrites the quiz files); run them in that order every time. Running the shuffle twice on the same quiz reorders it again. (HUMA 1301 build)
- Check images by looking at them: the export labeled an Ansel Adams photograph "Moonrise" that was a different photograph, and an 84 MB file was a second copy of another image. (HUMA 1301 build)
