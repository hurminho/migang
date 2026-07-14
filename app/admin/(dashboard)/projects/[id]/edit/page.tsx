import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { getCategories, getProjectById } from "@/lib/data/projects";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);
  return { title: project ? `${project.title} 수정` : "프로젝트 수정" };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const [project, categories] = await Promise.all([
    getProjectById(id),
    getCategories(),
  ]);

  if (!project) notFound();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold">프로젝트 수정</h1>
      <ProjectForm project={project} categories={categories} />
    </div>
  );
}
