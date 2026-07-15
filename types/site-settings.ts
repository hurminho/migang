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

/**
 * Site content settings — edit this file and redeploy.
 * Public site reads from here, not Supabase site_settings.
 */
export const SITE_SETTINGS: SiteSettings = {
  companyName: "미강 인테리어",
  companyNameEn: "MIGANG INTERIOR",
  representative: "최윤환",
  businessNumber: "219-03-78423",
  phone: "010-9511-3221",
  email: "migang0482@gmail.com",
  address: "대구광역시 달성군 옥포읍 본리로 20길 18-3, 1동",
  kakaoUrl: "https://pf.kakao.com/_example",
  instagramUrl: "",
  naverBlogUrl: "https://m.blog.naver.com/PostList.naver?blogId=jwcbsmg&tab=1",
  serviceAreas: "서울, 경기, 대구",
  heroTitle: "공간의 본질을 정확히 이해하고, 오래도록 가치 있는 결과를 만듭니다.",
  heroSubtitle: "Architecture · Interior · Remodeling",
  heroImage: "/heroimage-1.jpeg",
  aboutText:
    "We understand the true needs of every space and create results designed to last.",
  strengths: [
    "Accurate estimates and schedule management based on site conditions",
    "Consistent quality control from material selection to finishing",
    "Construction with full responsibility through after-service completion",
  ],
  services: ["건축", "인테리어", "리모델링", "방수공사", "상업공간", "주거공간"],
  processSteps: [
    "Consultation",
    "Site Visit",
    "Estimate",
    "Contract",
    "Construction",
    "Final Inspection",
  ],
  siteTitle: "미강 인테리어 MIGANG INTERIOR | 건축·인테리어·리모델링",
  siteDescription: "미강 인테리어는 건축, 인테리어, 리모델링 전문 업체입니다.",
  ogImage: "/placeholders/og.svg",
  gaId: "",
  clarityId: "",
  naverVerification: "",
  googleVerification: "",
  footerCopyright: "© 2020 미강 인테리어. All rights reserved.",
  footerBusinessInfo:
    "미강 인테리어 MIGANG INTERIOR | 대표 최윤환 | 사업자등록번호 219-03-78423",
  privacyPolicy: "",
  aboutContent: {
    greeting: "안녕하세요, 미강 인테리어 대표 최윤환입니다.",
    services: "주거 및 상업공간의 설계·시공",
    experience: "50년 경력",
    areas: "서울, 경기, 대구",
    licenses: "건축사사무소 등록",
    principles: "정확한 현장 파악, 투명한 견적",
  },
};

/** @deprecated Use SITE_SETTINGS */
export const DEFAULT_SITE_SETTINGS = SITE_SETTINGS;
