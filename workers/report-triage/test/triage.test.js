import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import worker, { ReportRateLimiter } from '../src/worker.js';

test('unverified reports cannot be queued and honeypot receipt reports no delivery', async () => {
  const origin = 'https://eyeinthesky6.github.io';
  const env = { ALLOWED_ORIGINS: origin, TURNSTILE_SECRET_KEY: 'test-secret' };
  function report(overrides) {
    return new Request('https://worker.test', {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json' },
      body: JSON.stringify({ pagePath: '/upi/authentication-context/', dwellMs: 2000, ...overrides }),
    });
  }
  const unverified = await worker.fetch(report({}), env);
  assert.equal(unverified.status, 403);
  const honeypot = await worker.fetch(report({ website: 'test' }), env);
  assert.deepEqual(await honeypot.json(), { ok: true, queued: false });
});

test('helpful feedback uses private triage and confirms delivery only after GitHub accepts it', async (t) => {
  const origin = 'https://eyeinthesky6.github.io';
  const recordPath = '/india-fintech-risk-atlas/upi/upi-ecosystem/';
  const issueCalls = [];
  const rateBuckets = [];
  let githubStatus = 201;
  const env = {
    ALLOWED_ORIGINS: origin,
    TURNSTILE_SECRET_KEY: 'fixture',
    TRIAGE_GITHUB_REPO: 'owner/private-queue',
    GITHUB_TRIAGE_TOKEN: 'fixture',
    REPORT_RATE_LIMITER: {
      idFromName(name) { rateBuckets.push(name); return name; },
      get() { return { fetch: async () => new Response(null, { status: 204 }) }; },
    },
  };
  t.mock.method(globalThis, 'fetch', async (url, request) => {
    if (new URL(url).hostname === 'challenges.cloudflare.com') return Response.json({ success: true });
    assert.equal(url, 'https://api.github.com/repos/owner/private-queue/issues');
    issueCalls.push(JSON.parse(request.body));
    return new Response(null, { status: githubStatus });
  });
  function submit(fields) {
    return worker.fetch(new Request('https://worker.test', {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json' },
      body: JSON.stringify({ recordId: 'UPI-OVERVIEW', dwellMs: 2000, turnstileToken: 'fixture', ...fields }),
    }), env);
  }
  const helpful = await submit({ kind: 'helpful', recordPath, note: 'Ignored by helpful feedback' });
  assert.equal(helpful.status, 201);
  assert.deepEqual(await helpful.json(), { ok: true, queued: true, kind: 'helpful' });
  assert.equal(issueCalls[0].title, '[Helpful] UPI-OVERVIEW');
  assert.deepEqual(issueCalls[0].labels, ['anonymous-report']);
  assert.ok(!issueCalls[0].body.includes('Ignored by helpful feedback'));

  const correction = await submit({ pagePath: recordPath, note: 'Correction note' });
  assert.deepEqual(await correction.json(), { ok: true, queued: true });
  assert.match(issueCalls[1].title, /^\[Flag\] /);
  assert.deepEqual(rateBuckets, ['atlas-helpful-quota', 'atlas-correction-quota']);

  githubStatus = 403;
  const rejected = await submit({ kind: 'helpful', recordPath });
  assert.equal(rejected.status, 502);
  assert.equal((await rejected.json()).queued, undefined);
});

test('quota applies per-IP and global limits in one SQLite transaction', async (t) => {
  const database = new DatabaseSync(':memory:');
  t.after(() => database.close());
  const limiter = new ReportRateLimiter({
    storage: {
      sql: {
        exec(sql, ...parameters) {
          const statement = database.prepare(sql);
          if (sql.startsWith('SELECT')) return { toArray: () => statement.all(...parameters) };
          statement.run(...parameters);
        },
      },
      transactionSync(action) {
        database.exec('BEGIN');
        try {
          const result = action();
          database.exec('COMMIT');
          return result;
        } catch (error) {
          database.exec('ROLLBACK');
          throw error;
        }
      },
    },
  });

  async function consume(hashChar) {
    const response = await limiter.fetch(new Request('https://limiter.internal', {
      method: 'POST',
      body: JSON.stringify({ ipHash: hashChar.repeat(64), hourlyCap: 1, dailyCap: 2 }),
    }));
    return response.status;
  }
  const statuses = await Promise.all([consume('a'), consume('a'), consume('b'), consume('c')]);
  assert.equal(statuses.filter((status) => status === 204).length, 2);
  assert.equal(statuses.filter((status) => status === 429).length, 2);
  assert.equal(await consume('d'), 429);
});
