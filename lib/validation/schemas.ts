import { z } from "zod";

const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;

export const inquiryFormSchema = z.object({
  name: z.string().min(2, "이름을 2자 이상 입력해 주세요."),
  phone: z
    .string()
    .min(10, "연락처를 입력해 주세요.")
    .refine(
      (val) => phoneRegex.test(val.replace(/\s/g, "")),
      "올바른 휴대폰 번호 형식이 아닙니다.",
    ),
  email: z
    .string()
    .email("올바른 이메일 형식이 아닙니다.")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  category_id: z.string().optional(),
  desired_date: z.string().optional(),
  message: z.string().min(10, "문의 내용을 10자 이상 입력해 주세요."),
  consent: z.literal(true, {
    error: "개인정보 수집에 동의해 주세요.",
  }),
  website: z.string().max(0).optional(),
});

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

export const projectFormSchema = z.object({
  title: z.string().min(2, "프로젝트명을 입력해 주세요."),
  slug: z
    .string()
    .min(2, "slug를 입력해 주세요.")
    .regex(/^[a-z0-9-]+$/, "slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다."),
  summary: z.string().optional(),
  description: z.string().optional(),
  category_id: z.string().optional().nullable(),
  cover_image_path: z.string().optional().nullable(),
  location: z.string().optional(),
  client_name: z.string().optional(),
  project_year: z.coerce.number().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  duration_text: z.string().optional(),
  work_scope: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  is_featured: z.boolean().default(false),
  sort_order: z.coerce.number().default(0),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  og_image_path: z.string().optional().nullable(),
  published_at: z.string().optional().nullable(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const siteSettingsFormSchema = z.object({
  companyName: z.string().min(1),
  companyNameEn: z.string().optional(),
  representative: z.string().optional(),
  businessNumber: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  kakaoUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  naverBlogUrl: z.string().optional(),
  serviceAreas: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroImage: z.string().optional(),
  aboutText: z.string().optional(),
  strengths: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  processSteps: z.array(z.string()).optional(),
  siteTitle: z.string().optional(),
  siteDescription: z.string().optional(),
  ogImage: z.string().optional(),
  gaId: z.string().optional(),
  clarityId: z.string().optional(),
  naverVerification: z.string().optional(),
  googleVerification: z.string().optional(),
  footerCopyright: z.string().optional(),
  footerBusinessInfo: z.string().optional(),
  privacyPolicy: z.string().optional(),
  aboutContent: z
    .object({
      greeting: z.string().optional(),
      services: z.string().optional(),
      experience: z.string().optional(),
      areas: z.string().optional(),
      licenses: z.string().optional(),
      principles: z.string().optional(),
    })
    .optional(),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().email("올바른 이메일을 입력해 주세요."),
  password: z.string().min(6, "비밀번호를 6자 이상 입력해 주세요."),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES = 5;
