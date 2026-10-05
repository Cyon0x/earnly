-- Earnly core schema. Safe to run more than once.

create extension if not exists "pgcrypto";

-- One row per human. Created the first time any provider signs them in.
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  email_verified boolean not null default false,
  name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

-- Provider identities. A user can hold several (Google + email) without
-- becoming two accounts, which is what stops duplicate signups.
create table if not exists auth_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  provider text not null check (provider in ('google', 'email')),
  provider_account_id text not null,
  provider_email text,
  password_hash text,
  password_salt text,
  created_at timestamptz not null default now(),
  unique (provider, provider_account_id)
);

create index if not exists auth_accounts_user_idx on auth_accounts (user_id);

-- Student profile + onboarding state. One row per user.
create table if not exists profiles (
  user_id uuid primary key references users(id) on delete cascade,
  full_name text,
  course text,
  grad_year int,
  student_email text,
  student_id text,
  university_id text,
  university_name text,
  university_country text,
  university_city text,
  university_custom boolean not null default false,
  location text,
  bio text,
  verification text not null default 'required'
    check (verification in ('required', 'pending', 'verified', 'failed')),
  onboarded boolean not null default false,
  onboarding_step int not null default 0,
  availability jsonb not null default '[]'::jsonb,
  looking_for jsonb not null default '[]'::jsonb,
  work_area text not null default 'Anywhere',
  ai_prefs jsonb,
  updated_at timestamptz not null default now()
);

-- Skills a student claims, normalised so they can be counted and matched later.
create table if not exists user_skills (
  user_id uuid not null references users(id) on delete cascade,
  skill text not null,
  custom boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (user_id, skill)
);

create index if not exists user_skills_skill_idx on user_skills (lower(skill));

-- Universities students add themselves when the seeded list does not have theirs.
create table if not exists custom_universities (
  id text primary key,
  name text not null,
  country text not null,
  city text,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create unique index if not exists custom_universities_name_country_idx
  on custom_universities (lower(name), country);

-- Server-side session log, so a session can be revoked without deleting the user.
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  user_agent text
);

create index if not exists sessions_user_idx on sessions (user_id);
