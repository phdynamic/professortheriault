const cheerio = require("cheerio");

function cleanCanvasHtml(rawHtml, filenameMap) {
  const $ = cheerio.load(rawHtml);

  $("[style]").removeAttr("style");
  $("[data-api-endpoint]").removeAttr("data-api-endpoint");
  $("[data-api-returntype]").removeAttr("data-api-returntype");

  $(".instructure_file_link").removeClass("instructure_file_link");
  $(".instructure_scribd_file").removeClass("instructure_scribd_file");
  $(".inline_disabled").removeClass("inline_disabled");

  $("[class='']").removeAttr("class");

  $("img").each(function () {
    const src = $(this).attr("src");
    if (src && src.includes("$IMS-CC-FILEBASE$")) {
      const resolved = resolveAssetPath(src, filenameMap, "/phil1301/assets/images/");
      $(this).attr("src", resolved);
    }
  });

  $("a").each(function () {
    let href = $(this).attr("href");
    if (!href) return;

    href = href.replace(/\?canvas_=1&canvas_qs_wrap=1/g, "");
    href = href.replace(/\?canvas_download=1&canvas_qs_wrap=1/g, "");

    if (href.includes("$IMS-CC-FILEBASE$")) {
      const isPdf = href.toLowerCase().includes(".pdf");
      const baseDir = isPdf
        ? "/phil1301/assets/handouts/"
        : "/phil1301/assets/images/";
      href = resolveAssetPath(href, filenameMap, baseDir);
    }

    $(this).attr("href", href);
  });

  const bodyHtml = $("body").html() || $.html();

  return { $, bodyHtml: bodyHtml.trim() };
}

function resolveAssetPath(originalPath, filenameMap, baseDir) {
  let cleaned = originalPath.replace(/\$IMS-CC-FILEBASE\$\/?/, "");
  cleaned = cleaned.split("?")[0];

  const decoded = decodeURIComponent(cleaned);

  const candidates = [
    cleaned,
    decoded,
    cleaned.replace(/^Uploaded%20Media\//, "Uploaded Media/"),
    decoded.replace(/^Uploaded Media\//, ""),
    cleaned.replace(/^Uploaded%20Media\//, ""),
    cleaned.replace(/^Handouts\//, ""),
    decoded.replace(/^Handouts\//, ""),
  ];

  for (const candidate of candidates) {
    if (filenameMap[candidate]) {
      return baseDir + filenameMap[candidate];
    }
  }

  const filename = decoded.split("/").pop();
  const normalized = filename
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/-+/g, "-");

  console.warn(`Asset path not found in map: "${decoded}" — using normalized: "${normalized}"`);
  return baseDir + normalized;
}

module.exports = { cleanCanvasHtml, resolveAssetPath };
