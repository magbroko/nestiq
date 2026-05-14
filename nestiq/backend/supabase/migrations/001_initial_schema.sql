-- ═══════════════════════════════════════════════════════════════
-- NestIQ — Initial Database Schema
-- Run this in your Supabase SQL Editor (Database → SQL Editor → New query)
-- ═══════════════════════════════════════════════════════════════

-- ── Enums ────────────────────────────────────────────────────────

CREATE TYPE lead_status AS ENUM ('new', 'qualifying', 'qualified', 'booked', 'closed');
CREATE TYPE property_type AS ENUM ('apartment', 'house', 'land', 'commercial', 'unknown');
CREATE TYPE conversation_role AS ENUM ('user', 'assistant');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- ── Leads ────────────────────────────────────────────────────────

CREATE TABLE leads (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number   TEXT NOT NULL UNIQUE,
  name              TEXT,
  budget            TEXT,
  location          TEXT,
  property_type     property_type NOT NULL DEFAULT 'unknown',
  status            lead_status NOT NULL DEFAULT 'new',
  needs_mortgage    BOOLEAN,
  buying_timeline   TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_contact      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_last_contact ON leads(last_contact DESC);
CREATE INDEX idx_leads_whatsapp ON leads(whatsapp_number);

-- ── Conversations ────────────────────────────────────────────────

CREATE TABLE conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id    UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  role       conversation_role NOT NULL,
  message    TEXT NOT NULL,
  timestamp  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_lead_id ON conversations(lead_id);
CREATE INDEX idx_conversations_timestamp ON conversations(lead_id, timestamp ASC);

-- ── Appointments ──────────────────────────────────────────────────

CREATE TABLE appointments (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id              UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  property_address     TEXT NOT NULL DEFAULT 'TBD — Agent will confirm',
  datetime             TIMESTAMPTZ NOT NULL,
  calendar_event_id    TEXT,
  calendar_meet_link   TEXT,
  status               appointment_status NOT NULL DEFAULT 'confirmed',
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_lead_id ON appointments(lead_id);
CREATE INDEX idx_appointments_datetime ON appointments(datetime ASC);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ── Demo Requests (from marketing website lead capture form) ──────

CREATE TABLE demo_requests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name      TEXT NOT NULL,
  email          TEXT NOT NULL,
  phone          TEXT NOT NULL,
  agency_name    TEXT NOT NULL,
  listing_count  TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_demo_requests_email ON demo_requests(email);
CREATE INDEX idx_demo_requests_created_at ON demo_requests(created_at DESC);

-- ── Row Level Security ────────────────────────────────────────────
-- For production, enable RLS and create appropriate policies.
-- During development with the anon key from the backend, you can use
-- the service role key instead, or enable the following permissive policies:

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Allow all operations from the service role (backend uses this)
-- Replace with restrictive policies in production as needed.
CREATE POLICY "service_role_all_leads" ON leads FOR ALL USING (true);
CREATE POLICY "service_role_all_conversations" ON conversations FOR ALL USING (true);
CREATE POLICY "service_role_all_appointments" ON appointments FOR ALL USING (true);
CREATE POLICY "service_role_all_demo_requests" ON demo_requests FOR ALL USING (true);

-- ── Seed Data (optional — remove in production) ──────────────────

-- INSERT INTO leads (whatsapp_number, name, budget, location, property_type, status)
-- VALUES
--   ('+2348012345678', 'Amara Obi', '₦25M – ₦35M', 'Lekki Phase 1', 'apartment', 'qualified'),
--   ('+2349087654321', 'Chidi Eze', '₦50M+', 'Ikoyi', 'house', 'booked'),
--   ('+2348099887766', NULL, NULL, NULL, 'unknown', 'new');
