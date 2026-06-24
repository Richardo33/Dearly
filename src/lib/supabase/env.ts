type SupabaseEnv = {
  anonKey: string;
  serviceRoleKey?: string;
  url: string;
};

export function getSupabasePublicEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return {
    anonKey,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    url,
  };
}

export function getSupabaseServerEnv() {
  const env = getSupabasePublicEnv();

  if (!env) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return env;
}

export function getSupabaseAdminEnv() {
  const env = getSupabaseServerEnv();

  if (!env.serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  return {
    serviceRoleKey: env.serviceRoleKey,
    url: env.url,
  };
}
