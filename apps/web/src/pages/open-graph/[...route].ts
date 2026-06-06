import { site } from '@/config/site';
import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// astro-og-canvas reads bgImage off the filesystem at build time (fs.readFile),
// so resolve it from this module rather than the cwd — the monorepo build may
// run from the repo root, where a cwd-relative "./public/..." would not exist.
const avatarPath = fileURLToPath(new URL('../../../public/images/avatar.jpeg', import.meta.url));

const getJpegWidth = async (imagePath: string) => {
  const image = await readFile(imagePath);

  if (image[0] !== 0xff || image[1] !== 0xd8) {
    throw new Error(`Expected a JPEG image: ${imagePath}`);
  }

  let offset = 2;

  while (offset < image.length) {
    if (image[offset] !== 0xff) {
      offset++;
      continue;
    }

    while (image[offset] === 0xff) {
      offset++;
    }

    const marker = image[offset++];
    const isStandaloneMarker = marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9);

    if (isStandaloneMarker) {
      continue;
    }

    const segmentLength = image.readUInt16BE(offset);
    const isStartOfFrameMarker =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);

    if (isStartOfFrameMarker) {
      return image.readUInt16BE(offset + 5);
    }

    offset += segmentLength;
  }

  throw new Error(`Could not read JPEG width: ${imagePath}`);
};

const imagePadding = (await getJpegWidth(avatarPath)) * 0.2;

const collectionEntries = [...(await getCollection('about')), ...(await getCollection('blog')), ...(await getCollection('papers')), ...(await getCollection('projects')), ...(await getCollection('vibe'))];

// Map the array of content collection entries to create an object.
// Converts [{ id: 'post.md', data: { title: 'Example', description: '' } }]
// to { 'post.md': { title: 'Example', description: '' } }
const pages = {
  // Default OG image for non-content routes (homepage, listings, etc.).
  site: {
    title: site.title,
    shortTitle: site.shortTitle,
    tagline: site.tagline,
    description: site.description,
  },
  ...Object.fromEntries(collectionEntries.map(({ id, data }) => [id, data])),
};

const OG_DESCRIPTION_MAX_LENGTH = 70;
const OG_DESCRIPTION_FALLBACK = "Well, it's (probably) a cool page. That's all I can tell you.";

export function getDescriptionFromPage<T extends typeof collectionEntries[number]["data"]>(page: T): string {
  // Priority: tagline → short title → (truncated) description → placeholder.
  if (page.tagline) {
    return page.tagline;
  }

  // `vibe` pages have no `description` field, so confirm it exists and is a
  // non-empty string before using it.
  if ('description' in page && typeof page.description === 'string' && page.description.length > 0) {
    return page.description.length > OG_DESCRIPTION_MAX_LENGTH
      ? `${page.description.slice(0, OG_DESCRIPTION_MAX_LENGTH)}...`
      : page.description;
  }

  return OG_DESCRIPTION_FALLBACK;
}

export function getTitleFromPage<T extends typeof collectionEntries[number]["data"]>(page: T): string {
  if (page.shortTitle) {
    return page.shortTitle;
  }

  if (page.title) {
    return page.title;
  }

  return "Untitled Page"
}

export const { getStaticPaths, GET } = await OGImageRoute({
  // Tell us the name of your dynamic route segment.
  // In this case it’s `route`, because the file is named `[...route].ts`.
  param: 'route',

  pages: pages,

  getImageOptions: (path, page) => ({
    title: getTitleFromPage<typeof page>(page),
    bgImage: {
      path: avatarPath,
      fit: 'fill',
      position: 'center',
    },
    padding: imagePadding,
    description: getDescriptionFromPage<typeof page>(page),
  }),
});
