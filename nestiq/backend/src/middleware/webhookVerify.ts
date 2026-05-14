import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export function verifyWebhookSignature(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const appSecret = process.env.META_APP_SECRET;

  if (!appSecret) {
    console.warn('[Webhook] META_APP_SECRET not set — skipping signature verification');
    next();
    return;
  }

  const signature = req.headers['x-hub-signature-256'] as string | undefined;
  if (!signature) {
    res.status(401).json({ error: 'Missing X-Hub-Signature-256 header' });
    return;
  }

  const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
  if (!rawBody) {
    res.status(400).json({ error: 'Raw body not available' });
    return;
  }

  const expectedSignature =
    'sha256=' + crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex');

  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  if (!isValid) {
    console.error('[Webhook] Signature verification failed');
    res.status(403).json({ error: 'Invalid signature' });
    return;
  }

  next();
}
