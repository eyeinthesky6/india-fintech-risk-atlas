import { getCollection, type CollectionEntry } from 'astro:content';
import taxonomy from '../taxonomy.json';

export { taxonomy };
export type UpiDocEntry = CollectionEntry<'docs'>;

export const UPI_THEMES = Object.entries(taxonomy.themes).map(([id, label]) => ({ id, label }));

const UPI_ORDER = [
  'UPI-OVERVIEW',
  'UPI-004',
  'UPI-006',
  'UPI-007',
  'UPI-003',
  'UPI-008',
  'UPI-009',
  'UPI-011',
  'UPI-001',
  'UPI-010',
  'UPI-002',
  'UPI-012',
  'UPI-005',
  'UPI-014',
  'UPI-013',
  'UPI-015',
  'UPI-016',
];

const ORDER_INDEX = new Map(UPI_ORDER.map((id, idx) => [id, idx]));

export function getBasePath(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, '');
}

export function taxonomyLabel(map: Record<string, string>, key: string | undefined): string {
  if (!key) return '';
  return map[key] ?? key;
}

export async function getUpiRecords(): Promise<UpiDocEntry[]> {
  const entries = await getCollection(
    'docs',
    (entry) => Boolean(entry.data.recordId && entry.data.products?.includes('upi')),
  );
  return [...entries].sort((a, b) => {
    const idA = a.data.recordId ?? '';
    const idB = b.data.recordId ?? '';
    const idxA = ORDER_INDEX.get(idA) ?? Number.MAX_SAFE_INTEGER;
    const idxB = ORDER_INDEX.get(idB) ?? Number.MAX_SAFE_INTEGER;
    if (idxA !== idxB) return idxA - idxB;
    return idA.localeCompare(idB);
  });
}

export function splitUpiRecordsByStage(records: UpiDocEntry[]) {
  const sourceChecked = records.filter((e) => e.data.reviewStage === 'source-checked');
  const drafts = records.filter(
    (e) => !e.data.reviewStage || e.data.reviewStage === 'draft' || e.data.reviewStage === 'researching',
  );
  const reviewed = records.filter(
    (e) => e.data.reviewStage === 'reviewed' || e.data.reviewStage === 'published',
  );
  return { total: records.length, sourceChecked, drafts, reviewed };
}

export function formatRecordStatus(entry: UpiDocEntry): string {
  const stage = entry.data.reviewStage ?? 'draft';
  if (stage === 'published' || stage === 'reviewed') return taxonomy.reviewStages[stage];
  if (stage === 'source-checked') return 'Source-checked draft (human check pending)';
  return entry.data.blockerNote
    ? `Draft (${entry.data.blockerNote})`
    : 'Research draft (independent review pending)';
}
