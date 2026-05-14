import { Router, Request, Response } from 'express';
import * as leadService from '../services/leadService.js';
import * as whatsappService from '../services/whatsappService.js';
import { LeadStatus, LeadUpdatePayload, CreateLeadPayload } from '../types/index.js';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string ?? '1', 10);
    const limit = parseInt(req.query.limit as string ?? '50', 10);
    const result = await leadService.getAllLeads(page, limit);
    res.json(result);
  } catch (err) {
    const error = err as Error;
    console.error('[Leads] GET /leads error:', error.message);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

router.get('/analytics', async (_req: Request, res: Response): Promise<void> => {
  try {
    const analytics = await leadService.getAnalytics();
    res.json(analytics);
  } catch (err) {
    const error = err as Error;
    console.error('[Leads] GET /leads/analytics error:', error.message);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    const conversations = await leadService.getConversationHistory(lead.id, 100);
    res.json({ lead, conversations });
  } catch (err) {
    const error = err as Error;
    console.error('[Leads] GET /leads/:id error:', error.message);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const allowedFields: (keyof LeadUpdatePayload)[] = [
      'name', 'budget', 'location', 'property_type', 'status',
      'needs_mortgage', 'buying_timeline',
    ];

    const payload: LeadUpdatePayload = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        (payload as Record<string, unknown>)[field] = req.body[field];
      }
    }

    const validStatuses: LeadStatus[] = ['new', 'qualifying', 'qualified', 'booked', 'closed'];
    if (payload.status && !validStatuses.includes(payload.status)) {
      res.status(400).json({ error: 'Invalid status value' });
      return;
    }

    const lead = await leadService.updateLead(req.params.id, payload);
    res.json(lead);
  } catch (err) {
    const error = err as Error;
    console.error('[Leads] PATCH /leads/:id error:', error.message);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

router.post('/:id/message', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body as { message?: string };
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'message field is required' });
      return;
    }

    const lead = await leadService.getLeadById(req.params.id);
    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    await whatsappService.sendTextMessage(lead.whatsapp_number, message.trim());
    await leadService.saveMessage(lead.id, 'assistant', message.trim());

    res.json({ success: true, message: 'Message sent' });
  } catch (err) {
    const error = err as Error;
    console.error('[Leads] POST /leads/:id/message error:', error.message);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as CreateLeadPayload;

    if (!body.fullName || !body.email || !body.phone) {
      res.status(400).json({ error: 'fullName, email, and phone are required' });
      return;
    }

    const phoneNormalized = body.phone.replace(/[^\d+]/g, '');
    const lead = await leadService.getOrCreateLead(phoneNormalized);

    if (body.fullName) {
      await leadService.updateLead(lead.id, { name: body.fullName });
    }

    res.status(201).json({
      success: true,
      message: 'Demo request received. Our team will contact you within 24 hours.',
      leadId: lead.id,
    });
  } catch (err) {
    const error = err as Error;
    console.error('[Leads] POST /leads error:', error.message);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

export default router;
