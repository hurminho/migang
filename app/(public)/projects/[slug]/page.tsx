import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { CtaBanner } from "@/components/layout/cta-banner";
import { Reveal } from "@/components/ui/reveal";
import {
  getAdjacentProjects,
  getProjectBySlug,
} from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/site-settings";
import { getPublicStorageUrl } from "@/lib/utils/storage";
import { absoluteUrl } from "@/lib/utils/index";
import type { ProjectWithRelations } from "@/types/database";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const settings = await getSiteSettings();

  if (!project) {
    return { title: "프로젝트를 찾을 수 없습니다" };
  }

  const title = project.seo_title || project.title;
  const description =
    project.seo_description || project.summary || settings.siteDescription;
  const ogImage = getPublicStorageUrl(
    "project-images",
    project.og_image_path || project.cover_image_path,
  );

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/projects/${slug}`) },
    openGraph: {
      title,
      description: description ?? undefined,
      images: [{ url: ogImage }],
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getProjectBySlug(slug),
    getSiteSettings(),
  ]);

  if (!project) notFound();

  const { prev, next } = await getAdjacentProjects(project);

  const coverSrc = getPublicStorageUrl("project-images", project.cover_image_path);

  const galleryImages = (project.project_images ?? [])
    .filter((img) => img.image_type === "gallery" || img.image_type === "before" || img.image_type === "after")
    .map((img) => ({
      src: getPublicStorageUrl("project-images", img.storage_path),
      alt: img.alt_text ?? project.title,
      caption: img.caption ?? undefined,
    }));

  const facts = [
    { label: "Location", value: project.location },
    { label: "Year", value: project.project_year },
    { label: "Duration", value: project.duration_text },
    { label: "Scope", value: project.work_scope },
  ].filter((fact) => fact.value);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    image: coverSrc,
    datePublished: project.published_at,
    locationCreated: project.location,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="container-site pt-28 pb-10 md:pt-36 md:pb-14">
          <Reveal>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
                aria-hidden
              />
              All projects
            </Link>
            {project.category?.name && <p className="eyebrow mt-10">{project.category.name}</p>}
            <h1 className="mt-4 max-w-4xl text-4xl leading-[1.15] md:text-6xl">{project.title}</h1>
            {project.summary && (
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{project.summary}</p>
            )}
          </Reveal>
        </header>

        <Reveal className="container-site">
          <div className="relative aspect-[4/3] overflow-hidden bg-surface md:aspect-[21/9]">
            <Image
              src={coverSrc}
              alt={project.title}
              fill
              preload
              className="object-cover"
              sizes="(max-width: 1440px) 100vw, 1440px"
            />
          </div>
        </Reveal>

        <section className="container-site grid gap-12 py-16 md:grid-cols-12 md:py-24">
          {facts.length > 0 && (
            <Reveal className="md:col-span-4">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-1">
                {facts.map((fact) => (
                  <div key={fact.label} className="border-t border-border pt-4">
                    <dt className="eyebrow">{fact.label}</dt>
                    <dd className="mt-2 text-base">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
          {project.description && (
            <Reveal className="md:col-span-7 md:col-start-6" delay={100}>
              <div className="prose-content">
                <MarkdownContent content={project.description} />
              </div>
            </Reveal>
          )}
        </section>

        {galleryImages.length > 0 && (
          <section className="container-site pb-24 md:pb-32">
            <ProjectGallery images={galleryImages} />
          </section>
        )}

        {(prev || next) && (
          <nav className="container-site grid gap-6 border-t border-border py-16 md:grid-cols-2 md:py-20">
            {prev ? <AdjacentLink project={prev} direction="prev" /> : <span className="hidden md:block" />}
            {next ? <AdjacentLink project={next} direction="next" /> : null}
          </nav>
        )}
      </article>

      <CtaBanner phone={settings.phone} />
    </>
  );
}

function AdjacentLink({
  project,
  direction,
}: {
  project: ProjectWithRelations;
  direction: "prev" | "next";
}) {
  const isNext = direction === "next";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group flex items-center gap-5 ${isNext ? "md:flex-row-reverse md:text-right" : ""}`}
    >
      <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden bg-surface md:w-40">
        <Image
          src={getPublicStorageUrl("project-images", project.cover_image_path)}
          alt={project.title}
          fill
          sizes="160px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0">
        <p className="eyebrow inline-flex items-center gap-2">
          {!isNext && <ArrowLeft size={14} aria-hidden />}
          {isNext ? "Next project" : "Previous project"}
          {isNext && <ArrowRight size={14} aria-hidden />}
        </p>
        <p className="mt-2 text-lg font-semibold leading-snug md:text-xl">{project.title}</p>
      </div>
    </Link>
  );
}
