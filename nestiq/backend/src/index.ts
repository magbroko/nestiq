import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { CronJob } from 'cron';

import webhookRouter from './routes/webhook.js';
import leadsRouter from './routes/leads.js';
import appointmentsRouter from './routes/appointments.js';
import * as leadService from './services/leadService.js';
import * as whatsappService from './services/whatsappService.js';
import * as emailService from './services/emailService.js';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.FRONTEND_URL ?? '',
      process.env.DASHBOARD_URL ?? '',
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan('combined'));

app.use(
  (req: Request, res: Response, next: NextFunction): void => {
    let data = Buffer.alloc(0);
    req.on('data', (chunk: Buffer) => {
      data = Buffer.concat([data, chunk]);
    });
    req.on('end', () => {
      (req as Request & { rawBody: Buffer }).rawBody = data;
      next();
    });
  }
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

app.use('/api', apiLimiter);

app.use('/api/webhook/whatsapp', webhookRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/appointments', appointmentsRouter);

app.get('/health', (_req: Request, res: Response): void => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'NestIQ Backend',
  });
});

app.use((req: Request, res: Response): void => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('[Server] Unhandled error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const followUpJob = new CronJob('0 * * * *', async () => {
  console.log('[Cron] Running follow-up check...');
  try {
    const staleLeads = await leadService.getLeadsForFollowUp();
    console.log(`[Cron] Found ${staleLeads.length} leads needing follow-up`);

    for (const lead of staleLeads) {
      try {
        const message = await emailService.sendFollowUpWhatsApp(lead);
        await whatsappService.sendTextMessage(lead.whatsapp_number, message);
        await leadService.saveMessage(lead.id, 'assistant', message);
        await leadService.updateLead(lead.id, { last_contact: new Date().toISOString() });
        console.log(`[Cron] Follow-up sent to ${lead.whatsapp_number}`);
      } catch (err) {
        console.error(`[Cron] Failed to send follow-up to ${lead.whatsapp_number}:`, err);
      }
    }
  } catch (err) {
    console.error('[Cron] Follow-up job failed:', err);
  }
});

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║   NestIQ Backend — Running on :${PORT}  ║
╚══════════════════════════════════════╝

  Health check : http://localhost:${PORT}/health
  Webhook      : http://localhost:${PORT}/api/webhook/whatsapp
  Leads API    : http://localhost:${PORT}/api/leads
  Appointments : http://localhost:${PORT}/api/appointments
  `);

  followUpJob.start();
  console.log('[Cron] Follow-up job scheduled (every hour)');
});

export default app;
