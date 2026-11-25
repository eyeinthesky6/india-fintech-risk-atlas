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
