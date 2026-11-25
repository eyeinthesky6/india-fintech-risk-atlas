import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const bundled = fileURLToPath(new URL('../data/atlas-records.json', import.meta.url));
const cache = path.join(os.homedir(), '.cache', 'india-fintech-risk-atlas', 'atlas-records.json');
const URL_STRING = 'https://eyeinthesky6.github.io/india-fintech-risk-atlas/atlas-records.json';
const MAX_BYTES = 32 * 1024 * 1024;
const TTL = 6 * 60 * 60 * 1000;

export function validateSnapshot(data) {
  const m = data?.metadata;
  if (!m || m.title !== 'India Fintech Risk Atlas' ||
      !Number.isFinite(Date.parse(m.generatedAt)) ||
      Date.parse(m.generatedAt) > Date.now() + 300000 ||
      !/^1\./.test(m.version || '') ||
      !Array.isArray(data.records) || !data.records.length ||
      m.totalRecords !== data.records.length ||
      !Array.isArray(data.guideDocs) || !data.knowledgeGraph?.connections || !m.taxonomy) {
    throw new Error('Invalid or incompatible Atlas snapshot');
  }
  const ids = new Set();
  for (const r of data.records) {
    if (typeof r.recordId !== 'string' || !r.recordId || ids.has(r.recordId) ||
        !Array.isArray(r.products) || !Array.isArray(r.actors) ||
        !Array.isArray(r.evidenceLayers) || !Array.isArray(r.controls) ||
        !Array.isArray(r.references) || typeof r.fullMarkdown !== 'string' ||
        !r.url?.startsWith('https://eyeinthesky6.github.io/india-fintech-risk-atlas/')) {
      throw new Error('Malformed Atlas record');
    }
    ids.add(r.recordId);
  }
  return data;
}

async function readSnapshot(file) {
  try { return validateSnapshot(JSON.parse(await fs.readFile(file, 'utf8'))); }
  catch { return null; }
}

export async function selectSnapshot({offline = false, force = false} = {}) {
  const local = await readSnapshot(bundled);
  const saved = await readSnapshot(cache);
  const newer = saved && (!local || Date.parse(saved.metadata.generatedAt) >= Date.parse(local.metadata.generatedAt));
  let selected = newer ? cache : bundled;
  let baseline = newer ? saved : local;
  if (!offline) {
    let fresh = false;
    try { fresh = !!saved && Date.now() - (await fs.stat(cache)).mtimeMs < TTL; } catch {}
    if (force || !fresh) {
      let temp;
      try {
        const res = await fetch(URL_STRING, {signal: AbortSignal.timeout(5000), redirect:'error'});
        if (!res.ok || !res.body) throw new Error('HTTP ' + res.status);
        const reader = res.body.getReader();
        let size = 0;
        const chunks = [];
        try {
          while (true) {
            const {done,value} = await reader.read();
            if (done) break;
            size += value.byteLength;
            if (size > MAX_BYTES) throw new Error('Snapshot exceeds size limit');
            chunks.push(value);
          }
        } finally { await reader.cancel().catch(()=>{}); }
        const bytes = Buffer.concat(chunks);
        const incoming = validateSnapshot(JSON.parse(bytes.toString('utf8')));
        if (!baseline || Date.parse(incoming.metadata.generatedAt) >= Date.parse(baseline.metadata.generatedAt)) {
          await fs.mkdir(path.dirname(cache), {recursive:true});
          temp = cache + '.' + process.pid + '.tmp';
          await fs.writeFile(temp, bytes, {mode:0o600});
          await fs.rename(temp, cache);
          selected = cache;
          baseline = incoming;
        }
      } catch (e) {
        console.error('Atlas refresh unavailable; retaining last valid snapshot:', e.message);
      } finally { if (temp) await fs.rm(temp, {force:true}).catch(()=>{}); }
    }
  }
  if (!baseline) throw new Error('No valid Atlas snapshot; rebuild local data or reconnect.');
  console.error('Atlas snapshot generated:', baseline.metadata.generatedAt);
  return selected;
}
