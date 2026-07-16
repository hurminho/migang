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
}

/**
 * Site content settings — edit this file and redeploy.
 * Public site reads from here, not Supabase site_settings.
 */
export const SITE_SETTINGS: SiteSettings = {
  companyName: "미강 인테리어",
  companyNameEn: "MIGANG INTERIOR",
  representative: "Choi, Yun-hwan",
  businessNumber: "219-03-78423",
  phone: "+82 10-9511-3221",
  email: "migang0482@gmail.com",
  address: "대구광역시 달성군 옥포읍 본리로 20길 18-3, 1동",
  kakaoUrl: "https://pf.kakao.com/_example",
  instagramUrl: "",
  naverBlogUrl: "https://m.blog.naver.com/PostList.naver?blogId=jwcbsmg&tab=1",
  serviceAreas: "서울, 경기, 대구",
  heroTitle: "공간의 가능성을 디자인합니다. \nDesigning the Possibilities of Space.",
  heroSubtitle: "Architecture · Interior · Remodeling",
  heroImage: "/heroimage-1.jpeg",
  aboutText:
    "건축, 인테리어, 제작까지 공간에 필요한 모든 과정을 직접 완성합니다.\nFrom Architecture to Interior, from Production to Completion.",
  strengths: [
    "공간의 이야기를 먼저 듣습니다.",
    "재료 선택부터 작은 마감까지 놓치지 않습니다.",
    "시간이 지나도 편안하고 단단한 공간을 만듭니다.",
    "\nWe listen to the story of each space first.",
    "Every material and finishing details is carefully considered.",
    "Thoughtfully designed, Built to last.",
  ],
  services: [
    "건축 · 인테리어 · 리모델링 · 상업공간 · 주거공간",
    "Construction · Interior · Remodeling · Commercial Space · Residential Space",
  ],
  processSteps: [
    "Consultation",
    "Site Visit",
    "Design and Estimate",
    "Contract",
    "Construction",
    "Final Inspection",
  ],
  siteTitle: "미강 인테리어 MIGANG INTERIOR | 건축·인테리어·리모델링",
  siteDescription: "미강 인테리어는 건축, 인테리어, 리모델링 전문 업체입니다.",
  ogImage: "/og.png",
  gaId: "",
  clarityId: "",
  naverVerification: "",
  googleVerification: "",
  footerCopyright: "© 2020 미강 인테리어. All rights reserved.",
  footerBusinessInfo:
    "미강 인테리어 MIGANG INTERIOR | 대표 최윤환 | 사업자등록번호 219-03-78423",
  privacyPolicy: "",
};

/** @deprecated Use SITE_SETTINGS */
export const DEFAULT_SITE_SETTINGS = SITE_SETTINGS;
