(function () {
  document.querySelectorAll(".quiz").forEach(function (quiz) {
    var questions = quiz.querySelectorAll(".quiz__question");
    var totalQuestions = questions.length;
    var scoreTracker = quiz.querySelector(".quiz__score-tracker");
    var startOverBtn = quiz.querySelector(".quiz__start-over");

    // Initialize score tracking
    var answered = 0;
    var correct = 0;
    // Track answered state per question so Start Over can reset it
    var answeredState = [];

    function updateScore() {
      if (scoreTracker) {
        scoreTracker.textContent = correct + " / " + totalQuestions + " correct";
        scoreTracker.style.display = answered > 0 ? "block" : "none";
      }
      if (startOverBtn) {
        startOverBtn.style.display = answered > 0 ? "inline-block" : "none";
      }
    }

    questions.forEach(function (q, qIndex) {
      var choices = q.querySelectorAll(".quiz__choice");
      var correctValue = q.getAttribute("data-correct");
      answeredState[qIndex] = false;

      choices.forEach(function (choice) {
        var input = choice.querySelector("input");
        var label = choice.querySelector("label");

        function handleSelect() {
          if (answeredState[qIndex]) return;
          answeredState[qIndex] = true;
          answered++;

          // Disable all radio buttons in this question
          q.querySelectorAll('input[type="radio"]').forEach(function (r) {
            r.disabled = true;
          });
          q.classList.add("quiz__question--answered");

          var correctFb   = q.querySelector(".quiz__feedback--correct");
          var incorrectFb = q.querySelector(".quiz__feedback--incorrect");

          if (input.value === correctValue) {
            correct++;
            choice.classList.add("quiz__choice--correct");
            if (correctFb) correctFb.style.display = "block";
          } else {
            choice.classList.add("quiz__choice--incorrect");
            // Do NOT reveal the correct answer
            if (incorrectFb) incorrectFb.style.display = "block";
          }

          input.checked = true;
          updateScore();
        }

        input.addEventListener("change", handleSelect);
        label.addEventListener("click", function (e) {
          if (answeredState[qIndex]) e.preventDefault();
        });
      });
    });

    // Start Over button — resets ALL questions
    if (startOverBtn) {
      startOverBtn.addEventListener("click", function () {
        answered = 0;
        correct = 0;

        questions.forEach(function (q, qIndex) {
          answeredState[qIndex] = false;
          q.classList.remove("quiz__question--answered");

          q.querySelectorAll(".quiz__choice").forEach(function (c) {
            c.classList.remove("quiz__choice--correct", "quiz__choice--incorrect");
          });
          q.querySelectorAll('input[type="radio"]').forEach(function (r) {
            r.disabled = false;
            r.checked = false;
          });
          q.querySelectorAll(".quiz__feedback").forEach(function (fb) {
            fb.style.display = "none";
          });
        });

        updateScore();
      });
    }
  });
})();
