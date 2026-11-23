import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';
import taxonomy from './taxonomy.json';

const enumFromKeys = <T extends Record<string, string>>(obj: T) =>
  z.enum(Object.keys(obj) as [keyof T & string, ...(keyof T & string)[]]);

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        recordId: z.string().regex(new RegExp(taxonomy.recordIdPattern)).optional(),
        products: z.array(enumFromKeys(taxonomy.products)).optional(),
        recordType: enumFromKeys(taxonomy.recordTypes).optional(),
        theme: enumFromKeys(taxonomy.themes).optional(),
        lifecycle: z.array(enumFromKeys(taxonomy.lifecycle)).optional(),
        actors: z.array(enumFromKeys(taxonomy.actors)).optional(),
        evidenceLayers: z.array(enumFromKeys(taxonomy.evidenceLayers)).optional(),
        reviewStage: enumFromKeys(taxonomy.reviewStages).optional(),
        blockerNote: z.string().optional(),
        lastSourceCheck: z.string().optional(),
      }),
    }),
  }),
};
