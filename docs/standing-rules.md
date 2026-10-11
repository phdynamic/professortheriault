# Standing rules

Recurring technical lessons. Each line points to its source.

- Use straight quotes in HTML attributes; curly quotes silently break CSS classes and iframe src. (868550d, de4f752)
- Regenerating quiz pages from a script overwrote a manual fix; re-check manual edits after any regeneration. (83670be → c327bcf)
- Any .md/.njk/.html file outside docs/ is published by Eleventy; add new root files to the ignores in .eleventy.js before pushing. (a09f486 → a282547)
