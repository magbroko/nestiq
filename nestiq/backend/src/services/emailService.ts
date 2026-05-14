import nodemailer, { Transporter } from 'nodemailer';
import { Lead, Conversation } from '../types/index.js';

let transporter: Transporter;

function getTransporter(): Transporter {
  if (!transporter) {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT ?? '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      throw new Error('SMTP_HOST, SMTP_USER, and SMTP_PASS must be set');
    }

    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
  }
  return transporter;
}

function formatPhone(phone: string): string {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '+$1 $2 $3');
}

function statusBadge(status: string): string {
  const colors: Record<string, string> = {
    new: '#6366f1',
    qualifying: '#f59e0b',
    qualified: '#10b981',
    booked: '#3b82f6',
    closed: '#6b7280',
  };
  return `<span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;color:#fff;background:${colors[status] ?? '#6b7280'}">${status.toUpperCase()}</span>`;
}

export async function notifyAgentNewLead(lead: Lead, recentMessages: Conversation[]): Promise<void> {
  const agentEmail = process.env.AGENT_EMAIL;
  const agencyName = process.env.AGENCY_NAME ?? 'NestIQ';
  const dashboardUrl = process.env.DASHBOARD_URL ?? 'http://localhost:5174';

  if (!agentEmail) {
    console.warn('[Email] AGENT_EMAIL not set — skipping agent notification');
    return;
  }

  const t = getTransporter();

  const conversationHtml = recentMessages
    .slice(-6)
    .map(
      (m) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;width:80px;vertical-align:top">
            <span style="font-size:12px;font-weight:600;color:${m.role === 'user' ? '#6366f1' : '#10b981'}">${m.role === 'user' ? 'BUYER' : 'NESTIQ'}</span>
          </td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#374151">${m.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
        </tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f9fafb">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0D1B2A 0%,#1a3a5c 100%);padding:28px 32px">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:40px;height:40px;background:#C8A96E;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px">🏠</div>
        <div>
          <div style="color:#C8A96E;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase">NestIQ Alert</div>
          <div style="color:#fff;font-size:20px;font-weight:700">New Qualified Lead</div>
        </div>
      </div>
    </div>

    <!-- Lead Details -->
    <div style="padding:28px 32px;border-bottom:1px solid #f0f0f0">
      <h2 style="margin:0 0 16px;font-size:22px;color:#111827">
        ${lead.name ?? 'Unknown'} ${statusBadge(lead.status)}
      </h2>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px;width:140px">WhatsApp</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:500">${formatPhone(lead.whatsapp_number)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px">Budget</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:500">${lead.budget ?? '—'}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px">Location</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:500">${lead.location ?? '—'}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px">Property Type</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:500">${lead.property_type}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px">Timeline</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:500">${lead.buying_timeline ?? '—'}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px">Mortgage Needed</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:500">${lead.needs_mortgage === null ? '—' : lead.needs_mortgage ? 'Yes' : 'No'}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px">First Contact</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:500">${new Date(lead.created_at).toLocaleString()}</td>
        </tr>
      </table>
    </div>

    <!-- Conversation Preview -->
    ${
      recentMessages.length > 0
        ? `<div style="padding:28px 32px;border-bottom:1px solid #f0f0f0">
      <h3 style="margin:0 0 16px;font-size:16px;color:#111827">Recent Conversation</h3>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
        ${conversationHtml}
      </table>
    </div>`
        : ''
    }

    <!-- CTA -->
    <div style="padding:28px 32px;text-align:center">
      <a href="${dashboardUrl}/leads/${lead.id}" 
         style="display:inline-block;background:#C8A96E;color:#0D1B2A;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;text-decoration:none">
        View Full Conversation →
      </a>
      <p style="margin:16px 0 0;font-size:12px;color:#9ca3af">
        This alert was sent by NestIQ for ${agencyName}. 
        <a href="${dashboardUrl}" style="color:#C8A96E">Open Dashboard</a>
      </p>
    </div>

  </div>
</body>
</html>`;

  await t.sendMail({
    from: `"NestIQ" <${process.env.SMTP_USER}>`,
    to: agentEmail,
    subject: `🏠 New Qualified Lead: ${lead.name ?? lead.whatsapp_number} — Budget: ${lead.budget ?? 'Unknown'}`,
    html,
  });

  console.log(`[Email] Agent notification sent to ${agentEmail}`);
}

export async function sendFollowUpWhatsApp(lead: Lead): Promise<string> {
  const name = lead.name ?? 'there';
  const location = lead.location ? ` in ${lead.location}` : '';
  return `Hi ${name}! 👋 Just checking in — are you still interested in viewing properties${location}? We have some new listings that match your budget. Would you like to book an inspection? 🏡`;
}

export async function sendAppointmentConfirmation(
  agentEmail: string,
  leadName: string,
  leadPhone: string,
  datetime: string,
  meetLink: string | null
): Promise<void> {
  if (!agentEmail) return;

  const t = getTransporter();

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#f9fafb;margin:0;padding:32px">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="background:linear-gradient(135deg,#0D1B2A 0%,#1a3a5c 100%);padding:24px 28px">
      <div style="color:#C8A96E;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase">NestIQ — Appointment</div>
      <div style="color:#fff;font-size:20px;font-weight:700;margin-top:4px">Inspection Booked ✅</div>
    </div>
    <div style="padding:28px">
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;width:120px">Buyer</td><td style="font-weight:600;color:#111827;font-size:14px">${leadName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;font-size:14px">WhatsApp</td><td style="font-weight:600;color:#111827;font-size:14px">${leadPhone}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;font-size:14px">Date & Time</td><td style="font-weight:600;color:#111827;font-size:14px">${new Date(datetime).toLocaleString()}</td></tr>
        ${meetLink ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:14px">Meet Link</td><td style="font-size:14px"><a href="${meetLink}" style="color:#C8A96E">${meetLink}</a></td></tr>` : ''}
      </table>
    </div>
  </div>
</body>
</html>`;

  await t.sendMail({
    from: `"NestIQ" <${process.env.SMTP_USER}>`,
    to: agentEmail,
    subject: `📅 Inspection Booked: ${leadName} — ${new Date(datetime).toLocaleDateString()}`,
    html,
  });
}
