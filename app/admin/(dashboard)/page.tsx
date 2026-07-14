import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/index";

export const metadata = { title: "관리자 대시보드" };

export default async function AdminDashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h1 className="text-xl font-semibold">Supabase 설정 필요</h1>
        <p className="mt-2 text-sm text-muted">
          .env.local 파일에 Supabase 환경변수를 설정해 주세요.
        </p>
      </div>
    );
  }

  const supabase = await createClient();

  const [
    { count: totalProjects },
    { count: publishedProjects },
    { count: draftProjects },
    { count: newInquiries },
    { data: recentProjects },
    { data: recentInquiries },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "published").is("deleted_at", null),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "draft").is("deleted_at", null),
    supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new").is("deleted_at", null),
    supabase.from("projects").select("id, title, status, created_at").is("deleted_at", null).order("created_at", { ascending: false }).limit(5),
    supabase.from("inquiries").select("id, name, phone, status, created_at, is_read").is("deleted_at", null).order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "전체 프로젝트", value: totalProjects ?? 0 },
    { label: "공개 프로젝트", value: publishedProjects ?? 0 },
    { label: "임시저장", value: draftProjects ?? 0 },
    { label: "새 문의", value: newInquiries ?? 0 },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold">대시보드</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">최근 프로젝트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentProjects?.map((p) => (
              <Link
                key={p.id}
                href={`/admin/projects/${p.id}/edit`}
                className="flex items-center justify-between text-sm hover:underline"
              >
                <span>{p.title}</span>
                <Badge variant="outline">{p.status}</Badge>
              </Link>
            )) ?? <p className="text-sm text-muted">없음</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">최근 문의</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentInquiries?.map((inq) => (
              <Link
                key={inq.id}
                href={`/admin/inquiries?id=${inq.id}`}
                className="flex items-center justify-between text-sm hover:underline"
              >
                <span>
                  {inq.name} {!inq.is_read && "•"}
                </span>
                <span className="text-muted">{formatDate(inq.created_at)}</span>
              </Link>
            )) ?? <p className="text-sm text-muted">없음</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
