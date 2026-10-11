// Builds the PHIL 2306 reflection prompts, self-study quizzes, and Final Paper page from the
// Canvas export, in the same markup as PHIL 1301 so the shared quiz.js and styles apply.
// The export's quizzes carry no answer feedback; FEEDBACK below was written for the first ten
// questions of each, in the style of the PHIL 1301 feedback.

const AdmZip = require("adm-zip");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const IMSCC = path.join(ROOT, "6263-phil-2306-intro-to-ethics-s2-12575-export.imscc");
const OUT = path.join(ROOT, "phil2306");
const QUESTIONS_PER_QUIZ = 10;

const UNITS = {
  1: { slug: "unit-1-aristotle", name: "Aristotle" },
  2: { slug: "unit-2-aquinas", name: "Thomas Aquinas" },
  3: { slug: "unit-3-kant", name: "Immanuel Kant" },
  4: { slug: "unit-4-mill", name: "John Stuart Mill" },
  5: { slug: "unit-5-nietzsche", name: "Friedrich Nietzsche" },
  6: { slug: "unit-6-beauvoir", name: "Simone de Beauvoir" },
};

// [correct feedback, incorrect feedback] for questions 1-10 of each unit quiz.
const FEEDBACK = {
  1: [
    ["Correct. The Nicomachean Ethics reads like what it is: lecture notes, probably edited by Aristotle's son Nicomachus or his students after his death. That explains its compressed, sometimes repetitive style.", "Think about where the text came from. Its compressed style, repetitions, and abrupt transitions reflect its origin as material for teaching, not a finished book prepared for readers."],
    ["Correct. For Aristotle, every living thing has a telos, an end built into its nature. Understanding what something is means understanding what it is for, and this is the backbone of his ethics.", "Teleology comes from the Greek telos, meaning end or goal. Ask what Aristotle thinks a thing's nature tells you about what it is for."],
    ["Correct. Eudaimonia describes how a whole life goes, not a passing mood. You can feel happy on a given afternoon, but flourishing is something you achieve, or fail to, over a lifetime.", "The issue is about time and stability. Ask whether eudaimonia is something that comes and goes from hour to hour, or something that characterizes a life as a whole."],
    ["Correct. If every good were pursued only for the sake of some further good, the chain would never end and desire would be empty. So there must be a final good we choose for its own sake, and Aristotle argues it is eudaimonia.", "Follow the chain of 'for the sake of.' Aristotle's point is about what would happen to our choices if every end were only a means to something further."],
    ["Correct. Nutrition and growth we share with plants, and perception with animals. What is distinctive of human beings is rational activity, so the human good is activity of the soul in accordance with reason, performed well.", "The function argument looks for what is distinctive of human beings. Ask which of these capacities we share with plants or animals, and which belongs to us alone."],
    ["Correct. Validity is about structure: if the premises were true, the conclusion would have to be true. Whether the premises actually are true is a separate question, which is where soundness comes in.", "Validity and truth are different properties. Revisit the Logic for Ethics page in Start Here: validity concerns the connection between premises and conclusion, not whether the premises are true."],
    ["Correct. Honor sits in the hands of those who give it, so it is too superficial to be the chief good. And people seek honor to be assured of their own goodness, which shows that virtue matters more than the recognition of it.", "Aristotle's objection is not that honor is wrong. Ask where honor comes from, and what people who seek it are really trying to establish about themselves."],
    ["Correct. Moral virtues come from habit. We become just by doing just acts and brave by doing brave acts, until acting well becomes second nature.", "Book II distinguishes how intellectual virtues and moral virtues are acquired. Remember the lyre player: some excellences can be taught, but others are only built by doing."],
    ["Correct. A hexis is a settled state of character, a stable disposition to feel and act in certain ways. Virtues are hexeis, which is why a single good act does not make someone virtuous.", "A hexis is not a passing feeling or a single action. Ask what Aristotle calls the stable, habituated condition that virtue turns out to be."],
    ["Correct. Courage concerns fear and confidence. The coward fears too much, the rash person too little, and the courageous person feels and acts as the situation actually calls for.", "Each virtue is a mean between a vice of excess and a vice of deficiency in the same feeling. Ask what feeling courage governs, and what having too much or too little of it would look like."],
  ],
  2: [
    ["Correct. Aquinas joined the Dominicans, a new mendicant order devoted to preaching and study. His family objected so strongly that they held him captive for about a year to change his mind.", "Aquinas joined a mendicant order of preachers founded in the early thirteenth century. Revisit Aquinas' Life and Context for the story of his family's resistance."],
    ["Correct. Our readings come from the Summa Theologiae, Aquinas's massive and unfinished synthesis of theology and philosophy, organized as Questions divided into Articles.", "Two of these titles belong to other authors we know: Aristotle and Augustine. Look for Aquinas's own systematic summary of theology."],
    ["Correct. Each Article lists objections, then a 'sed contra' citing an authority, and then 'I answer that,' where Aquinas gives his own position and argument before replying to the objections.", "The objections state views Aquinas will answer, and the sed contra cites an authority on the other side. Ask where in the Article Aquinas speaks in his own voice."],
    ["Correct. Aquinas defines law as an ordinance of reason, for the common good, made by whoever has care of the community, and promulgated. Penalties may support law, but they are not part of what makes something law.", "Aquinas's definition has four elements: reason, the common good, proper authority, and promulgation. Check which option names something outside that definition."],
    ["Correct. For Aquinas, truth cannot contradict truth. Reason and revelation reach the same truth by different routes, so an apparent conflict means an error has crept in somewhere.", "Aquinas was not a fideist who set faith against reason. Revisit Reason and Faith: he holds that both come from the same source and so cannot ultimately disagree."],
    ["Correct. Aquinas identifies four kinds of law in Question 91: eternal, natural, human, and divine.", "Question 91 names four kinds of law: eternal, natural, human, and divine. Only one of these options appears on that list."],
    ["Correct. Eternal law is the plan of divine wisdom by which God governs the whole of creation. Every other kind of law derives from it.", "Eternal law is more fundamental than any written code or scientific law of nature. Ask what Aquinas thinks ultimately orders all of creation."],
    ["Correct. Natural law is rational creatures' participation in the eternal law. Through reason, human beings grasp part of the divine plan as it applies to them.", "Natural law and eternal law are related but not identical. Aquinas's word is 'participation': ask how rational creatures share in the divine plan."],
    ["Correct. A human law is legitimate insofar as it is derived from natural law. A law that contradicts natural law lacks the nature of law, which is the basis for Aquinas's claim that an unjust law is no law at all.", "For Aquinas, neither force nor custom nor consent is the deepest source of a law's authority. Ask what a just human law must be derived from."],
    ["Correct. Aquinas's three levels are inclinations we share with all substances (self-preservation), with animals (reproduction and raising young), and those proper to rational beings (knowing truth and living in society). Contemplating God directly with the angels is not one of them.", "Question 94 builds natural inclinations up in three layers, from what we share with all things, to what we share with animals, to what is proper to reason. Find the option that is not one of those layers."],
  ],
  3: [
    ["Correct. Our reading is the Groundwork for the Metaphysic of Morals (1785), Kant's short introduction to the foundations of his moral philosophy.", "These are all real works by Kant, but this unit reads only one: the short book that lays the groundwork for his moral philosophy."],
    ["Correct. Kant argues that moral philosophy must be grounded a priori, in pure reason. Moral law has to bind every rational being, so it cannot rest on contingent facts about human psychology.", "Kant thinks moral law must hold with necessity for every rational being. Ask what kind of source could guarantee that, given that observation, feeling, and tradition all vary."],
    ["Correct. Kant opens the First Section by arguing that nothing can be called good without qualification except a good will. Talents and even happiness can become bad when the will using them is bad.", "Kant notes that intelligence, courage, and even happiness can be put to bad uses. Ask what remains good no matter how circumstances turn out."],
    ["Correct. The shopkeeper does what duty requires, but from self-interest. His action conforms to duty without being done from duty, so it has no moral worth on Kant's view.", "Kant distinguishes acting in accordance with duty from acting from duty. Ask what actually motivates this shopkeeper's honesty."],
    ["Correct. For Kant, moral worth lies in the motive. The cold person who helps because it is their duty shows the good will more clearly than someone who helps because they enjoy it.", "Kant locates moral worth in the motive, not in feeling. Ask what is moving the person who helps despite having no inclination to."],
    ["Correct. The command applies only if you want the end, here being healthy. That makes it a hypothetical imperative.", "Notice the 'if.' Ask whether this command would still bind you if you did not care about being healthy."],
    ["Correct. Hypothetical imperatives depend on what you happen to want. The categorical imperative binds unconditionally, whatever your goals.", "The difference is not about subject matter or legal enforcement. Ask whether the imperative depends on some end you happen to want."],
    ["Correct. A maxim is the subjective principle you are actually acting on, the 'when I am in situation S, I will do A in order to get E' behind an action.", "In Kant's technical sense a maxim is not a proverb or a law. It is the principle behind a particular agent's action. Revisit the categorical imperative page for examples."],
    ["Correct. The universalization test asks whether you could consistently will your maxim to become a universal law that every rational being follows.", "This formulation is a consistency test, not a calculation of consequences or an appeal to tradition. Ask what it means to will your maxim as a law for everyone."],
    ["Correct. We may use others as means, as we do whenever we buy something. What we may never do is treat a person merely as a means, ignoring their status as a rational end in themselves.", "Notice the word 'merely.' Kant does not forbid all use of others. Ask what he says we must also always do."],
  ],
  4: [
    ["Correct. Jeremy Bentham, a close friend of Mill's father, founded classical utilitarianism. Mill was raised as Bentham's intellectual heir and spent much of his career revising Bentham's views.", "Mill's utilitarianism grew directly out of the work of a family friend who raised him in it. Revisit Mill's Life and Context."],
    ["Correct. Mill grants that first principles cannot be proved in the strict sense, because there is nothing more basic to derive them from. He offers considerations that can move a rational mind instead.", "Mill does not abandon utilitarianism in Chapter 1. Ask what he says about whether any ultimate principle can be strictly proved."],
    ["Correct. The Greatest Happiness Principle: actions are right in proportion as they tend to promote happiness, and wrong as they tend to produce the reverse of happiness.", "Mill's principle judges actions by their consequences for happiness. The other options describe Kant, virtue ethics, and Aquinas."],
    ["Correct. Bentham counted pleasures by quantity alone. Mill adds quality: some pleasures, such as those of the intellect and moral sentiments, are more valuable in kind, not just in amount.", "Mill is refining Bentham, not abandoning hedonism. Ask what Mill adds to Bentham's purely quantitative measure of pleasure."],
    ["Correct. Critics called utilitarianism a 'doctrine worthy only of swine.' Mill replies that human beings have higher faculties, and anyone who has experienced both kinds of pleasure prefers the higher, even with dissatisfaction.", "Mill's remark answers a specific charge about pleasure, that a pleasure-based ethics degrades human beings. Ask which objection that is."],
    ["Correct. Utilitarianism adds up happiness and unhappiness across everyone affected. An action is judged by its total effect, not by its effect on any one person.", "'Aggregative' means adding together. Ask what utilitarianism adds up when it evaluates an action."],
    ["Correct. Act utilitarianism asks which particular action produces the most happiness. Rule utilitarianism asks which general rules would produce the most happiness if followed, then judges actions by those rules.", "Both versions are consequentialist. The difference is what the principle of utility is applied to: each action, or general rules of conduct."],
    ["Correct. Mill says humanity has had its whole history to learn the tendencies of actions. Our inherited moral rules record that experience, so we need not calculate from scratch every time.", "Mill does not deny that consequences matter or that they are hard to predict. Ask what he thinks humanity's accumulated experience gives us."],
    ["Correct. Mill grounds the ultimate sanction in human social feeling, our natural desire to be in unity with others, which education and social progress can strengthen.", "Mill argues the deepest motive to be moral is not fear of punishment, religion, or an innate moral faculty. Ask what feature of human nature he appeals to in Chapter 3."],
    ["Correct. Internal sanctions are the feelings within us: conscience and the pain of violating duty. External sanctions come from others: the law, public opinion, or God.", "Mill divides sanctions into external and internal. Ask which kind arises within the person's own mind."],
  ],
  5: [
    ["Correct. Nietzsche asks a question moral philosophers usually skip: what is the value of our moral values themselves? Answering it requires a critique of morality, beginning with its origins.", "Nietzsche is not choosing between existing moral theories or arguing about God. In the Preface he turns the question back on morality itself."],
    ["Correct. Genealogy traces where moral concepts came from: the historical conditions, power relations, and psychological needs out of which they grew.", "A genealogy is a history of descent. Ask what Nietzsche thinks we learn by tracing the conditions in which moral concepts arose."],
    ["Correct. Nietzsche credits the English psychologists with seeking historical origins but says they assumed the unegoistic is good and simply explained it by utility. They never questioned the value of the morality they were explaining.", "Nietzsche's complaint is about what these psychologists took for granted. Revisit The Genealogical Method: did they question the values they were explaining?"],
    ["Correct. The genetic fallacy is judging a belief by its origin rather than by its truth or justification. Critics say that even ugly origins would not by themselves show our values are wrong.", "The objection concerns the relation between where a belief came from and whether it is true. Ask which fallacy names that confusion."],
    ["Correct. In master morality, 'good' starts as the nobles' self-description. The powerful call themselves good, and the term expresses their own strength and vitality.", "In master morality, 'good' comes first, and it is something the nobles say about themselves. Ask who is doing the naming."],
    ["Correct. For the nobles, 'bad' (schlecht) just means common, low, and inferior. It is a judgment of rank, not of moral wickedness.", "Master morality's 'bad' is not the same as slave morality's 'evil.' Ask whether it carries condemnation or simply marks lower status."],
    ["Correct. Master morality starts with a yes to itself and derives 'bad' afterward. Slave morality starts with a no to the other, 'evil,' and defines 'good' as a reaction against it.", "The difference is about which judgment comes first. Ask whether each morality begins by affirming itself or by negating its enemy."],
    ["Correct. Ressentiment is hostility that cannot be discharged in action. It festers, turns inward, and eventually becomes creative, giving birth to a new morality.", "Nietzsche uses the French word for something more specific than ordinary resentment. Ask what happens to hostility that cannot be acted on."],
    ["Correct. The slave revolt revalued values. What the nobles called good, strength and pride, became evil, and what they looked down on, weakness and humility, became good. That inversion came to dominate Western morality.", "The slave revolt was a revolt in values, not in military or political power. Ask what it did to the meaning of 'good' and 'evil.'"],
    ["Correct. Nietzsche traces the slave revolt to the priestly class of ancient Israel, whose revaluation was carried by Christianity throughout the Roman world.", "Nietzsche places the slave revolt in the ancient world, long before the Enlightenment or industrialization. Revisit the First Treatise on the role of the priestly caste."],
  ],
  6: [
    ["Correct. For existentialists there is no human nature fixed in advance. We exist first and then make ourselves what we are through our choices.", "Existentialism denies that human beings come with a predetermined nature or purpose. Ask what comes first and what is made afterward."],
    ["Correct. For de Beauvoir we are ambiguous because we are both: free consciousness that transcends any situation, and embodied, situated beings shaped by conditions we did not choose.", "De Beauvoir's ambiguity is not vagueness or moral uncertainty. Ask what two sides of the human condition she holds together."],
    ["Correct. There is no neutral position outside freedom. Refusing to choose, or drifting, is itself a choice we are responsible for.", "De Beauvoir does not mean that freedom is guaranteed or that we are determined. Ask what she says about refusing to choose."],
    ["Correct. Bad faith is the flight from freedom: pretending that our situation, role, or nature dictates what we do, so that we are not responsible for it.", "In this tradition bad faith is not ordinary dishonesty. It is a kind of self-deception about something specific. Ask what is being denied."],
    ["Correct. To assume freedom is to take it up honestly, owning the weight and responsibility of one's choices instead of fleeing into bad faith.", "'Assume' here means taking something up and owning it, not presupposing it. Ask what de Beauvoir thinks the ethical person does with their freedom."],
    ["Correct. The sub-man flees freedom through apathy. He refuses to engage with anything, which leaves him available to be swept up by whatever movement offers him a role.", "Each inauthentic attitude evades freedom in its own way. Ask which one does so by passivity and refusal to engage."],
    ["Correct. The serious man makes some external absolute, a Cause, Party, or Nation, the source of all value and loses himself in it. He treats the cause, not himself, as responsible for what he does.", "The serious man's problem is not lack of commitment. Ask what he does with his freedom when he gives himself over to a cause."],
    ["Correct. The nihilist is a disappointed serious man. When his absolute collapses, he concludes that nothing has value and turns disillusionment into a pose of indifference.", "De Beauvoir traces nihilism to a specific experience, not a philosophical argument. Ask which earlier attitude it grows out of."],
    ["Correct. All five attitudes evade the full acknowledgment of freedom. Some deny it, some dissolve it into an object, and some exercise it without engaging what it is for.", "Look for what unites the sub-man, the serious man, the nihilist, the adventurer, and the passionate man. Ask what each one fails to face."],
    ["Correct. The adventurer loves action and conquest for their own sake but is indifferent to what they serve. His freedom never reaches out to the freedom of others, so it stays shallow and self-enclosed.", "The adventurer is not over-committed. If anything, the reverse. Ask what is missing from a freedom pursued only for its own sake."],
  ],
};

