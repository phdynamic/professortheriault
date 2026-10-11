const q = require("./q");

module.exports = {
  reflection: {
    title: "The Elements of Painting",
    subtitle: "How Van Gogh's treatment of one element changes what the night sky means",
    html: `<p>This unit introduces the elements of painting: line, color, texture, and composition. Van Gogh's <em>The Starry Night</em> uses all four in distinctive ways. The lines are not smooth or controlled; they swirl and pulse. The colors are intense and unrealistic (the sky is not actually that shade of blue). The texture is heavy, with visible brushstrokes that create ridges on the surface. The composition moves the eye in circular patterns rather than leading it to a single focal point.</p>
<p><img src="/huma1301/assets/images/vincent-van-gogh-the-starry-night-1889.jpg" alt="Vincent van Gogh, The Starry Night, 1889. A swirling night sky of blue and yellow above a quiet village and a dark cypress tree." loading="lazy" style="max-width: 100%; height: auto;"></p>
<p style="font-size: 0.8rem; color: #666;">Vincent van Gogh, <em>The Starry Night</em>, 1889. Oil on canvas, 73.7 × 92.1 cm. Museum of Modern Art, New York. Public domain (image from Wikimedia Commons).</p>
<div class="callout callout--concept"><span class="callout__icon" aria-hidden="true">&#128161;</span><div class="callout__content">
<p><strong>The prompt</strong></p>
<p>Choose <strong>one</strong> element (line, color, texture, or composition) and describe how Van Gogh uses it in this painting. Then explain how that element contributes to the painting's <em>content</em>, not just its subject matter. What does Van Gogh's treatment of that element communicate about the night sky that a more conventional approach would not?</p>
</div></div>
<p>Be specific. "The brushstrokes are powerful" is not yet a description; say where they are, what direction they run, and what they do to your eye. If a classmate chose a different element, would their reading of the painting's content agree with yours?</p>`,
  },
  quiz: [
    q("Michelangelo's Creation of Adam on the Sistine Chapel ceiling is a fresco. What is distinctive about fresco as a medium?",
      "Pigment is applied to wet plaster, so the painting becomes part of the wall itself.",
      ["Pigment is bound with egg yolk on a wooden panel.", "Pigment is mixed with oil and layered slowly on canvas.", "The painting is made on translucent paper."],
      "Correct. Because the pigment sinks into wet plaster and becomes part of the wall, frescoes can last for centuries. That is why Michelangelo's ceiling has survived for five hundred years.",
      "Think about the word fresh. In fresco the pigment goes onto fresh, wet plaster and becomes part of the wall, which is why it lasts."),
    q("Why does oil paint give a painter the greatest range of color, texture, and detail?",
      "It dries slowly and can be layered, so the painter can blend, rework, and build up surfaces.",
      ["It is translucent, so the white paper shows through.", "It dries so quickly that no changes are possible.", "It cannot be mixed with other colors."],
      "Correct. Oil's slow drying and layering are part of what makes a Rembrandt self-portrait feel alive: the paint can model soft shadow and thick highlights.",
      "The key properties of oil paint are slow drying and the ability to be layered. Look for the answer that treats those as advantages."),
    q("A closed line in a painting is",
      "hard, sharp, and definite.",
      ["soft, blurry, and suggested.", "invisible.", "always straight."],
      "Correct. Closed lines define edges firmly; open lines are soft and suggested. Lawrence's Migration Series uses closed lines; Rothko's soft edges are almost the opposite.",
      "Closed and open describe how definite a line is. A closed line is hard and sharp; an open line is soft and suggested."),
    q("Which three qualities describe a color?",
      "Hue, saturation, and value.",
      ["Line, shape, and texture.", "Primary, secondary, and tertiary.", "Warm, cold, and neutral only."],
      "Correct. Hue is the name of the color, saturation is its purity or intensity, and value is its lightness or darkness.",
      "The three qualities are hue (the color's name), saturation (its intensity), and value (how light or dark it is)."),
    q("Van Gogh's The Starry Night has heavy, visible brushstrokes that create ridges on the surface. Which element of painting is this?",
      "Texture.",
      ["Hue.", "Perspective drawing.", "Subject matter."],
      "Correct. Texture is the surface quality of a painting. Oil can be applied thickly, so the brushstrokes become part of what you see.",
      "Texture is the surface quality of the painting, here the ridges left by thick brushstrokes."),
    q("What does the lesson mean by the \"all-at-onceness\" of painting?",
      "A painting presents everything simultaneously, with no sequence, and the viewer chooses where to look.",
      ["A painting must be seen in a single second.", "A painting is always made in one sitting.", "Every painting contains all the colors of the rainbow."],
      "Correct. Unlike music, literature, or film, a painting offers all its elements immediately. The challenge is not access but attention.",
      "Contrast painting with a song or a novel. In painting, every element is available at once; the experience is not sequential."),
    q("According to this lesson, what is the subject matter of an abstract painting such as Rothko's No. 61?",
      "The sensuous: the visual qualities of color, shape, and line experienced directly.",
      ["A hidden landscape.", "A portrait of the artist.", "Nothing; abstract paintings have no subject matter."],
      "Correct. In abstract painting there is no recognizable subject to decode, so the subject matter is the sensuous itself, the pure visual qualities.",
      "Abstract paintings do have subject matter, defined differently from representational ones. Look for the answer about the pure visual qualities."),
    q("In Frida Kahlo's The Two Fridas, the artery connecting the two hearts is",
      "the detail that ties the figures together physically while their clothing and posture hold them apart.",
      ["a purely decorative flourish.", "the only part of the painting that is realistic.", "evidence that the painting is abstract."],
      "Correct. The artery is the painting's most striking detail relationship: it makes the division of the self visible and shows that the two selves are still joined.",
      "Look at the artery's role in the composition. It connects the two figures even as their dress and posture separate them."),
    q("Why does the medium matter in Jacob Lawrence's Migration Series, Panel 1?",
      "Casein tempera produces flat, opaque color with sharp edges, which gives the figures a graphic quality that emphasizes movement and pattern.",
      ["Oil paint made the faces highly detailed.", "Watercolor lets the paper show through the figures.", "The medium is irrelevant to the content."],
      "Correct. Lawrence's flat color and closed line turn the crowd into a collective force; the same subject in soft oil paint would feel different.",
      "Medium shapes what a painter can do. Casein tempera is flat and opaque, which affects how the crowd of figures reads."),
    q("In Giotto's Lamentation, the slope of the hillside runs diagonally down toward the faces of Mary and Christ. What is this an example of?",
      "Composition: an axis line that guides your eye through the painting.",
      ["Texture only.", "A color mixture.", "A medium."],
      "Correct. An axis line is an imaginary line that determines a painting's basic visual direction. Here the diagonal leads your eye to the emotional center of the scene.",
      "Think about how your eye moves through the painting. A line that sets that direction is an axis line, and how things are arranged is composition."),
  ],
};
