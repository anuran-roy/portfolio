import { site } from '@/config/site';
import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';
import { fileURLToPath } from 'node:url';

// astro-og-canvas reads bgImage off the filesystem at build time (fs.readFile),
// so resolve it from this module rather than the cwd — the monorepo build may
// run from the repo root, where a cwd-relative "./public/..." would not exist.
const avatarPath = fileURLToPath(new URL('../../../public/images/avatar.jpeg', import.meta.url));

const collectionEntries = [...(await getCollection('about')), ...(await getCollection('blog')), ...(await getCollection('papers')), ...(await getCollection('projects')), ...(await getCollection('vibe'))];

// Map the array of content collection entries to create an object.
// Converts [{ id: 'post.md', data: { title: 'Example', description: '' } }]
// to { 'post.md': { title: 'Example', description: '' } }
const pages = {
  // Default OG image for non-content routes (homepage, listings, etc.).
  site: { title: site.title, description: site.description },
  ...Object.fromEntries(collectionEntries.map(({ id, data }) => [id, data])),
};

export const { getStaticPaths, GET } = await OGImageRoute({
  // Tell us the name of your dynamic route segment.
  // In this case it’s `route`, because the file is named `[...route].ts`.
  param: 'route',

  pages: pages,

  getImageOptions: (path, page) => ({
    title: page.title ?? 'Untitled',

    bgImage: {
      path: avatarPath,
      fit: 'fill',
      position: "center"
    },
    description: 'description' in page ? page.description : 'Well, it\'s (probably) a cool page. That\'s all I can tell you.',
  }),
});