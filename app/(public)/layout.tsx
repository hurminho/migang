import { SiteHeader } from "@/components/layout/site-header";
import { Footer } from "@/components/layout/footer";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { getSiteSettings } from "@/lib/data/site-settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader
        companyName={settings.companyName}
        companyNameEn={settings.companyNameEn}
        phone={settings.phone}
      />
      <main className="min-w-0 overflow-x-clip">{children}</main>
      <Footer />
      <MobileActionBar phone={settings.phone} />
    </div>
  );
}
