(function () {
  document.querySelectorAll(".quiz").forEach(function (quiz) {
    var questions = quiz.querySelectorAll(".quiz__question");
    var totalQuestions = questions.length;
    var scoreTracker = quiz.querySelector(".quiz__score-tracker");

    // Initialize score tracking
    var answered = 0;
    var correct = 0;

    function updateScore() {
      if (scoreTracker) {
        scoreTracker.textContent = correct + " / " + totalQuestions + " correct";
        scoreTracker.style.display = answered > 0 ? "block" : "none";
      }
    }

    questions.forEach(function (q, qIndex) {
      var choices = q.querySelectorAll(".quiz__choice");
      var correctValue = q.getAttribute("data-correct");
      var clearBtn = q.querySelector(".quiz__clear");
      var isAnswered = false;

      choices.forEach(function (choice) {
        var input = choice.querySelector("input");
        var label = choice.querySelector("label");

        function handleSelect() {
          if (isAnswered) return;
          isAnswered = true;
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
            // Show the correct answer
            choices.forEach(function (c) {
              var cInput = c.querySelector("input");
              if (cInput && cInput.value === correctValue) {
                c.classList.add("quiz__choice--correct");
              }
            });
            if (incorrectFb) incorrectFb.style.display = "block";
          }

          input.checked = true;
          if (clearBtn) clearBtn.style.display = "inline-block";
          updateScore();
        }

        input.addEventListener("change", handleSelect);
        label.addEventListener("click", function (e) {
          if (isAnswered) e.preventDefault();
        });
      });

      // Clear button for this question
      if (clearBtn) {
        clearBtn.addEventListener("click", function () {
          if (!isAnswered) return;

          // Undo score
          var wasCorrect = q.querySelector(".quiz__choice--correct input:checked");
          if (wasCorrect) correct--;
          answered--;

          // Reset visual state
          isAnswered = false;
          q.classList.remove("quiz__question--answered");
          choices.forEach(function (c) {
            c.classList.remove("quiz__choice--correct", "quiz__choice--incorrect");
          });
          q.querySelectorAll('input[type="radio"]').forEach(function (r) {
            r.disabled = false;
            r.checked = false;
          });
          var feedbacks = q.querySelectorAll(".quiz__feedback");
          feedbacks.forEach(function(fb) { fb.style.display = "none"; });
          clearBtn.style.display = "none";
          updateScore();
        });
      }
    });
  });
})();
