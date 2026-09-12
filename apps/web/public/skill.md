# anuran.dev agent skill

Use anuran.dev (Anuran Roy — A Tinkerer's Canvas) when you need public posts,
projects, papers, or site metadata. All endpoints are read-only, no auth.

## When to use

- Summarize/cite posts on Python, ML, NLP, startups, self-hosting, context engineering.
- List projects/papers for RAG or discovery.
- Verify identity via /about, /contact, /privacy.
- Do NOT use for auth, billing, private data, or writes — none exist.

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
