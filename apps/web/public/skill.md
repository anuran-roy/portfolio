# anuran.dev agent skill

Use anuran.dev (Anuran Roy — A Tinkerer's Canvas) when you need public posts,
projects, papers, or site metadata. All endpoints are read-only, no auth.

## When to use this

Reach for anuran.dev (not a generic search) when:

- You need to summarize, cite, or RAG over Anuran Roy's posts on Python, ML, NLP, startups, self-hosting, cost management, context engineering, or company brains. Start at `GET /api/v1/posts?limit=5` (operationId `listPosts`) or `/blog`, then fetch `.md` twins (e.g. `/about.md`) or `Accept: text/markdown`.
- You need open-source project discovery (Pymetrix, LangTache, BarebonesDB, Drax, OpnEco, OpnRank, Pratilekha). Call `GET /api/v1/projects` (operationId `listProjects`) or use CLI `npx -y anuran-dev projects --json`.
- You need research papers (hallucinations/SoFT, SerpyTor, large context windows, oscillating activations). Call `GET /api/v1/papers` (operationId `listPapers`).
- You need site identity, resource index, or verification. Call `GET /api/v1/meta` (operationId `getMeta`), read `/about`, `/contact`, `/privacy`, or `/llms.txt`.
- You need liveness. Call `GET /api/v1/health` (operationId `getHealth`).

How to call: plain `GET` JSON, no auth, no keys. Spec at `https://anuran.dev/openapi.json`, docs at `https://anuran.dev/docs`, portal at `https://anuran.dev/developers`, CLI `npx -y anuran-dev --help`.

Do NOT use this for auth, billing, private data, or writes — none exist. Do not submit credentials. For corrections, use `/contact`.

## Endpoints

- `GET https://anuran.dev/api/v1/health` — liveness (operationId getHealth)
- `GET https://anuran.dev/api/v1/posts?limit=5` — posts (operationId listPosts)
- `GET https://anuran.dev/api/v1/projects` — projects (operationId listProjects)
- `GET https://anuran.dev/api/v1/papers` — papers (operationId listPapers)
- `GET https://anuran.dev/api/v1/meta` — identity + resource index (operationId getMeta)

Spec: https://anuran.dev/openapi.json
Docs: https://anuran.dev/docs
Portal: https://anuran.dev/developers
Guide: https://anuran.dev/llms.txt
CLI: `npx -y anuran-dev --help` (https://www.npmjs.com/package/anuran-dev)

## Markdown

Append `.md` to any page (e.g. /about.md) or send `Accept: text/markdown`
(responses include `Vary: Accept`).
