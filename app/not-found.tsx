import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-light text-muted">404</h1>
      <p className="mt-4 text-lg">페이지를 찾을 수 없습니다.</p>
      <Button asChild className="mt-8">
        <Link href="/">홈으로</Link>
      </Button>
    </div>
  );
}
