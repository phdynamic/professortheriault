(function () {
  // Sidebar accordion toggles
  var toggles = document.querySelectorAll(".sidebar__toggle");
  toggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var module = this.closest(".sidebar__module");
      var isActive = module.classList.contains("sidebar__module--active");

      // Close all modules
      document.querySelectorAll(".sidebar__module--active").forEach(function (m) {
        m.classList.remove("sidebar__module--active");
        m.querySelector(".sidebar__toggle").setAttribute("aria-expanded", "false");
      });

      // Open clicked module (if it wasn't already open)
      if (!isActive) {
        module.classList.add("sidebar__module--active");
        this.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Mobile hamburger toggle
  var hamburger = document.querySelector(".top-nav__hamburger");
  var sidebar = document.getElementById("sidebar");
  var backdrop = document.getElementById("sidebar-backdrop");

  function openSidebar() {
    sidebar.classList.add("sidebar--open");
    backdrop.classList.add("sidebar-backdrop--visible");
    hamburger.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    sidebar.classList.remove("sidebar--open");
    backdrop.classList.remove("sidebar-backdrop--visible");
    hamburger.setAttribute("aria-expanded", "false");
  }

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      var isOpen = sidebar.classList.contains("sidebar--open");
      if (isOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeSidebar);
  }
})();
