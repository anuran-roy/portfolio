// @ts-check

import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections"
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers"
import tailwindcss from "@tailwindcss/vite"
import expressiveCode from "astro-expressive-code"
import llms from "astro-llms-md"
import mermaid from 'astro-mermaid'
import { defineConfig } from "astro/config"


// https://astro.build/config
export default defineConfig({
  site: "https://anuran.dev",
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Pagefind is generated into /pagefind during build and imported at
      // runtime, so it must not be resolved by the bundler.
      rollupOptions: { external: ["/pagefind/pagefind.js"] },
    },
  },
  integrations: [
    // expressiveCode must be registered before mdx so it can process code blocks.
    expressiveCode({
      themes: ["github-dark", "github-light"],
      // Follow the shadcn `.dark` class toggle instead of the OS media query.
      themeCssSelector: (theme) => (theme.type === "dark" ? ".dark" : ":root"),
      useDarkModeMediaQuery: false,
      plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
      styleOverrides: {
        codeFontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        borderRadius: "0",
      },
      defaultProps: {
        showLineNumbers: false,
      },
    }),
    mermaid({
      theme: 'neutral',
      autoTheme: true
    }),
    mdx(),
    react(),
    sitemap(),
    llms(),
  ],
  // Preserve SEO from the legacy static site's sitemap by 301-ing old URLs.
  redirects: {
    "/top/about": "/about",
    "/top/projects": "/projects",
    "/top/other-blogs": "/other-blogs",
    "/post/blog/offline-speech-with-vosk": "/blog/offline-speech-with-vosk",
    "/post/blog/machine-learning": "/blog/machine-learning",
    "/post/projects/pymetrix/home": "/blog/pymetrix-home",
    "/post/projects/pymetrix/overview": "/blog/pymetrix-overview",
    "/post/projects/pymetrix/flow": "/blog/pymetrix-flow",
    "/categories/[category]": "/blog/categories/[category]",
    "/tags/[tag]": "/blog/tags/[tag]",
  },
})
