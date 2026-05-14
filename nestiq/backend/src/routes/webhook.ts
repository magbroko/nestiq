import { Router, Request, Response } from 'express';
import { verifyWebhookSignature } from '../middleware/webhookVerify.js';
import * as leadService from '../services/leadService.js';
import * as aiService from '../services/aiService.js';
import * as whatsappService from '../services/whatsappService.js';
import * as calendarService from '../services/calendarService.js';
import * as emailService from '../services/emailService.js';
import { WhatsAppWebhookBody, WhatsAppMessage } from '../types/index.js';

const router = Router();

router.get('/', (req: Request, res: Response): void => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[Webhook] Meta webhook verified successfully');
    res.status(200).send(challenge as string);
  } else {
    console.error('[Webhook] Verification failed — invalid token');
    res.status(403).json({ error: 'Verification failed' });
  }
});

router.post('/', verifyWebhookSignature, (req: Request, res: Response): void => {
  res.status(200).json({ status: 'ok' });

  setImmediate(() => {
    processWebhookPayload(req.body as WhatsAppWebhookBody).catch((err: unknown) => {
      console.error('[Webhook] Async processing error:', err);
    });
  });
});

async function processWebhookPayload(body: WhatsAppWebhookBody): Promise<void> {
  if (body.object !== 'whatsapp_business_account') return;

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== 'messages') continue;

      const value = change.value;
      const messages = value.messages ?? [];

      for (const message of messages) {
        try {
          await processIncomingMessage(message, value.contacts?.[0]?.profile?.name);
        } catch (err) {
          console.error(`[Webhook] Error processing message from ${message.from}:`, err);
        }
      }
    }
  }
}

async function processIncomingMessage(
  message: WhatsAppMessage,
  contactName?: string
): Promise<void> {
  const senderPhone = message.from;
  const messageId = message.id;

  await whatsappService.markAsRead(messageId).catch(() => {});

  if (message.type !== 'text' || !message.text?.body) {
    await whatsappService.sendTextMessage(
      senderPhone,
      "I can only read text messages for now 😊 Please type your message and I'll be happy to help!"
    );
    return;
  }

  const userText = message.text.body.trim();
  if (!userText) return;

  const lead = await leadService.getOrCreateLead(senderPhone);

  if (contactName && !lead.name) {
    await leadService.updateLead(lead.id, { name: contactName });
    lead.name = contactName;
  }

  const history = await leadService.getConversationHistory(lead.id, 20);

  await leadService.saveMessage(lead.id, 'user', userText);

  let aiResponse: string;
  try {
    aiResponse = await aiService.getAIResponse(history, userText, lead);
  } catch (err) {
    console.error('[AI] Failed to get response:', err);
    await whatsappService.sendTextMessage(
      senderPhone,
      "I'm having a brief technical issue. Please try again in a moment or call us directly. Apologies for the inconvenience! 🙏"
    );
    return;
  }

  const isQualified = aiService.parseLeadQualified(aiResponse);
  const appointmentDatetime = aiService.parseAppointmentBooked(aiResponse);
  const cleanResponse = aiService.stripHiddenTags(aiResponse);

  if (isQualified && lead.status !== 'qualified' && lead.status !== 'booked' && lead.status !== 'closed') {
    await leadService.updateLead(lead.id, { status: 'qualified' });
    lead.status = 'qualified';
    console.log(`[Lead] ${senderPhone} marked as QUALIFIED`);

    const updatedHistory = [...history, { id: '', lead_id: lead.id, role: 'user' as const, message: userText, timestamp: new Date().toISOString() }];
    emailService.notifyAgentNewLead(lead, updatedHistory).catch((err: unknown) => {
      console.error('[Email] Failed to send agent notification:', err);
    });
  } else if (lead.status === 'new') {
    await leadService.updateLead(lead.id, { status: 'qualifying' });
  }

  if (appointmentDatetime) {
    console.log(`[Calendar] Booking appointment for ${senderPhone} at ${appointmentDatetime}`);

    let calendarEventId: string | null = null;
    let meetLink: string | null = null;

    try {
      const calResult = await calendarService.createInspectionEvent(
        lead.name ?? senderPhone,
        senderPhone,
        appointmentDatetime
      );
      calendarEventId = calResult.eventId;
      meetLink = calResult.meetLink;

      const agentEmail = process.env.AGENT_EMAIL ?? '';
      emailService
        .sendAppointmentConfirmation(agentEmail, lead.name ?? senderPhone, senderPhone, appointmentDatetime, meetLink)
        .catch(console.error);
    } catch (err) {
      console.error('[Calendar] Failed to create calendar event:', err);
    }

    await leadService.createAppointment(
      lead.id,
      'TBD — Agent will confirm',
      appointmentDatetime,
      calendarEventId,
      meetLink
    );

    await leadService.updateLead(lead.id, { status: 'booked' });
  }

  await whatsappService.sendTextMessage(senderPhone, cleanResponse);
  await leadService.saveMessage(lead.id, 'assistant', cleanResponse);
}

export default router;
