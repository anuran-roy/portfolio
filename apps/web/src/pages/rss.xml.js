import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { site } from "@/config/site"

export async function GET(context) {
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).map(
    (post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: [...post.data.categories, ...post.data.tags],
    })
  )

  const papers = (await getCollection("papers", ({ data }) => !data.draft)).map(
    (paper) => ({
      title: paper.data.title,
      description: paper.data.description,
      pubDate: paper.data.date,
      link: `/papers/${paper.id}/`,
      categories: paper.data.tags,
    })
  )

  const items = [...posts, ...papers].sort(
    (a, b) => (b.pubDate?.valueOf() ?? 0) - (a.pubDate?.valueOf() ?? 0)
  )

  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items,
  })
}
