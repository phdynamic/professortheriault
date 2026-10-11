const q = require("./q");

module.exports = {
  reflection: {
    title: "A Photograph and Its Two Lives",
    subtitle: "Evidence of something real, and a made picture",
    html: `<p>A photograph seems to be evidence: light really did bounce off something real and land on the film or sensor. But photographs are also made. Someone chose where to stand, what to include, when to press the shutter, and what to call the picture. This unit asks you to hold both ideas at once.</p>
<div class="callout callout--concept"><span class="callout__icon" aria-hidden="true">&#128161;</span><div class="callout__content">
<p><strong>The prompt</strong></p>
<p>Choose one photograph from the Gallery, or one that matters to you personally (a family picture, a news photograph, a portrait). Write about it twice:</p>
<ol>
<li><strong>As evidence.</strong> What does the photograph tell you about what was in front of the camera? What can you not tell from it?</li>
<li><strong>As art.</strong> What choices did the photographer make (framing, point of view, focus, light, the moment)? Name at least three, and say what each does.</li>
<li><strong>Together.</strong> Does knowing the choices make you trust the picture more, less, or differently? Why?</li>
</ol>
</div></div>
<p>If you chose one of the Gallery photographs, consider how the caption or title shapes your reading. Would you see Lange's mother or Parks's cleaning woman the same way without the words that came with them?</p>`,
  },
  quiz: [
    q("Why did people ask whether photography could be art?",
      "Because a camera appears simply to record what is in front of it, so where is the artistic form?",
      ["Because photographs are always blurry.", "Because photography was invented before painting.", "Because photographers cannot choose their subjects."],
      "Correct. The answer, developed in this unit, is that photographers make deliberate decisions about framing, light, focus, timing, and subject.",
      "The argument against photography as art was that the camera merely records. The lesson answers with the choices the photographer makes."),
    q("Pictorialist photographers",
      "imitated painting with soft focus, dramatic lighting, and sentimental subjects, hoping to win acceptance for photography as fine art.",
      ["rejected painting and used only sharp focus.", "documented social conditions with political intent.", "refused to compose their pictures."],
      "Correct. Stieglitz's Paula is a pictorialist photograph: soft focus, dramatic light, careful composition.",
      "Pictorialists borrowed painting's techniques, such as soft focus and dramatic lighting, to raise photography's status."),
    q("What did the f/64 Group and Edward Weston embrace?",
      "What is unique to the camera: sharp focus, precise detail, and great depth of field.",
      ["Soft focus and painterly effects.", "Hand coloring of prints.", "Avoiding the darkroom entirely."],
      "Correct. The name f/64 refers to the smallest aperture, which keeps everything in focus. Ansel Adams was a founding member.",
      "Straight photographers rejected pictorialism and celebrated the camera's own strengths: sharpness and detail."),
    q("What is the \"decisive moment\" in documentary photography?",
      "The peak of intensity in a scene, captured at exactly the right instant.",
      ["The moment a photograph is printed.", "The moment a photographer decides to retire.", "The longest exposure possible."],
      "Correct. The best documentary work, like Lange's, captures a peak of meaning in a single instant.",
      "The decisive moment is about timing: the instant when a scene's intensity peaks."),
    q("How does this unit define sentimentality?",
      "The falsifying of feelings by demanding easy responses.",
      ["A very sad subject.", "A photograph in color.", "A portrait of a child."],
      "Correct. Sentimental work manipulates the image to produce an emotional response that the subject matter does not earn.",
      "Sentimentality is not simply sadness. It is faking or forcing feeling by asking for an easy response."),
    q("What does \"the modern eye\" in photography accept?",
      "Clutter, accident, and unresolved tension: it catches reality instead of composing it.",
      ["Only perfectly symmetrical scenes.", "Only studio portraits.", "Only soft-focus images."],
      "Correct. Vivian Maier's candid street photographs are an example: quick, attentive to accidental arrangements of city life.",
      "The modern eye is the opposite of the pictorialist's tidy composition. It accepts what chance puts in the frame."),
    q("Gordon Parks's American Gothic, Washington, D.C. echoes a famous painting. Why does that matter?",
      "Knowing Grant Wood's painting gives the photograph additional meaning: it shows a Black cleaning woman whose citizenship was diminished by segregation.",
      ["It means the photograph is a copy.", "It proves the photograph has no content of its own.", "It makes the photograph less serious."],
      "Correct. This is a direct test of the claim that background knowledge deepens perception.",
      "The photograph depends on a comparison. The reference to Wood's painting is part of what the photograph says."),
    q("Why does Vivian Maier's work challenge the categories pictorialism, straight photography, and documentary?",
      "She photographed street life for decades without exhibiting it, timing and framing candid pictures that fit none of the categories neatly.",
      ["She worked only in a studio.", "She sold all her work during her lifetime.", "She photographed only landscapes."],
      "Correct. Her case raises the question of how intention relates to artistic form.",
      "Maier took over 100,000 pictures of strangers and never showed them. That makes her hard to fit into the lesson's three categories."),
    q("What did Muybridge's high-speed photographs of a galloping horse reveal?",
      "At one moment all four hooves are off the ground, something nobody could see with the naked eye.",
      ["That horses never leave the ground.", "That cameras cannot capture motion.", "That photographs are always unreliable."],
      "Correct. Photography does not only record what we see; it can reveal what we cannot.",
      "Muybridge used very fast shutters to freeze moments too quick to see. The discovery concerned the horse's legs."),
    q("In Daguerre's 1838 photograph of the Boulevard du Temple, why does the busy street look empty?",
      "The exposure lasted several minutes, so only the one man who stood still, having his boots polished, was recorded.",
      ["The street really was empty that day.", "Daguerre removed the people by hand.", "The camera could not see people."],
      "Correct. A long exposure records what stays still and loses what moves. It is a vivid reminder that shutter speed decides how time is shown.",
      "Early exposures lasted minutes. Anything that moved too much did not register."),
  ],
};
