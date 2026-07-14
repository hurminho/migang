"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { publicNavItems } from "@/lib/navigation";

interface MobileHeaderProps {
  companyName: string;
}

export function MobileHeader({ companyName }: MobileHeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const close = () => setOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between bg-white px-4 py-3.5 lg:hidden">
        <Link href="/" className="text-sm font-medium">
          {companyName}
        </Link>
        <button
          type="button"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-[5px] p-1"
        >
          <span
            className={cn(
              "block h-px w-5 bg-foreground transition-transform",
              open && "translate-y-[3px] rotate-45",
            )}
          />
          <span
            className={cn(
              "block h-px w-5 bg-foreground transition-opacity",
              open && "opacity-0",
            )}
          />
          <span
            className={cn(
              "block h-px w-5 bg-foreground transition-transform",
              open && "-translate-y-[3px] -rotate-45",
            )}
          />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-30 bg-white lg:hidden">
          <div className="flex h-full flex-col px-4 pt-16 pb-8">
            <nav className="flex flex-col gap-5">
              {publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={cn(
                    "text-sm",
                    item.isActive(pathname, searchParams)
                      ? "font-medium text-foreground"
                      : "text-muted",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
