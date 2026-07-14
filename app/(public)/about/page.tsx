import Link from "next/link";
import { OrgChart } from "@/components/about/org-chart";
import { ProcessSteps } from "@/components/about/process-steps";
import { getSiteSettings } from "@/lib/data/site-settings";

export const metadata = {
  title: "About",
  description: "미강건축 회사 소개",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const { aboutContent } = settings;

  return (
    <div className="page-main">
      <p className="mb-10 text-xs tracking-[0.08em] text-muted uppercase">About</p>

      <div className="max-w-2xl space-y-10">
        {/* Company */}
        <section>
          <p className="whitespace-pre-line text-sm leading-relaxed">
            {aboutContent.greeting}
          </p>
        </section>

        {/* Services */}
        <section>
          <p className="mb-3 text-xs tracking-[0.08em] text-muted uppercase">Services</p>
          <p className="text-sm text-muted">{settings.services.join(" · ")}</p>
          {aboutContent.services && (
            <p className="mt-3 text-sm leading-relaxed text-muted">{aboutContent.services}</p>
          )}
        </section>

        <ProcessSteps steps={settings.processSteps} />

        {/* Strengths */}
        <section>
          <p className="mb-3 text-xs tracking-[0.08em] text-muted uppercase">Strengths</p>
          <ul className="space-y-2">
            {settings.strengths.map((strength) => (
              <li key={strength} className="text-sm leading-relaxed text-muted">
                {strength}
              </li>
            ))}
          </ul>
        </section>

        {/* Organization */}
        <OrgChart ceoName={settings.representative} />

        {/* Company info */}
        <section className="space-y-5 border-t border-border pt-8 text-sm">
          <div>
            <p className="text-xs text-muted">Experience</p>
            <p className="mt-1">{aboutContent.experience}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Area</p>
            <p className="mt-1">{aboutContent.areas || settings.serviceAreas}</p>
          </div>
          <div>
            <p className="text-xs text-muted">License</p>
            <p className="mt-1">{aboutContent.licenses}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Principles</p>
            <p className="mt-1 leading-relaxed text-muted">{aboutContent.principles}</p>
          </div>
        </section>

        {/* Contact */}
        <section className="border-t border-border pt-8">
          <p className="mb-4 text-xs tracking-[0.08em] text-muted uppercase">Contact</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href={`tel:${settings.phone.replace(/-/g, "")}`} className="text-link">
              {settings.phone}
            </a>
            {settings.naverBlogUrl && (
              <a
                href={settings.naverBlogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Blog
              </a>
            )}
            <Link href="/contact" className="text-link">
              Inquiry
            </Link>
          </div>
          <dl className="mt-6 space-y-2 text-sm text-muted">
            <div className="flex gap-6">
              <dt className="w-12 shrink-0">Email</dt>
              <dd>{settings.email}</dd>
            </div>
            <div className="flex gap-6">
              <dt className="w-12 shrink-0">Addr</dt>
              <dd>{settings.address}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
