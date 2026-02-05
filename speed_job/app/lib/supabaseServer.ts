// app/lib/supabaseServer.ts
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

function requireSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_URL");
  if (!key) throw new Error("Missing env var: SUPABASE_SERVICE_ROLE_KEY");

  return { url, key };
}

export function getSupabaseServer(): SupabaseClient {
  if (_supabase) return _supabase;

  const { url, key } = requireSupabase();
  _supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  return _supabase;
}
