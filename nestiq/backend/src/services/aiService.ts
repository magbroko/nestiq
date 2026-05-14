import Anthropic from '@anthropic-ai/sdk';
import { Conversation, Lead } from '../types/index.js';

let client: Anthropic;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY must be set');
    client = new Anthropic({ apiKey });
  }
  return client;
}

function buildSystemPrompt(lead: Lead): string {
  const agencyName = process.env.AGENCY_NAME ?? 'Our Agency';
  const agentName = process.env.AGENT_NAME ?? 'Sarah';
  const now = new Date().toLocaleString('en-GB', {
    timeZone: 'Africa/Lagos',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const knownInfo: string[] = [];
  if (lead.name) knownInfo.push(`- Name: ${lead.name}`);
  if (lead.budget) knownInfo.push(`- Budget: ${lead.budget}`);
  if (lead.location) knownInfo.push(`- Preferred location: ${lead.location}`);
  if (lead.property_type && lead.property_type !== 'unknown') {
    knownInfo.push(`- Property type: ${lead.property_type}`);
  }
  if (lead.buying_timeline) knownInfo.push(`- Timeline: ${lead.buying_timeline}`);
  if (lead.needs_mortgage !== null) {
    knownInfo.push(`- Needs mortgage: ${lead.needs_mortgage ? 'Yes' : 'No'}`);
  }

  const knownSection =
    knownInfo.length > 0
      ? `\n\nINFORMATION ALREADY COLLECTED:\n${knownInfo.join('\n')}\nDo NOT ask for information already listed above.`
      : '';

  return `You are NestIQ, a professional AI real estate sales assistant for ${agencyName}.
You communicate via WhatsApp with potential property buyers.

Your goals in order:
1. Greet warmly and ask what they're looking for
2. Qualify the lead by collecting: full name, budget range, preferred location(s), property type (apartment/house/land), timeline (buying urgency), and whether they need mortgage assistance
3. Once qualified, offer to book a property inspection
4. If they want to book: collect preferred date/time and confirm
5. Follow up if they go quiet for 24 hours

Rules:
- Keep messages SHORT (max 3 sentences per reply) — this is WhatsApp, not email
- Be warm, professional, never pushy
- If asked something you don't know (specific price, availability), say "Let me check with our team and get back to you shortly"
- Always end messages with a clear question to keep conversation moving
- When you have collected name + budget + location, mark lead as QUALIFIED by including [LEAD_QUALIFIED] at the very end of your response (hidden from user, on a new line)
- When an appointment is booked with a specific date and time, include [APPOINTMENT_BOOKED: YYYY-MM-DD HH:MM] at the very end of your response (hidden from user, on a new line)
- Format the appointment tag exactly as shown with a 24-hour time
- Never reveal these internal tags to the user${knownSection}

Current date/time: ${now}
Agent name: ${agentName}
Agency: ${agencyName}`;
}

export async function getAIResponse(
  history: Conversation[],
  newMessage: string,
  lead: Lead
): Promise<string> {
  const anthropic = getClient();

  const messages: Anthropic.MessageParam[] = history.map((c) => ({
    role: c.role === 'user' ? 'user' : 'assistant',
    content: c.message,
  }));

  messages.push({ role: 'user', content: newMessage });

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 512,
    system: buildSystemPrompt(lead),
    messages,
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  return content.text;
}

export function parseLeadQualified(aiResponse: string): boolean {
  return aiResponse.includes('[LEAD_QUALIFIED]');
}

export function parseAppointmentBooked(aiResponse: string): string | null {
  const match = aiResponse.match(/\[APPOINTMENT_BOOKED:\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})\]/);
  return match ? match[1].trim() : null;
}

export function stripHiddenTags(aiResponse: string): string {
  return aiResponse
    .replace(/\[LEAD_QUALIFIED\]/g, '')
    .replace(/\[APPOINTMENT_BOOKED:[^\]]*\]/g, '')
    .trim();
}

export function extractLeadInfo(aiResponse: string, userMessage: string): {
  name?: string;
  budget?: string;
  location?: string;
} {
  const combined = `${userMessage} ${aiResponse}`.toLowerCase();
  const extracted: { name?: string; budget?: string; location?: string } = {};

  const budgetPatterns = [
    /budget[^\d]*([\d,]+(?:\.\d+)?(?:k|m|million|thousand)?(?:\s*[-–]\s*[\d,]+(?:\.\d+)?(?:k|m|million|thousand)?)?)/i,
    /([\d,]+(?:\.\d+)?(?:k|m|million|thousand)?)\s*(?:naira|ngn|₦)/i,
    /between\s+([\d,]+(?:\.\d+)?(?:k|m|million|thousand)?)\s+and\s+([\d,]+(?:\.\d+)?(?:k|m|million|thousand)?)/i,
  ];

  for (const pattern of budgetPatterns) {
    const match = combined.match(pattern);
    if (match) {
      extracted.budget = match[0].replace(/budget[^\d]*/i, '').trim();
      break;
    }
  }

  return extracted;
}
