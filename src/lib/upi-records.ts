import { getCollection, type CollectionEntry } from 'astro:content';

export type UpiDocEntry = CollectionEntry<'docs'>;

export const UPI_THEMES = [
  { id: 'overview', label: 'Overview & ecosystem' },
  { id: 'social-engineering', label: 'Social engineering & scams' },
  { id: 'identity-auth', label: 'Identity, access & authentication' },
  { id: 'monitoring-mules-merchants', label: 'Monitoring, mules & merchants' },
  { id: 'reconciliation-disputes-protection', label: 'Reconciliation, disputes & protection' },
  { id: 'policy', label: 'Policy & consultation' },
] as const;

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

export async function getUpiRecords(): Promise<UpiDocEntry[]> {
  const entries = await getCollection(
    'docs',
    (entry) => Boolean(entry.data.recordId && entry.data.products?.includes('UPI')),
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
  if (stage === 'published') return 'Published (independently reviewed)';
  if (stage === 'reviewed') return 'Independently reviewed';
  if (stage === 'source-checked') return 'Source-checked draft (independent review pending)';
  return entry.data.blockerNote
    ? `Draft (${entry.data.blockerNote})`
    : 'Research draft (independent review pending)';
}
