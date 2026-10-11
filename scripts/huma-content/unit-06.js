const q = require("./q");

module.exports = {
  reflection: {
    title: "Architecture and Values",
    subtitle: "What two famous buildings reveal about the people who built them",
    html: `<p>This unit argues that architecture has a <strong>revelatory</strong> function: great buildings say something about the values of the people who built them. Below are two famous buildings from very different cultures and time periods: the Empire State Building (1931, New York) and the Taj Mahal (1632–1653, Agra, India).</p>
<p><img src="/huma1301/assets/images/empire-state-building-new-york-1931.jpg" alt="Aerial view of the stepped, tapering tower of the Empire State Building rising above Manhattan." loading="lazy" style="max-width: 320px; width: 100%; height: auto;"></p>
<p style="font-size: 0.8rem; color: #666;">Empire State Building, 1931. Designed by Shreve, Lamb &amp; Harmon. New York City. Aerial photograph by Sam Valadi (public domain, Wikimedia Commons).</p>
<p><img src="/huma1301/assets/images/taj-mahal-agra-1632-1653.jpg" alt="The white marble Taj Mahal with its central dome and four minarets, reflected in a long pool." loading="lazy" style="max-width: 100%; height: auto;"></p>
<p style="font-size: 0.8rem; color: #666;">Taj Mahal, 1632–1653. Agra, India. Photograph by Yann, edited by Jim Carter, CC BY-SA 4.0 (Wikimedia Commons).</p>
<div class="callout callout--concept"><span class="callout__icon" aria-hidden="true">&#128161;</span><div class="callout__content">
<p><strong>The prompt</strong></p>
<p>Choose <strong>one</strong> of these buildings. Using the four requirements from this unit (technical, functional, spatial, and revelatory), describe what values you think the building reveals. Consider: What does its scale communicate? How does it use materials and light? What does it say about the culture that produced it?</p>
</div></div>
<p>Be specific about which formal qualities lead you to your interpretation. A claim like "the Taj Mahal shows love" needs a detail behind it: the symmetry, the white marble, the reflecting pool. Which one carries your argument?</p>`,
  },
  quiz: [
    q("What does it mean to say that \"architecture begins where function ends\"?",
      "A building becomes architecture when it does more than shelter, using space, light, and proportion to produce a specific experience.",
      ["Architecture is any building that has a roof.", "Architecture must have no function.", "Only decorations count as architecture."],
      "Correct. A warehouse shelters goods; a cathedral shelters a congregation and also produces the sense of being in the presence of something larger than yourself.",
      "Both a warehouse and a cathedral are buildings. The difference is what the cathedral's space, light, and proportion do beyond shelter."),
    q("The four requirements of architecture are",
      "technical, functional, spatial, and revelatory.",
      ["technical, financial, political, and decorative.", "spatial, structural, musical, and visual.", "practical, historical, religious, and legal."],
      "Correct. A building must stand, serve its purpose, organize space meaningfully, and reveal the values of the people who built and use it.",
      "The four are technical (it stands), functional (it works), spatial (it organizes space), and revelatory (it reveals values)."),
    q("What does the revelatory requirement ask of a building?",
      "That it say something about the values of the people who built it and use it.",
      ["That it be as tall as possible.", "That it be built from a single material.", "That it never change."],
      "Correct. The revelatory requirement is what raises a building from construction to art: it shows what a culture cares about.",
      "Revelatory means revealing. The question is what the building reveals about the values of its builders and users."),
    q("Why does a strip mall usually fail to qualify as architecture in this sense?",
      "It stands and functions, but it does not organize space meaningfully or reveal values clearly.",
      ["It is too small.", "It is not technically sound.", "It is always built from the wrong materials."],
      "Correct. Most buildings satisfy the first two requirements easily. The harder two, spatial and revelatory, are what distinguish architecture.",
      "A strip mall meets the first two requirements (technical and functional). Ask which two it does not meet."),
    q("Which qualities does earth-rooted architecture emphasize?",
      "Connection to the ground, the site, gravity, raw materials, and centrality.",
      ["Height, light, and weightlessness.", "Transparency and elevation on columns.", "Movement and flow without a site."],
      "Correct. Wright's Fallingwater is the classic example: built over a waterfall from local stone, inseparable from its setting.",
      "Earth-rooted architecture grows from its site. Fallingwater uses local stone and sits over a waterfall."),
    q("Which features does sky-oriented architecture use to make stone appear to soar?",
      "Pointed arches, ribbed vaults, and flying buttresses.",
      ["Thick walls and tiny windows.", "Flat roofs and low ceilings.", "Wooden beams only."],
      "Correct. Gothic cathedrals like Chartres use these structural devices to reach upward and let in light.",
      "Think of a Gothic cathedral. Its pointed arches, ribbed vaults, and flying buttresses all work to lift the stone and open it to light."),
    q("What is the Farnsworth House an example of?",
      "Earth-resting architecture: a glass box elevated on steel columns that sits lightly on the ground.",
      ["Sky-oriented architecture.", "Earth-rooted architecture.", "Architecture that fails the technical requirement."],
      "Correct. It neither roots into the ground nor reaches away from it. It rests lightly on it.",
      "The lesson names a third category for a house that sits lightly on its site without rooting into it or reaching upward."),
    q("How does Le Corbusier's Ronchamp chapel use light?",
      "Thick walls with irregular windows let light in as small, intense points, producing an intimate, contemplative interior.",
      ["Broad walls of glass flood the room with even light.", "It uses no natural light at all.", "A central oculus is its only light source."],
      "Correct. This is the opposite of a Gothic cathedral's soaring transparency, though both are sky-oriented and use light as a primary element.",
      "Remember the cave-like interior. Ronchamp's thick walls pierced by irregular windows send light in as separate bright points."),
    q("Why does Zaha Hadid's Heydar Aliyev Center test the earth-rooted and sky-oriented categories?",
      "It does neither clearly: its surface folds continuously, embracing the ground and then lifting away in one gesture.",
      ["It is a perfect example of Gothic architecture.", "It has no roof.", "It is hidden underground."],
      "Correct. The building demonstrates that the lesson's framework is a starting point, not a cage.",
      "The center has no clear anchor to its site and does not reach upward like a cathedral. Look for the answer about a continuous, flowing form."),
    q("The Pantheon in Rome admits daylight only through a circular opening at the top of its dome. What is that opening called?",
      "The oculus.",
      ["The apse.", "The nave.", "The buttress."],
      "Correct. The oculus lets a disc of sunlight slowly cross the interior through the day, so the space makes you feel enclosed by the sky.",
      "The Pantheon's round opening at the top of the dome has a Latin name meaning eye: the oculus."),
  ],
};
