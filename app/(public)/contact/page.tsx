import { ContactForm } from "@/components/forms/contact-form";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/ui/reveal";
import { getCategories } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/site-settings";

export const metadata = {
  title: "Request a Estimate",
  description: "미강 인테리어 상담 문의",
};

export default async function ContactPage() {
  const [categories, settings] = await Promise.all([getCategories(), getSiteSettings()]);

  const contacts = [
    {
      label: "Phone",
      value: settings.phone,
      href: `tel:${settings.phone.replace(/[^\d+]/g, "")}`,
    },
    { label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { label: "Address", value: settings.address },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="프로젝트 상담"
        description="공간과 일정, 예산을 알려주시면 현장 상황에 맞춰 상담해 드립니다. 사진을 함께 첨부하시면 더 정확한 안내가 가능합니다."
      />

      <section className="container-site grid gap-14 pb-24 md:grid-cols-12 md:pb-32">
        <Reveal className="md:col-span-4">
          <dl className="space-y-8 border-t border-border pt-8">
            {contacts.map((item) => (
              <div key={item.label}>
                <dt className="eyebrow">{item.label}</dt>
                <dd className="mt-2 text-lg">
                  {item.href ? (
                    <a href={item.href} className="hover:underline">
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
            {settings.naverBlogUrl && (
              <div>
                <dt className="eyebrow">Blog</dt>
                <dd className="mt-2 text-lg">
                  <a
                    href={settings.naverBlogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    네이버 블로그
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </Reveal>

        <Reveal className="md:col-span-8" delay={100}>
          <div className="bg-surface p-6 md:p-10">
            <ContactForm categories={categories} />
          </div>
        </Reveal>
      </section>
    </>
  );
}
