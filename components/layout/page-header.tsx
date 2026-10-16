import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, aside }: PageHeaderProps) {
  return (
    <header className="container-site pt-32 pb-12 md:pt-40 md:pb-16">
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
        <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h1 className="max-w-4xl text-4xl leading-[1.15] md:text-6xl">{title}</h1>
          {aside}
        </div>
        {description && (
          <div className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{description}</div>
        )}
      </Reveal>
    </header>
  );
}
