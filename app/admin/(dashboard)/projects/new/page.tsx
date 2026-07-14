import { ProjectForm } from "@/components/admin/project-form";
import { getCategories } from "@/lib/data/projects";

export const metadata = { title: "새 프로젝트" };

export default async function NewProjectPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold">새 프로젝트</h1>
      <ProjectForm categories={categories} />
    </div>
  );
}
