#!/usr/bin/env node
/**
 * anuran-dev — official CLI for anuran.dev (Anuran Roy).
 * Read-only wrapper around https://anuran.dev/api/v1/* (no auth).
 */
const SITE = process.env.ANURAN_DEV_SITE || "https://anuran.dev";

function help() {
  console.log(`anuran-dev — official CLI for anuran.dev (Anuran Roy)

Usage:
  npx -y anuran-dev <command> [options]

Commands:
  posts [--limit N] [--tag TAG] [--json]   List blog posts
  projects [--json]                        List projects
  papers [--json]                          List papers
  meta [--json]                            Site identity + resources
  health [--json]                          Liveness check

Options:
  --json        Print raw JSON
  --limit N     Max items (1-50, default 10, posts only)
  --tag TAG     Filter posts by tag
  -h, --help    Show this help

Examples:
  npx -y anuran-dev posts --limit 5
  npx -y anuran-dev projects --json
  npm install -g anuran-dev && anuran-dev health

Docs: https://anuran.dev/docs
Portal: https://anuran.dev/developers
API: https://anuran.dev/api
OpenAPI: https://anuran.dev/openapi.json
`);
}

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} for ${url}\n${text.slice(0, 500)}`);
  }
  return res.json();
}

function parseArgs(argv) {
  const args = { _: [], json: false, limit: "10", tag: undefined };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") args.json = true;
    else if (a === "--limit") args.limit = argv[++i] ?? "10";
    else if (a === "--tag") args.tag = argv[++i];
    else if (a === "-h" || a === "--help") args.help = true;
    else if (!a.startsWith("-")) args._.push(a);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || args._.length === 0) {
    help();
    return;
  }
  const cmd = args._[0];
  try {
    if (cmd === "health") {
      const data = await getJson(`${SITE}/api/v1/health.json`);
      if (args.json) console.log(JSON.stringify(data, null, 2));
      else console.log(`${data.status} ${data.site} v${data.version}`);
    } else if (cmd === "meta") {
      const data = await getJson(`${SITE}/api/v1/meta.json`);
      if (args.json) console.log(JSON.stringify(data, null, 2));
      else {
        console.log(`${data.site.name}\n${data.site.url}\n`);
        console.log("Resources:");
        for (const [k, v] of Object.entries(data.resources)) console.log(`  ${k}: ${v}`);
      }
    } else if (cmd === "posts") {
      const limit = Math.max(1, Math.min(50, parseInt(args.limit, 10) || 10));
      let url = `${SITE}/api/v1/posts.json`;
      const data = await getJson(url);
      let items = data.data || [];
      if (args.tag) items = items.filter((p) => (p.tags || []).includes(args.tag));
      items = items.slice(0, limit);
      if (args.json) console.log(JSON.stringify({ data: items, count: items.length }, null, 2));
      else {
        for (const p of items) console.log(`- ${p.title}\n  ${p.url}\n`);
      }
    } else if (cmd === "projects") {
      const data = await getJson(`${SITE}/api/v1/projects.json`);
      if (args.json) console.log(JSON.stringify(data, null, 2));
      else for (const p of data.data || []) console.log(`- ${p.title}\n  ${p.url}\n`);
    } else if (cmd === "papers") {
      const data = await getJson(`${SITE}/api/v1/papers.json`);
      if (args.json) console.log(JSON.stringify(data, null, 2));
      else for (const p of data.data || []) console.log(`- ${p.title}\n  ${p.url}\n`);
    } else {
      console.error(`Unknown command: ${cmd}\n`);
      help();
      process.exitCode = 1;
    }
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exitCode = 1;
  }
}

main();
