/**
 * GET /api/v1/papers — list papers (operationId listPapers).
 */
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Vary", "Accept, Accept-Encoding");
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host;
    const base = `${proto}://${host}`;
    const r = await fetch(new URL("/api/v1/papers.json", base).toString(), {
      headers: { Accept: "application/json" },
    });
    if (!r.ok) throw new Error(`static fetch HTTP ${r.status}`);
    const data = await r.json();
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    res.status(200).json(data);
  } catch {
    res.setHeader("Content-Type", "application/problem+json; charset=utf-8");
    res.status(503).json({
      type: "about:blank",
      title: "Upstream unavailable",
      status: 503,
      code: "upstream_unavailable",
      message: "Could not load papers index.",
      hint: "Retry shortly or see /docs and /openapi.json.",
    });
  }
}
