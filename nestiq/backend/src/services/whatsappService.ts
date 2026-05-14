import axios, { AxiosError } from 'axios';

const GRAPH_API_VERSION = 'v18.0';
const BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

const sendQueue: Array<() => Promise<void>> = [];
let isProcessing = false;
const RATE_LIMIT_MS = 1000;

async function processQueue(): Promise<void> {
  if (isProcessing) return;
  isProcessing = true;

  while (sendQueue.length > 0) {
    const task = sendQueue.shift();
    if (task) {
      await task();
      await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS));
    }
  }

  isProcessing = false;
}

export async function sendTextMessage(to: string, text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    sendQueue.push(async () => {
      try {
        const token = process.env.META_WHATSAPP_TOKEN;
        const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

        if (!token || !phoneNumberId) {
          throw new Error('META_WHATSAPP_TOKEN and META_PHONE_NUMBER_ID must be set');
        }

        const normalizedTo = to.replace(/[^\d]/g, '');

        const response = await axios.post(
          `${BASE_URL}/${phoneNumberId}/messages`,
          {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: normalizedTo,
            type: 'text',
            text: { body: text, preview_url: false },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          }
        );

        const messageId: string = response.data?.messages?.[0]?.id ?? 'unknown';
        resolve(messageId);
      } catch (err) {
        const error = err as AxiosError;
        const detail = error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message;
        console.error(`[WhatsApp] Failed to send message to ${to}: ${detail}`);
        reject(new Error(`WhatsApp send failed: ${detail}`));
      }
    });

    processQueue().catch(console.error);
  });
}

export async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode = 'en_US',
  components: Record<string, unknown>[] = []
): Promise<string> {
  const token = process.env.META_WHATSAPP_TOKEN;
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    throw new Error('META_WHATSAPP_TOKEN and META_PHONE_NUMBER_ID must be set');
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    return response.data?.messages?.[0]?.id ?? 'unknown';
  } catch (err) {
    const error = err as AxiosError;
    const detail = error.response?.data
      ? JSON.stringify(error.response.data)
      : error.message;
    throw new Error(`WhatsApp template send failed: ${detail}`);
  }
}

export async function markAsRead(messageId: string): Promise<void> {
  const token = process.env.META_WHATSAPP_TOKEN;
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) return;

  try {
    await axios.post(
      `${BASE_URL}/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      }
    );
  } catch {
    // Non-critical — don't throw
  }
}
