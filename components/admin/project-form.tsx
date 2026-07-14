"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  projectFormSchema,
  type ProjectFormValues,
} from "@/lib/validation/schemas";
import { slugify } from "@/lib/utils/index";
import type { Category, ProjectImage, ProjectWithRelations } from "@/types/database";

interface GalleryItem {
  id: string;
  storage_path: string;
  alt_text: string;
  caption: string;
  image_type: "gallery" | "before" | "after";
  sort_order: number;
  isNew?: boolean;
}

interface ProjectFormProps {
  project?: ProjectWithRelations;
  categories: Category[];
}

function SortableImage({
  item,
  onUpdate,
  onRemove,
}: {
  item: GalleryItem;
  onUpdate: (id: string, data: Partial<GalleryItem>) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const src = item.storage_path.startsWith("/")
    ? item.storage_path
    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-images/${item.storage_path}`;

  return (
    <div ref={setNodeRef} style={style} className="flex gap-3 rounded border bg-white p-3">
      <button type="button" {...attributes} {...listeners} className="mt-2 cursor-grab">
        <GripVertical className="size-4 text-muted" />
      </button>
      <div className="relative size-20 shrink-0 overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={item.alt_text} className="size-full object-cover" />
      </div>
      <div className="grid flex-1 gap-2 sm:grid-cols-3">
        <Input
          placeholder="Alt text"
          value={item.alt_text}
          onChange={(e) => onUpdate(item.id, { alt_text: e.target.value })}
        />
        <Input
          placeholder="캡션"
          value={item.caption}
          onChange={(e) => onUpdate(item.id, { caption: e.target.value })}
        />
        <Select
          value={item.image_type}
          onValueChange={(v) =>
            onUpdate(item.id, { image_type: v as GalleryItem["image_type"] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gallery">갤러리</SelectItem>
            <SelectItem value="before">Before</SelectItem>
            <SelectItem value="after">After</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(item.id)}>
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

export function ProjectForm({ project, categories }: ProjectFormProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>(
    (project?.project_images ?? [])
      .filter((img) => img.image_type !== "cover")
      .map((img: ProjectImage) => ({
        id: img.id,
        storage_path: img.storage_path,
        alt_text: img.alt_text ?? "",
        caption: img.caption ?? "",
        image_type: img.image_type as GalleryItem["image_type"],
        sort_order: img.sort_order,
      })),
  );

  const form = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      summary: project?.summary ?? "",
      description: project?.description ?? "",
      category_id: project?.category_id ?? "",
      cover_image_path: project?.cover_image_path ?? "",
      location: project?.location ?? "",
      client_name: project?.client_name ?? "",
      project_year: project?.project_year ?? undefined,
      start_date: project?.start_date ?? "",
      end_date: project?.end_date ?? "",
      duration_text: project?.duration_text ?? "",
      work_scope: project?.work_scope ?? "",
      status: project?.status ?? "draft",
      is_featured: project?.is_featured ?? false,
      sort_order: project?.sort_order ?? 0,
      seo_title: project?.seo_title ?? "",
      seo_description: project?.seo_description ?? "",
      og_image_path: project?.og_image_path ?? "",
      published_at: project?.published_at ?? "",
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const uploadFile = async (file: File, bucket = "project-images") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "업로드 실패");
    return data.path as string;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = await uploadFile(file);
      form.setValue("cover_image_path", path);
      toast.success("대표 이미지가 업로드되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const newItems: GalleryItem[] = [];
      for (const file of files) {
        const path = await uploadFile(file);
        newItems.push({
          id: crypto.randomUUID(),
          storage_path: path,
          alt_text: "",
          caption: "",
          image_type: "gallery",
          sort_order: gallery.length + newItems.length,
          isNew: true,
        });
      }
      setGallery((prev) => [...prev, ...newItems]);
      toast.success(`${files.length}개 이미지 업로드됨`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setGallery((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex).map((item, i) => ({
        ...item,
        sort_order: i,
      }));
    });
  };

  const onSubmit = async (values: ProjectFormValues, publish = false) => {
    const payload = {
      ...values,
      status: publish ? "published" : values.status,
      published_at:
        publish && !values.published_at
          ? new Date().toISOString()
          : values.published_at || null,
      gallery,
    };

    const url = project
      ? `/api/admin/projects/${project.id}`
      : "/api/admin/projects";
    const method = project ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "저장 실패");
      return;
    }

    toast.success("저장되었습니다.");
    router.push(`/admin/projects/${data.id}/edit`);
    router.refresh();
  };

  const generateSlug = () => {
    const title = form.getValues("title");
    if (title) form.setValue("slug", slugify(title));
  };

  const coverPath = form.watch("cover_image_path");
  const coverSrc = coverPath?.startsWith("/")
    ? coverPath
    : coverPath
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-images/${coverPath}`
      : null;

  return (
    <form className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label>프로젝트명 *</Label>
          <Input {...form.register("title")} onBlur={generateSlug} />
        </div>
        <div className="space-y-2">
          <Label>Slug *</Label>
          <Input {...form.register("slug")} />
        </div>
        <div className="space-y-2">
          <Label>카테고리</Label>
          <Select
            value={form.watch("category_id") || undefined}
            onValueChange={(v) => form.setValue("category_id", v ?? undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>위치</Label>
          <Input {...form.register("location")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>한 줄 설명</Label>
        <Input {...form.register("summary")} />
      </div>

      <div className="space-y-2">
        <Label>상세 설명 (Markdown)</Label>
        <Textarea rows={8} {...form.register("description")} />
      </div>

      <div className="space-y-4">
        <Label>대표 이미지</Label>
        {coverSrc && (
          <div className="relative h-40 w-64 overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverSrc} alt="Cover" className="size-full object-cover" />
          </div>
        )}
        <Input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploading} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>갤러리 이미지</Label>
          <label className="cursor-pointer">
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={uploading} />
            <Button type="button" variant="outline" size="sm" asChild>
              <span><Upload className="mr-2 size-4" />업로드</span>
            </Button>
          </label>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={gallery.map((g) => g.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {gallery.map((item) => (
                <SortableImage
                  key={item.id}
                  item={item}
                  onUpdate={(id, data) =>
                    setGallery((prev) =>
                      prev.map((g) => (g.id === id ? { ...g, ...data } : g)),
                    )
                  }
                  onRemove={(id) => setGallery((prev) => prev.filter((g) => g.id !== id))}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2">
          <Label>공사 연도</Label>
          <Input type="number" {...form.register("project_year")} />
        </div>
        <div className="space-y-2">
          <Label>시작일</Label>
          <Input type="date" {...form.register("start_date")} />
        </div>
        <div className="space-y-2">
          <Label>종료일</Label>
          <Input type="date" {...form.register("end_date")} />
        </div>
        <div className="space-y-2">
          <Label>공사 기간 텍스트</Label>
          <Input {...form.register("duration_text")} />
        </div>
        <div className="space-y-2">
          <Label>공사 범위</Label>
          <Input {...form.register("work_scope")} />
        </div>
        <div className="space-y-2">
          <Label>고객명/건물명</Label>
          <Input {...form.register("client_name")} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label>SEO 제목</Label>
          <Input {...form.register("seo_title")} />
        </div>
        <div className="space-y-2">
          <Label>SEO 설명</Label>
          <Input {...form.register("seo_description")} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            checked={form.watch("is_featured")}
            onCheckedChange={(v) => form.setValue("is_featured", v)}
          />
          <Label>대표 프로젝트</Label>
        </div>
        <div className="space-y-2">
          <Label>정렬 순서</Label>
          <Input type="number" className="w-24" {...form.register("sort_order")} />
        </div>
        <div className="space-y-2">
          <Label>상태</Label>
          <Select
            value={form.watch("status")}
            onValueChange={(v) => form.setValue("status", v as ProjectFormValues["status"])}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">임시저장</SelectItem>
              <SelectItem value="published">공개</SelectItem>
              <SelectItem value="archived">보관</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t pt-6">
        <Button
          type="button"
          onClick={form.handleSubmit((v) => onSubmit(v, false))}
          disabled={form.formState.isSubmitting || uploading}
        >
          저장
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={form.handleSubmit((v) => onSubmit(v, true))}
          disabled={form.formState.isSubmitting || uploading}
        >
          공개
        </Button>
        {project && (
          <>
            <Button type="button" variant="outline" asChild>
              <a href={`/projects/${project.slug}`} target="_blank" rel="noopener noreferrer">
                미리보기
              </a>
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={async () => {
                if (!confirm("정말 삭제하시겠습니까?")) return;
                const res = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
                if (res.ok) {
                  toast.success("삭제되었습니다.");
                  router.push("/admin/projects");
                }
              }}
            >
              삭제
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
