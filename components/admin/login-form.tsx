"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.",
  no_session: "로그인 세션을 확인할 수 없습니다.",
  no_profile: "프로필 정보를 불러올 수 없습니다. 관리자에게 문의해 주세요.",
  not_admin: "관리자 권한이 없습니다.",
  supabase_not_configured:
    "Supabase 설정이 없습니다. .env.local 파일을 확인해 주세요.",
  server_error: "로그인 중 오류가 발생했습니다.",
};

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("올바른 이메일을 입력해 주세요.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호를 6자 이상 입력해 주세요.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = (await res.json()) as { error?: string; ok?: boolean };

      if (!res.ok) {
        setError(
          ERROR_MESSAGES[data.error ?? "server_error"] ?? ERROR_MESSAGES.server_error,
        );
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError(ERROR_MESSAGES.server_error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
