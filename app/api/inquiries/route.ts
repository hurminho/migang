import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { inquiryFormSchema, ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_FILES } from "@/lib/validation/schemas";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "서버가 아직 설정되지 않았습니다. Supabase 환경변수를 확인해 주세요." },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rateCheck = checkRateLimit(`inquiry:${ip}`);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." },
      {
        status: 429,
        headers: rateCheck.retryAfter
          ? { "Retry-After": String(rateCheck.retryAfter) }
          : undefined,
      },
    );
  }

  try {
    const formData = await request.formData();

    const raw = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      address: String(formData.get("address") ?? ""),
      category_id: String(formData.get("category_id") ?? ""),
      desired_date: String(formData.get("desired_date") ?? ""),
      message: String(formData.get("message") ?? ""),
      consent: formData.get("consent") === "true",
      website: String(formData.get("website") ?? ""),
    };

    // Honeypot check
    if (raw.website) {
      return NextResponse.json({ success: true });
    }

    const parsed = inquiryFormSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `최대 ${MAX_FILES}개까지 첨부할 수 있습니다.` },
        { status: 400 },
      );
    }

    for (const file of files) {
      if (!ALLOWED_FILE_TYPES.includes(file.type as (typeof ALLOWED_FILE_TYPES)[number])) {
        return NextResponse.json(
          { error: "허용되지 않는 파일 형식입니다." },
          { status: 400 },
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "파일 크기는 10MB 이하여야 합니다." },
          { status: 400 },
        );
      }
    }

    const supabase = await createClient();

    const { data: inquiry, error: inquiryError } = await supabase
      .from("inquiries")
      .insert({
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        address: parsed.data.address || null,
        category_id: parsed.data.category_id || null,
        desired_date: parsed.data.desired_date || null,
        message: parsed.data.message,
        consented_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (inquiryError || !inquiry) {
      console.error(inquiryError);
      return NextResponse.json(
        { error: "문의 저장에 실패했습니다." },
        { status: 500 },
      );
    }

    for (const file of files) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
      const storagePath = `${inquiry.id}/${randomUUID()}.${ext}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from("inquiry-attachments")
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error(uploadError);
        continue;
      }

      await supabase.from("inquiry_attachments").insert({
        inquiry_id: inquiry.id,
        storage_path: storagePath,
        original_filename: file.name,
        mime_type: file.type,
        file_size: file.size,
      });
    }

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
