import { defineCollection, z } from 'astro:content';

const photosCollection = defineCollection({
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
