export type LeadStatus = 'new' | 'qualifying' | 'qualified' | 'booked' | 'closed';
export type PropertyType = 'apartment' | 'house' | 'land' | 'commercial' | 'unknown';
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
  role: 'user' | 'assistant';
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
  leads?: { name: string | null; whatsapp_number: string };
}

export interface Analytics {
  totalLeads: number;
  qualifiedLeads: number;
  bookedAppointments: number;
  leadsThisWeek: number;
  avgResponseTimeMinutes: number;
  topLocations: Array<{ location: string; count: number }>;
  statusBreakdown: Record<LeadStatus, number>;
}
