import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

interface CtaBannerProps {
  phone: string;
}

export function CtaBanner({ phone }: CtaBannerProps) {
  return (
    <section className="bg-ink text-white">
      <Reveal className="container-site flex flex-col gap-10 py-20 md:flex-row md:items-end md:justify-between md:py-28">
        <div>
          <p className="eyebrow text-white/50">Start a project</p>
          <h2 className="mt-5 text-3xl leading-tight md:text-5xl">
            공간에 대한 고민,
            <br />
            함께 이야기해 보세요.
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-medium text-ink transition-colors hover:bg-white/85"
          >
            상담 신청하기
            <ArrowUpRight size={18} aria-hidden />
          </Link>
          <a
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 text-sm font-medium transition-colors hover:border-white"
          >
            {phone}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
