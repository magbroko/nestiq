import { google, calendar_v3 } from 'googleapis';
import { CalendarEventResult } from '../types/index.js';

function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google Calendar credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN) must be set');
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret);
  auth.setCredentials({ refresh_token: refreshToken });
  return auth;
}

export async function createInspectionEvent(
  leadName: string,
  leadPhone: string,
  datetime: string,
  propertyAddress = 'TBD — Agent will confirm'
): Promise<CalendarEventResult> {
  const auth = getOAuth2Client();
  const calendar = google.calendar({ version: 'v3', auth });

  const agentEmail = process.env.AGENT_EMAIL;
  const agencyName = process.env.AGENCY_NAME ?? 'Our Agency';
  const agentName = process.env.AGENT_NAME ?? 'Agent';

  const startDate = new Date(datetime);
  if (isNaN(startDate.getTime())) {
    throw new Error(`Invalid datetime string: ${datetime}`);
  }

  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const attendees: calendar_v3.Schema$EventAttendee[] = [];
  if (agentEmail) {
    attendees.push({ email: agentEmail, displayName: agentName });
  }

  const event: calendar_v3.Schema$Event = {
    summary: `Property Inspection — ${leadName}`,
    description: `Property inspection booked via NestIQ AI assistant.\n\nBuyer: ${leadName}\nWhatsApp: ${leadPhone}\nProperty: ${propertyAddress}\n\nBooked automatically by NestIQ for ${agencyName}.`,
    location: propertyAddress,
    start: {
      dateTime: startDate.toISOString(),
      timeZone: 'Africa/Lagos',
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: 'Africa/Lagos',
    },
    attendees,
    conferenceData: {
      createRequest: {
        requestId: `nestiq-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 30 },
      ],
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
    conferenceDataVersion: 1,
    sendUpdates: 'all',
  });

  const createdEvent = response.data;
  const meetLink =
    createdEvent.conferenceData?.entryPoints?.find((ep) => ep.entryPointType === 'video')?.uri ??
    null;

  return {
    eventId: createdEvent.id ?? 'unknown',
    meetLink,
    htmlLink: createdEvent.htmlLink ?? '',
  };
}

export async function listUpcomingInspections(maxResults = 20): Promise<calendar_v3.Schema$Event[]> {
  const auth = getOAuth2Client();
  const calendar = google.calendar({ version: 'v3', auth });

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults,
    singleEvents: true,
    orderBy: 'startTime',
    q: 'Property Inspection',
  });

  return response.data.items ?? [];
}

export async function cancelInspectionEvent(eventId: string): Promise<void> {
  const auth = getOAuth2Client();
  const calendar = google.calendar({ version: 'v3', auth });

  await calendar.events.delete({
    calendarId: 'primary',
    eventId,
    sendUpdates: 'all',
  });
}
