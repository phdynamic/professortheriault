(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.RandomizerLogic = factory();
})(typeof self !== "undefined" ? self : this, function () {
  var FORMS = ["painting", "sculpture", "architecture", "literature", "theater", "music", "dance", "photography", "cinema", "television and video art"];
  var KEY = "artRandomizerHistory";
  var MAX_HISTORY = 50;

  function ordinal(n) {
    var s = n % 100;
    if (s >= 11 && s <= 13) return n + "th";
    var r = n % 10;
    return n + (r === 1 ? "st" : r === 2 ? "nd" : r === 3 ? "rd" : "th");
  }

  function centuryLabel(year) {
    if (year < -3000) return "Prehistoric";
    if (year > 0) return ordinal(Math.ceil(year / 100)) + " century";
    return ordinal(Math.max(1, Math.ceil(Math.abs(year) / 100))) + " century BCE";
  }

  function shuffle(arr, rng) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function pickWork(works, recentIds, rng) {
    var recent = {};
    (recentIds || []).forEach(function (id) { recent[id] = true; });
    var fresh = works.filter(function (w) { return !recent[w.id]; });
    var list = fresh.length ? fresh : works;
    return list[Math.min(list.length - 1, Math.floor(rng() * list.length))];
  }

  function distinct(works, fn) {
    var seen = {}, out = [];
    works.forEach(function (w) { var v = fn(w); if (v && !seen[v]) { seen[v] = true; out.push(v); } });
    return out;
  }

  var ANSWER = {
    form: function (w) { return w.form; },
    century: function (w) { return centuryLabel(w.year); },
    region: function (w) { return w.region; },
  };
  var TEXT = {
    form: "Which art form is this?",
    century: "Roughly when was this made?",
    region: "Where was this made?",
  };

  // Works with no firm date (living traditions, for example) never supply or receive a century question.
  function dated(works) { return works.filter(function (w) { return !w.undated; }); }

  function questionKinds(work, works) {
    var kinds = ["form"];
    if (!work.undated && distinct(dated(works), ANSWER.century).length >= 4) kinds.push("century");
    if (distinct(works, ANSWER.region).length >= 4) kinds.push("region");
    return kinds;
  }

  function buildQuestion(work, works, kind, rng) {
    var answer = ANSWER[kind](work);
    var pool = kind === "form" ? FORMS.slice() : distinct(kind === "century" ? dated(works) : works, ANSWER[kind]);
    var wrong = shuffle(pool.filter(function (o) { return o !== answer; }), rng).slice(0, 3);
    var options = shuffle([answer].concat(wrong), rng);
    return { kind: kind, text: TEXT[kind], options: options, answerIndex: options.indexOf(answer) };
  }

  function loadHistory(storage) {
    try {
      if (!storage) return [];
      var raw = storage.getItem(KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.filter(function (e) { return e && typeof e.id === "string"; }).slice(0, MAX_HISTORY);
    } catch (e) { return []; }
  }

  function addHistory(storage, id, now) {
    try {
      if (!storage) return;
      var list = loadHistory(storage).filter(function (e) { return e.id !== id; });
      list.unshift({ id: id, t: now });
      storage.setItem(KEY, JSON.stringify(list.slice(0, MAX_HISTORY)));
    } catch (e) { /* storage unavailable: history simply stays empty */ }
  }

  function clearHistory(storage) {
    try { if (storage) storage.removeItem(KEY); } catch (e) { /* ignore */ }
  }

  return { FORMS: FORMS, centuryLabel: centuryLabel, pickWork: pickWork, questionKinds: questionKinds, buildQuestion: buildQuestion, loadHistory: loadHistory, addHistory: addHistory, clearHistory: clearHistory };
});