const read = (zip, name) => zip.getEntry(name).getData().toString("utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const nextNav = (href, title) => `<nav class="page-nav" aria-label="Page navigation" style="margin-top: 2.5rem;">
  <div></div>
  <a href="${href}" class="page-nav__link page-nav__link--next page-nav__link--filled">
    <span class="page-nav__label">Next &rarr;</span>
    <span class="page-nav__title">${title}</span>
  </a>
</nav>`;
const frontMatter = (title, mod, breadcrumb, position) =>
  `---\nlayout: layouts/page.njk\ntitle: ${JSON.stringify(title)}\nmodule: "${mod}"\nbreadcrumbTitle: ${JSON.stringify(breadcrumb)}\nposition: ${position}\n---\n`;

function reflectionBody(discussionHtml) {
  const $ = cheerio.load(discussionHtml, { decodeEntities: false });
  const body = $("body");
  const header = body.children("div").first();
  const title = header.find("h2").text().trim();
  const subtitle = header.find("p").last().text().trim();
  const main = body.children("div").eq(1);

  const parts = [];
  for (const el of main.children().toArray()) {
    const $el = $(el);
    const label = $el.is("div") ? $el.children("p").first().text().trim() : "";
    if (/^PARTICIPATION REQUIREMENTS/i.test(label)) continue;
    if ($el.is("div")) {
      const paras = $el.children("p").slice(1).toArray().map((p) => $(p).html().trim());
      const steps = [], other = [];
      for (const p of paras) (/^(<strong>)?\s*\d+\.\s/.test(p) ? steps : other).push(p);
      const isPrompt = /^THE PROMPT$/i.test(label);
      let inner = `<p><strong>${esc(label.charAt(0) + label.slice(1).toLowerCase())}</strong></p>\n`;
      for (const p of other) inner += `<p>${p}</p>\n`;
      if (steps.length) inner += `<ol>\n${steps.map((s) => `<li>${s.replace(/^(<strong>)?\s*\d+\.\s*/, "$1")}</li>`).join("\n")}\n</ol>\n`;
      const kind = isPrompt ? "concept" : "note";
      const icon = isPrompt ? "&#128161;" : "&#8505;&#65039;";
      parts.push(`<div class="callout callout--${kind}"><span class="callout__icon" aria-hidden="true">${icon}</span><div class="callout__content">\n${inner}</div></div>`);
    } else if ($el.text().trim()) {
      parts.push($.html(el));
    }
  }

  let html = `<h2>${esc(title)}</h2>\n<p><em>${esc(subtitle)}</em></p>\n${parts.join("\n")}`;
  html = html
    .replace(/\s*style="[^"]*"/g, "")
    .replace(/This discussion asks you/g, "This reflection asks you")
    .replace(/In your post, do the following:/g, "In your reflection, do the following:")
    .replace(/\byour (original )?post\b/gi, "your reflection")
    .replace(/\bYour (original )?post\b/g, "Your reflection");
  return html;
}

function quizBody(unit, quiz) {
  const fb = FEEDBACK[unit];
  const questions = quiz.questions.slice(0, QUESTIONS_PER_QUIZ).map((q, i) => {
    const n = i + 1;
    const ids = q.choices.map((c, j) => `q${n}${"abcd"[j]}`);
    const correctId = ids[q.choices.findIndex((c) => c.correct)];
    const choices = q.choices.map((c, j) => `      <li class="quiz__choice">
        <input type="radio" name="q${n}" value="${ids[j]}" id="${ids[j]}">
        <label for="${ids[j]}">${esc(c.text)}</label>
      </li>`).join("\n");
    return `  <div class="quiz__question" data-correct="${correctId}">
    <div class="quiz__question-text"><span class="quiz__number">${n}</span> ${esc(q.text)}</div>
    <ul class="quiz__choices">
${choices}
    </ul>
    <div class="quiz__feedback quiz__feedback--correct" style="display:none;">${esc(fb[i][0])}</div>
    <div class="quiz__feedback quiz__feedback--incorrect" style="display:none;">${esc(fb[i][1])}</div>
  </div>`;
  });
  return `<div class="callout callout--concept"><span class="callout__icon" aria-hidden="true">&#128161;</span><div class="callout__content">
<p><strong>Self-study quiz.</strong> This quiz is for your own review — answers are not recorded. You’ll get instant feedback on each question.</p>
</div></div>

<div class="quiz"><div class="quiz__top-bar"><div class="quiz__score-tracker" style="display:none;"></div><button class="quiz__start-over" type="button" style="display:none;">Start Over</button></div>
${questions.join("\n")}
</div>`;
}

const FINAL_PAPER = `<p>Your final assignment is to write an essay on one philosopher covered in this course.</p>

<h2>Instructions</h2>

<p>Choose one of the six philosophers — Aristotle, Aquinas, Kant, Mill, Nietzsche, or de Beauvoir — and develop a focused argument or analysis related to their work.</p>

<h3>Requirements</h3>
<ul>
<li>Minimum three pages, double-spaced, MLA format</li>
<li>Choose a specific claim, argument, or concept from the philosopher's work</li>
<li>Develop a thesis — take a position, don't just summarize</li>
<li>Support your claims with evidence from the primary texts we've read</li>
<li>Address at least one potential objection to your argument</li>
</ul>

<h3>Suggested Approaches</h3>
<ul>
<li><strong>Defend or critique</strong> a specific argument made by your chosen philosopher</li>
<li><strong>Compare</strong> how two philosophers in the course address the same question</li>
<li><strong>Apply</strong> a philosopher's framework to a contemporary moral question and evaluate whether it holds up</li>
<li><strong>Identify a tension</strong> within a philosopher's position and argue for a resolution</li>
</ul>

<div class="callout callout--concept"><span class="callout__icon" aria-hidden="true">&#128161;</span><div class="callout__content">
<p><strong>Choose your philosopher wisely.</strong> You'll be spending several pages with their ideas — pick someone whose thinking genuinely interests or challenges you. The best papers come from genuine engagement, not obligation.</p>
</div></div>

<div class="callout callout--connection"><span class="callout__icon" aria-hidden="true">&#10145;&#65039;</span><div class="callout__content">
<p><strong>Need help getting started?</strong> Review your reflection prompt responses from each unit. The ideas that stuck with you — the arguments you found most compelling or most problematic — are often the seed of a strong paper. Contact your instructor if you'd like to discuss your topic before writing.</p>
</div></div>
`;

function main() {
  const zip = new AdmZip(IMSCC);
  const $meta = cheerio.load(read(zip, "course_settings/module_meta.xml"), { xmlMode: true });
  const dataFile = path.join(OUT, "phil2306.11tydata.json");
  const data = JSON.parse(fs.readFileSync(dataFile, "utf8"));

  for (const mod of $meta("module").toArray()) {
    const unit = Number(($meta(mod).children("title").text().match(/^Unit (\d)/) || [])[1]);
    if (!UNITS[unit]) continue;
    const { slug } = UNITS[unit];
    const items = $meta(mod).find("item").toArray();
    const ref = (type) => $meta(items.find((it) => $meta(it).children("content_type").text() === type)).children("identifierref").text();

    const $q = cheerio.load(read(zip, `non_cc_assessments/${ref("Quizzes::Quiz")}.xml.qti`), { xmlMode: true });
    const quiz = {
      questions: $q("item").toArray().map((item) => {
        const correct = $q(item).find("respcondition").toArray().find((r) => $q(r).find("setvar").text().trim() === "100");
        const correctId = $q(correct).find("varequal").text().trim();
        return {
          text: cheerio.load($q(item).find("presentation > material mattext").first().text()).text().replace(/\s+/g, " ").trim(),
          choices: $q(item).find("response_label").toArray().map((l) => ({
            text: cheerio.load($q(l).find("mattext").text()).text().replace(/\s+/g, " ").trim(),
            correct: $q(l).attr("ident") === correctId,
          })),
        };
      }),
    };
    const $d = cheerio.load(read(zip, `${ref("DiscussionTopic")}.xml`), { xmlMode: true });
    const discussion = $d("text").first().text();

    const pageData = data.course.modules.find((m) => m.slug === slug);
    const nextPos = Math.max(...fs.readdirSync(path.join(OUT, slug)).filter((f) => f.endsWith(".njk") && !/^(reflection-prompt|quiz)\.njk$/.test(f))
      .map((f) => Number((fs.readFileSync(path.join(OUT, slug, f), "utf8").match(/^position: (\d+)/m) || [])[1]))) + 1;

    fs.writeFileSync(path.join(OUT, slug, "reflection-prompt.njk"),
      frontMatter("Reflection Prompt", slug, "Reflection Prompt", nextPos) +
      `<div class="reflection">\n  <div class="reflection__prompt">\n${reflectionBody(discussion)}\n  </div>\n  <h3>Your Reflection</h3>\n  <textarea class="reflection__textarea" placeholder="Write your reflection here..."></textarea>\n  <p class="reflection__note">This is a thinking space — your response is not saved or submitted. Copy your work if you want to keep it.</p>\n</div>\n`);

    const next = UNITS[unit + 1];
    const nav = next
      ? nextNav(`/phil2306/${next.slug}/`, `Continue to Unit ${unit + 1}: ${next.name}`)
      : nextNav("/phil2306/final-paper/", "Continue to Final Paper");
    fs.writeFileSync(path.join(OUT, slug, "quiz.njk"),
      frontMatter(`Quiz: ${UNITS[unit].name}`, slug, "Quiz", nextPos + 1) + quizBody(unit, quiz) + "\n\n" + nav + "\n");

    pageData.pages = pageData.pages.filter((p) => !["reflection-prompt", "quiz"].includes(p.slug))
      .concat([{ slug: "reflection-prompt", title: "Reflection Prompt" }, { slug: "quiz", title: "Quiz" }]);
    console.log(`Unit ${unit}: reflection prompt (position ${nextPos}) and ${Math.min(quiz.questions.length, QUESTIONS_PER_QUIZ)}-question quiz (position ${nextPos + 1})`);
  }

  fs.writeFileSync(path.join(OUT, "final-paper", "index.njk"),
    `---\nlayout: layouts/page.njk\ntitle: "Final Paper"\nmodule: "final-paper"\nposition: 1\n---\n\n${FINAL_PAPER}`);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2) + "\n");
  console.log("Final Paper page written; sidebar data updated.");
}

main();
