import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Lead, Conversation, Appointment, LeadStatus, LeadUpdatePayload, PropertyType } from '../types/index.js';

let supabase: SupabaseClient;

function getClient(): SupabaseClient {
  if (!supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set');
    }
    supabase = createClient(url, key);
  }
  return supabase;
}

export async function getOrCreateLead(whatsappNumber: string): Promise<Lead> {
  const client = getClient();

  const { data: existing, error: fetchError } = await client
    .from('leads')
    .select('*')
    .eq('whatsapp_number', whatsappNumber)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error(`Failed to fetch lead: ${fetchError.message}`);
  }

  if (existing) {
    await client
      .from('leads')
      .update({ last_contact: new Date().toISOString() })
      .eq('id', existing.id);
    return existing as Lead;
  }

  const { data: newLead, error: insertError } = await client
    .from('leads')
    .insert({
      whatsapp_number: whatsappNumber,
      name: null,
      budget: null,
      location: null,
      property_type: 'unknown' as PropertyType,
      status: 'new' as LeadStatus,
      needs_mortgage: null,
      buying_timeline: null,
      created_at: new Date().toISOString(),
      last_contact: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (insertError || !newLead) {
    throw new Error(`Failed to create lead: ${insertError?.message}`);
  }

  return newLead as Lead;
}

export async function updateLead(leadId: string, payload: LeadUpdatePayload): Promise<Lead> {
  const client = getClient();

  const { data, error } = await client
    .from('leads')
    .update({ ...payload, last_contact: new Date().toISOString() })
    .eq('id', leadId)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(`Failed to update lead: ${error?.message}`);
  }

  return data as Lead;
}

export async function getLeadById(leadId: string): Promise<Lead | null> {
  const client = getClient();

  const { data, error } = await client
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (error) return null;
  return data as Lead;
}

export async function getAllLeads(page = 1, limit = 50): Promise<{ leads: Lead[]; total: number }> {
  const client = getClient();
  const offset = (page - 1) * limit;

  const { data, error, count } = await client
    .from('leads')
    .select('*', { count: 'exact' })
    .order('last_contact', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch leads: ${error.message}`);
  }

  return { leads: (data ?? []) as Lead[], total: count ?? 0 };
}

export async function getConversationHistory(leadId: string, limit = 20): Promise<Conversation[]> {
  const client = getClient();

  const { data, error } = await client
    .from('conversations')
    .select('*')
    .eq('lead_id', leadId)
    .order('timestamp', { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch conversations: ${error.message}`);
  }

  return (data ?? []) as Conversation[];
}

export async function saveMessage(
  leadId: string,
  role: 'user' | 'assistant',
  message: string
): Promise<void> {
  const client = getClient();

  const { error } = await client.from('conversations').insert({
    lead_id: leadId,
    role,
    message,
    timestamp: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`Failed to save message: ${error.message}`);
  }
}

export async function createAppointment(
  leadId: string,
  propertyAddress: string,
  datetime: string,
  calendarEventId: string | null,
  calendarMeetLink: string | null
): Promise<Appointment> {
  const client = getClient();

  const { data, error } = await client
    .from('appointments')
    .insert({
      lead_id: leadId,
      property_address: propertyAddress,
      datetime,
      calendar_event_id: calendarEventId,
      calendar_meet_link: calendarMeetLink,
      status: 'confirmed',
      created_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(`Failed to create appointment: ${error?.message}`);
  }

  return data as Appointment;
}

export async function getAllAppointments(): Promise<Appointment[]> {
  const client = getClient();

  const { data, error } = await client
    .from('appointments')
    .select('*, leads(name, whatsapp_number)')
    .order('datetime', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch appointments: ${error.message}`);
  }

  return (data ?? []) as Appointment[];
}

export async function getLeadsForFollowUp(): Promise<Lead[]> {
  const client = getClient();
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await client
    .from('leads')
    .select('*')
    .in('status', ['qualifying', 'new'])
    .lt('last_contact', cutoff);

  if (error) {
    throw new Error(`Failed to fetch follow-up leads: ${error.message}`);
  }

  return (data ?? []) as Lead[];
}

export async function getAnalytics(): Promise<{
  totalLeads: number;
  qualifiedLeads: number;
  bookedAppointments: number;
  leadsThisWeek: number;
  avgResponseTimeMinutes: number;
  topLocations: Array<{ location: string; count: number }>;
  statusBreakdown: Record<LeadStatus, number>;
}> {
  const client = getClient();

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [allLeads, bookedLeads, weekLeads] = await Promise.all([
    client.from('leads').select('status, location', { count: 'exact' }),
    client.from('appointments').select('id', { count: 'exact' }).eq('status', 'confirmed'),
    client.from('leads').select('id', { count: 'exact' }).gte('created_at', weekAgo),
  ]);

  const leads = (allLeads.data ?? []) as Array<{ status: LeadStatus; location: string | null }>;
  const statusBreakdown: Record<LeadStatus, number> = {
    new: 0,
    qualifying: 0,
    qualified: 0,
    booked: 0,
    closed: 0,
  };

  const locationMap: Record<string, number> = {};

  for (const lead of leads) {
    statusBreakdown[lead.status] = (statusBreakdown[lead.status] ?? 0) + 1;
    if (lead.location) {
      locationMap[lead.location] = (locationMap[lead.location] ?? 0) + 1;
    }
  }

  const topLocations = Object.entries(locationMap)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalLeads: allLeads.count ?? 0,
    qualifiedLeads: statusBreakdown.qualified + statusBreakdown.booked + statusBreakdown.closed,
    bookedAppointments: bookedLeads.count ?? 0,
    leadsThisWeek: weekLeads.count ?? 0,
    avgResponseTimeMinutes: 3,
    topLocations,
    statusBreakdown,
  };
}
