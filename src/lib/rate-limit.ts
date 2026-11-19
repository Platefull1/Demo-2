import { prisma } from '@/lib/prisma';

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Rate limit distribuído via tabela rate_limit_buckets (Neon).
 * Upsert atômico em uma query — seguro em serverless multi-instância.
 */
export async function checkRateLimit(opts: {
  key: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {
  const { key, limit, windowSeconds } = opts;
  if (!key || limit < 1 || windowSeconds < 1) {
    throw new Error('checkRateLimit: key, limit e windowSeconds inválidos');
  }

  const rows = await prisma.$queryRaw<
    Array<{ count: number; expires_at: Date }>
  >`
    INSERT INTO rate_limit_buckets (key, count, window_start, expires_at)
    VALUES (
      ${key},
      1,
      NOW(),
      NOW() + make_interval(secs => ${windowSeconds})
    )
    ON CONFLICT (key) DO UPDATE SET
      count = CASE
        WHEN rate_limit_buckets.expires_at <= NOW() THEN 1
        ELSE rate_limit_buckets.count + 1
      END,
      window_start = CASE
        WHEN rate_limit_buckets.expires_at <= NOW() THEN NOW()
        ELSE rate_limit_buckets.window_start
      END,
      expires_at = CASE
        WHEN rate_limit_buckets.expires_at <= NOW()
          THEN NOW() + make_interval(secs => ${windowSeconds})
        ELSE rate_limit_buckets.expires_at
      END
    RETURNING count, expires_at
  `;

  const row = rows[0];
  if (!row) {
    throw new Error('checkRateLimit: upsert não retornou linha');
  }

  const allowed = row.count <= limit;
  const remaining = Math.max(0, limit - row.count);
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((new Date(row.expires_at).getTime() - Date.now()) / 1000),
  );

  return { allowed, remaining, retryAfterSeconds };
}
