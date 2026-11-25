import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const BUNDLED_PATH = fileURLToPath(new URL('../data/atlas-records.json', import.meta.url));
const CACHE_PATH = path.join(os.homedir(), '.cache', 'india-fintech-risk-atlas', 'atlas-records.json');
const SNAPSHOT_URL = 'https://eyeinthesky6.github.io/india-fintech-risk-atlas/atlas-records.json';
const MAX_BYTES = 32 * 1024 * 1024;
const TTL = 6 * 60 * 60 * 1000;

export function validateSnapshot(data) {
  const m = data?.metadata;
  if (!m || m.title !== 'India Fintech Risk Atlas' ||
      !Number.isFinite(Date.parse(m.generatedAt)) ||
      Date.parse(m.generatedAt) > Date.now() + 300000 ||
      !/^1\.\d+\.\d+$/.test(m.version || '') || Number(m.version.split('.')[1]) < 2 ||
      !Array.isArray(m.coveredProducts) || typeof m.verificationNotice !== 'string' ||
      !Array.isArray(data.records) || !data.records.length ||
      m.totalRecords !== data.records.length ||
      !Array.isArray(data.guideDocs) ||
      !data.guideDocs.every((guide) => typeof guide?.slug === 'string') ||
      !data.knowledgeGraph?.connections || !m.taxonomy) {
    throw new Error('Invalid or incompatible Atlas snapshot');
  }
  const ids = new Set();
  for (const r of data.records) {
    if (typeof r?.recordId !== 'string' || !r.recordId || ids.has(r.recordId) ||
        !isStringArray(r.products) || !isStringArray(r.actors) ||
        !isStringArray(r.evidenceLayers) || !Array.isArray(r.controls) ||
        !r.controls.every((control) => typeof control?.id === 'string' &&
          isStringArray(control.ownerIds) && typeof control.basis === 'string' &&
          typeof control.owner === 'string' && typeof control.action === 'string') ||
        !Array.isArray(r.references) || typeof r.fullMarkdown !== 'string' ||
        typeof r.reviewStage !== 'string' ||
        (r.blockerNote != null && typeof r.blockerNote !== 'string') ||
        typeof r.url !== 'string' ||
        !r.url.startsWith('https://eyeinthesky6.github.io/india-fintech-risk-atlas/')) {
      throw new Error('Malformed Atlas record');
    }
    ids.add(r.recordId);
    const node = data.knowledgeGraph.connections[r.recordId];
    if (!node || !isStringArray(node.sharedSources) || !isStringArray(node.sameTheme) ||
        !isStringArray(node.directLinks) || !isStringArray(node.allNeighbors)) {
      throw new Error('Malformed Atlas graph');
    }
  }
  return data;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

async function readSnapshot(file) {
  try { return validateSnapshot(JSON.parse(await fs.readFile(file, 'utf8'))); }
  catch { return null; }
}

async function fetchSnapshot() {
  const response = await fetch(SNAPSHOT_URL, {
    signal: AbortSignal.timeout(5000),
    redirect: 'error',
    cache: 'no-store',
  });
  if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);

  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) throw new Error('Snapshot exceeds size limit');
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  const bytes = Buffer.concat(chunks);
  return { bytes, snapshot: validateSnapshot(JSON.parse(bytes.toString('utf8'))) };
}

async function cacheSnapshot(cachePath, bytes) {
  const cacheDir = path.dirname(cachePath);
  await fs.mkdir(cacheDir, { recursive: true });
  const staging = await fs.mkdtemp(path.join(cacheDir, '.atlas-'));
  const tempPath = path.join(staging, 'snapshot.json');
  try {
    await fs.writeFile(tempPath, bytes, { mode: 0o600 });
    await fs.rename(tempPath, cachePath);
  } finally {
    await fs.rm(tempPath, { force: true });
    await fs.rmdir(staging);
  }
}

export async function selectSnapshot({
  offline = false,
  force = false,
  bundledPath = BUNDLED_PATH,
  cachePath = CACHE_PATH,
} = {}) {
  const [local, saved] = await Promise.all([readSnapshot(bundledPath), readSnapshot(cachePath)]);
  // The published feed owns online content. A local build date cannot order GitHub Pages releases.
  let selected = saved ?? local;
  if (offline && local && (!saved || Date.parse(local.metadata.generatedAt) > Date.parse(saved.metadata.generatedAt))) {
    selected = local;
  }
  if (!offline) {
    const cacheStat = saved && !force ? await fs.stat(cachePath).catch(() => null) : null;
    if (!cacheStat || Date.now() - cacheStat.mtimeMs >= TTL) {
      try {
        const { bytes, snapshot } = await fetchSnapshot();
        selected = snapshot;
        await cacheSnapshot(cachePath, bytes)
          .catch((error) => console.error('Atlas snapshot could not be cached:', error.message));
      } catch (error) {
        console.error('Atlas refresh unavailable; retaining last valid snapshot:', error.message);
      }
    }
  }
  if (!selected) throw new Error('No valid Atlas snapshot; regenerate local data or reconnect.');
  console.error('Atlas snapshot generated:', selected.metadata.generatedAt);
  return selected;
}
