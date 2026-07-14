import { ContactForm } from "@/components/forms/contact-form";
import { getCategories } from "@/lib/data/projects";

export const metadata = {
  title: "Request a Estimate",
  description: "미강건축 상담 문의",
};

export default async function ContactPage() {
  const categories = await getCategories();

  return (
    <div className="page-main">
      <div className="max-w-lg">
        <p className="text-xs tracking-[0.08em] text-muted uppercase">Contact</p>
        <p className="mt-6 text-sm leading-relaxed text-muted">
          프로젝트 상담을 원하시면 아래 양식을 작성해 주세요.
        </p>
        <div className="mt-10">
          <ContactForm categories={categories} />
        </div>
      </div>
    </div>
  );
}
