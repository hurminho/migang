import Link from "next/link";
import { getSiteSettings } from "@/lib/data/site-settings";
import { publicNavItems } from "@/lib/navigation";

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-surface pb-24 md:pb-0">
      <div className="container-site grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <p className="text-lg font-semibold tracking-tight">{settings.companyName}</p>
          <p className="text-[11px] tracking-[0.2em] text-muted uppercase">
            {settings.companyNameEn}
          </p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
            {settings.heroSubtitle}
          </p>
        </div>

        <div className="md:col-span-4">
          <p className="eyebrow">Contact</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="sr-only">Phone</dt>
              <dd>
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="hover:underline">
                  {settings.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="sr-only">Email</dt>
              <dd>
                <a href={`mailto:${settings.email}`} className="hover:underline">
                  {settings.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="sr-only">Address</dt>
              <dd className="text-muted">{settings.address}</dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow">Menu</p>
          <ul className="mt-4 space-y-2 text-sm">
            {publicNavItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
            {settings.naverBlogUrl && (
              <li>
                <a
                  href={settings.naverBlogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Blog
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="container-site">
        <div className="flex flex-col gap-2 border-t border-border py-6 text-[13px] text-muted md:flex-row md:justify-between">
          <p>{settings.footerBusinessInfo}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">
              개인정보처리방침
            </Link>
            <span>{settings.footerCopyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
