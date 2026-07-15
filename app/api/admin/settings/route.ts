import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/admin-api";

export async function PUT() {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  return NextResponse.json(
    {
      error:
        "사이트 설정은 types/site-settings.ts에서 관리합니다. 파일을 수정한 뒤 배포해 주세요.",
    },
    { status: 403 },
  );
}
