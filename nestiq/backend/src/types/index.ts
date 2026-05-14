export type LeadStatus = 'new' | 'qualifying' | 'qualified' | 'booked' | 'closed';
export type PropertyType = 'apartment' | 'house' | 'land' | 'commercial' | 'unknown';
export type ConversationRole = 'user' | 'assistant';
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Lead {
  id: string;
  whatsapp_number: string;
  name: string | null;
  budget: string | null;
  location: string | null;
  property_type: PropertyType;
  status: LeadStatus;
  needs_mortgage: boolean | null;
  buying_timeline: string | null;
  created_at: string;
  last_contact: string;
}

export interface Conversation {
  id: string;
  lead_id: string;
  role: ConversationRole;
  message: string;
  timestamp: string;
}

export interface Appointment {
  id: string;
  lead_id: string;
  property_address: string;
  datetime: string;
  calendar_event_id: string | null;
  calendar_meet_link: string | null;
  status: AppointmentStatus;
  created_at: string;
}

export interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
}

export interface WhatsAppWebhookBody {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: { display_phone_number: string; phone_number_id: string };
        contacts?: Array<{ profile: { name: string }; wa_id: string }>;
        messages?: WhatsAppMessage[];
        statuses?: Array<{ id: string; status: string; timestamp: string; recipient_id: string }>;
      };
      field: string;
    }>;
  }>;
}

export interface AIContext {
  lead: Lead;
  history: Conversation[];
  newMessage: string;
}

export interface CalendarEventResult {
  eventId: string;
  meetLink: string | null;
  htmlLink: string;
}

export interface LeadUpdatePayload {
  name?: string;
  budget?: string;
  location?: string;
  property_type?: PropertyType;
  status?: LeadStatus;
  needs_mortgage?: boolean;
  buying_timeline?: string;
  last_contact?: string;
}

export interface CreateLeadPayload {
  fullName: string;
  email: string;
  phone: string;
  agencyName: string;
  listingCount: string;
}
