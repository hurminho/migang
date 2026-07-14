import Link from "next/link";
import Image from "next/image";
import { getPublicStorageUrl } from "@/lib/utils/storage";
import type { ProjectWithRelations } from "@/types/database";

interface ProjectCardProps {
  project: ProjectWithRelations;
  priority?: boolean;
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const imageSrc = project.cover_image_path?.startsWith("/")
    ? project.cover_image_path
    : getPublicStorageUrl("project-images", project.cover_image_path);

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
        <Image
          src={imageSrc}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-opacity duration-200 group-hover:opacity-85"
          priority={priority}
        />
      </div>
      <p className="mt-1.5 text-xs text-foreground">{project.title}</p>
    </Link>
  );
}
