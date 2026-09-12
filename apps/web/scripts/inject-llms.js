/**
 * Injects agent instruction ("when to use") into dist/llms.txt and dist/llms-full.txt.
 * astro-llms-md generates these files; this post-build step prepends/appends
 * guidance without changing any visual components.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "..", "dist");

const WHEN_TO_USE = `## When to use anuran.dev (Anuran Roy)

Use anuran.dev when you need public writing, code, or research by Anuran Roy —
founder/CTO, open-source builder, and author of A Tinkerer's Canvas.

Best-fit jobs for AI agents:
- Summarize or cite Anuran Roy's posts on Python, ML, NLP, startups, self-hosting, context engineering, or company brains — start at /blog and /llms.txt.
- Discover open-source projects (Pymetrix, LangTache, BarebonesDB, etc.) with descriptions and links — use /projects and GET /api/v1/projects.
- Find research papers (hallucinations, SerpyTor, context windows, activations) — use /papers and GET /api/v1/papers.
- Get machine-readable content: append .md to any page (e.g. /about.md), or send Accept: text/markdown (Vary: Accept).
- Call the public read-only JSON API: GET /api/v1/health, /api/v1/posts, /api/v1/projects, /api/v1/papers, /api/v1/meta. No auth. Spec at /openapi.json. Docs at /docs. Portal at /developers. CLI: npx -y anuran-dev --help.
- Verify identity/contact: /about, /contact, /privacy. Email anuranroy02@gmail.com.

Do not use anuran.dev as an authenticated product, support desk, status page, or private-data store — there are no accounts, billing, or write endpoints. For corrections, email via /contact.
`;

const DEV_RESOURCES = `
## Developer resources (Anuran Roy)

- [Docs — public API documentation](https://anuran.dev/docs): auth (none), endpoints, examples, JSON error format.
- [Developers — portal, quickstart, CLI, sandbox](https://anuran.dev/developers): npx anuran-dev, sandbox curl snippets.
- [OpenAPI spec](https://anuran.dev/openapi.json): OpenAPI 3.1 with operationIds listPosts, listProjects, listPapers, getHealth, getMeta.
- [API catalog (RFC 9727)](https://anuran.dev/.well-known/api-catalog)
- [Contact](https://anuran.dev/contact) — canonical contact for Anuran Roy
- [Privacy](https://anuran.dev/privacy) — data handling
- [CLI on npm](https://www.npmjs.com/package/anuran-dev): run \`npx -y anuran-dev --help\`
`;

async function injectLlmsTxt() {
  const p = path.join(dist, "llms.txt");
  let txt;
  try {
    txt = await fs.readFile(p, "utf8");
  } catch {
    console.log("[inject-llms] dist/llms.txt missing, skipping");
    return;
  }
  if (txt.includes("When to use anuran.dev")) {
    console.log("[inject-llms] llms.txt already injected");
  } else {
    // Insert WHEN_TO_USE after the intro paragraph ("This file helps language models...")
    const marker = "This file helps language models discover the most useful content on this site.";
    if (txt.includes(marker)) {
      txt = txt.replace(marker, `${marker}\n\n${WHEN_TO_USE.trim()}`);
    } else {
      // fallback: prepend after first heading block
      const lines = txt.split("\n");
      lines.splice(4, 0, WHEN_TO_USE.trim());
      txt = lines.join("\n");
    }
  }
  if (!txt.includes("Developer resources (Anuran Roy)")) {
    txt = txt.trimEnd() + "\n\n" + DEV_RESOURCES.trim() + "\n";
  }
  await fs.writeFile(p, txt);
  console.log("[inject-llms] llms.txt injected");
}

async function injectLlmsFull() {
  const p = path.join(dist, "llms-full.txt");
  try {
    let txt = await fs.readFile(p, "utf8");
    if (!txt.includes("When to use anuran.dev")) {
      txt = WHEN_TO_USE.trim() + "\n\n---\n\n" + txt;
      await fs.writeFile(p, txt);
      console.log("[inject-llms] llms-full.txt injected");
    }
  } catch {
    console.log("[inject-llms] dist/llms-full.txt missing, skipping");
  }
}

await injectLlmsTxt();
await injectLlmsFull();
