module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("course-assets");
  eleventyConfig.addPassthroughCopy("phil1301/assets");
  eleventyConfig.addPassthroughCopy("index.html");

  eleventyConfig.ignores.add("docs/**");
  eleventyConfig.ignores.add(".claude/**");
  eleventyConfig.ignores.add("node_modules/**");
  eleventyConfig.ignores.add(".github/**");

  // Pages in the same course and module, in position order — drives prev/next and unit tables of contents.
  eleventyConfig.addFilter("modulePages", function (allPages, courseSlug, moduleSlug) {
    return allPages
      .filter((p) => p.data.course && p.data.course.slug === courseSlug && p.data.module === moduleSlug)
      .sort((a, b) => a.data.position - b.data.position);
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
  };
};
