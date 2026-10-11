// q(text, correctChoice, [wrong1, wrong2, wrong3], feedbackIfRight, feedbackIfWrong)
module.exports = (text, correct, wrongs, right, wrong) => ({
  text,
  choices: [{ text: correct, correct: true }, ...wrongs.map((w) => ({ text: w }))],
  right,
  wrong,
});
