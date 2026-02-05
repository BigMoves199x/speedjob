-- ============================================================
-- Enable Required Extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Drop Existing Tables (dependency-safe order)
-- ============================================================
DROP TABLE IF EXISTS onboarding CASCADE;
DROP TABLE IF EXISTS applicants CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- ============================================================
-- Admin Users
-- ============================================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL CHECK (length(username) >= 3),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Applicants
-- ============================================================
CREATE TABLE applicants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  first_name TEXT NOT NULL CHECK (length(trim(first_name)) > 0),
  last_name  TEXT NOT NULL CHECK (length(trim(last_name)) > 0),

  email TEXT UNIQUE NOT NULL
    CHECK (position('@' in email) > 1),

  phone TEXT NOT NULL
    CHECK (length(regexp_replace(phone, '\D', '', 'g')) >= 10),

  resume_url TEXT,

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected')),

  application_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_applicants_status ON applicants(status);

-- ============================================================
-- Onboarding
-- ============================================================
CREATE TABLE onboarding (
  applicant_id UUID PRIMARY KEY REFERENCES applicants(id) ON DELETE CASCADE,

  -- Identity Info
  first_name         TEXT NOT NULL CHECK (length(trim(first_name)) > 0),
  middle_name        TEXT,
  last_name          TEXT NOT NULL CHECK (length(trim(last_name)) > 0),
  mother_maiden_name TEXT,
  date_of_birth      DATE NOT NULL
    CHECK (date_of_birth < CURRENT_DATE),

  -- If you truly must store SSN in a practice project:
  ssn TEXT
    CHECK (ssn ~ '^\d{9}$'),

  -- Address Info
  street   TEXT NOT NULL,
  city     TEXT NOT NULL,
  state    TEXT NOT NULL CHECK (length(state) >= 2),
  zip_code TEXT NOT NULL CHECK (zip_code ~ '^\d{5}(-\d{4})?$'),

  -- Banking Info (NO bank username/password)
  bank_name      TEXT NOT NULL,
  routing_number TEXT NOT NULL CHECK (routing_number ~ '^\d{9}$'),
  account_number TEXT NOT NULL CHECK (account_number ~ '^\d{6,17}$'),

  -- Document URLs (public links)
  front_image_url TEXT NOT NULL,
  back_image_url  TEXT NOT NULL,
  w2_form_url     TEXT NOT NULL,

  front_image_filename TEXT,
  back_image_filename  TEXT,
  w2_form_filename     TEXT,

  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_date      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
