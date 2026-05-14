import axios from 'axios';
import { Lead, Conversation, Appointment, Analytics, LeadStatus } from './types';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

export async function fetchLeads(
  page = 1,
  limit = 50
): Promise<{ leads: Lead[]; total: number }> {
  const { data } = await api.get('/leads', { params: { page, limit } });
  return data;
}

export async function fetchLeadDetail(
  id: string
): Promise<{ lead: Lead; conversations: Conversation[] }> {
  const { data } = await api.get(`/leads/${id}`);
  return data;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  const { data } = await api.patch(`/leads/${id}`, { status });
  return data;
}

export async function sendManualMessage(id: string, message: string): Promise<void> {
  await api.post(`/leads/${id}/message`, { message });
}

export async function fetchAppointments(): Promise<{ appointments: Appointment[] }> {
  const { data } = await api.get('/appointments');
  return data;
}

export async function cancelAppointment(id: string): Promise<void> {
  await api.patch(`/appointments/${id}/cancel`);
}

export async function fetchAnalytics(): Promise<Analytics> {
  const { data } = await api.get('/leads/analytics');
  return data;
}
