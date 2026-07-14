import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils/index";
import { getPublicStorageUrl } from "@/lib/utils/storage";

interface AdminProjectsPageProps {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}

export const metadata = { title: "프로젝트 관리" };

export default async function AdminProjectsPage({
  searchParams,
}: AdminProjectsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));
  const limit = 20;

  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select("*, category:categories(name)", { count: "exact" })
    .is("deleted_at", null);

  if (params.status) query = query.eq("status", params.status);
  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,slug.ilike.%${params.search}%`);
  }

  const from = (page - 1) * limit;
  const { data: projects, count } = await query
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">프로젝트</h1>
        <Button asChild>
          <Link href="/admin/projects/new">새 프로젝트</Link>
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        {["", "draft", "published", "archived"].map((s) => (
          <Link
            key={s || "all"}
            href={`/admin/projects${s ? `?status=${s}` : ""}`}
            className={`text-sm ${params.status === s || (!params.status && !s) ? "font-semibold" : "text-muted"}`}
          >
            {s || "전체"}
          </Link>
        ))}
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">썸네일</TableHead>
              <TableHead>프로젝트명</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>대표</TableHead>
              <TableHead>등록일</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.map((project) => {
              const thumb = project.cover_image_path?.startsWith("/")
                ? project.cover_image_path
                : getPublicStorageUrl("project-images", project.cover_image_path);
              return (
                <TableRow key={project.id}>
                  <TableCell>
                    <div
                      className="size-10 bg-muted bg-cover bg-center"
                      style={{ backgroundImage: `url(${thumb})` }}
                    />
                  </TableCell>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.category?.name ?? "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{project.status}</Badge>
                  </TableCell>
                  <TableCell>{project.is_featured ? "✓" : ""}</TableCell>
                  <TableCell className="text-muted">
                    {formatDate(project.created_at)}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/projects/${project.id}/edit`}>수정</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {count !== null && count > limit && (
        <p className="mt-4 text-sm text-muted">
          총 {count}개 · 페이지 {page}
        </p>
      )}
    </div>
  );
}
