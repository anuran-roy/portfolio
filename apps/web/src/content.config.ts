import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string().optional(),
    tagline: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    heroImage: z.string().optional(),
    author: z.string().default("Anuran Roy"),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    series: z.string().optional(),
    comments: z.boolean().default(true),
  }),
})

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string().optional(),
    tagline: z.string().optional(),
    description: z.string(),
    date: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    order: z.number().default(0),
    tech: z.array(z.string()).default([]),
    status: z.enum(["active", "maintained", "discontinued", "merged"]).default("active"),
    links: z
      .array(z.object({ label: z.string(), href: z.string().url() }))
      .default([]),
  }),
})

const papers = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/papers" }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string().optional(),
    tagline: z.string().optional(),
    description: z.string(),
    date: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    order: z.number().default(0),
    tags: z.array(z.string()).default([]),
    doi: z.string().optional(),
    links: z
      .array(z.object({ label: z.string(), href: z.string().url() }))
      .default([]),
  }),
})

const vibe = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/vibe" }),
  schema: z.object({
    title: z.string().optional(),
    shortTitle: z.string().optional(),
    tagline: z.string().optional(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    type: z.enum(["text", "photo", "quote", "code", "mixed"]).default("text"),
    mood: z.string().optional(),
    location: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
})

const about = defineCollection({
  loader: glob({ pattern: "about.{md,mdx}", base: "./src/content" }),
  schema: z.object({
    title: z.string().default("About"),
    shortTitle: z.string().optional(),
    tagline: z.string().optional(),
    description: z.string().default(""),
  }),
})

export const collections = { blog, projects, papers, vibe, about }
