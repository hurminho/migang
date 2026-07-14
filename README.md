# 미강건축 포트폴리오 웹사이트

건축·인테리어·공사업체를 위한 미니멀 포트폴리오 사이트입니다.  
Next.js App Router, Supabase, Tailwind CSS, shadcn/ui 기반으로 구현되었습니다.

## 주요 기능

### 공개 사이트
- 홈 (랜딩페이지 + CTA)
- 공사사례 목록/상세 (카테고리 필터, 페이지네이션)
- 회사 소개, 상담 문의, 개인정보처리방침
- 반응형 (데스크톱 좌측 사이드바 / 모바일 햄버거 메뉴)
- SEO (metadata, sitemap, robots, JSON-LD)
- Google Analytics / Microsoft Clarity 연동 구조

### 관리자
- Supabase Auth 이메일/비밀번호 로그인 (공개 회원가입 없음)
- 프로젝트 CRUD (이미지 업로드, 갤러리 순서, slug, SEO)
- 문의 관리 (상태 변경, 메모, 첨부파일 signed URL)
- 사이트 설정 (업체 정보, 홈 콘텐츠, SEO)

## 기술 스택

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Supabase (PostgreSQL, Auth, Storage, RLS)
- React Hook Form + Zod
- Vercel 배포 기준

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.example`을 복사하여 `.env.local`을 생성합니다.

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # 선택 (대부분 RLS + anon key로 동작)
NEXT_PUBLIC_GA_ID=G-XXXXXXXX                       # 선택
NEXT_PUBLIC_CLARITY_ID=xxxxxxxx                  # 선택
```

### 3. Supabase 프로젝트 설정

1. [Supabase Dashboard](https://supabase.com/dashboard)에서 새 프로젝트 생성
2. **SQL Editor**에서 migration 실행:
   - `supabase/migrations/20260314120000_initial_schema.sql`
3. (선택) 샘플 데이터:
   - `supabase/seed.sql`
4. **Authentication > Users**에서 관리자 계정 생성
5. SQL Editor에서 관리자 권한 부여:

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@example.com';
```

### 4. Storage 확인

Migration 실행 시 다음 bucket이 자동 생성됩니다.

| Bucket | 용도 | 공개 |
|--------|------|------|
| `project-images` | 프로젝트 이미지 | O |
| `site-assets` | 사이트 에셋 | O |
| `inquiry-attachments` | 문의 첨부파일 | X |

### 5. 개발 서버 실행

```bash
npm run dev
```

- 공개 사이트: http://localhost:3000
- 관리자 로그인: http://localhost:3000/admin/login

> Supabase 미설정 시 샘플 데이터로 UI 확인 가능 (문의/관리자 기능은 Supabase 필요)

### 6. 빌드

```bash
npm run build
npm start
```

## Vercel 배포

1. GitHub 저장소 연결
2. Environment Variables에 `.env.example` 항목 설정
3. Deploy

배포 후 Supabase Dashboard > Authentication > URL Configuration에 사이트 URL 추가:

- Site URL: `https://your-domain.com`
- Redirect URLs: `https://your-domain.com/**`

## 프로젝트 구조

```
app/
  (public)/          # 공개 페이지
  admin/             # 관리자 (login + dashboard)
  api/               # API Routes
components/
  layout/            # 사이드바, 헤더, 푸터
  projects/          # 프로젝트 카드, 갤러리
  forms/             # 문의 폼
  admin/             # 관리자 UI
  ui/                # shadcn/ui
lib/
  supabase/          # Supabase 클라이언트
  auth/              # 관리자 인증
  data/              # 데이터 fetch
  validation/        # Zod 스키마
supabase/
  migrations/        # DB migration
  seed.sql           # 샘플 데이터
public/
  placeholders/      # placeholder 이미지
```

## 관리자 사용법

1. `/admin/login`에서 로그인
2. **프로젝트**: 공사사례 등록/수정/삭제, 이미지 업로드, 공개/임시저장
3. **문의**: 접수된 상담 확인, 상태 변경, CSV 다운로드
4. **설정**: 업체 정보, 홈 콘텐츠, SEO, Analytics ID

## 보안

- 모든 테이블 RLS 적용
- 관리자 role은 `profiles.role = 'admin'`으로 확인
- 문의 첨부파일은 비공개 bucket + signed URL
- Honeypot + rate limit (문의 API)
- 관리자 페이지 `noindex`
- Service Role Key는 서버 전용 (클라이언트 노출 금지)

## 라이선스

Private — 미강건축 내부 사용
