/**
 * Central site configuration.
 *
 * Navfolio drives this from a `site.toml`; since this app is shadcn-first we keep
 * it as plain TypeScript so values are typed and importable from both `.astro`
 * and `.tsx` files.
 */

export interface NavLink {
  label: string
  href: string
  /** External links open in a new tab. */
  external?: boolean
}

export interface SocialLink {
  label: string
  href: string
  /** lucide-react icon name handled by the consumer, or a custom key. */
  icon: string
}

export interface OtherBlog {
  name: string
  description: string
  href: string
  handle?: string
}

export const site = {
  title: "A Tinkerer's Canvas",
  /** Used for <title> suffix and OG. */
  shortTitle: "Anuran Roy",
  tagline: "$ sudo apt-get install tinker-dev && sudo tinker.run()",
  description:
    "Personal website and blog of Anuran Roy — notes on Python, machine learning, NLP, and open-source tinkering.",
  url: "https://anuran.dev",
  author: {
    name: "Anuran Roy",
    bio: "Sleepy by day, coding by night. Student on weekdays, explorer on weekends. A machine that converts coffee to code.",
    email: "anuranroy02@gmail.com",
    avatar: "/images/avatar.jpg",
    resume: "/documents/cv.pdf",
  },
  blog: {
    postsPerPage: 6,
  },
} as const

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Projects", href: "/projects" },
  { label: "Vibe", href: "/vibe" },
  { label: "About", href: "/about" },
  { label: "Other blogs", href: "/other-blogs" },
  { label: "CV", href: "/documents/cv.pdf", external: true },
]

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/anuran-roy", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/anuran-roy",
    icon: "linkedin",
  },
  { label: "Twitter", href: "https://twitter.com/AnuranRoy", icon: "twitter" },
  {
    label: "Reddit",
    href: "https://www.reddit.com/user/Ateenagerstudent",
    icon: "reddit",
  },
  {
    label: "HackerRank",
    href: "https://www.hackerrank.com/anuranroy02",
    icon: "hackerrank",
  },
  { label: "Email", href: "mailto:anuranroy02@gmail.com", icon: "mail" },
  { label: "RSS", href: "/rss.xml", icon: "rss" },
]

export const otherBlogs: OtherBlog[] = [
  {
    name: "Art of Problem Solving Blog",
    description:
      "My oldest blog (quite inactive now) with math, CS, and ML content. Written under the pseudonym A-student.",
    href: "https://artofproblemsolving.com/community/c997683",
    handle: "A-student",
  },
  {
    name: "Hashnode",
    description: "Long-form technical writing on Hashnode.",
    href: "https://tinker.hashnode.dev",
  },
  {
    name: "CSED VIT — Newsletter & Articles",
    description:
      "The Centre for Social Entrepreneurship and Development club blog, where I contribute to the Editorial and Technical departments.",
    href: "https://www.csedvit.com/",
  },
  {
    name: "Geek 'N' Freak (GNF)",
    description:
      "A blog started with friends, ranked in the top 11k sites in India (100k internationally). Written under the pseudonym Ron.",
    href: "https://geeknfreak.in/geeky/category/ron/",
    handle: "Ron",
  },
]

/**
 * Giscus comments configuration.
 *
 * SETUP (required before comments work):
 *   1. Make the repo below public.
 *   2. Enable the "Discussions" feature in the repo settings.
 *   3. Install the giscus GitHub app: https://github.com/apps/giscus
 *   4. Visit https://giscus.app, enter the repo, and copy the generated
 *      `data-repo-id` and `data-category-id` into the placeholders below.
 */
export const giscus = {
  enabled: true,
  repo: "anuran-roy/anuran-roy.github.io" as `${string}/${string}`,
  repoId: "TODO_REPO_ID",
  category: "Announcements",
  categoryId: "TODO_CATEGORY_ID",
  mapping: "pathname" as const,
  reactionsEnabled: true,
  lang: "en",
}

/** True once the giscus placeholders have been replaced with real IDs. */
export const giscusConfigured =
  giscus.enabled &&
  !giscus.repoId.startsWith("TODO") &&
  !giscus.categoryId.startsWith("TODO")
