const q = require("./q");

module.exports = {
  reflection: {
    title: "Listening Twice",
    subtitle: "Hearing one song as a formalist and then as an expressionist",
    html: `<p>This unit presents two theories about how music creates meaning. <strong>Formalists</strong> argue that music's value lies entirely in its internal structure: the relationships between tones, rhythms, and harmonies. <strong>Expressionists</strong> argue that music refers to emotions and experiences beyond itself: a minor key sounds sad because it connects to our experience of sadness. This reflection asks you to try both ways of listening on the same piece.</p>
<div class="callout callout--concept"><span class="callout__icon" aria-hidden="true">&#128161;</span><div class="callout__content">
<p><strong>The prompt</strong></p>
<p>Choose a piece from Watch &amp; Listen or a song you know well. Listen to it twice, with headphones if you can, and write three short paragraphs:</p>
<ol>
<li><strong>The formalist listening.</strong> Ignore feelings and stories. Describe the structure: the tempo, the rhythm, the melody, how a theme or motive returns, how loudness changes.</li>
<li><strong>The expressionist listening.</strong> Now listen for what the music seems to say. What feeling or experience does it express, and which sounds make you say so?</li>
<li><strong>Your verdict.</strong> Which listening taught you more about this piece? Could you give the first account without the second, or the second without the first?</li>
</ol>
</div></div>
<p>Whichever side you take, support it with specific moments in the music ("at about the second minute, the strings drop out and...") instead of general statements. Specific listening is the skill this unit is built to teach.</p>`,
  },
  quiz: [
    q("According to this lesson, the subject matter of music is",
      "feeling: the structures and patterns of feeling, such as tension and release, buildup and resolution.",
      ["historical events.", "the names of specific emotions only.", "the lives of composers."],
      "Correct. A painting of a sad woman shows you sadness; music enacts the structure of sadness in sound.",
      "The lesson argues that music bypasses representation and presents patterns of feeling directly."),
    q("What is the difference between consonance and dissonance?",
      "Consonance is a pleasing combination of simultaneous tones; dissonance is a tense, unresolved combination.",
      ["Consonance is loud and dissonance is quiet.", "Consonance is for singers and dissonance is for pianos.", "There is no difference."],
      "Correct. Dissonance creates tension that the music may later resolve; that tension and release is part of musical feeling.",
      "Consonance sounds stable and pleasing; dissonance sounds tense and unresolved."),
    q("In Beethoven's Fifth Symphony, the four-note opening is best called",
      "a motive: the smallest self-contained unit of a theme.",
      ["a harmony.", "a counterpoint.", "a dynamic."],
      "Correct. Beethoven transforms, inverts, extends, and develops this motive obsessively across the first movement.",
      "The short-short-short-long figure is the smallest self-contained unit that the movement is built from. That is a motive."),
    q("What claim do formalists make about music?",
      "Its value lies entirely in its internal structure, so external references are unnecessary.",
      ["Its value lies in the emotions it refers to beyond itself.", "It has no value.", "It must always be paired with lyrics."],
      "Correct. A formalist hears the Fifth as a masterpiece of structural logic.",
      "Formalists focus on form: the relationships among tones, rhythms, and harmonies, not on external meanings."),
    q("What claim do expressionists make about music?",
      "Music refers to emotions and experiences beyond itself, as a minor key connects to our experience of sadness.",
      ["Music has no connection to emotion.", "Only the structure of music matters.", "Music must be about politics."],
      "Correct. An expressionist hears the Fifth as an embodiment of struggle and triumph. The lesson says both views are right, and neither is complete without the other.",
      "Expressionists emphasize what music expresses. A minor key sounds sad because it connects to our experience of sadness."),
    q("How does Billie Holiday's performance of \"Strange Fruit\" make a devastating subject harder to ignore?",
      "She sings softly and conversationally, with long pauses between lines, which sets the beauty of her voice against the horror of the content.",
      ["She sings as loudly as possible.", "The song has no lyrics.", "She changes the words to a happier story."],
      "Correct. The artistic form does not soften the subject matter; it makes it harder to look away.",
      "Think about contrast. A quiet, beautiful voice describing something terrible forces the listener to attend to the words."),
    q("What is a raga in Indian classical music?",
      "A framework of notes, patterns, and emotional associations that the performer uses as the basis for improvisation.",
      ["A fixed written composition that cannot change.", "A kind of drum.", "A Western melody played slowly."],
      "Correct. The raga provides the rules, and the performer's spontaneous choices within those rules create the content.",
      "A raga is not a single melody. It is a set of rules and associations that the performer improvises within."),
    q("A piece that opens with a theme, moves to a contrasting section, and then returns to the opening theme is in",
      "ternary (ABA) form.",
      ["binary (AB) form.", "call-and-response form.", "no form at all."],
      "Correct. The return in ABA gives a feeling of homecoming after the contrast.",
      "A return to the opening after a contrast makes an A-B-A pattern, called ternary form."),
    q("Bach's Prelude from his first cello suite is built from",
      "a repeating pattern of broken chords, so a single instrument suggests several voices at once.",
      ["a single sustained note.", "a loud percussion pattern.", "a spoken text."],
      "Correct. The pattern outlines changing harmonies, and the listener hears a slow harmonic journey inside the quick motion.",
      "The piece is famous for a pattern that outlines chords one note at a time on a single cello."),
    q("On the first pass of the three-pass method of listening, you should",
      "follow the overall shape of the music: where it starts, builds, relaxes, and ends.",
      ["analyze every note.", "read the lyrics only.", "listen to a different piece."],
      "Correct. The second pass is for elements such as tempo, rhythm, melody, and dynamics, and the third is for expression and the choices that produce it.",
      "The first pass is for the big picture. Details come on later passes."),
  ],
};
