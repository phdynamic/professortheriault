const cheerio = require("cheerio");

function transformComponents(bodyHtml) {
  const $ = cheerio.load(bodyHtml, { decodeEntities: false });

  transformAccordionsToTabs($);
  transformCalloutBoxes($);
  transformArgumentBlocks($);
  transformHeroImage($);
  transformVideoEmbeds($);
  transformPdfLinks($);

  return $("body").html() || $.html();
}

function transformAccordionsToTabs($) {
  const detailsElements = $("details");
  if (detailsElements.length === 0) return;

  const groups = [];
  let currentGroup = [];
  let lastElement = null;

  detailsElements.each(function () {
    const el = $(this);
    if (lastElement && areSiblings($, lastElement, el)) {
      currentGroup.push(el);
    } else {
      if (currentGroup.length > 0) groups.push([...currentGroup]);
      currentGroup = [el];
    }
    lastElement = el;
  });
  if (currentGroup.length > 0) groups.push(currentGroup);

  let tabGroupId = 0;
  for (const group of groups) {
    const prefix = `tabs-${tabGroupId}`;
    let tabsHtml = `<div class="tabs">`;
    tabsHtml += `<div class="tabs__bar" role="tablist">`;

    group.forEach((el, i) => {
      const summary = el.find("summary").first().text().trim();
      const isActive = i === 0;
      tabsHtml += `<button class="tabs__tab${isActive ? " tabs__tab--active" : ""}" role="tab" aria-selected="${isActive}" aria-controls="${prefix}-panel-${i}" id="${prefix}-tab-${i}">${summary}</button>`;
    });
    tabsHtml += `</div>`;

    group.forEach((el, i) => {
      const isActive = i === 0;
      const clone = el.clone();
      clone.find("summary").remove();
      const content = clone.html().trim();

      tabsHtml += `<div class="tabs__panel${isActive ? " tabs__panel--active" : ""}" role="tabpanel" id="${prefix}-panel-${i}" aria-labelledby="${prefix}-tab-${i}"${!isActive ? " hidden" : ""}>${content}</div>`;
    });

    tabsHtml += `</div>`;

    group[0].before(tabsHtml);
    group.forEach((el) => el.remove());

    tabGroupId++;
  }
}

function areSiblings($, el1, el2) {
  let next = el1.next();
  let attempts = 0;
  while (next.length && attempts < 5) {
    if (next[0] === el2[0]) return true;
    const tagName = next.prop("tagName");
    if (tagName && tagName.toLowerCase() === "details") return false;
    next = next.next();
    attempts++;
  }
  return false;
}

function transformCalloutBoxes($) {
  $("[data-callout-type]").each(function () {
    const el = $(this);
    const type = el.attr("data-callout-type");
    el.removeAttr("data-callout-type");

    const icons = {
      concept: "&#128161;",
      note: "&#8505;&#65039;",
      connection: "&#10145;&#65039;",
    };

    const icon = icons[type] || icons.note;
    const innerHtml = el.html();

    el.replaceWith(
      `<div class="callout callout--${type}"><span class="callout__icon" aria-hidden="true">${icon}</span><div class="callout__content">${innerHtml}</div></div>`
    );
  });
}

function transformArgumentBlocks($) {
  $("div").each(function () {
    const el = $(this);
    const text = el.text().trim();
    if (/^P1[.:]/m.test(text) && /^C[.:]/m.test(text)) {
      el.addClass("argument-block");
    }
  });
}

function transformHeroImage($) {
  const firstImg = $("img").first();
  if (firstImg.length) {
    firstImg.addClass("page-hero-image");
  }
}

function transformVideoEmbeds($) {
  $("iframe").each(function () {
    const el = $(this);
    const src = el.attr("src") || "";
    if (src.includes("youtube") || src.includes("youtu.be")) {
      const outerHtml = $.html(el);
      el.replaceWith(`<div class="video-embed">${outerHtml}</div>`);
    }
  });
}

function transformPdfLinks($) {
  $("a").each(function () {
    const el = $(this);
    const href = el.attr("href") || "";
    if (href.toLowerCase().endsWith(".pdf")) {
      el.addClass("download-link");
    }
  });
}

module.exports = { transformComponents, transformCalloutBoxes };
