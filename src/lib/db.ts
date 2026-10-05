import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Server-only Neon access. The connection string never reaches the browser:
 * nothing in this module may be imported from a "use client" file.
 */
const url = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;

let client: NeonQueryFunction<false, false> | null = null;

export const databaseConfigured = Boolean(url);

export function db(): NeonQueryFunction<false, false> {
  if (!url) {
    throw new Error(
      "Database is not configured. Set DATABASE_URL (and DATABASE_URL_POOLED) in the environment."
    );
  }
  if (!client) client = neon(url);
  return client;
}

export type DbUser = {
  id: string;
  email: string | null;
  email_verified: boolean;
  name: string | null;
  avatar_url: string | null;
};

export type DbProfile = {
  user_id: string;
  full_name: string | null;
  course: string | null;
  grad_year: number | null;
  student_email: string | null;
  student_id: string | null;
  university_id: string | null;
  university_name: string | null;
  university_country: string | null;
  university_city: string | null;
  university_custom: boolean;
  location: string | null;
  bio: string | null;
  verification: "required" | "pending" | "verified" | "failed";
  onboarded: boolean;
  onboarding_step: number;
  availability: string[];
  looking_for: string[];
  work_area: string;
  ai_prefs: Record<string, unknown> | null;
};
