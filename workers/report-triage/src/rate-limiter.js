export class ReportRateLimiter {
  constructor(state) {
    this.storage = state.storage;
    this.storage.sql.exec(
      'CREATE TABLE IF NOT EXISTS counters (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL)',
    );
  }

  async fetch(request) {
    const { ipHash, hourlyCap, dailyCap } = await request.json();
    if (!/^[a-f0-9]{64}$/.test(ipHash) ||
        !Number.isSafeInteger(hourlyCap) || hourlyCap < 1 ||
        !Number.isSafeInteger(dailyCap) || dailyCap < 1) {
      return new Response(null, { status: 400 });
    }

    const hour = 3600;
    const day = 24 * hour;
    const now = Math.floor(Date.now() / 1000);
    const counters = [
      { key: `ip:${ipHash}`, cap: hourlyCap, expires: (Math.floor(now / hour) + 1) * hour },
      { key: 'global', cap: dailyCap, expires: (Math.floor(now / day) + 1) * day },
    ];
    const sql = this.storage.sql;
    const allowed = this.storage.transactionSync(() => {
      sql.exec('DELETE FROM counters WHERE expires <= ?', now);
      for (const { key, cap } of counters) {
        const count = sql.exec('SELECT count FROM counters WHERE key = ?', key).toArray()[0]?.count ?? 0;
        if (count >= cap) return false;
      }
      for (const { key, expires } of counters) {
        sql.exec(
          'INSERT INTO counters (key, count, expires) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1',
          key,
          expires,
        );
      }
      return true;
    });
    return new Response(null, { status: allowed ? 204 : 429 });
  }
}
