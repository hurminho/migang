import Link from "next/link";

interface CtaSectionProps {
  phone: string;
  naverBlogUrl: string;
}

export function CtaSection({ phone, naverBlogUrl }: CtaSectionProps) {
  return (
    <section className="mt-20 border-t border-border pt-10">
      <p className="mb-4 text-xs tracking-[0.08em] text-muted uppercase">Contact</p>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        <a href={`tel:${phone.replace(/-/g, "")}`} className="text-link">
          {phone}
        </a>
        {naverBlogUrl && (
          <a
            href={naverBlogUrl}
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
    </section>
  );
}
