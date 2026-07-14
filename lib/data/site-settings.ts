import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import {
  DEFAULT_SITE_SETTINGS,
  SITE_SETTING_KEYS,
  type SiteSettings,
} from "@/types/site-settings";
import type { SiteSettingsFormValues } from "@/lib/validation/schemas";

function parseSettingValue<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  return value as T;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_SITE_SETTINGS;
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("key, value");

    if (!data?.length) {
      return DEFAULT_SITE_SETTINGS;
    }

    const map = new Map(data.map((row) => [row.key, row.value]));
    const get = <T>(key: string, fallback: T): T =>
      parseSettingValue(map.get(key), fallback);

    return {
      companyName: get(SITE_SETTING_KEYS.companyName, DEFAULT_SITE_SETTINGS.companyName),
      companyNameEn: get(SITE_SETTING_KEYS.companyNameEn, DEFAULT_SITE_SETTINGS.companyNameEn),
      representative: get(SITE_SETTING_KEYS.representative, DEFAULT_SITE_SETTINGS.representative),
      businessNumber: get(SITE_SETTING_KEYS.businessNumber, DEFAULT_SITE_SETTINGS.businessNumber),
      phone: get(SITE_SETTING_KEYS.phone, DEFAULT_SITE_SETTINGS.phone),
      email: get(SITE_SETTING_KEYS.email, DEFAULT_SITE_SETTINGS.email),
      address: get(SITE_SETTING_KEYS.address, DEFAULT_SITE_SETTINGS.address),
      kakaoUrl: get(SITE_SETTING_KEYS.kakaoUrl, DEFAULT_SITE_SETTINGS.kakaoUrl),
      instagramUrl: get(SITE_SETTING_KEYS.instagramUrl, DEFAULT_SITE_SETTINGS.instagramUrl),
      naverBlogUrl: get(SITE_SETTING_KEYS.naverBlogUrl, DEFAULT_SITE_SETTINGS.naverBlogUrl),
      serviceAreas: get(SITE_SETTING_KEYS.serviceAreas, DEFAULT_SITE_SETTINGS.serviceAreas),
      heroTitle: get(SITE_SETTING_KEYS.heroTitle, DEFAULT_SITE_SETTINGS.heroTitle),
      heroSubtitle: get(SITE_SETTING_KEYS.heroSubtitle, DEFAULT_SITE_SETTINGS.heroSubtitle),
      heroImage: get(SITE_SETTING_KEYS.heroImage, DEFAULT_SITE_SETTINGS.heroImage),
      aboutText: get(SITE_SETTING_KEYS.aboutText, DEFAULT_SITE_SETTINGS.aboutText),
      strengths: get(SITE_SETTING_KEYS.strengths, DEFAULT_SITE_SETTINGS.strengths),
      services: get(SITE_SETTING_KEYS.services, DEFAULT_SITE_SETTINGS.services),
      processSteps: get(SITE_SETTING_KEYS.processSteps, DEFAULT_SITE_SETTINGS.processSteps),
      siteTitle: get(SITE_SETTING_KEYS.siteTitle, DEFAULT_SITE_SETTINGS.siteTitle),
      siteDescription: get(SITE_SETTING_KEYS.siteDescription, DEFAULT_SITE_SETTINGS.siteDescription),
      ogImage: get(SITE_SETTING_KEYS.ogImage, DEFAULT_SITE_SETTINGS.ogImage),
      gaId: get(SITE_SETTING_KEYS.gaId, DEFAULT_SITE_SETTINGS.gaId),
      clarityId: get(SITE_SETTING_KEYS.clarityId, DEFAULT_SITE_SETTINGS.clarityId),
      naverVerification: get(SITE_SETTING_KEYS.naverVerification, DEFAULT_SITE_SETTINGS.naverVerification),
      googleVerification: get(SITE_SETTING_KEYS.googleVerification, DEFAULT_SITE_SETTINGS.googleVerification),
      footerCopyright: get(SITE_SETTING_KEYS.footerCopyright, DEFAULT_SITE_SETTINGS.footerCopyright),
      footerBusinessInfo: get(SITE_SETTING_KEYS.footerBusinessInfo, DEFAULT_SITE_SETTINGS.footerBusinessInfo),
      privacyPolicy: get(SITE_SETTING_KEYS.privacyPolicy, DEFAULT_SITE_SETTINGS.privacyPolicy),
      aboutContent: get(SITE_SETTING_KEYS.aboutContent, DEFAULT_SITE_SETTINGS.aboutContent),
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function upsertSiteSettings(
  settings: SiteSettingsFormValues,
): Promise<void> {
  const supabase = await createClient();
  const entries = Object.entries(SITE_SETTING_KEYS) as Array<
    [keyof typeof SITE_SETTING_KEYS, string]
  >;

  const rows = entries
    .filter(([key]) => settings[key] !== undefined)
    .map(([key, dbKey]) => ({
      key: dbKey,
      value: settings[key],
    }));

  if (!rows.length) return;

  const { error } = await supabase.from("site_settings").upsert(rows, {
    onConflict: "key",
  });

  if (error) throw error;
}
