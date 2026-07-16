import Link from "next/link";
import { ProjectCard } from "@/components/projects/project-card";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/site-settings";

export default async function HomePage() {
  const [settings, featuredProjects] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(8),
  ]);

  return (
    <div className="page-main">
      {/* Hero — text only */}
      <section className="max-w-lg">
        <p className="text-xs tracking-[0.08em] text-muted uppercase">
          {settings.heroSubtitle}
        </p>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">
          {settings.heroTitle}
        </p>
      </section>

      {/* Intro */}
      <section className="mt-12 max-w-lg">
        <p className="whitespace-pre-line text-sm leading-relaxed text-muted">
          {settings.aboutText}
        </p>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="mt-12">
          <div className="project-grid">
            {featuredProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} priority={i < 4} />
            ))}
          </div>
          <div className="mt-8">
            <Link href="/projects" className="text-link">
              View all projects
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
