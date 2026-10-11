module.exports = function (eleventyConfig) {
  // Passthrough copy — files copied as-is to output
  eleventyConfig.addPassthroughCopy("phil1301/css");
  eleventyConfig.addPassthroughCopy("phil1301/js");
  eleventyConfig.addPassthroughCopy("phil1301/assets");
  eleventyConfig.addPassthroughCopy("index.html");

  // Ignore non-site files
  eleventyConfig.ignores.add("docs/**");
  eleventyConfig.ignores.add(".claude/**");
  eleventyConfig.ignores.add("node_modules/**");
  eleventyConfig.ignores.add("sand-box-number-1-phil-1301-export.imscc");
  eleventyConfig.ignores.add(".github/**");

  // Collections: one per unit, ordered by position
  eleventyConfig.addCollection("starthere", function (collectionApi) {
    return collectionApi.getFilteredByTag("starthere").sort((a, b) => a.data.position - b.data.position);
  });
  eleventyConfig.addCollection("unit1", function (collectionApi) {
    return collectionApi.getFilteredByTag("unit1").sort((a, b) => a.data.position - b.data.position);
  });
  eleventyConfig.addCollection("unit2", function (collectionApi) {
    return collectionApi.getFilteredByTag("unit2").sort((a, b) => a.data.position - b.data.position);
  });
  eleventyConfig.addCollection("unit3", function (collectionApi) {
    return collectionApi.getFilteredByTag("unit3").sort((a, b) => a.data.position - b.data.position);
  });
  eleventyConfig.addCollection("unit4", function (collectionApi) {
    return collectionApi.getFilteredByTag("unit4").sort((a, b) => a.data.position - b.data.position);
  });
  eleventyConfig.addCollection("unit5", function (collectionApi) {
    return collectionApi.getFilteredByTag("unit5").sort((a, b) => a.data.position - b.data.position);
  });
  eleventyConfig.addCollection("unit6", function (collectionApi) {
    return collectionApi.getFilteredByTag("unit6").sort((a, b) => a.data.position - b.data.position);
  });
  eleventyConfig.addCollection("finalexam", function (collectionApi) {
    return collectionApi.getFilteredByTag("finalexam").sort((a, b) => a.data.position - b.data.position);
  });

  // Tables scroll inside their own box on narrow screens instead of widening the page.
  eleventyConfig.addTransform("wrapTables", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    return content
      .replace(/<table\b/g, '<div class="table-wrap"><table')
      .replace(/<\/table>/g, "</table></div>");
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "phil1301/_includes",
      data: "phil1301/_data",
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
  };
};
