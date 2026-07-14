import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { Category, ProjectWithRelations, ProjectImage } from "@/types/database";

const SAMPLE_PROJECTS: ProjectWithRelations[] = [
  {
    id: "1",
    title: "강남 아파트 리모델링",
    slug: "gangnam-apartment-remodeling",
    summary: "20평 아파트 전체 리모델링",
    description: "노후된 20평 아파트를 거실 확장과 주방 개방형 구조로 리모델링했습니다.",
    category_id: "1",
    cover_image_path: "/placeholders/project-1.svg",
    location: "서울 강남구",
    client_name: null,
    project_year: 2025,
    start_date: null,
    end_date: null,
    duration_text: "6주",
    work_scope: "전체 리모델링",
    status: "published",
    is_featured: true,
    sort_order: 1,
    seo_title: null,
    seo_description: null,
    og_image_path: null,
    published_at: new Date().toISOString(),
    deleted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "1", name: "Project", slug: "project", description: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  },
  {
    id: "2",
    title: "성수동 카페 인테리어",
    slug: "seongsu-cafe-interior",
    summary: "30평 카페 공간 인테리어",
    description: "성수동 로컬 카페의 브랜드 아이덴티티를 반영한 인테리어 시공.",
    category_id: "2",
    cover_image_path: "/placeholders/project-2.svg",
    location: "서울 성동구",
    client_name: null,
    project_year: 2025,
    start_date: null,
    end_date: null,
    duration_text: "4주",
    work_scope: "인테리어",
    status: "published",
    is_featured: true,
    sort_order: 2,
    seo_title: null,
    seo_description: null,
    og_image_path: null,
    published_at: new Date().toISOString(),
    deleted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "2", name: "Interior", slug: "interior", description: null, sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  },
];

const SAMPLE_CATEGORIES: Category[] = [
  { id: "1", name: "Project", slug: "project", description: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Interior", slug: "interior", description: null, sort_order: 2, is_active: true, created_at: "", updated_at: "" },
];

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return SAMPLE_CATEGORIES;

  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return data ?? SAMPLE_CATEGORIES;
}

export async function getFeaturedProjects(limit = 6): Promise<ProjectWithRelations[]> {
  if (!isSupabaseConfigured()) {
    return SAMPLE_PROJECTS.slice(0, limit);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .eq("is_featured", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function getProjects(options: {
  categorySlug?: string;
  page?: number;
  limit?: number;
  admin?: boolean;
  status?: string;
  search?: string;
} = {}): Promise<{ projects: ProjectWithRelations[]; total: number }> {
  const { categorySlug, page = 1, limit = 12, admin = false, status, search } = options;

  if (!isSupabaseConfigured()) {
    let projects = [...SAMPLE_PROJECTS];
    if (categorySlug) {
      projects = projects.filter((p) => p.category?.slug === categorySlug);
    }
    const total = projects.length;
    const start = (page - 1) * limit;
    return { projects: projects.slice(start, start + limit), total };
  }

  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select("*, category:categories(*)", { count: "exact" });

  if (!admin) {
    query = query.eq("status", "published").is("deleted_at", null);
  } else {
    query = query.is("deleted_at", null);
    if (status) query = query.eq("status", status);
  }

  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    if (category) query = query.eq("category_id", category.id);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`);
  }

  const from = (page - 1) * limit;
  const { data, count } = await query
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(from, from + limit - 1);

  return { projects: data ?? [], total: count ?? 0 };
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithRelations | null> {
  if (!isSupabaseConfigured()) {
    return SAMPLE_PROJECTS.find((p) => p.slug === slug) ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, category:categories(*), project_images(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single();

  if (data?.project_images) {
    data.project_images.sort((a: ProjectImage, b: ProjectImage) => a.sort_order - b.sort_order);
  }

  return data;
}

export async function getProjectById(id: string): Promise<ProjectWithRelations | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, category:categories(*), project_images(*)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (data?.project_images) {
    data.project_images.sort((a: ProjectImage, b: ProjectImage) => a.sort_order - b.sort_order);
  }

  return data;
}

export async function getAdjacentProjects(
  current: ProjectWithRelations,
): Promise<{ prev: ProjectWithRelations | null; next: ProjectWithRelations | null }> {
  const supabase = await createClient();

  const { data: all } = await supabase
    .from("projects")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (!all?.length) return { prev: null, next: null };

  const index = all.findIndex((p) => p.id === current.id);
  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}

export async function getAllProjectSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return SAMPLE_PROJECTS.map((p) => p.slug);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("slug")
    .eq("status", "published")
    .is("deleted_at", null);

  return data?.map((p) => p.slug) ?? [];
}
