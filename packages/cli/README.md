# anuran-dev CLI

Official CLI for [anuran.dev](https://anuran.dev) (Anuran Roy — A Tinkerer's Canvas).
Read-only wrapper around the public JSON API. No auth, no keys.

## Install / run

```sh
# Run without installing
npx -y anuran-dev --help
npx -y anuran-dev posts --limit 5
npx -y anuran-dev projects --json

# Or install globally
npm install -g anuran-dev
anuran-dev health
```

- npm: https://www.npmjs.com/package/anuran-dev
- Docs: https://anuran.dev/docs
- Portal: https://anuran.dev/developers
- OpenAPI: https://anuran.dev/openapi.json

## Commands

- `posts [--limit N] [--tag TAG] [--json]`
- `projects [--json]`
- `papers [--json]`
- `meta [--json]`
- `health [--json]`
