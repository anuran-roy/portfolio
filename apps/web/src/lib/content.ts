import { getCollection, type CollectionEntry } from "astro:content"
import readingTime from "reading-time"

export type BlogPost = CollectionEntry<"blog">
export type Project = CollectionEntry<"projects">
export type Paper = CollectionEntry<"papers">
export type Vibe = CollectionEntry<"vibe">

const isProd = import.meta.env.PROD

/** Hide drafts in production builds; show them in dev. */
function published<T extends { data: { draft?: boolean } }>(entry: T): boolean {
  return !isProd || !entry.data.draft
}

/** All published blog posts, newest first. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog", published)
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

/** All published projects, ordered by `order` then title. */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection("projects", published)
  return projects.sort(
    (a, b) =>
      a.data.order - b.data.order || a.data.title.localeCompare(b.data.title)
  )
}

/** All published papers, ordered by `order` then title. */
export async function getPapers(): Promise<Paper[]> {
  const papers = await getCollection("papers", published)
  return papers.sort(
    (a, b) =>
      a.data.order - b.data.order || a.data.title.localeCompare(b.data.title)
  )
}

/** All published vibe entries, newest first. */
export async function getVibes(): Promise<Vibe[]> {
  const vibes = await getCollection("vibe", published)
  return vibes.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

/** Reading time label, e.g. "3 min read", computed from raw markdown. */
export function readingTimeOf(post: BlogPost): string {
  return readingTime(post.body ?? "").text
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
})

export function formatDate(date: Date): string {
  return dateFormatter.format(date)
}

/** Unique, sorted tag list with counts across all posts. */
export function collectTags(posts: BlogPost[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

/** Unique, sorted category list with counts across all posts. */
export function collectCategories(
  posts: BlogPost[]
): { category: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const category of post.data.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category))
}

/** Unique, sorted series list with counts across all posts. */
export function collectSeries(
  posts: BlogPost[]
): { series: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const post of posts) {
    const series = post.data.series
    if (series) {
      counts.set(series, (counts.get(series) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([series, count]) => ({ series, count }))
    .sort((a, b) => b.count - a.count || a.series.localeCompare(b.series))
}

/** Up to `limit` posts related to `post` by shared series or tags. */
export function relatedPosts(
  post: BlogPost,
  all: BlogPost[],
  limit = 3
): BlogPost[] {
  const scored = all
    .filter((p) => p.id !== post.id)
    .map((p) => {
      let score = 0
      if (post.data.series && p.data.series === post.data.series) score += 5
      score += p.data.tags.filter((t) => post.data.tags.includes(t)).length
      return { post: p, score }
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.post.data.date.valueOf() - a.post.data.date.valueOf()
    )
  return scored.slice(0, limit).map((entry) => entry.post)
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
