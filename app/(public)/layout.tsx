import { Suspense } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { Footer } from "@/components/layout/footer";
import { getSiteSettings } from "@/lib/data/site-settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <Sidebar
          companyName={settings.companyName}
          companyNameEn={settings.companyNameEn}
        />
      </Suspense>
      <Suspense fallback={null}>
        <MobileHeader
          companyName={settings.companyName}
          companyNameEn={settings.companyNameEn}
        />
      </Suspense>
      <div className="min-w-0 lg:pl-[220px]">
        <main className="min-w-0 overflow-x-clip">{children}</main>
        <Footer />
      </div>
    </div>
  );
}0