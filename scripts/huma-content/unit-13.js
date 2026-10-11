const q = require("./q");

module.exports = {
  reflection: {
    title: "Is Television Art?",
    subtitle: "Applying the three standards of evaluation to a series you know",
    html: `<p>Television is the art form most of us know best and take most for granted. It is also the one whose status as art is most disputed. This unit has asked you to look at it with the same attention you gave to paintings and poems. This final reflection asks you to make a judgment.</p>
<div class="callout callout--concept"><span class="callout__icon" aria-hidden="true">&#128161;</span><div class="callout__content">
<p><strong>The prompt</strong></p>
<p>Choose a television series you know well (a drama, a comedy, a documentary series, anything with several episodes). Apply the three evaluative standards from Unit 3:</p>
<ol>
<li><strong>Perfection:</strong> does everything in the work contribute to the whole?</li>
<li><strong>Insight:</strong> does it reveal something meaningful about human experience?</li>
<li><strong>Inexhaustibility:</strong> does it reward repeated viewing?</li>
</ol>
<p>Give a specific example from the series for each standard, and say where it falls short. Then answer: is this series art?</p>
</div></div>
<p>Notice how the form of television (a long serial structure, interruptions, a living-room setting) helps or hinders each standard. A series can be inexhaustible in a way no two-hour film could, but it can also be uneven. Be honest about both.</p>`,
  },
  quiz: [
    q("What distinguishes television's conditions from cinema's?",
      "Cinema is designed for concentrated viewing in a dark room; television was designed for the living room, with interruptions and divided attention.",
      ["Television has no images.", "Cinema is always shorter.", "Television is always silent."],
      "Correct. These conditions shaped the art form: television developed the self-contained episode, the recurring cast, and the cliffhanger.",
      "Think about where each is watched. The setting and expected attention differ."),
    q("What is the difference between an episodic series and a serial?",
      "An episodic series has self-contained episodes; a serial tells a continuous story across many episodes or seasons.",
      ["An episodic series is longer.", "A serial has no characters.", "They are the same thing."],
      "Correct. The serial form has become important in what critics call prestige television.",
      "Episodic means each episode stands alone. A serial continues from episode to episode."),
    q("What does the serial form allow that a two-hour film cannot?",
      "An extended time frame in which to develop character and theme with great depth.",
      ["A shorter running time.", "A simpler plot.", "No characters at all."],
      "Correct. The Sopranos, The Wire, and Downton Abbey use this extended time to deepen their worlds.",
      "The advantage of a serial is time. Seasons of episodes give room to develop characters and themes."),
    q("Video art usually",
      "uses the moving image for non-commercial, often experimental purposes, and typically avoids narrative.",
      ["tells conventional stories for a mass audience.", "is made only for broadcast.", "cannot be shown in galleries."],
      "Correct. In its goals it is closer to painting and sculpture than to television, though it uses the same technology.",
      "Video art is not entertainment. It uses video as an artist's medium."),
    q("What is distinctive about Bill Viola's The Crossing?",
      "A two-channel installation in which one man is consumed by fire and the same man by water, in extreme slow motion.",
      ["A cartoon about animals.", "A fast comedy.", "A news broadcast."],
      "Correct. The slowness turns a brief violent event into a sustained meditation on transformation, destruction, and renewal.",
      "The work shows two events, fire and water, in extremely slow motion across two screens."),
    q("How does the form of The Wire mirror its content?",
      "Its serial structure and unresolved cases reflect the self-perpetuating systems it depicts, which resist individual efforts to change them.",
      ["Each episode neatly ends with a solved crime.", "The show has only one character.", "It avoids real settings."],
      "Correct. The show resists the satisfying resolutions of episodic television, just as the institutions it examines resist reform.",
      "The Wire does not resolve its cases neatly. That open-endedness is a formal choice that matches its subject."),
    q("In Nam June Paik's TV Buddha, what do we see?",
      "A statue of the Buddha facing a camera and a monitor that shows its own live image, in an endless feedback loop.",
      ["A documentary about a monk.", "A scripted drama.", "A news broadcast."],
      "Correct. There is no narrative, no editing, and no progression: a contemplative figure contemplating its own electronic image.",
      "The work is a situation: a statue, a camera, and a monitor connected in a loop."),
    q("Why are many video artworks designed to loop?",
      "So viewers can enter at any point and stay as long as they like, instead of watching from a fixed beginning to a fixed end.",
      ["Because they are too short.", "Because looping saves money.", "Because gallery visitors dislike endings."],
      "Correct. Looping contradicts the fixed running time of a film or television episode and changes how a viewer's attention works.",
      "Looping removes the fixed beginning and end. Think about how that changes how you enter the work."),
    q("What did Paik's Global Groove imagine?",
      "A future in which viewers can tune in to any television station in the world, presented as a fast collage of music, dance, and images.",
      ["A world without television.", "A silent film.", "A single channel of news."],
      "Correct. Paik manipulated television signals and mixed found footage to make television itself an artist's medium.",
      "Paik's work is a collage of images from around the world. It imagines viewers choosing among all the world's channels."),
    q("A typical half-hour sitcom like I Love Lucy follows which structure?",
      "A problem, escalating complications, and a resolution within one episode.",
      ["An unresolved cliffhanger across ten seasons.", "No plot at all.", "A single unbroken shot."],
      "Correct. The tidy structure suited the living-room schedule, and repetition and escalation build the jokes.",
      "Sitcoms are episodic. Each half hour sets up a problem, makes it worse, and solves it."),
  ],
};
