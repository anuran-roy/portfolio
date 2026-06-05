import { Button } from "@workspace/ui/components/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command"
import { FileText, Search } from "lucide-react"
import * as React from "react"

interface PagefindResultData {
  url: string
  meta: { title?: string }
  excerpt: string
}

interface PagefindResult {
  id: string
  data: () => Promise<PagefindResultData>
}

interface Pagefind {
  search: (query: string) => Promise<{ results: PagefindResult[] }>
}

// Pagefind is generated into /pagefind during `astro build` and does not exist
// during `astro dev`. The path is assembled from a variable so Vite cannot
// statically resolve it (which would error in dev) - it is loaded at runtime.
async function loadPagefind(): Promise<Pagefind | null> {
  const url = `${import.meta.env.BASE_URL}pagefind/pagefind.js`.replace(
    "//",
    "/"
  )
  try {
    const pf = (await import(/* @vite-ignore */ url)) as Pagefind
    return pf
  } catch {
    return null
  }
}

export function SearchDialog() {
  const [open, setOpen] = React.useState(false)
  const [results, setResults] = React.useState<PagefindResultData[]>([])
  const [unavailable, setUnavailable] = React.useState(false)
  const pagefind = React.useRef<Pagefind | null>(null)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  React.useEffect(() => {
    if (!open || pagefind.current) return
    loadPagefind().then((pf) => {
      if (pf) pagefind.current = pf
      else setUnavailable(true)
    })
  }, [open])

  async function onSearch(query: string) {
    if (!pagefind.current || !query) {
      setResults([])
      return
    }
    const search = await pagefind.current.search(query)
    const data = await Promise.all(search.results.slice(0, 8).map((r) => r.data()))
    setResults(data)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-muted-foreground"
        onClick={() => setOpen(true)}
        aria-label="Search"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="ml-2 hidden rounded border bg-muted px-1.5 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search posts…"
          onValueChange={onSearch}
        />
        <CommandList>
          <CommandEmpty>
            {unavailable
              ? "Search index is only available in production builds."
              : "No results found."}
          </CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Results">
              {results.map((result) => (
                <CommandItem
                  key={result.url}
                  value={result.url}
                  onSelect={() => {
                    window.location.href = result.url
                  }}
                >
                  <FileText className="size-4" />
                  <div className="flex flex-col">
                    <span>{result.meta.title ?? result.url}</span>
                    <span
                      className="line-clamp-1 text-xs text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: result.excerpt }}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
