const q = require("./q");

module.exports = {
  reflection: {
    title: "Walking Around a Sculpture",
    subtitle: "What changes when a work occupies the same space you do",
    html: `<p>Painting gives you everything on a flat surface and fixes your point of view. Sculpture shares your space. You can walk around it, stand under it, or look down on it, and each position tells you something different. This reflection asks you to practice that kind of looking on a real work.</p>
<div class="callout callout--concept"><span class="callout__icon" aria-hidden="true">&#128161;</span><div class="callout__content">
<p><strong>The prompt</strong></p>
<p>Find a sculpture you can actually visit or look at from several angles: a statue or memorial in your town, a piece of public art on a campus or in a park, or a sculpture in a museum or museum website that offers several views. Then write about it:</p>
<ol>
<li>Name the work and describe it from at least <strong>two</strong> different viewpoints. What changes?</li>
<li>Describe the sensory space around it. Does it draw you in, push you back, or invite you to circle? Which formal choices (size, pedestal, material, pose) produce that effect?</li>
<li>Say what the work reveals about what its makers or community valued. Would the sculpture mean the same thing if it were much smaller, much larger, or made of a different material?</li>
</ol>
</div></div>
<p>If the sculpture shows a human body, notice what the pose makes you feel in your own body. If it does not, notice what takes the body's place. Either way, the point is to treat the work as an object you share a room with, not as a picture.</p>`,
  },
  quiz: [
    q("What does the lesson mean by the \"sensory interconnections\" of sculpture?",
      "Looking at a sculpture lets you sense its weight, coolness, or roughness as if you could touch it.",
      ["A sculpture must be touched to be understood.", "Sculpture combines sound and sight.", "All sculptures are made of the same material."],
      "Correct. Sculpture engages sight and, at least imaginatively, touch. You sense the marble's smoothness or the bronze's roughness without laying a hand on it.",
      "Think about how a sculpture's material comes across through sight alone. The interconnection is between seeing and imagined touch."),
    q("Which sculptural technique builds up material, such as clay or wax?",
      "Modeling.",
      ["Carving.", "Casting.", "Printing."],
      "Correct. Modeling adds and shapes material. Carving removes it, casting pours molten metal into a mold, and construction assembles separate pieces.",
      "Carving removes material from a block, and casting pours molten material into a mold. The technique that builds material up is modeling."),
    q("In high relief, figures",
      "project substantially from the background, nearly detaching from it, but remain attached to a plane.",
      ["are carved into a surface and do not project at all.", "stand completely free of any background.", "hang from the ceiling."],
      "Correct. Sunken relief is carved into a surface, low relief projects slightly, and high relief projects substantially. In all three the sculpture remains attached to a plane.",
      "Relief means the sculpture stays attached to a background. High relief projects the most, so the figures almost detach."),
    q("Why does freestanding sculpture have no single \"correct\" viewpoint?",
      "It is meant to be seen from multiple angles, and each angle reveals different relationships between forms.",
      ["Because it is usually too small to see clearly.", "Because only the back of a sculpture matters.", "Because sculptors make no decisions about viewpoint."],
      "Correct. This is a fundamental difference from painting, which fixes the viewer's position.",
      "Sculpture in the round is made to be walked around. Each angle shows something new, so no single view is the correct one."),
    q("What is \"sensory space\" in sculpture?",
      "The space around a sculpture, which is shaped by its mass and volume and can draw you in, push you back, or invite you to circle.",
      ["The empty space inside a building.", "The space on a museum wall.", "Another word for the base of a statue."],
      "Correct. A sculpture organizes the space around it. Paying attention to that space is essential to understanding how sculpture works.",
      "The space around a sculpture is not empty. It is shaped by the work's mass and volume, which is why the lesson calls it sensory space."),
    q("Why has the human body been sculpture's primary subject for thousands of years?",
      "When we see a sculpted body, we project our own physical sensations onto it, so tension, a twist, or a reaching hand produces a feeling in us.",
      ["Because sculptors cannot make anything else.", "Because the body is easy to carve.", "Because patrons only paid for portraits."],
      "Correct. A tensed muscle or a reaching hand gives an external image for an internal feeling. That is why the body carries so much meaning.",
      "The lesson's argument is about response. We feel our own body in the sculpted one, which is why the body is such a powerful subject."),
    q("Rodin's The Thinker was originally part of The Gates of Hell. How does knowing this change the content?",
      "The figure is not merely thinking in a generic way; he is witnessing human anguish and struggling to comprehend it.",
      ["The figure is relaxing.", "The sculpture becomes a portrait of Rodin.", "Nothing changes; the sculpture is purely abstract."],
      "Correct. The tension in the shoulders, the hand against the face, and the forward lean express the weight of moral awareness. Context enriches what the form already shows.",
      "The lesson's point is that background knowledge deepens perception. Here it turns generic thinking into a response to suffering."),
    q("Why does the title of Louise Bourgeois's Maman matter?",
      "It reveals that the huge, possibly menacing spider is a portrait of the artist's mother, who was a weaver; spiders suggest protection and patience.",
      ["It tells you the spider is made of marble.", "It names the museum that owns the work.", "It has no effect on the meaning."],
      "Correct. The tension between the threatening scale and the maternal subject matter is where the content lives.",
      "The title is the key to the content. Maman means mother, and the artist connected spiders with her weaving mother."),
    q("Calder's mobile is described as constructivist sculpture. What does that mean here?",
      "It is assembled from separate pieces, and its composition changes continuously as the pieces move.",
      ["It is carved from a single block of marble.", "It is cast in bronze in one piece.", "It is a flat relief on a wall."],
      "Correct. A mobile challenges the idea that sculpture must be heavy, stable, and permanent: its form is a set of possibilities governed by balance, weight, and chance.",
      "Constructivist sculpture is assembled from separate pieces. Calder's pieces hang and move, so the work is never the same twice."),
    q("Bernini's Apollo and Daphne shows the instant Daphne begins to turn into a laurel tree. What does the sculpture ask the viewer to do?",
      "Circle it, since the chase and the transformation are seen from different positions.",
      ["Look at it only from the front.", "Touch the marble.", "Ignore the figures and look at the base."],
      "Correct. A story that unfolds around the figures cannot be taken in from one position, which is exactly the strength of sculpture in the round.",
      "Think about what sculpture in the round allows. Bernini put different moments of the story on different sides, so you must move."),
  ],
};
