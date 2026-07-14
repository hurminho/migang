import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { loginFormSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "supabase_not_configured" },
      { status: 500 },
    );
  }

  try {
    const body = loginFormSchema.parse(await request.json());
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword(
      body,
    );

    if (authError) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "no_session" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "no_profile" }, { status: 403 });
    }

    if (profile.role !== "admin") {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "not_admin" }, { status: 403 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
