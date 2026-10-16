import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getPublicStorageUrl } from "@/lib/utils/storage";
import type { ProjectWithRelations } from "@/types/database";

interface ProjectCardProps {
  project: ProjectWithRelations;
  preload?: boolean;
  sizes?: string;
}

export function ProjectCard({
  project,
  preload = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ProjectCardProps) {
  const imageSrc = getPublicStorageUrl("project-images", project.cover_image_path);
  const meta = [project.location, project.project_year].filter(Boolean).join(" · ");

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <Image
          src={imageSrc}
          alt={project.title}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
        <span className="absolute top-4 right-4 flex size-11 translate-y-2 items-center justify-center rounded-full bg-white text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={20} aria-hidden />
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg leading-snug font-semibold">{project.title}</h3>
          {meta && <p className="mt-1 text-sm text-muted">{meta}</p>}
        </div>
        {project.category?.name && (
          <span className="mt-0.5 shrink-0 rounded-full border border-border px-3 py-1 text-xs text-muted">
            {project.category.name}
          </span>
        )}
      </div>
    </Link>
  );
}
