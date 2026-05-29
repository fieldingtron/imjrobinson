import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const photosCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/photos" }),
  schema: z.object({
    title: z.string(),
    images: z.array(
      z.object({
        src: z.string(),
        title: z.string(),
      })
    ),
  }),
});

export const collections = {
  photos: photosCollection,
};
