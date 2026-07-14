import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/data/site-settings";

export const metadata = { title: "사이트 설정" };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold">사이트 설정</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
