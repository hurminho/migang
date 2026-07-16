import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { AnalyticsScripts } from "@/components/layout/analytics";
import { getSiteSettings } from "@/lib/data/site-settings";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.siteTitle,
      template: `%s | ${settings.companyName}`,
    },
    description: settings.siteDescription,
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: settings.companyName,
      images: [{ url: settings.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
    },
    verification: {
      google: settings.googleVerification || undefined,
      other: settings.naverVerification
        ? { "naver-site-verification": settings.naverVerification }
        : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <Toaster position="top-center" />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
