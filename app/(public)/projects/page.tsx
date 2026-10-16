import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { PageHeader } from "@/components/layout/page-header";
import { CtaBanner } from "@/components/layout/cta-banner";
import { Reveal } from "@/components/ui/reveal";
import { getProjects } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/site-settings";

interface ProjectsPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export const metadata = {
  title: "Projects",
  description: "미강 인테리어 공사사례",
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));
  const limit = 16;

  const [{ projects, total }, settings] = await Promise.all([
    getProjects({ categorySlug: params.category, page, limit }),
    getSiteSettings(),
  ]);

  const totalPages = Math.ceil(total / limit);
  const pageHref = (target: number) =>
    `/projects?${new URLSearchParams({
      ...(params.category ? { category: params.category } : {}),
      page: String(target),
    }).toString()}`;

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="시공 사례"
        description="건축부터 인테리어, 계단과 난간 제작까지 미강이 직접 완성한 공간들입니다."
        aside={
          total > 0 ? (
            <p className="shrink-0 text-sm text-muted tabular-nums">
              {String(total).padStart(2, "0")} Projects
            </p>
          ) : null
        }
      />

      <section className="container-site pb-24 md:pb-32">
        {projects.length === 0 ? (
          <p className="border-t border-border py-20 text-sm text-muted">
            등록된 공사사례가 없습니다.
          </p>
        ) : (
          <div className="grid gap-x-6 gap-y-14 border-t border-border pt-12 md:grid-cols-2 md:gap-y-20 xl:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={(i % 3) * 100}>
                <ProjectCard
                  project={project}
                  preload={i < 2}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </Reveal>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-20 flex items-center justify-center gap-6 text-sm">
            {page > 1 ? (
              <Link
                href={pageHref(page - 1)}
                aria-label="이전 페이지"
                className="flex size-11 items-center justify-center rounded-full border border-border transition-colors hover:border-foreground"
              >
                <ArrowLeft size={18} />
              </Link>
            ) : (
              <span className="size-11" />
            )}
            <span className="tabular-nums text-muted">
              <span className="text-foreground">{page}</span> / {totalPages}
            </span>
            {page < totalPages ? (
              <Link
                href={pageHref(page + 1)}
                aria-label="다음 페이지"
                className="flex size-11 items-center justify-center rounded-full border border-border transition-colors hover:border-foreground"
              >
                <ArrowRight size={18} />
              </Link>
            ) : (
              <span className="size-11" />
            )}
          </nav>
        )}
      </section>

      <CtaBanner phone={settings.phone} />
    </>
  );
}
