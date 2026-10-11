(function () {
  document.querySelectorAll(".gallery").forEach(function (g) {
    var thumbs = g.querySelectorAll(".gallery__thumb");
    var viewer = g.querySelector(".gallery__viewer");
    if (!thumbs.length || !viewer) return;
    var media = viewer.querySelector(".gallery__media");
    var credit = viewer.querySelector(".gallery__credit");
    var notice = viewer.querySelector(".gallery__notice");

    function show(t) {
      thumbs.forEach(function (x) {
        x.classList.toggle("gallery__thumb--current", x === t);
        x.setAttribute("aria-current", x === t ? "true" : "false");
      });
      media.innerHTML = "";
      media.classList.remove("gallery__media--video");
      var video = t.getAttribute("data-video");
      if (video) {
        var f = document.createElement("iframe");
        f.src = "https://www.youtube-nocookie.com/embed/" + video;
        f.title = t.getAttribute("data-title") || "Video";
        f.setAttribute("allow", "accelerometer; encrypted-media; gyroscope; picture-in-picture");
        f.allowFullscreen = true;
        media.classList.add("gallery__media--video");
        media.appendChild(f);
      } else {
        var img = document.createElement("img");
        img.alt = t.querySelector("img").alt;
        img.onerror = function () {
          media.innerHTML = '<p class="gallery__missing">Image unavailable. See the credit below.</p>';
        };
        img.src = t.getAttribute("href");
        media.appendChild(img);
      }
      credit.textContent = t.getAttribute("data-credit") || "";
      notice.textContent = t.getAttribute("data-notice") || "";
    }

    thumbs.forEach(function (t) {
      t.addEventListener("click", function (e) { e.preventDefault(); show(t); });
    });
    viewer.hidden = false;
    show(thumbs[0]);
  });
})();
