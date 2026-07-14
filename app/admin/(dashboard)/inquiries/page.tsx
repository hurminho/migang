import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InquiryDetail } from "@/components/admin/inquiry-detail";
import { formatDate } from "@/lib/utils/index";
import type { InquiryWithRelations } from "@/types/database";

interface AdminInquiriesPageProps {
  searchParams: Promise<{ id?: string; status?: string }>;
}

export const metadata = { title: "문의 관리" };

export default async function AdminInquiriesPage({
  searchParams,
}: AdminInquiriesPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("inquiries")
    .select("*, category:categories(name)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (params.status) query = query.eq("status", params.status);

  const { data: inquiries } = await query.limit(50);

  let selected: InquiryWithRelations | null = null;
  if (params.id) {
    const { data } = await supabase
      .from("inquiries")
      .select("*, category:categories(*), inquiry_attachments(*)")
      .eq("id", params.id)
      .single();
    selected = data;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">문의</h1>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- API file download */}
        <a
          href="/api/admin/inquiries/export"
          download
          className="text-sm text-muted hover:text-foreground"
        >
          CSV 다운로드
        </a>
      </div>

      <div className="mb-4 flex gap-2">
        {["", "new", "contacted", "quoted", "completed", "closed"].map((s) => (
          <Link
            key={s || "all"}
            href={`/admin/inquiries${s ? `?status=${s}` : ""}`}
            className={`text-sm ${params.status === s || (!params.status && !s) ? "font-semibold" : "text-muted"}`}
          >
            {s || "전체"}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>접수일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries?.map((inq) => (
                <TableRow key={inq.id}>
                  <TableCell>
                    <Link
                      href={`/admin/inquiries?id=${inq.id}`}
                      className={!inq.is_read ? "font-semibold" : ""}
                    >
                      {inq.name}
                    </Link>
                  </TableCell>
                  <TableCell>{inq.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{inq.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted">
                    {formatDate(inq.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {selected && <InquiryDetail inquiry={selected} />}
      </div>
    </div>
  );
}
