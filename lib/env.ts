function getEnv(key: string, required = false): string {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(
      `Missing required environment variable: ${key}. Please check your .env.local file.`,
    );
  }
  return value ?? "";
}

// Use static process.env references so Next.js inlines NEXT_PUBLIC_* in client bundles.
export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID ?? "",
};

export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function assertSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
    );
  }
}
