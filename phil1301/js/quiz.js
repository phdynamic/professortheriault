(function () {
  document.querySelectorAll(".quiz").forEach(function (quiz) {
    var questions = quiz.querySelectorAll(".quiz__question");
    var submitBtn = quiz.querySelector(".quiz__submit");
    var resultsDiv = quiz.querySelector(".quiz__results");

    submitBtn.addEventListener("click", function () {
      var total = questions.length;
      var correct = 0;

      questions.forEach(function (q) {
        var selected = q.querySelector('input[type="radio"]:checked');
        var choices = q.querySelectorAll(".quiz__choice");
        var correctValue = q.getAttribute("data-correct");

        // Clear previous feedback
        choices.forEach(function (c) {
          c.classList.remove("quiz__choice--correct", "quiz__choice--incorrect");
        });
        q.classList.remove("quiz__question--answered");

        if (selected) {
          q.classList.add("quiz__question--answered");
          var selectedChoice = selected.closest(".quiz__choice");

          if (selected.value === correctValue) {
            correct++;
            selectedChoice.classList.add("quiz__choice--correct");
          } else {
            selectedChoice.classList.add("quiz__choice--incorrect");
            // Highlight the correct answer
            choices.forEach(function (c) {
              var input = c.querySelector("input");
              if (input && input.value === correctValue) {
                c.classList.add("quiz__choice--correct");
              }
            });
          }
        } else {
          // Not answered — highlight correct
          q.classList.add("quiz__question--answered");
          choices.forEach(function (c) {
            var input = c.querySelector("input");
            if (input && input.value === correctValue) {
              c.classList.add("quiz__choice--correct");
            }
          });
        }
      });

      var percentage = Math.round((correct / total) * 100);
      resultsDiv.innerHTML =
        '<div class="quiz__score">' +
        '<h3>Your Score: ' + correct + ' / ' + total + ' (' + percentage + '%)</h3>' +
        (percentage === 100 ? '<p>Perfect score! Excellent work.</p>' :
         percentage >= 80 ? '<p>Great job! Review the questions you missed.</p>' :
         percentage >= 60 ? '<p>Good effort. Consider reviewing the material and trying again.</p>' :
         '<p>You may want to revisit the readings before retrying.</p>') +
        '<button class="quiz__retry" type="button">Try Again</button>' +
        '</div>';

      resultsDiv.style.display = "block";
      resultsDiv.scrollIntoView({ behavior: "smooth", block: "center" });

      // Retry button
      resultsDiv.querySelector(".quiz__retry").addEventListener("click", function () {
        questions.forEach(function (q) {
          q.classList.remove("quiz__question--answered");
          q.querySelectorAll(".quiz__choice").forEach(function (c) {
            c.classList.remove("quiz__choice--correct", "quiz__choice--incorrect");
          });
          q.querySelectorAll('input[type="radio"]').forEach(function (r) {
            r.checked = false;
          });
        });
        resultsDiv.style.display = "none";
        quiz.scrollIntoView({ behavior: "smooth" });
      });
    });
  });
})();
