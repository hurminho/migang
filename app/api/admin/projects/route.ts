import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/auth/admin-api";
import { projectFormSchema } from "@/lib/validation/schemas";

interface GalleryPayload {
  id: string;
  storage_path: string;
  alt_text: string;
  caption: string;
  image_type: string;
  sort_order: number;
  isNew?: boolean;
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  try {
    const body = await request.json();
    const { gallery, ...formData } = body;

    const parsed = projectFormSchema.safeParse(formData);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data: existing } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", parsed.data.slug)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "이미 사용 중인 slug입니다." }, { status: 400 });
    }

    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        ...parsed.data,
        category_id: parsed.data.category_id || null,
        cover_image_path: parsed.data.cover_image_path || null,
        og_image_path: parsed.data.og_image_path || null,
        project_year: parsed.data.project_year || null,
        start_date: parsed.data.start_date || null,
        end_date: parsed.data.end_date || null,
        published_at: parsed.data.published_at || null,
      })
      .select("id")
      .single();

    if (error || !project) {
      return NextResponse.json({ error: error?.message ?? "생성 실패" }, { status: 500 });
    }

    if (gallery?.length) {
      await supabase.from("project_images").insert(
        (gallery as GalleryPayload[]).map((img, i) => ({
          project_id: project.id,
          storage_path: img.storage_path,
          alt_text: img.alt_text || null,
          caption: img.caption || null,
          image_type: img.image_type,
          sort_order: i,
        })),
      );
    }

    return NextResponse.json({ id: project.id });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
