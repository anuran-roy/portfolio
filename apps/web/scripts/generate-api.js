/**
 * Generates public read-only JSON API files from content collections.
 * Runs before `astro build` so outputs are copied from public/ -> dist/.
 * No visual changes: headless JSON only.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const contentRoot = path.join(webRoot, "src", "content");
const outRoot = path.join(webRoot, "public", "api", "v1");

const SITE = "https://anuran.dev";

function parseFrontmatter(raw) {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return {};
  const data = {};
  const lines = m[1].split("\n");
  let currentKey = null;
  for (const line of lines) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      let val = kv[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (val === "true") val = true;
      else if (val === "false") val = false;
      else if (!isNaN(Number(val)) && val !== "") val = Number(val);
      data[currentKey] = val;
    }
  }
  // tags: ["a", "b"] — parse simple flow arrays
  for (const k of Object.keys(data)) {
    if (typeof data[k] === "string" && data[k].startsWith("[") && data[k].endsWith("]")) {
      try {
        // crude: split by comma, strip quotes
        const inner = data[k].slice(1, -1).trim();
        if (!inner) data[k] = [];
        else {
          data[k] = inner.split(",").map((s) => s.trim().replace(/^["']|["']$/g, ""));
        }
      } catch {}
    }
  }
  return data;
}

async function listFilesRecursive(dir, exts = [".md", ".mdx"]) {
  const out = [];
  async function walk(d) {
    let entries = [];
    try {
      entries = await fs.readdir(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) await walk(p);
      else if (exts.some((ext) => e.name.endsWith(ext))) out.push(p);
    }
  }
  await walk(dir);
  return out;
}

async function buildPosts() {
  const files = await listFilesRecursive(path.join(contentRoot, "blog"));
  const posts = [];
  for (const f of files) {
    const raw = await fs.readFile(f, "utf8");
    const fm = parseFrontmatter(raw);
    if (fm.draft === true) continue;
    const rel = path.relative(path.join(contentRoot, "blog"), f).replace(/\\/g, "/").replace(/\.(md|mdx)$/, "");
    // skip copy duplicates with spaces
    if (rel.includes(" copy")) continue;
    posts.push({
      slug: rel,
      title: fm.title || rel,
      description: fm.description || "",
      url: `${SITE}/blog/${rel}/`,
      date: fm.date ? new Date(fm.date).toISOString() : undefined,
      tags: Array.isArray(fm.tags) ? fm.tags : [],
    });
  }
  posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return posts;
}

async function buildProjects() {
  const files = await listFilesRecursive(path.join(contentRoot, "projects"));
  const items = [];
  for (const f of files) {
    const raw = await fs.readFile(f, "utf8");
    const fm = parseFrontmatter(raw);
    if (fm.draft === true) continue;
    const rel = path.relative(path.join(contentRoot, "projects"), f).replace(/\\/g, "/").replace(/\.(md|mdx)$/, "");
    items.push({
      slug: rel,
      title: fm.title || rel,
      description: fm.description || "",
      url: `${SITE}/projects/${rel}/`,
    });
  }
  items.sort((a, b) => a.title.localeCompare(b.title));
  return items;
}

async function buildPapers() {
  const files = await listFilesRecursive(path.join(contentRoot, "papers"));
  const items = [];
  for (const f of files) {
    const raw = await fs.readFile(f, "utf8");
    const fm = parseFrontmatter(raw);
    if (fm.draft === true) continue;
    const rel = path.relative(path.join(contentRoot, "papers"), f).replace(/\\/g, "/").replace(/\.(md|mdx)$/, "");
    items.push({
      slug: rel,
      title: fm.title || rel,
      description: fm.description || "",
      url: `${SITE}/papers/${rel}/`,
    });
  }
  items.sort((a, b) => a.title.localeCompare(b.title));
  return items;
}

async function main() {
  await fs.mkdir(outRoot, { recursive: true });
  const [posts, projects, papers] = await Promise.all([buildPosts(), buildProjects(), buildPapers()]);

  const health = { status: "ok", site: SITE, version: "1.0.0" };
  const meta = {
    site: {
      name: "Anuran Roy — A Tinkerer's Canvas",
      url: SITE,
      description: "Anuran's journal on the internet - capturing his late-night breakdowns to his Eureka moments.",
    },
    author: { name: "Anuran Roy", url: `${SITE}/about` },
    resources: {
      docs: `${SITE}/docs`,
      developers: `${SITE}/developers`,
      openapi: `${SITE}/openapi.json`,
      sitemap: `${SITE}/sitemap-index.xml`,
      llmsTxt: `${SITE}/llms.txt`,
      rss: `${SITE}/rss.xml`,
      contact: `${SITE}/contact`,
      privacy: `${SITE}/privacy`,
    },
  };

  await fs.writeFile(path.join(outRoot, "health.json"), JSON.stringify(health, null, 2) + "\n");
  await fs.writeFile(path.join(outRoot, "posts.json"), JSON.stringify({ data: posts, count: posts.length }, null, 2) + "\n");
  await fs.writeFile(path.join(outRoot, "projects.json"), JSON.stringify({ data: projects, count: projects.length }, null, 2) + "\n");
  await fs.writeFile(path.join(outRoot, "papers.json"), JSON.stringify({ data: papers, count: papers.length }, null, 2) + "\n");
  await fs.writeFile(path.join(outRoot, "meta.json"), JSON.stringify(meta, null, 2) + "\n");

  // Clean URLs without .json extension for agent-friendly API (Astro serves public files verbatim;
  // Vercel rewrites in vercel.json map /api/v1/posts -> /api/v1/posts.json).
  // Also write an index for /api.
  const apiIndex = {
    site: SITE,
    version: "1.0.0",
    endpoints: {
      health: `${SITE}/api/v1/health`,
      posts: `${SITE}/api/v1/posts`,
      projects: `${SITE}/api/v1/projects`,
      papers: `${SITE}/api/v1/papers`,
      meta: `${SITE}/api/v1/meta`,
    },
    docs: `${SITE}/docs`,
    openapi: `${SITE}/openapi.json`,
  };
  await fs.mkdir(path.join(webRoot, "public", "api"), { recursive: true });
  await fs.writeFile(path.join(webRoot, "public", "api", "index.json"), JSON.stringify(apiIndex, null, 2) + "\n");

  console.log(`[generate-api] posts=${posts.length} projects=${projects.length} papers=${papers.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
