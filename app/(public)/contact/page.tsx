import { ContactForm } from "@/components/forms/contact-form";
import { getCategories } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/site-settings";

export const metadata = {
  title: "Contact",
  description: "미강건축 상담 문의",
};

export default async function ContactPage() {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategories(),
  ]);

  return (
    <div className="page-main">
      <div className="grid gap-16 lg:grid-cols-[240px_1fr]">
        <div>
          <p className="text-xs tracking-[0.08em] text-muted uppercase">Contact</p>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            프로젝트 상담을 원하시면 아래 양식을 작성해 주세요.
          </p>
          <dl className="mt-8 space-y-3 text-sm text-muted">
            <div>
              <dt className="text-xs">Tel</dt>
              <dd className="mt-0.5">{settings.phone}</dd>
            </div>
            <div>
              <dt className="text-xs">Email</dt>
              <dd className="mt-0.5">{settings.email}</dd>
            </div>
            <div>
              <dt className="text-xs">Address</dt>
              <dd className="mt-0.5">{settings.address}</dd>
            </div>
          </dl>
        </div>

        <ContactForm categories={categories} />
      </div>
    </div>
  );
}
