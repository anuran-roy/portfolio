/**
 * GET /api/v1/health — liveness (operationId getHealth).
 * Public, no auth. Returns JSON, never HTML.
 */
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Vary", "Accept, Accept-Encoding");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
  res.status(200).json({ status: "ok", site: "https://anuran.dev", version: "1.0.0" });
}
