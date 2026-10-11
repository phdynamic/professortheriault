(function () {
  var L = window.RandomizerLogic;
  var $ = function (id) { return document.getElementById(id); };
  var storage = null;
  try { storage = window.localStorage; storage.getItem("artRandomizerHistory"); } catch (e) { storage = null; }

  var works = [], byId = {}, spinning = false, current = null, answered = false;
  var CARDS = 24, LAND = 20, SPIN_MS = 2800;
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function unitLink(w) { return "/huma1301/" + w.unit + "/lesson/"; }
  function unitNumber(w) { var m = /unit-(\d+)/.exec(w.unit); return m ? m[1] : ""; }

  function thumbFor(w) {
    if (w.media.type === "image") { var img = el("img"); img.src = w.media.src; img.alt = ""; return img; }
    return el("span", "card__video", "▶");
  }

  function renderHistory() {
    var list = $("history-list"), empty = $("history-empty");
    clear(list);
    var h = L.loadHistory(storage).filter(function (e) { return byId[e.id]; });
    empty.hidden = h.length > 0;
    $("clear-history").hidden = h.length === 0;
    h.forEach(function (e) {
      var w = byId[e.id], li = el("li"), b = el("button");
      b.type = "button";
      var t = el("span", "thumb"); t.appendChild(thumbFor(w));
      b.appendChild(t); b.appendChild(el("span", "name", w.title + " — " + w.creator));
      b.addEventListener("click", function () {
        if (spinning) return;
        showWork(w, true);
        window.scrollTo({ top: $("work").offsetTop - 20, behavior: reduce ? "auto" : "smooth" });
      });
      li.appendChild(b); list.appendChild(li);
    });
  }

  function buildTrack() {
    var track = $("wheel-track");
    clear(track);
    track.style.transition = "none"; track.style.transform = "translateX(0)";
    for (var i = 0; i < CARDS; i++) track.appendChild(el("div", "card", "?"));
    return track;
  }

  function landOffset(track) {
    var win = $("wheel-window").clientWidth;
    var card = track.children[LAND];
    return -(card.offsetLeft + card.offsetWidth / 2 - win / 2);
  }

  function mediaNode(w) {
    var box = el("div");
    if (w.media.type === "image") {
      var img = el("img"); img.alt = w.media.alt;
      img.onerror = function () { clear(box); box.appendChild(el("p", "work__missing", "This image could not be loaded. You can still guess below.")); };
      img.src = w.media.src; box.appendChild(img);
    } else {
      var wrap = el("div", "work__video"), f = el("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + w.media.id;
      f.title = "Video: " + w.title;
      f.setAttribute("allow", "accelerometer; encrypted-media; gyroscope; picture-in-picture");
      f.allowFullscreen = true;
      wrap.appendChild(f); box.appendChild(wrap);
    }
    return box;
  }

  function showWork(w, fromHistory) {
    current = w; answered = false;
    $("work").hidden = false;
    clear($("work-media")); $("work-media").appendChild(mediaNode(w));
    $("reveal").hidden = true;
    var kinds = L.questionKinds(w, works);
    var q = L.buildQuestion(w, works, kinds[Math.floor(Math.random() * kinds.length)], Math.random);
    $("quiz-text").textContent = q.text;
    var ul = $("quiz-options"); clear(ul);
    q.options.forEach(function (opt, i) {
      var li = el("li"), b = el("button", "", opt); b.type = "button";
      b.addEventListener("click", function () { answer(q, i, ul); });
      li.appendChild(b); ul.appendChild(li);
    });
    $("status").textContent = fromHistory ? "Showing a work from your history. Make a guess." : "Landed. Make a guess.";
  }

  function answer(q, i, ul) {
    if (answered) return;
    answered = true;
    var buttons = ul.querySelectorAll("button");
    buttons.forEach(function (b, k) { b.disabled = true; if (k === q.answerIndex) b.classList.add("is-right"); else if (k === i) b.classList.add("is-wrong"); });
    var w = current;
    $("reveal-verdict").textContent = i === q.answerIndex ? "Yes! That's right." : "Not quite. The answer is " + q.options[q.answerIndex] + ".";
    $("reveal-title").textContent = w.title;
    $("reveal-meta").textContent = w.creator + ", " + w.yearLabel + " · " + w.region + " · " + w.form;
    $("reveal-credit").textContent = w.credit;
    $("reveal-notice").textContent = w.notice;
    var pl = $("reveal-prompts"); clear(pl);
    w.prompts.forEach(function (p) { pl.appendChild(el("li", "", p)); });
    var a = $("reveal-unit"); a.href = unitLink(w); a.textContent = "Explore this in Unit " + unitNumber(w) + " of the Humanities course";
    $("reveal").hidden = false;
    $("reveal-title").focus();   // the clicked option was disabled, which would drop focus to <body>
    $("status").textContent = $("reveal-verdict").textContent + " " + w.title + " by " + w.creator + ".";
  }

  function randomize() {
    if (spinning || !works.length) return;
    spinning = true;
    $("randomize").disabled = true;
    $("work").hidden = true;
    var recent = L.loadHistory(storage).slice(0, 10).map(function (e) { return e.id; });
    var chosen = L.pickWork(works, recent, Math.random);   // decided BEFORE the animation
    var track = buildTrack();
    $("status").textContent = "Choosing a work…";

    function land() {
      var card = track.children[LAND];
      card.className = "card card--landed card--flip";
      clear(card); card.appendChild(thumbFor(chosen));
      L.addHistory(storage, chosen.id, Date.now());
      renderHistory();
      showWork(chosen, false);
      spinning = false; $("randomize").disabled = false;
      $("quiz-text").focus();
    }

    if (reduce) { track.style.transform = "translateX(" + landOffset(track) + "px)"; setTimeout(land, 400); return; }
    var off = landOffset(track);
    track.getBoundingClientRect(); // flush so the transition starts from the left
    track.style.transition = "transform " + SPIN_MS + "ms cubic-bezier(0.12, 0.65, 0.12, 1)";
    track.style.transform = "translateX(" + off + "px)";
    var done = false;
    function finish() {
      if (done) return; done = true;
      // Snap to the final position in case the browser skipped the transition (for example in a background tab).
      track.style.transition = "none"; track.style.transform = "translateX(" + off + "px)";
      land();
    }
    track.addEventListener("transitionend", finish, { once: true });
    setTimeout(finish, SPIN_MS + 300);
  }

  function init() {
    fetch("works.json").then(function (r) { return r.json(); }).then(function (data) {
      works = data; data.forEach(function (w) { byId[w.id] = w; });
      buildTrack();
      $("randomize").addEventListener("click", randomize);
      $("clear-history").addEventListener("click", function () { L.clearHistory(storage); renderHistory(); $("randomize").focus(); });
      renderHistory();
    }).catch(function () {
      $("status").textContent = "The art pool could not be loaded.";
      $("randomize").disabled = true;
    });
  }
  init();
})();
