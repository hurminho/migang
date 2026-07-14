import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/admin-api";
import { upsertSiteSettings } from "@/lib/data/site-settings";
import { siteSettingsFormSchema } from "@/lib/validation/schemas";

export async function PUT(request: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  try {
    const body = await request.json();
    const parsed = siteSettingsFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message },
        { status: 400 },
      );
    }

    await upsertSiteSettings(parsed.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}
