import { getSiteSettings } from "@/lib/data/site-settings";
import { MarkdownContent } from "@/components/ui/markdown-content";

export const metadata = {
  title: "개인정보처리방침",
};

const DEFAULT_PRIVACY = `
## 개인정보처리방침

미강 인테리어(이하 "회사")은 상담 문의 서비스 제공을 위해 아래와 같이 개인정보를 수집·이용합니다.

### 1. 수집하는 개인정보 항목
- 필수: 이름, 연락처, 문의 내용
- 선택: 이메일, 공사 주소, 공사 유형, 예상 공사 시기, 첨부 파일

### 2. 개인정보의 수집 및 이용 목적
- 상담 문의 접수 및 답변
- 견적 및 시공 상담

### 3. 개인정보의 보유 및 이용 기간
- 문의 처리 완료 후 1년간 보관 후 파기

### 4. 개인정보의 제3자 제공
- 원칙적으로 제3자에게 제공하지 않습니다.

### 5. 문의
- 이메일: contact@migang.co.kr
`;

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const content = settings.privacyPolicy || DEFAULT_PRIVACY;

  return (
    <div className="page-main">
      <p className="mb-8 text-xs tracking-[0.08em] text-muted uppercase">
        Privacy Policy
      </p>
      <MarkdownContent content={content} className="prose-content" />
    </div>
  );
}
