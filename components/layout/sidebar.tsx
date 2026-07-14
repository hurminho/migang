"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { publicNavItems } from "@/lib/navigation";

interface SidebarProps {
  companyName: string;
  companyNameEn: string;
}

export function Sidebar({ companyName, companyNameEn }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[220px] flex-col bg-white px-7 py-9 lg:flex">
      <Link href="/" className="mb-14 block">
        <p className="text-sm font-medium tracking-tight">{companyName}</p>
        <p className="mt-0.5 text-[12px] tracking-[0.14em] text-muted uppercase">
          {companyNameEn}
        </p>
      </Link>

      <nav className="flex flex-col gap-3.5">
        {publicNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-[15px] transition-colors",
              item.isActive(pathname, searchParams)
                ? "font-medium text-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
