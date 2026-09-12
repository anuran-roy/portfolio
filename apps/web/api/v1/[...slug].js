/**
 * Catch-all for /api/v1/* unknown routes — always JSON 404 (never HTML).
 */
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/problem+json; charset=utf-8");
  res.setHeader("Vary", "Accept, Accept-Encoding");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host || "anuran.dev";
  let pathname = "/api/v1/unknown";
  try {
    pathname = new URL(req.url, `${proto}://${host}`).pathname;
  } catch {}
  res.status(404).json({
    type: "about:blank",
    title: "API route not found",
    status: 404,
    code: "api_not_found",
    message: `No API route at ${pathname}.`,
    hint: "See /docs and /openapi.json. Try GET /api/v1/health, /api/v1/posts, /api/v1/projects, /api/v1/papers, /api/v1/meta.",
  });
}
