/**
 * generate-missing-feedback.js
 *
 * Adds correctFeedback and incorrectFeedback to Units 3 (Hume), 4 (Hegel),
 * and 5 (Marx) in extracted-content.json. These units originally shipped
 * without feedback text.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, 'extracted-content.json');

// ---------------------------------------------------------------------------
// Feedback data — keyed by quiz index (0-based), then question index (0-based)
// ---------------------------------------------------------------------------

const FEEDBACK = {
  // Index 2 = Unit 3: David Hume
  2: [
    {
      correctFeedback:   "Correct. Hume distinguishes between an 'easy and obvious' philosophy that paints virtue in attractive colors and an 'accurate and abstruse' philosophy that investigates the underlying principles of human understanding. The popular type entertains but never digs beneath the surface.",
      incorrectFeedback: "Hume's complaint about the popular, literary type of philosophy is not that it is too logical or too technical, but that it contents itself with surface-level appeals to sentiment without examining the principles that govern thought. Review Section 1 of the Enquiry."
    },
    {
      correctFeedback:   "Correct. Just as Newton reduced the motions of all physical bodies to a few simple laws, Hume hopes to discover a small number of general principles that explain all the operations of the human mind — an ambitious program he calls the 'science of man.'",
      incorrectFeedback: "Hume does not aim to prove the mind's independence, demonstrate that mental events obey physical laws, or establish God's existence. His goal is descriptive: to find the simple principles behind all mental operations, just as Newton found laws behind physical motion. Review Section 1."
    },
    {
      correctFeedback:   "Correct. The distinction between impressions and ideas rests entirely on their degree of force and vivacity. Impressions — sensations, passions, emotions as they first appear — are lively and forceful; ideas are the faint images of impressions in thinking and reasoning.",
      incorrectFeedback: "Hume's distinction is not about where perceptions come from, their complexity, or their truth value. It is about intensity: impressions strike the mind with greater force and vivacity than the fainter copies we call ideas. Review the Impressions and Ideas lecture page."
    },
    {
      correctFeedback:   "Correct. The Copy Principle functions as an empiricist test for meaning: if you cannot trace a philosophical concept back to some original impression, the concept is suspect and may be empty. This principle becomes Hume's most powerful critical tool throughout the Enquiry.",
      incorrectFeedback: "The Copy Principle does not prove the external world exists or rank complex ideas above simple ones. Its philosophical significance is as a criterion of meaning — a way to test whether any concept has genuine content by asking what impression it copies. Review the Impressions and Ideas lecture."
    },
    {
      correctFeedback:   "Correct. The imagination can recombine simple ideas that each copy a real impression — the idea of gold and the idea of a mountain — into the complex idea of a golden mountain. The Copy Principle is preserved because imagination assembles but does not create from nothing.",
      incorrectFeedback: "Hume does not appeal to past lives, grant exceptions to the Copy Principle, or deny that we have the idea. His answer is that complex ideas are built from simple ones, each of which traces back to an impression. The imagination recombines but never invents entirely new content. Review the Impressions and Ideas lecture."
    },
    {
      correctFeedback:   "Correct. Hume identifies exactly three principles of association: resemblance (a portrait makes us think of the person), contiguity in time or place (mentioning one room makes us think of adjoining rooms), and cause and effect (thinking of a wound makes us think of the pain that follows).",
      incorrectFeedback: "Contrast, identity, temporal sequence, and emotional association are not among Hume's three principles. The three are resemblance, contiguity, and cause and effect — and Hume treats these as the only natural relations connecting ideas in the mind. Review the Impressions and Ideas lecture."
    },
    {
      correctFeedback:   "Correct. By describing association as a 'gentle force' that habitually connects ideas, Hume deliberately leaves open whether these mental connections — especially causal ones — correspond to real connections in the world. This sets up his critical investigation of causation in Section 4.",
      incorrectFeedback: "The distinction matters not because Hume is doing psychology instead of philosophy, or because emotions are excluded. It matters because describing how the mind connects ideas is different from showing that those connections track reality — a question Hume takes up when he examines causation. Review the Impressions and Ideas lecture."
    },
    {
      correctFeedback:   "Correct. Relations of ideas — such as mathematical and logical truths — are knowable by the operation of thought alone, and their denial involves a contradiction. This is one prong of Hume's Fork; the other prong, matters of fact, depends on experience and admits of conceivable contraries.",
      incorrectFeedback: "Relations of ideas are not discovered through observation, nor are their contraries merely unlikely — their contraries are inconceivable. Claims about God, the soul, and the external world fall under matters of fact, the other side of Hume's Fork. Review the Causation and Induction lecture."
    },
    {
      correctFeedback:   "Correct. Hume argues that no amount of pure reasoning can reveal what effect will follow from a given cause, because the effect is an entirely distinct event from the cause. Without prior experience, a person confronting a billiard ball collision for the first time could not deduce the outcome.",
      incorrectFeedback: "Hume's argument is not that the senses are unreliable or that causation is an illusion. His point is more precise: there is no logically necessary connection between any cause and its effect that reason alone could detect. Experience is always required. Review the Causation and Induction lecture."
    },
    {
      correctFeedback:   "Correct. Any attempt to justify induction from experience is circular: 'the future will resemble the past because it always has' already assumes the uniformity of nature — the very principle it is supposed to establish. This is Hume's famous problem of induction.",
      incorrectFeedback: "The circularity is not about deduction being inapplicable or the future being unobservable. It is specifically about using past experience to justify reliance on past experience — which presupposes exactly what needs to be proved. Review the Causation and Induction lecture."
    },
    {
      correctFeedback:   "Correct. When Hume applies the Copy Principle to 'necessary connection,' he finds that the impression does not come from observing external events but from an internal feeling — the mind's habitual transition from one idea to another after repeated experience of their conjunction.",
      incorrectFeedback: "Hume does not conclude that the idea of necessary connection is meaningless — he finds an impression for it, but it is internal rather than external. Nor does he attribute it to God. The impression is the felt determination of the mind to pass from cause to expected effect. Review the Causation and Induction lecture."
    },
    {
      correctFeedback:   "Correct. All we actually observe is constant conjunction — one event regularly followed by another. We never perceive the power, force, or necessary connection between the two events. The idea of causal power is supplied by the mind, not by the objects themselves.",
      incorrectFeedback: "Hume's whole point is that we never observe causal power, force, or necessary connection between billiard balls. We see only succession — one motion followed by another. The 'connection' is something the mind adds after repeated experience. Review the Causation and Induction lecture."
    },
    {
      correctFeedback:   "Correct. Hume's sceptical solution acknowledges that reason cannot justify induction, but argues that nature has provided an alternative: custom and habit. After repeated experience, the mind is simply determined — by a non-rational process — to expect the usual effect. This works well enough for practical life.",
      incorrectFeedback: "Hume does not argue that careful reasoning solves the problem, that God guarantees induction, or that induction is really deduction. His solution is 'sceptical' precisely because it replaces rational justification with a non-rational psychological mechanism: custom and habit. Review the Causation and Induction lecture."
    },
    {
      correctFeedback:   "Correct. For Hume, belief is not a product of rational verification or a correspondence with reality but a particular manner of conceiving an idea — with a distinctive vivacity and force that arises from custom and the present impression, not from argument.",
      incorrectFeedback: "Hume's account of belief does not involve rational verification, correspondence with the external world, or innate ideas. Belief is simply an idea felt with greater vivacity and steadiness than a mere fiction — a feeling produced by habit, not by reasoning. Review the Causation and Induction lecture."
    },
    {
      correctFeedback:   "Correct. Hume's analysis undermines Descartes' argument at its foundation: the causal principle that every effect needs an adequate cause is neither a relation of ideas (its denial is conceivable) nor established by experience (we never observe necessary connections). Without this principle, Descartes' proof of God collapses.",
      incorrectFeedback: "Hume does not deny that we have an idea of God, nor does he claim ideas need no causes. His challenge targets the causal principle Descartes relies on — that every effect requires a cause of equal or greater perfection — showing it has no rational or empirical foundation. Review the Causation and Induction lecture."
    },
  ],

  // Index 3 = Unit 4: Hegel
  3: [
    {
      correctFeedback:   "Correct. Hegel's 'original history' is written by historians like Thucydides or Herodotus who directly witnessed and participated in the events they describe. The historian's spirit and the spirit of the age are one and the same.",
      incorrectFeedback: "Original history is not about applying a philosophical framework or compiling second-hand sources. It refers to historians who write about events they witnessed firsthand, sharing the culture and spirit of the age they describe. Review the Reason, Spirit, and History lecture."
    },
    {
      correctFeedback:   "Correct. Reflective history's central problem is anachronism: the historian inevitably imports their own categories, values, and assumptions into the interpretation of a past era, judging the past through a lens it did not share.",
      incorrectFeedback: "The problem with reflective history is not about unreliable sources or lack of documentation. It is about the historian's own intellectual framework distorting the past — imposing later categories onto earlier periods that operated under different assumptions. Review the Reason, Spirit, and History lecture."
    },
    {
      correctFeedback:   "Correct. Philosophical history, as Hegel practices it, aims to identify a rational principle that is already at work in historical events — not to impose reason from outside, but to discover the rationality inherent in the process itself.",
      incorrectFeedback: "Hegel's philosophical history is not about passing moral judgment on historical actors or merely compiling facts. It seeks to uncover the rational structure that is already working through historical events. Reason is discovered in history, not imposed upon it. Review the Reason, Spirit, and History lecture."
    },
    {
      correctFeedback:   "Correct. When Hegel says 'Reason governs the world,' he means that history has an intelligible, directional structure — it is not a random succession of events but a rational process working toward a goal, specifically the progressive realization of freedom.",
      incorrectFeedback: "Hegel does not mean that individual people always act rationally, or that history is pleasant. He means that history as a whole has a rational, intelligible structure — events are connected by a logic that becomes visible in retrospect. Review the Reason, Spirit, and History lecture."
    },
    {
      correctFeedback:   "Correct. Geist (Spirit) is Hegel's term for a self-developing rational principle that manifests as the collective consciousness of humanity across history. It is neither an individual soul nor the Christian God, but the rational essence of human civilization coming to know itself over time.",
      incorrectFeedback: "Geist is not simply formal logic, a personal soul, or the Christian God. It is the collective rational spirit of humanity — a self-developing principle that comes to fuller self-awareness through the institutions, art, religion, and philosophy of successive civilizations. Review the Reason, Spirit, and History lecture."
    },
    {
      correctFeedback:   "Correct. For Hegel, the essential nature of Spirit is freedom, and the entire history of the world is the progressive realization of that freedom — Spirit coming to consciousness of its own free nature through human institutions and culture.",
      incorrectFeedback: "Hegel does not define Spirit's nature primarily as rational order, virtue, or knowledge. The essence of Spirit is freedom, and history is the process by which Spirit becomes conscious of and realizes its own freedom. Review the Reason, Spirit, and History lecture."
    },
    {
      correctFeedback:   "Correct. Aufhebung is Hegel's key dialectical term that simultaneously means to cancel, to preserve, and to elevate. A stage of history is negated yet its essential content is preserved and raised to a higher level in the next stage.",
      incorrectFeedback: "Aufhebung does not mean simple elimination, compromise, or synthesis in the sense of a middle ground. Its power lies in its triple meaning: what is overcome is simultaneously preserved and elevated into something richer. Review the Dialectic lecture."
    },
    {
      correctFeedback:   "Correct. For Hegel, historical change is driven by internal contradictions within a society or stage of Spirit — not by external pressures. A civilization carries within itself the tensions that will eventually transform it into something new.",
      incorrectFeedback: "Hegel does not locate the engine of change in external invasions, economic pressures alone, or the decisions of great leaders. Change arises from contradictions internal to a stage of development — tensions between what a society claims to be and what it actually is. Review the Dialectic lecture."
    },
    {
      correctFeedback:   "Correct. The Socratic dialectic operates at the level of individual conversation, exposing contradictions in a person's beliefs through questioning. Hegel's dialectic operates at the level of world history, where contradictions within entire civilizations drive the development of Spirit.",
      incorrectFeedback: "The difference is not that one is logical and the other emotional, or that they reach opposite conclusions. The key distinction is scale: Socrates exposes contradictions in an individual's beliefs, while Hegel's dialectic traces contradictions through entire historical epochs. Review the Dialectic lecture."
    },
    {
      correctFeedback:   "Correct. The Cunning of Reason is Hegel's idea that Reason achieves its purposes by working through the private passions and ambitions of individuals. People pursue their own goals, but in doing so they unwittingly advance the larger rational plan of history.",
      incorrectFeedback: "The Cunning of Reason does not mean that enlightened philosophers guide history or that individuals consciously serve rational purposes. It means the opposite: individuals pursue their own passions, and Reason uses those passions as instruments to realize goals no individual intended. Review the Reason, Spirit, and History lecture."
    },
    {
      correctFeedback:   "Correct. World-historical individuals like Alexander or Napoleon are significant because their personal ambitions happen to coincide with what Spirit needs at that moment. They are unconscious instruments of a larger purpose they do not fully understand.",
      incorrectFeedback: "Hegel does not select world-historical individuals based on their moral virtue, philosophical wisdom, or benevolent intentions. What matters is that their personal drive happens to align with the needs of Spirit at a particular historical moment. Review the Reason, Spirit, and History lecture."
    },
    {
      correctFeedback:   "Correct. Once a world-historical individual has served Spirit's purpose by establishing a new principle in the world, they are no longer needed. History discards them — they are, as Hegel puts it, cast aside like empty husks once the kernel has been extracted.",
      incorrectFeedback: "Their tragic fate is not divine punishment for moral failings or a result of their own hubris alone. Hegel's point is structural: once the historical principle has been realized, the individual who carried it forward loses their world-historical significance and is discarded by the process itself. Review the Reason, Spirit, and History lecture."
    },
    {
      correctFeedback:   "Correct. Hegel traces freedom through three stages: in the Oriental world, only one (the despot) is free; in the Greek and Roman world, some are free (citizens, but not slaves); in the Germanic-Christian world, all are recognized as free in principle.",
      incorrectFeedback: "These are not abstract philosophical categories but concrete historical stages. Hegel maps the development of freedom onto actual civilizations: Oriental despotism (one is free), Greek democracy (some are free), and the modern Germanic-Christian world (all are free). Review the Freedom, Progress, and the Limits of Hegel's Vision lecture."
    },
    {
      correctFeedback:   "Correct. The Owl of Minerva — Hegel's famous image — means that philosophy can only comprehend an epoch after it has already run its course. Understanding comes after the fact; philosophy paints its grey in grey only when a form of life has grown old.",
      incorrectFeedback: "The Owl of Minerva is not about the secrecy of wisdom or the decline of philosophy with age. It expresses Hegel's view that philosophical understanding is necessarily retrospective — we can only fully grasp the meaning of a historical period after it has ended. Review the Freedom, Progress, and the Limits of Hegel's Vision lecture."
    },
    {
      correctFeedback:   "Correct. This arc traces a progressive philosophical response: Hume shows reason cannot reach beyond experience; Kant responds by arguing the mind actively structures experience through its own categories; Hegel goes further, arguing that reason is not merely in us but constitutes reality itself.",
      incorrectFeedback: "Each thinker responds to the previous one's limitations, not by rejecting them entirely but by building on them. Confusing the order or direction of these responses misses the dialectical development from Hume's empiricist scepticism through Kant's critical philosophy to Hegel's absolute idealism. Review the course arc discussion."
    },
  ],

  // Index 4 = Unit 5: Marx
  4: [
    {
      correctFeedback:   "Correct. When Marx says the history of all hitherto existing society is the history of class struggle, he is making a descriptive, empirical claim about what fundamentally drives historical change — not offering a moral condemnation or predicting a specific outcome.",
      incorrectFeedback: "Marx's opening claim is not a prediction about the future, a definition of what history means, or a moral judgment. It is an empirical thesis: that the primary engine of historical development has been conflict between classes with opposing economic interests. Review the Class Struggle and Historical Materialism lecture."
    },
    {
      correctFeedback:   "Correct. The base (or economic foundation) consists of the relations of production — who owns the means of production, who works, and on what terms. Everything else — law, politics, religion, philosophy — belongs to the superstructure that the base shapes.",
      incorrectFeedback: "Law, religion, and political institutions are part of the superstructure, not the base. The base is specifically the economic relations of production — the social relationships people enter into in order to produce their material existence. Review the Class Struggle and Historical Materialism lecture."
    },
    {
      correctFeedback:   "Correct. The bourgeoisie is defined by its structural position in the capitalist mode of production: ownership of the means of production and employment of wage labor. It is a class category, not a description of income level, education, or cultural refinement.",
      incorrectFeedback: "Marx defines classes by their relationship to the means of production, not by income, education, or lifestyle. The bourgeoisie owns the means of production and employs others' labor; the proletariat owns nothing but its labor power. Review the Class Struggle and Historical Materialism lecture."
    },
    {
      correctFeedback:   "Correct. The metaphor of 'its own gravediggers' points to a structural contradiction: capitalism's need for wage labor concentrates workers in factories and cities, creating the very class that has both the interest and the organization to overthrow it.",
      incorrectFeedback: "Marx is not pointing to individual moral failings or the greed of particular capitalists. The gravediggers metaphor identifies a structural dynamic: capitalism creates, concentrates, and organizes the proletariat as a necessary consequence of its own operation. Review the Manifesto lecture."
    },
    {
      correctFeedback:   "Correct. Marx carefully distinguishes personal property — your toothbrush, clothes, home furnishings — from private property in the means of production, which is used to generate profit through the exploitation of others' labor. Communism abolishes the latter, not the former.",
      incorrectFeedback: "The distinction is not between luxury and necessity, or between large and small possessions. It is between property used for daily personal life and property in the means of production that enables the extraction of surplus value from workers. Review the Manifesto lecture."
    },
    {
      correctFeedback:   "Correct. The ten-point program — including progressive income tax, centralization of credit, free public education — represents transitional measures to be implemented after the working class has seized political power. Marx did not intend them as permanent features of communist society.",
      incorrectFeedback: "These measures are not achievable through gradual reform within capitalism, nor are they the final shape of communist society. They are transitional steps to be taken after a revolutionary seizure of power, dismantling bourgeois economic structures. Review the Manifesto lecture."
    },
    {
      correctFeedback:   "Correct. Marx says communists support every revolutionary movement against the existing social and political order while maintaining their theoretical independence — strategic solidarity without subordinating their analysis of class struggle to other movements' frameworks.",
      incorrectFeedback: "Communists are neither rivals of all other working-class movements nor neutral observers. Marx advocates a strategic relationship: supporting progressive movements while insisting on the independent communist analysis of class struggle as the fundamental driver of history. Review the Manifesto lecture."
    },
    {
      correctFeedback:   "Correct. The proletariat's interest is universal because abolishing proletarian exploitation requires abolishing the class system itself. Unlike previous revolutions that replaced one ruling class with another, proletarian revolution eliminates the conditions for any class domination.",
      incorrectFeedback: "The claim is not simply that workers are the majority and therefore their interests are universal. Marx's argument is structural: because the proletariat can liberate itself only by abolishing all class distinctions, its particular liberation is simultaneously universal liberation. Review the Manifesto lecture."
    },
    {
      correctFeedback:   "Correct. Reactionary socialism — whether feudal, petty-bourgeois, or clerical — criticizes the real suffering capitalism produces, but from the standpoint of a pre-capitalist order that was itself oppressive. It looks backward, not forward.",
      incorrectFeedback: "Marx does not criticize reactionary socialism for being too emotional or too radical. His objection is that it critiques capitalism while yearning for a return to earlier, equally exploitative social arrangements — feudal aristocracy or the petty-bourgeois guild system. Review the Manifesto lecture."
    },
    {
      correctFeedback:   "Correct. Bourgeois socialists want to preserve the advantages of the capitalist system — its productivity, its markets — while softening its worst effects on workers through reforms. Marx sees this as wanting capitalism without its necessary consequences.",
      incorrectFeedback: "Marx does not criticize bourgeois socialism for being too radical; his criticism is precisely the opposite. Bourgeois socialists seek to patch capitalism's injuries without addressing the structural exploitation that causes them. They want the benefits without the contradictions. Review the Manifesto lecture."
    },
    {
      correctFeedback:   "Correct. Marx respects the critical-utopian socialists like Saint-Simon, Fourier, and Owen for diagnosing capitalism's problems, but criticizes them for appealing to universal reason and moral persuasion rather than understanding class struggle as the actual engine of historical change.",
      incorrectFeedback: "The issue is not that utopian socialists are vague or impractical in their details. Marx's critique is more fundamental: they correctly identify the disease but prescribe the wrong treatment because they do not grasp that class struggle — not rational argument — is what drives historical transformation. Review the Manifesto lecture."
    },
    {
      correctFeedback:   "Correct. For Marx, alienation under capitalism is not caused by cruel individual bosses but is inherent in the structure of wage labor itself. When workers sell their labor power as a commodity, the product of their work confronts them as something alien rather than as an expression of their creative activity.",
      incorrectFeedback: "Marx does not locate alienation in the cruelty of individual employers or in workers' subjective unhappiness. Alienation is a structural feature of wage labor: the worker's product becomes a commodity belonging to the capitalist, and the act of production itself becomes something imposed rather than freely chosen. Review the Ideology, Alienation lecture."
    },
    {
      correctFeedback:   "Correct. False consciousness is a structural condition in which people sincerely hold beliefs that reflect and reinforce the interests of the ruling class. It is not deliberate deception or propaganda but the natural product of living within exploitative economic relations.",
      incorrectFeedback: "False consciousness is not about capitalists deliberately lying to workers or about propaganda campaigns. It describes how the economic base shapes people's ideas so that exploitative arrangements appear natural and inevitable — a structural distortion, not a conspiracy. Review the Ideology, Alienation lecture."
    },
    {
      correctFeedback:   "Correct. Marx 'inverts' Hegel by replacing Spirit with material conditions as the primary driver of history. Where Hegel argued that ideas and rational principles produce historical reality, Marx insists that material, economic conditions produce the ideas and consciousness of each era.",
      incorrectFeedback: "The inversion is not about optimism versus pessimism, nor about rejecting dialectics entirely. Marx preserves Hegel's dialectical method but reverses the foundation: instead of deriving material reality from Spirit or ideas, he derives ideas and consciousness from material, economic conditions. Review the Class Struggle and Historical Materialism lecture."
    },
    {
      correctFeedback:   "Correct. The self-exemption problem is the reflexivity challenge: if all ideas are products of class position and material conditions, then Marx's own theory of historical materialism is presumably also shaped by his class position — raising the question of why it should be privileged as objectively true.",
      incorrectFeedback: "The self-exemption problem is not about Marx's personal wealth or tax status. It is a logical challenge: if every thinker's ideas are determined by their class position, Marx's own ideas must be too, which threatens to undermine his claim to have discovered objective historical laws. Review the Ideology, Alienation lecture."
    },
  ],
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

let totalAdded = 0;

for (const [quizIndexStr, feedbackArray] of Object.entries(FEEDBACK)) {
  const quizIndex = parseInt(quizIndexStr, 10);
  const quiz = data.quizzes[quizIndex];

  if (!quiz) {
    console.warn(`WARNING: No quiz at index ${quizIndex}`);
    continue;
  }

  console.log(`Processing Unit ${quiz.unit}: ${quiz.title} (${feedbackArray.length} questions)`);

  feedbackArray.forEach((fb, qi) => {
    const question = quiz.questions[qi];
    if (!question) {
      console.warn(`  WARNING: No question at index ${qi}`);
      return;
    }
    question.correctFeedback   = fb.correctFeedback;
    question.incorrectFeedback = fb.incorrectFeedback;
    totalAdded++;
  });
}

fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log(`\nDone. Added feedback to ${totalAdded} questions.`);
console.log(`Updated: ${JSON_PATH}`);
