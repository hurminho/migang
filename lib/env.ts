function getEnv(key: string, required = false): string {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(
      `Missing required environment variable: ${key}. Please check your .env.local file.`,
    );
  }
  return value ?? "";
}

function readPublicEnv(name: "NEXT_PUBLIC_SITE_URL" | "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY" | "NEXT_PUBLIC_GA_ID" | "NEXT_PUBLIC_CLARITY_ID"): string {
  return process.env[name] ?? "";
}

// Static references so Next.js inlines NEXT_PUBLIC_* in client bundles.
export const env = {
  get siteUrl() {
    return readPublicEnv("NEXT_PUBLIC_SITE_URL") || "http://localhost:3000";
  },
  get supabaseUrl() {
    return readPublicEnv("NEXT_PUBLIC_SUPABASE_URL");
  },
  get supabaseAnonKey() {
    return readPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
  get supabaseServiceRoleKey() {
    return getEnv("SUPABASE_SERVICE_ROLE_KEY");
  },
  get gaId() {
    return readPublicEnv("NEXT_PUBLIC_GA_ID");
  },
  get clarityId() {
    return readPublicEnv("NEXT_PUBLIC_CLARITY_ID");
  },
};

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function assertSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
}
