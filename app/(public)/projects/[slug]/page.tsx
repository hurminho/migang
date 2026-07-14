import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { CtaSection } from "@/components/layout/cta-section";
import {
  getAdjacentProjects,
  getProjectBySlug,
} from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/site-settings";
import { getPublicStorageUrl } from "@/lib/utils/storage";
import { absoluteUrl } from "@/lib/utils/index";

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
  const ogImage = project.og_image_path
    ? getPublicStorageUrl("project-images", project.og_image_path)
    : project.cover_image_path?.startsWith("/")
      ? project.cover_image_path
      : getPublicStorageUrl("project-images", project.cover_image_path);

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

  const coverSrc = project.cover_image_path?.startsWith("/")
    ? project.cover_image_path
    : getPublicStorageUrl("project-images", project.cover_image_path);

  const galleryImages = (project.project_images ?? [])
    .filter((img) => img.image_type === "gallery" || img.image_type === "before" || img.image_type === "after")
    .map((img) => ({
      src: img.storage_path.startsWith("/")
        ? img.storage_path
        : getPublicStorageUrl("project-images", img.storage_path),
      alt: img.alt_text ?? project.title,
      caption: img.caption ?? undefined,
    }));

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

      <article className="page-main">
        <header className="mb-8 max-w-lg">
          {project.category?.name && (
            <p className="text-xs text-muted">{project.category.name}</p>
          )}
          <h1 className="mt-2 text-base font-normal">{project.title}</h1>
          <dl className="mt-5 space-y-1.5 text-xs text-muted">
            {project.location && (
              <div className="flex gap-4">
                <dt className="w-16 shrink-0">Location</dt>
                <dd className="text-foreground">{project.location}</dd>
              </div>
            )}
            {project.project_year && (
              <div className="flex gap-4">
                <dt className="w-16 shrink-0">Year</dt>
                <dd className="text-foreground">{project.project_year}</dd>
              </div>
            )}
            {project.duration_text && (
              <div className="flex gap-4">
                <dt className="w-16 shrink-0">Duration</dt>
                <dd className="text-foreground">{project.duration_text}</dd>
              </div>
            )}
            {project.work_scope && (
              <div className="flex gap-4">
                <dt className="w-16 shrink-0">Scope</dt>
                <dd className="text-foreground">{project.work_scope}</dd>
              </div>
            )}
          </dl>
        </header>

        <div className="relative mb-10 aspect-[4/3] w-full overflow-hidden bg-[#f5f5f5]">
            <Image
              src={coverSrc}
              alt={project.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1500px) 100vw, 1500px"
            />
          </div>

          {project.description && (
            <div className="prose-content mb-10">
              <MarkdownContent content={project.description} />
            </div>
          )}

          {galleryImages.length > 0 && (
            <div className="mb-12">
              <ProjectGallery images={galleryImages} />
            </div>
          )}

          <nav className="flex flex-col gap-3 border-t border-border pt-6 text-xs sm:flex-row sm:justify-between">
            <div>
              {prev ? (
                <Link href={`/projects/${prev.slug}`} className="text-link">
                  ← {prev.title}
                </Link>
              ) : (
                <span />
              )}
            </div>
            <Link href="/projects" className="text-link">
              All projects
            </Link>
            <div className="text-right">
              {next ? (
                <Link href={`/projects/${next.slug}`} className="text-link">
                  {next.title} →
                </Link>
              ) : (
                <span />
              )}
            </div>
          </nav>

        <CtaSection phone={settings.phone} naverBlogUrl={settings.naverBlogUrl} />
      </article>
    </>
  );
}
