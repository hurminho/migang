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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const { id } = await params;

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
      .neq("id", id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "이미 사용 중인 slug입니다." }, { status: 400 });
    }

    const { error } = await supabase
      .from("projects")
      .update({
        ...parsed.data,
        category_id: parsed.data.category_id || null,
        cover_image_path: parsed.data.cover_image_path || null,
        og_image_path: parsed.data.og_image_path || null,
        project_year: parsed.data.project_year || null,
        start_date: parsed.data.start_date || null,
        end_date: parsed.data.end_date || null,
        published_at: parsed.data.published_at || null,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("project_images").delete().eq("project_id", id);

    if (gallery?.length) {
      await supabase.from("project_images").insert(
        (gallery as GalleryPayload[]).map((img, i) => ({
          project_id: id,
          storage_path: img.storage_path,
          alt_text: img.alt_text || null,
          caption: img.caption || null,
          image_type: img.image_type,
          sort_order: i,
        })),
      );
    }

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ deleted_at: new Date().toISOString(), status: "archived" })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const supabase = await createClient();

  const { data: original } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .eq("id", id)
    .single();

  if (!original) {
    return NextResponse.json({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }

  const newSlug = `${original.slug}-copy-${Date.now()}`;

  const { data: copy, error } = await supabase
    .from("projects")
    .insert({
      title: `${original.title} (복사)`,
      slug: newSlug,
      summary: original.summary,
      description: original.description,
      category_id: original.category_id,
      cover_image_path: original.cover_image_path,
      location: original.location,
      client_name: original.client_name,
      project_year: original.project_year,
      start_date: original.start_date,
      end_date: original.end_date,
      duration_text: original.duration_text,
      work_scope: original.work_scope,
      status: "draft",
      is_featured: false,
      sort_order: original.sort_order,
      seo_title: original.seo_title,
      seo_description: original.seo_description,
      og_image_path: original.og_image_path,
    })
    .select("id")
    .single();

  if (error || !copy) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }

  if (original.project_images?.length) {
    await supabase.from("project_images").insert(
      original.project_images.map(
        (img: { storage_path: string; alt_text: string | null; caption: string | null; image_type: string; sort_order: number }) => ({
          project_id: copy.id,
          storage_path: img.storage_path,
          alt_text: img.alt_text,
          caption: img.caption,
          image_type: img.image_type,
          sort_order: img.sort_order,
        }),
      ),
    );
  }

  return NextResponse.json({ id: copy.id });
}
