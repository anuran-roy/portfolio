import * as React from "react"
import Giscus from "@giscus/react"

import { giscus as giscusConfig } from "@/config/site"

function currentGiscusTheme(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

/**
 * Giscus comments island. Mirrors the site's `.dark` class into giscus and keeps
 * the two in sync when the user toggles the theme.
 *
 * NOTE: until `repoId`/`categoryId` in `src/config/site.ts` are replaced with
 * real values from https://giscus.app, giscus will render a configuration error
 * instead of the comment box. See the setup notes in that file / the README.
 */
export function Comments() {
  const [theme, setTheme] = React.useState<"light" | "dark">(() =>
    typeof document === "undefined" ? "light" : currentGiscusTheme()
  )

  React.useEffect(() => {
    const observer = new MutationObserver(() => setTheme(currentGiscusTheme()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  return (
    <Giscus
      id="comments"
      repo={giscusConfig.repo}
      repoId={giscusConfig.repoId}
      category={giscusConfig.category}
      categoryId={giscusConfig.categoryId}
      mapping={giscusConfig.mapping}
      reactionsEnabled={giscusConfig.reactionsEnabled ? "1" : "0"}
      emitMetadata="0"
      inputPosition="bottom"
      theme={theme}
      lang={giscusConfig.lang}
      loading="lazy"
    />
  )
}
