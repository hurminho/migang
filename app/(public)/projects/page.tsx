import Link from "next/link";
import { ProjectCard } from "@/components/projects/project-card";
import { getProjects } from "@/lib/data/projects";

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

  const { projects, total } = await getProjects({
    categorySlug: params.category,
    page,
    limit,
  });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="page-main">
      {projects.length === 0 ? (
        <p className="py-20 text-sm text-muted">등록된 공사사례가 없습니다.</p>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex items-center gap-4 text-xs text-muted">
          {page > 1 && (
            <Link
              href={`/projects?${new URLSearchParams({
                ...(params.category ? { category: params.category } : {}),
                page: String(page - 1),
              }).toString()}`}
              className="text-link"
            >
              ← Prev
            </Link>
          )}
          <span>
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/projects?${new URLSearchParams({
                ...(params.category ? { category: params.category } : {}),
                page: String(page + 1),
              }).toString()}`}
              className="text-link"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
