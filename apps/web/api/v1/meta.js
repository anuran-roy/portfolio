/**
 * GET /api/v1/meta — site identity (operationId getMeta).
 */
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Vary", "Accept, Accept-Encoding");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
  res.status(200).json({
    site: {
      name: "Anuran Roy — A Tinkerer's Canvas",
      url: "https://anuran.dev",
      description:
        "Anuran's journal on the internet - capturing his late-night breakdowns to his Eureka moments.",
    },
    author: { name: "Anuran Roy", url: "https://anuran.dev/about" },
    resources: {
      docs: "https://anuran.dev/docs",
      developers: "https://anuran.dev/developers",
      openapi: "https://anuran.dev/openapi.json",
      sitemap: "https://anuran.dev/sitemap-index.xml",
      llmsTxt: "https://anuran.dev/llms.txt",
      rss: "https://anuran.dev/rss.xml",
      contact: "https://anuran.dev/contact",
      privacy: "https://anuran.dev/privacy",
    },
  });
}
