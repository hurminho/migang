import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/admin";

export async function requireAdminApi(): Promise<
  { profile: NonNullable<Awaited<ReturnType<typeof getCurrentProfile>>> } | { error: NextResponse }
> {
  try {
    const profile = await getCurrentProfile();

    if (!profile || profile.role !== "admin") {
      return {
        error: NextResponse.json({ error: "권한이 없습니다." }, { status: 403 }),
      };
    }

    return { profile };
  } catch {
    return {
      error: NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 }),
    };
  }
}
