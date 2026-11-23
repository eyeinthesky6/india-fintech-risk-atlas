import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';

const recordTypeEnum = z.enum([
  'explainer',
  'fraud-pattern',
  'preventive-control',
  'detective-control',
  'operational-failure',
  'recovery-process',
  'policy-consultation',
]);

const themeEnum = z.enum([
  'overview',
  'social-engineering',
  'identity-auth',
  'monitoring-mules-merchants',
  'reconciliation-disputes-protection',
  'policy',
]);

const lifecycleEnum = z.enum([
  'onboarding',
  'initiation',
  'authentication',
  'authorization',
  'processing',
  'monitoring',
  'settlement',
  'reconciliation',
  'investigation',
  'dispute',
  'recovery',
  'servicing',
]);

const evidenceLayerEnum = z.enum([
  'official',
  'industry',
  'practitioner',
  'atlas',
]);

const reviewStageEnum = z.enum([
  'draft',
  'researching',
  'source-checked',
  'reviewed',
  'published',
]);

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        recordId: z.string().regex(/^[A-Z]+-(?:OVERVIEW|\d{3})$/).optional(),
        products: z.array(z.enum(['UPI'])).optional(),
        recordType: recordTypeEnum.optional(),
        recordTypeLabel: z.string().optional(),
        theme: themeEnum.optional(),
        themeLabel: z.string().optional(),
        lifecycle: z.array(lifecycleEnum).optional(),
        actors: z.array(z.string()).optional(),
        evidenceLayers: z.array(evidenceLayerEnum).optional(),
        reviewStage: reviewStageEnum.optional(),
        blockerNote: z.string().optional(),
        lastSourceCheck: z.string().optional(),
      }),
    }),
  }),
};
