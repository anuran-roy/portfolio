/**
 * GET /api/v1/posts — list blog posts (operationId listPosts).
 * Query: limit 1-50 (default 10), tag optional.
 * Errors are application/problem+json with code/message/hint.
 */
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Vary", "Accept, Accept-Encoding");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  const base = `${proto}://${host}`;
  const url = new URL(req.url, base);

  const limitRaw = url.searchParams.get("limit") ?? "10";
  const limit = Number.parseInt(limitRaw, 10);
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    res.setHeader("Content-Type", "application/problem+json; charset=utf-8");
    res.status(400).json({
      type: "about:blank",
      title: "Invalid limit",
      status: 400,
      code: "invalid_limit",
      message: "limit must be an integer between 1 and 50.",
      hint: "Try /api/v1/posts?limit=5. See /docs and /openapi.json.",
    });
    return;
  }

  const tag = url.searchParams.get("tag");
  if (tag && tag.length > 64) {
    res.setHeader("Content-Type", "application/problem+json; charset=utf-8");
    res.status(400).json({
      type: "about:blank",
      title: "Invalid tag",
      status: 400,
      code: "invalid_tag",
      message: "tag must be 64 characters or fewer.",
      hint: "Try /api/v1/posts?tag=python. See /docs and /openapi.json.",
    });
    return;
  }

  try {
    const r = await fetch(new URL("/api/v1/posts.json", base).toString(), {
      headers: { Accept: "application/json" },
    });
    if (!r.ok) throw new Error(`static fetch HTTP ${r.status}`);
    const data = await r.json();
    let items = Array.isArray(data.data) ? data.data : [];
    if (tag) items = items.filter((p) => Array.isArray(p.tags) && p.tags.includes(tag));
    items = items.slice(0, limit);
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    res.status(200).json({ data: items, count: items.length });
  } catch (e) {
    res.setHeader("Content-Type", "application/problem+json; charset=utf-8");
    res.status(503).json({
      type: "about:blank",
      title: "Upstream unavailable",
      status: 503,
      code: "upstream_unavailable",
      message: "Could not load posts index.",
      hint: "Retry shortly or see /docs and /openapi.json.",
    });
  }
}
