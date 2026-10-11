const q = require("./q");

module.exports = {
  reflection: {
    title: "The Poem You Can Hear",
    subtitle: "Choosing one image and showing how the poem makes it work",
    html: `<p>Literature is made of language, and language works through both meaning and sound. A poem's power often comes from the gap between what its words say literally and what they suggest, and from the way the form (sound, line, and stanza) reinforces that suggestion. This reflection asks you to look closely at a short poem of your choice.</p>
<div class="callout callout--concept"><span class="callout__icon" aria-hidden="true">&#128161;</span><div class="callout__content">
<p><strong>The prompt</strong></p>
<p>Choose a short poem (no longer than about twenty lines) from this unit (Dickinson's "Because I could not stop for Death," Hughes's "Harlem," or Whitman's "A Noiseless Patient Spider") or from a poem you already love. Read it aloud twice, then write about it:</p>
<ol>
<li>Pick <strong>one image</strong> from the poem and describe what it asks you to picture.</li>
<li>Explain what the image <em>suggests</em> beyond its literal meaning. Is it a metaphor, a simile, a symbol, or an objective correlative?</li>
<li>Show how the poem's <strong>form</strong> (line breaks, rhythm, repetition, or placement of the image) makes that suggestion stronger. What would be lost if the same idea were stated in a plain sentence?</li>
</ol>
</div></div>
<p>If you are not sure where to start, begin with a single word that surprised you and ask why the poet chose it over a more obvious one. Diction, the choice of words, is where many strong readings begin.</p>`,
  },
  quiz: [
    q("What is the difference between a word's denotation and its connotation?",
      "Denotation is its literal meaning; connotation is the associations and emotional shadings that come with it.",
      ["Denotation is its sound; connotation is its spelling.", "Denotation is its history; connotation is its length.", "They are two names for the same thing."],
      "Correct. A poem's power often comes from the gap between what its words say literally and what they suggest.",
      "Denotation is the literal, dictionary meaning. Connotation is everything the word suggests beyond that."),
    q("Why does the lesson say literature unfolds in time?",
      "You receive it one word at a time, holding earlier words in memory as new ones arrive.",
      ["Because poems are always about the past.", "Because books take years to print.", "Because every story must be set in a historical period."],
      "Correct. Unlike a painting, which gives you everything at once, a poem or story is sequential, and that sequence is part of its form.",
      "Contrast literature with painting. A painting is all at once; a poem or story arrives word by word."),
    q("Which kind of narrative integrates every detail so tightly that nothing can be removed without damaging the whole?",
      "An organic narrative.",
      ["An episodic narrative.", "A quest narrative.", "A lyric."],
      "Correct. Borges's story is the lesson's example: every detail connects to its central theme.",
      "Episodic narratives are loosely connected adventures, and quest narratives follow a search. The one in which every detail depends on the others is organic."),
    q("A quest narrative is built around",
      "a protagonist searching for something of supreme value.",
      ["a series of loosely connected adventures with no central plot.", "a single concentrated feeling about an object.", "a debate between two characters."],
      "Correct. A quest narrative builds suspense around whether the protagonist will find what they seek.",
      "The word quest names a search. The lesson describes it as a protagonist looking for something of supreme value."),
    q("What does a lyric poem usually do?",
      "It reveals a single, concentrated feeling about something and captures a moment, mood, or insight.",
      ["It tells a long story with many characters.", "It explains a scientific theory.", "It lists historical dates."],
      "Correct. Unlike narrative, a lyric does not tell a story. Dickinson's and Hughes's poems are lyrics.",
      "A lyric is not mainly a story. It concentrates a feeling or insight into a short space."),
    q("What is an objective correlative?",
      "An object or situation that embodies an emotion without naming it directly.",
      ["A rhyme at the end of a line.", "A summary of a poem's plot.", "A comparison that uses the word like or as."],
      "Correct. A bare tree in winter, for example, can correlate with loss or emptiness without the poem saying so.",
      "The key idea is expressing an emotion through an object or situation instead of naming it. That is the objective correlative."),
    q("Which statement correctly distinguishes simile from metaphor?",
      "A simile makes a comparison explicit using like or as; a metaphor makes the comparison directly.",
      ["A simile is always longer than a metaphor.", "A metaphor uses like or as; a simile never does.", "They are the same device."],
      "Correct. \"Like a raisin in the sun\" is a simile; calling death a gentleman caller is a metaphor.",
      "The words like and as mark a simile. A metaphor states the comparison directly."),
    q("In Dickinson's \"Because I could not stop for Death,\" what do the school, the gazing grain, and the setting sun represent as the carriage passes them?",
      "Stages of life: childhood, maturity, and decline.",
      ["Three places the speaker visited on vacation.", "Three symbols of the poet's religion.", "Nothing; they are only scenery."],
      "Correct. The poem never explains the images; it trusts them to carry the meaning, which is part of what makes it powerful.",
      "The carriage passes images that stand for phases of a life. Think of the order: children at school, ripe grain, the end of the day."),
    q("How does the last line of Hughes's \"Harlem\" differ from the rest of the poem?",
      "It drops the similes and asks a single, direct question: Or does it explode?",
      ["It adds a sixth simile.", "It repeats the first line.", "It describes the weather."],
      "Correct. The shift from specific images to one abstract verb, set apart in italics, gives the ending enormous force.",
      "The poem answers its opening question with five similes and then changes strategy. Look for what the final line stops doing."),
    q("According to the Gallery lesson, why do most of Shakespeare's plays survive?",
      "They were collected in a printed volume, the First Folio of 1623, seven years after his death.",
      ["Shakespeare published them all himself while he was alive.", "They were carved into stone.", "Only the theater companies remembered them."],
      "Correct. About half of his plays were first printed in the Folio. Literature depends on the physical form that carries it.",
      "The Gallery highlights how books preserve literature. Shakespeare wrote for the stage; the collected volume that saved the plays appeared after his death."),
  ],
};
