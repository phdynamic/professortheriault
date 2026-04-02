(function () {
  document.querySelectorAll(".tabs").forEach(function (tabContainer) {
    var tabs = tabContainer.querySelectorAll(".tabs__tab");
    var panels = tabContainer.querySelectorAll(".tabs__panel");

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          t.classList.remove("tabs__tab--active");
          t.setAttribute("aria-selected", "false");
        });
        panels.forEach(function (p) {
          p.classList.remove("tabs__panel--active");
          p.setAttribute("hidden", "");
        });

        tab.classList.add("tabs__tab--active");
        tab.setAttribute("aria-selected", "true");
        var panelId = tab.getAttribute("aria-controls");
        var panel = document.getElementById(panelId);
        if (panel) {
          panel.classList.add("tabs__panel--active");
          panel.removeAttribute("hidden");
        }
      });

      tab.addEventListener("keydown", function (e) {
        var index = Array.from(tabs).indexOf(tab);
        var newIndex = -1;

        if (e.key === "ArrowRight") {
          newIndex = (index + 1) % tabs.length;
        } else if (e.key === "ArrowLeft") {
          newIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === "Home") {
          newIndex = 0;
        } else if (e.key === "End") {
          newIndex = tabs.length - 1;
        }

        if (newIndex >= 0) {
          e.preventDefault();
          tabs[newIndex].focus();
          tabs[newIndex].click();
        }
      });
    });
  });
})();
