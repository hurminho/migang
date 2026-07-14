import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/auth/admin-api";

export async function GET() {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const supabase = await createClient();
  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("name, phone, email, message, status, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const header = "name,phone,email,message,status,created_at\n";
  const rows =
    inquiries
      ?.map(
        (i) =>
          `"${i.name}","${i.phone}","${i.email ?? ""}","${(i.message ?? "").replace(/"/g, '""')}","${i.status}","${i.created_at}"`,
      )
      .join("\n") ?? "";

  return new NextResponse(header + rows, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="inquiries.csv"',
    },
  });
}
