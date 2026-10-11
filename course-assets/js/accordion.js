(function () {
  document.querySelectorAll(".accordion__header").forEach(function (header) {
    header.addEventListener("click", function () {
      var item = this.closest(".accordion__item");
      var content = item.querySelector(".accordion__content");
      var isOpen = item.classList.contains("accordion__item--open");

      if (isOpen) {
        content.style.maxHeight = null;
        item.classList.remove("accordion__item--open");
        this.setAttribute("aria-expanded", "false");
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        item.classList.add("accordion__item--open");
        this.setAttribute("aria-expanded", "true");
      }
    });

    // Keyboard: Enter and Space toggle
    header.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Auto-open first accordion item on each accordion
  document.querySelectorAll(".accordion").forEach(function (accordion) {
    var firstItem = accordion.querySelector(".accordion__item");
    if (firstItem) {
      var header = firstItem.querySelector(".accordion__header");
      var content = firstItem.querySelector(".accordion__content");
      firstItem.classList.add("accordion__item--open");
      header.setAttribute("aria-expanded", "true");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
})();
