"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { publicNavItems } from "@/lib/navigation";

interface MobileHeaderProps {
  companyName: string;
  companyNameEn: string;
}

const MOBILE_HEADER_HEIGHT = "4.125rem";

export function MobileHeader({ companyName, companyNameEn }: MobileHeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <header
        className={cn(
          "sticky top-0 z-50 flex items-center justify-between bg-white px-4 pb-3.5",
          "min-h-[calc(var(--mobile-header-h)+env(safe-area-inset-top,0px))]",
          "pt-[max(0.875rem,env(safe-area-inset-top,0px))]",
        )}
        style={{ ["--mobile-header-h" as string]: MOBILE_HEADER_HEIGHT }}
      >
        <Link href="/" className="block min-w-0 pr-4" onClick={close}>
          <p className="text-sm font-medium leading-snug">{companyName}</p>
          <p className="mt-0.5 text-[12px] leading-snug tracking-[0.14em] text-muted uppercase">
            {companyNameEn}
          </p>
        </Link>
        <button
          type="button"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex size-10 shrink-0 items-center justify-center"
        >
          {open ? (
            <X size={22} strokeWidth={1.5} aria-hidden />
          ) : (
            <Menu size={22} strokeWidth={1.5} aria-hidden />
          )}
        </button>
      </header>

      {open && (
        <nav
          aria-label="모바일 메뉴"
          className={cn(
            "fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-white px-4 pb-8",
            "top-[calc(var(--mobile-header-h)+env(safe-area-inset-top,0px))]",
          )}
          style={{ ["--mobile-header-h" as string]: MOBILE_HEADER_HEIGHT }}
        >
          <div className="flex flex-col gap-5 pt-6">
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={cn(
                  "text-sm leading-normal",
                  item.isActive(pathname, searchParams)
                    ? "font-medium text-foreground"
                    : "text-muted",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
