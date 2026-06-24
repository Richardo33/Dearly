import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/src/lib/supabase/database.types";
import { getSupabaseAdminEnv, getSupabaseServerEnv } from "@/src/lib/supabase/env";

export function createSupabaseServerClient() {
  const env = getSupabaseServerEnv();

  return createClient<Database>(env.url, env.anonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
        }),
    },
  });
}

export function createSupabaseAdminClient() {
  const env = getSupabaseAdminEnv();

  return createClient<Database>(env.url, env.serviceRoleKey, {
    auth: {
      persistSession: false,
    },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
        }),
    },
  });
}
