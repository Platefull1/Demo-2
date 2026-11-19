/**
 * Receptor local para N8N_PAYSLIP_PUBLISHED_WEBHOOK (etapa 4).
 *
 *   npx tsx scripts/holerites-webhook-receptor.ts
 *
 * Escuta http://127.0.0.1:3457/payslips-published
 */
import { createServer } from 'node:http';

const PORT = 3457;
const SECRET = process.env.N8N_WEBHOOK_SECRET?.trim() || 'holerites-dev-webhook-secret';

const server = createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/payslips-published') {
    const chunks: Buffer[] = [];
    for await (const c of req) chunks.push(c as Buffer);
    const raw = Buffer.concat(chunks).toString('utf8');
    const secret = req.headers['x-webhook-secret'];
    if (secret !== SECRET) {
      res.writeHead(401, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'unauthorized' }));
      console.log('[receptor] 401 secret inválido');
      return;
    }
    try {
      const body = JSON.parse(raw) as {
        type?: string;
        batchId?: string;
        items?: Array<{
          payslipId: string;
          firstName: string;
          phone: string;
          isRetificacao?: boolean;
        }>;
      };
      const masked = {
        type: body.type,
        batchId: body.batchId,
        items: (body.items ?? []).map((i) => ({
          payslipId: i.payslipId,
          firstName: i.firstName,
          phone: i.phone ? `****${i.phone.slice(-2)}` : null,
          isRetificacao: i.isRetificacao,
        })),
      };
      console.log('[receptor] OK', JSON.stringify(masked, null, 2));
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch (err) {
      console.error('[receptor] parse error', err);
      res.writeHead(400);
      res.end('bad json');
    }
    return;
  }
  res.writeHead(404);
  res.end('not found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(
    `[receptor] http://127.0.0.1:${PORT}/payslips-published (secret length=${SECRET.length})`,
  );
});
