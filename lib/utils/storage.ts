import { env, isSupabaseConfigured } from "@/lib/env";

export function getPublicStorageUrl(
  bucket: "project-images" | "site-assets",
  path: string | null | undefined,
  fallback = "/placeholders/project.svg",
): string {
  if (!path) return fallback;
  if (path.startsWith("http") || path.startsWith("/")) return path;

  if (!isSupabaseConfigured()) {
    return fallback;
  }

  return `${env.supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

export async function getSignedStorageUrl(
  bucket: "inquiry-attachments",
  path: string,
  expiresIn = 3600,
): Promise<string | null> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
