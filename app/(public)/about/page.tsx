import Image from "next/image";
import type { ReactNode } from "react";
import { OrgChart } from "@/components/about/org-chart";
import { ProcessSteps } from "@/components/about/process-steps";
import { CtaBanner } from "@/components/layout/cta-banner";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/ui/reveal";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/site-settings";
import { getPublicStorageUrl } from "@/lib/utils/storage";
import { pairServices, pairStrengths, splitParagraphs } from "@/lib/content";

export const metadata = {
  title: "About",
  description: "미강 인테리어 회사 소개",
};

export default async function AboutPage() {
  const [settings, [featured]] = await Promise.all([getSiteSettings(), getFeaturedProjects(1)]);
  const [introKo = [], introEn = []] = splitParagraphs(settings.aboutIntro);
  const services = pairServices(settings.services);
  const strengths = pairStrengths(settings.strengths);

  return (
    <>
      <PageHeader
        eyebrow="About"
        title={introKo.map((line, i) => (
          <span key={line} className="block">
            {line}
            {i < introKo.length - 1 && " "}
          </span>
        ))}
        description={
          introEn.length > 0 ? (
            <p>
              {introEn.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          ) : undefined
        }
      />

      {featured?.cover_image_path && (
        <Reveal className="container-site">
          <div className="relative aspect-[4/3] overflow-hidden bg-surface md:aspect-[21/9]">
            <Image
              src={getPublicStorageUrl("project-images", featured.cover_image_path)}
              alt={featured.title}
              fill
              preload
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover"
            />
          </div>
        </Reveal>
      )}

      <div className="container-site py-20 md:py-32">
        <AboutSection label="Services" title="서비스">
          <ul className="divide-y divide-border border-y border-border">
            {services.map((service, i) => (
              <Reveal
                as="li"
                key={service.ko}
                delay={i * 60}
                className="flex items-baseline justify-between gap-6 py-5"
              >
                <span className="text-xl font-semibold md:text-2xl">{service.ko}</span>
                {service.en && <span className="text-sm text-muted">{service.en}</span>}
              </Reveal>
            ))}
          </ul>
        </AboutSection>

        <AboutSection label="Process" title="진행 과정">
          <ProcessSteps steps={settings.processSteps} />
        </AboutSection>

        <AboutSection label="Strengths" title="미강의 약속">
          <Reveal className="grid gap-px border border-border bg-border md:grid-cols-3">
            {strengths.map((item, i) => (
              <div key={item.ko} className="bg-white p-6 md:p-8">
                <span className="text-sm tabular-nums text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-8 text-lg leading-snug font-semibold">{item.ko}</p>
                {item.en && <p className="mt-3 text-sm leading-relaxed text-muted">{item.en}</p>}
              </div>
            ))}
          </Reveal>
        </AboutSection>

        <AboutSection label="Organization" title="조직">
          <Reveal>
            <OrgChart ceoName={settings.representative} />
          </Reveal>
        </AboutSection>

        <AboutSection label="Contact" title="연락처">
          <dl className="divide-y divide-border border-y border-border">
            {[
              {
                label: "Phone",
                value: (
                  <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="hover:underline">
                    {settings.phone}
                  </a>
                ),
              },
              {
                label: "Email",
                value: (
                  <a href={`mailto:${settings.email}`} className="hover:underline">
                    {settings.email}
                  </a>
                ),
              },
              { label: "Address", value: settings.address },
            ].map((row) => (
              <div key={row.label} className="grid gap-2 py-5 sm:grid-cols-4">
                <dt className="eyebrow pt-1">{row.label}</dt>
                <dd className="text-lg sm:col-span-3">{row.value}</dd>
              </div>
            ))}
          </dl>
        </AboutSection>
      </div>

      <CtaBanner phone={settings.phone} />
    </>
  );
}

function AboutSection({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-8 border-t border-border py-14 first:border-t-0 first:pt-0 md:grid-cols-12 md:py-20">
      <Reveal className="md:col-span-3">
        <p className="eyebrow">{label}</p>
        <h2 className="mt-3 text-2xl md:text-3xl">{title}</h2>
      </Reveal>
      <div className="md:col-span-9">{children}</div>
    </section>
  );
}
