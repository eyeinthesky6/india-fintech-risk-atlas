export { ReportRateLimiter } from './rate-limiter.js';

const ALLOWED_PATH_RE = /^(?:\/india-fintech-risk-atlas)?\/(?:upi|cards|payment-aggregator|digital-lending|evidence-policy|methodology|contribute|licensing)(?:\/[a-z0-9-]+)?\/?$/i;
const ALLOWED_REASONS = new Set([
  'Outdated circular',
  'Wrong bank / entity scope',
  'Broken or wrong source',
  'Unclear / typo',
]);

function parseAllowedOrigins(raw) {
  return String(raw || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function corsHeaders(origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(origin),
    },
  });
}

function sanitizeText(raw, maxLen) {
  return String(raw || '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '[removed-image]')
    .replace(/<[^>]*>/g, '')
    .replace(/```/g, "'''")
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, maxLen);
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function verifyTurnstile(token, remoteIp, secretKey, allowInsecureDev) {
  if (!secretKey) return allowInsecureDev === 'true';
  if (!token || typeof token !== 'string') return false;

  const form = new URLSearchParams();
  form.set('secret', secretKey);
  form.set('response', token);
  if (remoteIp) form.set('remoteip', remoteIp);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });
  if (!res.ok) return false;
  const json = await res.json();
  return Boolean(json && json.success);
}

async function checkAndIncrementLimits(env, clientIp) {
  if (!env.REPORT_RATE_LIMITER) {
    return { allowed: String(env.ALLOW_INSECURE_DEV || '') === 'true', misconfigured: true };
  }

  const hourlyCap = Number(env.HOURLY_IP_CAP || 3);
  const dailyCap = Number(env.DAILY_GLOBAL_CAP || 30);

  const salt = String(env.IP_HASH_SALT || env.TRIAGE_GITHUB_REPO || 'atlas');
  const ipHash = await sha256Hex(`${salt}:${clientIp}`);
  try {
    const namespace = env.REPORT_RATE_LIMITER;
    const limiter = namespace.get(namespace.idFromName('atlas-correction-quota'));
    const decision = await limiter.fetch('https://limiter.internal/consume', {
      method: 'POST',
      body: JSON.stringify({ ipHash, hourlyCap, dailyCap }),
    });
    if (decision.status === 204) return { allowed: true };
    return { allowed: false, misconfigured: decision.status !== 429 };
  } catch (error) {
    console.error('Correction rate limiter is unavailable', error);
    return { allowed: false, misconfigured: true };
  }
}

export default {
  async fetch(request, env) {
    const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
    const origin = request.headers.get('Origin') || '';
    const originAllowed = origin && allowedOrigins.includes(origin);

    if (request.method === 'OPTIONS') {
      if (!originAllowed) {
        return new Response('Forbidden', { status: 403 });
      }
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, originAllowed ? origin : '');
    }

    if (!originAllowed) {
      return jsonResponse({ error: 'Origin not allowed' }, 403, '');
    }

    const rawBody = await request.text();
    if (rawBody.length > 8192) {
      return jsonResponse({ error: 'Payload too large' }, 413, origin);
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return jsonResponse({ error: 'Invalid JSON payload' }, 400, origin);
    }

    if (!payload || typeof payload !== 'object') {
      return jsonResponse({ error: 'Invalid payload structure' }, 400, origin);
    }

    // Silent drop if hidden honeypot field was filled by an automated scanner
    if (typeof payload.website === 'string' && payload.website.trim().length > 0) {
      return jsonResponse({ ok: true, queued: false }, 200, origin);
    }

    // Reject instant programmatic submissions
    if (typeof payload.dwellMs !== 'number' || !Number.isFinite(payload.dwellMs) || payload.dwellMs < 1500) {
      return jsonResponse({ error: 'Please wait a moment before submitting' }, 400, origin);
    }

    const pagePath = String(payload.pagePath || '').trim();
    if (!ALLOWED_PATH_RE.test(pagePath)) {
      return jsonResponse({ error: 'Unsupported page path' }, 400, origin);
    }

    const recordId = sanitizeText(payload.recordId, 32);
    const pageTitle = sanitizeText(payload.pageTitle, 160) || pagePath;
    const section = sanitizeText(payload.section, 120) || 'Whole page';
    const quote = sanitizeText(payload.quote, 300);
    const rawReason = sanitizeText(payload.reason, 60);
    const reason = ALLOWED_REASONS.has(rawReason) ? rawReason : 'Other';
    const note = sanitizeText(payload.note, 500);
    const sourceUrlRaw = String(payload.sourceUrl || '').trim().slice(0, 300);

    let validatedSourceUrl = '';
    if (sourceUrlRaw) {
      try {
        const parsed = new URL(sourceUrlRaw);
        if (parsed.protocol !== 'https:') {
          return jsonResponse({ error: 'Source URL must use https://' }, 400, origin);
        }
        validatedSourceUrl = parsed.toString();
      } catch {
        return jsonResponse({ error: 'Invalid source URL' }, 400, origin);
      }
    }

    const clientIp = request.headers.get('CF-Connecting-IP') || '';
    const turnstileOk = await verifyTurnstile(
      payload.turnstileToken,
      clientIp,
      String(env.TURNSTILE_SECRET_KEY || ''),
      String(env.ALLOW_INSECURE_DEV || ''),
    );
    if (!turnstileOk) {
      return jsonResponse({ error: 'Anti-bot verification failed' }, 403, origin);
    }

    const limitResult = await checkAndIncrementLimits(env, clientIp || 'unknown');
    if (!limitResult.allowed) {
      return jsonResponse(
        { error: limitResult.misconfigured ? 'Rate limiter not configured' : 'Rate limit exceeded' },
        limitResult.misconfigured ? 500 : 429,
        origin,
      );
    }

    const triageRepo = String(env.TRIAGE_GITHUB_REPO || '').trim();
    const triageToken = String(env.GITHUB_TRIAGE_TOKEN || '').trim();
    if (!triageRepo || !triageToken) {
      return jsonResponse({ error: 'Triage endpoint not configured' }, 500, origin);
    }

    const issueTitle = `[Flag] ${recordId || pageTitle}: ${section}`.slice(0, 200);
    const issueBody = [
      '> **UNTRUSTED READER SUBMISSION** — Verify original RBI / NPCI / operator sources manually before modifying any live record.',
      '',
      `- **Record:** \`${recordId || 'N/A'}\``,
      `- **Page:** \`${pagePath}\` (${pageTitle})`,
      `- **Section:** \`${section}\``,
      `- **Reason:** \`${reason}\``,
      validatedSourceUrl ? `- **Submitted Source URL:** \`${validatedSourceUrl}\`` : '- **Submitted Source URL:** *(none provided)*',
      '',
      '### Quoted text',
      '```text',
      quote || '(whole page flagged)',
      '```',
      '',
      '### Reader note',
      '```text',
      note || '(none provided)',
      '```',
    ].join('\n');

    const ghRes = await fetch(`https://api.github.com/repos/${triageRepo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${triageToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'atlas-report-triage-worker',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: ['factual-correction', 'anonymous-report'],
      }),
    });

    if (!ghRes.ok) {
      return jsonResponse({ error: 'Failed to queue triage issue' }, 502, origin);
    }

    return jsonResponse({ ok: true, queued: true }, 201, origin);
  },
};
