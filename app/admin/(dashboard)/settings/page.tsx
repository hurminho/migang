import { SITE_SETTINGS } from "@/types/site-settings";

export const metadata = { title: "사이트 설정" };

export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-2xl font-semibold">사이트 설정</h1>
      <p className="mb-8 text-sm leading-relaxed text-muted">
        사이트 문구·연락처·SEO 설정은 Supabase가 아니라{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
          types/site-settings.ts
        </code>
        파일에서 관리합니다. 수정 후 커밋하고 배포하면 반영됩니다.
      </p>

      <dl className="space-y-4 border-t border-border pt-6 text-sm">
        <div>
          <dt className="text-xs text-muted">업체명</dt>
          <dd className="mt-1">{SITE_SETTINGS.companyName}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">영문명</dt>
          <dd className="mt-1">{SITE_SETTINGS.companyNameEn}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">전화</dt>
          <dd className="mt-1">{SITE_SETTINGS.phone}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">이메일</dt>
          <dd className="mt-1">{SITE_SETTINGS.email}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Hero</dt>
          <dd className="mt-1 whitespace-pre-line">{SITE_SETTINGS.heroTitle}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Site title</dt>
          <dd className="mt-1">{SITE_SETTINGS.siteTitle}</dd>
        </div>
      </dl>
    </div>
  );
}
