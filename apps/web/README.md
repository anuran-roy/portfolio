# web — anuran.dev portfolio

Astro portfolio for **Anuran Roy** ("A Tinkerer's Canvas"), migrated from the
legacy static site. Built on the shared `@workspace/ui` shadcn design system with
an MDX blog, Giscus comments, Pagefind search, RSS, and a sitemap.

## Develop

```bash
bun install            # from the monorepo root
bun run dev            # http://localhost:4321
```

> **Search note:** Pagefind only indexes the production build, so `⌘K` search is
> empty during `astro dev`. Run `bun run build && bun run preview` to test it.

## Build

```bash
bun run build          # astro build && pagefind --site dist
bun run preview
```

## Content

All content lives in `src/content/`:

| Collection  | Location                | Notes                                  |
| ----------- | ----------------------- | -------------------------------------- |
| `blog`      | `src/content/blog`      | MD/MDX posts. Frontmatter in `content.config.ts`. |
| `projects`  | `src/content/projects`  | One file per project.                  |
| `vibe`      | `src/content/vibe`      | Short-form timeline entries.           |
| `about`     | `src/content/about.mdx` | Rendered by `/about`.                  |

Site-wide settings (profile, nav, socials, Giscus, "other blogs") live in
[`src/config/site.ts`](src/config/site.ts).

> The migrated 2021 content (bio, posts) is intentionally reproduced as-is.
> Two posts (`machine-learning`, `pymetrix-flow`) contain `{/* TODO */}` markers
> where the original page was only partially captured.

## Giscus comments setup

Comments are wired but disabled until real IDs are provided. To enable:

1. Make the comments repo (default `anuran-roy/anuran-roy.github.io`) **public**.
2. Enable **Discussions** in the repo settings.
3. Install the **giscus GitHub app**: https://github.com/apps/giscus
4. Go to https://giscus.app, enter the repo, and copy the generated
   `data-repo-id` and `data-category-id`.
5. Paste them into the `giscus` object in `src/config/site.ts` (replacing the
   `TODO_REPO_ID` / `TODO_CATEGORY_ID` placeholders).

The Giscus theme follows the site's light/dark toggle automatically.

## Assets to add

- `public/documents/cv.pdf` — linked from the nav ("CV").
- `public/images/avatar.jpg` — referenced by `site.author.avatar`.
- `public/favicon.svg` — already present; replace if desired.

## Legacy URL redirects

`astro.config.mjs` 301-redirects the old static-site URLs (`/top/*`, `/post/*`,
`/categories/*`, `/tags/*`) to their new locations to preserve SEO.
