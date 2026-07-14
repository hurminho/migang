export interface SiteSettings {
  companyName: string;
  companyNameEn: string;
  representative: string;
  businessNumber: string;
  phone: string;
  email: string;
  address: string;
  kakaoUrl: string;
  instagramUrl: string;
  naverBlogUrl: string;
  serviceAreas: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutText: string;
  strengths: string[];
  services: string[];
  processSteps: string[];
  siteTitle: string;
  siteDescription: string;
  ogImage: string;
  gaId: string;
  clarityId: string;
  naverVerification: string;
  googleVerification: string;
  footerCopyright: string;
  footerBusinessInfo: string;
  privacyPolicy: string;
  aboutContent: {
    greeting: string;
    services: string;
    experience: string;
    areas: string;
    licenses: string;
    principles: string;
  };
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: "미강건축",
  companyNameEn: "MIGANG ARCHITECTS",
  representative: "최윤환",
  businessNumber: "219-03-78423",
  phone: "010-6786-1204",
  email: "qkstmwja@naver.com",
  address: "대구광역시 달성군 옥포읍 본리로 20길 18-3, 1동",
  kakaoUrl: "https://pf.kakao.com/_example",
  instagramUrl: "",
  naverBlogUrl: "https://m.blog.naver.com/PostList.naver?blogId=jwcbsmg&tab=1",
  serviceAreas: "서울, 경기, 대구",
  heroTitle:
    "We identify spatial issues accurately\nand deliver results built to last.",
  heroSubtitle: "Architecture · Interior · Remodeling",
  heroImage: "/heroimage-1.jpeg",
  aboutText:
    "Migang Architects specializes in design and construction for residential and commercial spaces.",
  strengths: [
    "Accurate estimates and schedule management based on site conditions",
    "Consistent quality control from material selection to finishing",
    "Construction with full responsibility through after-service completion",
  ],
  services: ["건축", "인테리어", "리모델링", "방수공사", "상업공간", "주거공간"],
  processSteps: [
    "Site Visit",
    "Estimate",
    "Contract",
    "Construction",
    "Final Inspection",
  ],
  siteTitle: "미강건축 | 건축·인테리어·리모델링",
  siteDescription: "미강건축은 건축, 인테리어, 리모델링 전문 업체입니다.",
  ogImage: "/placeholders/og.svg",
  gaId: "",
  clarityId: "",
  naverVerification: "",
  googleVerification: "",
  footerCopyright: "© 2026 미강건축. All rights reserved.",
  footerBusinessInfo:
    "미강건축 | 대표 최윤환 | 사업자등록번호 219-03-78423",
  privacyPolicy: "",
  aboutContent: {
    greeting: "안녕하세요, 미강건축 대표 최윤환입니다.",
    services: "주거 및 상업공간의 설계·시공",
    experience: "50년 경력",
    areas: "서울, 경기, 대구",
    licenses: "건축사사무소 등록",
    principles: "정확한 현장 파악, 투명한 견적",
  },
};

export const SITE_SETTING_KEYS = {
  companyName: "company_name",
  companyNameEn: "company_name_en",
  representative: "representative",
  businessNumber: "business_number",
  phone: "phone",
  email: "email",
  address: "address",
  kakaoUrl: "kakao_url",
  instagramUrl: "instagram_url",
  naverBlogUrl: "naver_blog_url",
  serviceAreas: "service_areas",
  heroTitle: "hero_title",
  heroSubtitle: "hero_subtitle",
  heroImage: "hero_image",
  aboutText: "about_text",
  strengths: "strengths",
  services: "services",
  processSteps: "process_steps",
  siteTitle: "site_title",
  siteDescription: "site_description",
  ogImage: "og_image",
  gaId: "ga_id",
  clarityId: "clarity_id",
  naverVerification: "naver_verification",
  googleVerification: "google_verification",
  footerCopyright: "footer_copyright",
  footerBusinessInfo: "footer_business_info",
  privacyPolicy: "privacy_policy",
  aboutContent: "about_content",
} as const;
