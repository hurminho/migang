"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/projects", label: "프로젝트", icon: FolderKanban },
  { href: "/admin/inquiries", label: "문의", icon: MessageSquare },
  { href: "/admin/settings", label: "설정", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r bg-white">
      <div className="border-b px-4 py-5">
        <Link href="/admin" className="text-sm font-semibold">
          관리자
        </Link>
        <Link
          href="/"
          target="_blank"
          className="mt-1 block text-xs text-muted hover:text-foreground"
        >
          사이트 보기 →
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                active
                  ? "bg-muted font-medium"
                  : "text-muted hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 size-4" />
          로그아웃
        </Button>
      </div>
    </aside>
  );
}
