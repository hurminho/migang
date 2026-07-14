import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getCurrentProfile } from "@/lib/auth/admin";

export const metadata = {
  title: "관리자 로그인",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const profile = await getCurrentProfile();
  if (profile?.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm rounded-lg border bg-white p-8">
        <h1 className="mb-6 text-lg font-semibold">관리자 로그인</h1>
        <LoginForm />
      </div>
    </div>
  );
}
