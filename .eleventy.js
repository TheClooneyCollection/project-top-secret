import YAML from "yaml";

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });

  eleventyConfig.addDataExtension("yml", (contents) => YAML.parse(contents));
  eleventyConfig.addDataExtension("yaml", (contents) => YAML.parse(contents));

  eleventyConfig.addWatchTarget("src/**/*.{njk,html,css,js,yml,yaml}");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "dist"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
