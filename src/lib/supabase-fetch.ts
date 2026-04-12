/**
 * Lightweight Supabase REST helpers for client components.
 * Uses the anon key directly — no server-side secrets.
 */

export const SUPABASE_URL = "https://glmgwaywptqlzudoiwot.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbWd3YXl3cHRxbHp1ZG9pd290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjU3OTIsImV4cCI6MjA4OTkwMTc5Mn0.F2kYymu9_t9THk2VI_g4cgpYv70oa9CVIcsCKSb0LL8";

const HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  "Content-Type": "application/json",
};

/**
 * Fetch rows from a Supabase table via REST.
 * Returns `null` on any error (caller uses hardcoded fallback).
 */
export async function supabaseGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: HEADERS,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Fetch a single site_settings value by key.
 * Returns the parsed JSON value, or `null` on failure.
 */
export async function fetchSiteSetting<T>(key: string): Promise<T | null> {
  const rows = await supabaseGet<Array<{ key: string; value: T }>>(
    `site_settings?key=eq.${encodeURIComponent(key)}&select=value`,
  );
  if (rows && rows.length > 0) return rows[0].value;
  return null;
}
