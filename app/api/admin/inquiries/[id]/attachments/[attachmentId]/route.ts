import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/auth/admin-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; attachmentId: string }> },
) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const { id, attachmentId } = await params;
  const supabase = await createClient();

  const { data: attachment } = await supabase
    .from("inquiry_attachments")
    .select("*")
    .eq("id", attachmentId)
    .eq("inquiry_id", id)
    .single();

  if (!attachment) {
    return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
  }

  const { data, error } = await supabase.storage
    .from("inquiry-attachments")
    .createSignedUrl(attachment.storage_path, 3600);

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "URL 생성 실패" }, { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl);
}
