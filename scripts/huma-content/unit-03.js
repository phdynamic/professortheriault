const q = require("./q");

module.exports = {
  reflection: {
    title: "You Are Already a Critic",
    subtitle: "Practicing description, interpretation, and evaluation on something you chose",
    html: `<p>Every time you skip a song, stop scrolling because an image catches your attention, or tell a friend a film was worth seeing, you are making a critical judgment. What this unit gives you is a method for doing it well: <strong>describe</strong> what is there, <strong>interpret</strong> what it means, and <strong>evaluate</strong> how good it is, in that order.</p>
<div class="callout callout--concept"><span class="callout__icon" aria-hidden="true">&#128161;</span><div class="callout__content">
<p><strong>The prompt</strong></p>
<p>Choose a single work that you can look at or listen to again right now: a song, a short film clip, a painting or photograph, a building you pass often, or a poem. Spend a few minutes with it, then write three short paragraphs:</p>
<ol>
<li><strong>Describe.</strong> Say only what is there. Name specific details of form (color, rhythm, composition, word choice, camera movement) without saying what they mean or whether they are good.</li>
<li><strong>Interpret.</strong> Say what the work means or expresses, and tie your reading to at least one detail from your description.</li>
<li><strong>Evaluate.</strong> Say how well the work succeeds, and state the standard you are using (for example perfection, insight, or inexhaustibility).</li>
</ol>
</div></div>
<p>When you finish, notice which paragraph was hardest to write, and why. Many people find description hardest because they want to jump to meaning. If your interpretation did not need anything from your description, go back and see whether you were looking at the work or at your first impression.</p>`,
  },
  quiz: [
    q("In this course, criticism means",
      "the disciplined practice of paying attention to a work of art and saying something informed about it.",
      ["finding fault with a work.", "rating a work from one to five stars.", "repeating what experts have said."],
      "Correct. Criticism can be positive, negative, or neither. What defines it is disciplined attention and informed statements.",
      "In the humanities, criticism does not mean faultfinding. It means careful attention plus an informed statement about the work."),
    q("Descriptive criticism focuses on",
      "the formal elements of a work.",
      ["the work's meaning.", "the work's quality.", "the artist's biography."],
      "Correct. Descriptive criticism asks what is there: line, color, rhythm, structure. It deliberately holds back meaning and judgment.",
      "Description is the first step. It reports what is actually in the work without yet saying what it means or how good it is."),
    q("Interpretive criticism centers on",
      "the content: what the work means or expresses.",
      ["only the formal elements.", "whether the work deserves to be in a museum.", "the cost of the materials."],
      "Correct. The formula in this unit is that interpretation explains how form transforms subject matter into content.",
      "Interpretation moves from what is there to what it means. It should always be grounded in specific observations."),
    q("Evaluative criticism centers on",
      "the relative merits of a work.",
      ["the formal elements only.", "the history of the artist.", "how popular the work is."],
      "Correct. Evaluation asks how good a work is. It relies on description and interpretation first, which is why the order matters.",
      "Evaluation is about merit: how good a work is and why. It is the third step, after description and interpretation."),
    q("Which set lists the three standards for evaluation presented in this unit?",
      "Perfection, insight, and inexhaustibility.",
      ["Popularity, price, and fame.", "Beauty, realism, and age.", "Originality, speed, and size."],
      "Correct. A strong work is unified (perfection), reveals something meaningful about human experience (insight), and rewards repeated attention (inexhaustibility).",
      "The three standards are perfection (everything contributes), insight (it reveals something meaningful), and inexhaustibility (it rewards return visits)."),
    q("Leonardo's Last Supper is organized around a single vanishing point behind Christ's head, with the apostles in four groups of three. What kind of relationship is this?",
      "A structural relationship: the principle that governs how the parts fit the whole.",
      ["A detail relationship between two brushstrokes.", "A purely evaluative judgment.", "An interpretation of the painting's religious meaning."],
      "Correct. The vanishing point and the four groups are not small details or one region; they are the structure that organizes the whole composition.",
      "Descriptive criticism has three levels: detail, regional, and structural. The organizing principle for the whole painting is structural."),
    q("The statement that Picasso's Guernica is a better painting than Munch's The Scream is",
      "evaluative.",
      ["descriptive.", "interpretive.", "historical."],
      "Correct. Saying one work is better than another is a judgment of merit. Evaluation needs a stated standard to be convincing.",
      "Notice the word better. It judges merit, and judging merit is the job of evaluative criticism."),
    q("The statement that the bull in Guernica symbolizes the cruelty and indifference of the regime that ordered the bombing is",
      "interpretive.",
      ["descriptive.", "evaluative.", "purely historical."],
      "Correct. It says what a detail of the painting stands for. Good interpretations point to specific details and explain how the form creates the meaning.",
      "The statement explains what something stands for, not just what is there or how good it is. That is interpretation."),
    q("Noticing that the sky in Munch's The Scream is painted in long, swirling bands of orange that echo the curves of the figure's body is",
      "descriptive criticism.",
      ["evaluative criticism.", "interpretive criticism.", "not criticism at all."],
      "Correct. It reports formal elements and the relationships between them without saying what they mean or whether they succeed.",
      "The statement reports what is there (swirling bands, echoing curves). It does not say what they mean or whether they are good, so it is descriptive."),
    q("Klimt's The Kiss rewards repeated looking: you keep finding the contrast of geometric and organic patterns or the danger of the cliff edge. Which evaluative standard does this illustrate?",
      "Inexhaustibility.",
      ["Perfection only.", "Popularity.", "Historical importance."],
      "Correct. A work that keeps revealing something new each time you return to it is inexhaustible, and that is a mark of a strong work.",
      "The key phrase is keeps revealing something new. That is the standard of inexhaustibility, the quality of resisting becoming stale."),
  ],
};
