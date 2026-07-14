export type UserRole = "admin" | "user";

export type ProjectStatus = "draft" | "published" | "archived";

export type ImageType = "cover" | "gallery" | "before" | "after";

export type InquiryStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "completed"
  | "closed";

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  category_id: string | null;
  cover_image_path: string | null;
  location: string | null;
  client_name: string | null;
  project_year: number | null;
  start_date: string | null;
  end_date: string | null;
  duration_text: string | null;
  work_scope: string | null;
  status: ProjectStatus;
  is_featured: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image_path: string | null;
  published_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  storage_path: string;
  alt_text: string | null;
  caption: string | null;
  image_type: ImageType;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  category_id: string | null;
  desired_date: string | null;
  message: string;
  status: InquiryStatus;
  is_read: boolean;
  admin_memo: string | null;
  consented_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface InquiryAttachment {
  id: string;
  inquiry_id: string;
  storage_path: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: unknown;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithRelations extends Project {
  category?: Category | null;
  project_images?: ProjectImage[];
}

export interface InquiryWithRelations extends Inquiry {
  category?: Category | null;
  inquiry_attachments?: InquiryAttachment[];
}
