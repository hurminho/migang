import { SITE_SETTINGS, type SiteSettings } from "@/types/site-settings";

export async function getSiteSettings(): Promise<SiteSettings> {
  return SITE_SETTINGS;
}

export async function upsertSiteSettings(): Promise<void> {
  throw new Error(
    "Site settings are managed in types/site-settings.ts. Edit the file and redeploy.",
  );
}
