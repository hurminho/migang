"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { publicNavItems } from "@/lib/navigation";

interface SiteHeaderProps {
  companyName: string;
  companyNameEn: string;
  phone: string;
}

export function SiteHeader({ companyName, companyNameEn, phone }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overHero = pathname === "/" && !scrolled && !open;
  const anyActive = publicNavItems.some((item) => item.isActive(pathname, new URLSearchParams()));
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-colors duration-300",
          overHero
            ? "bg-transparent text-white"
            : "border-b border-border/70 bg-white/90 text-foreground backdrop-blur-md",
        )}
      >
        <div className="container-site flex h-16 items-center justify-between md:h-20">
          <Link href="/" onClick={close} className="leading-tight">
            <span className="block text-base font-semibold tracking-tight">{companyName}</span>
            <span
              className={cn(
                "block text-[11px] tracking-[0.2em] uppercase",
                overHero ? "text-white/70" : "text-muted",
              )}
            >
              {companyNameEn}
            </span>
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {publicNavItems.map((item) => {
              const active = item.isActive(pathname, new URLSearchParams());
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-[15px] font-medium transition-opacity hover:opacity-100",
                    active ? "opacity-100" : "opacity-70",
                    "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-current after:transition-transform after:duration-300",
                    active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
                overHero
                  ? "bg-white text-ink hover:bg-white/85"
                  : "bg-ink text-white hover:bg-ink/85",
              )}
            >
              상담 문의
              <ArrowUpRight size={16} aria-hidden />
            </Link>
          </nav>

          <button
            type="button"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="-mr-2 flex size-11 items-center justify-center md:hidden"
          >
            {open ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-white pt-[calc(4rem+env(safe-area-inset-top,0px))] transition-opacity duration-300 md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <nav className="container-site flex flex-1 flex-col justify-center gap-2">
          {publicNavItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              tabIndex={open ? 0 : -1}
              className={cn(
                "py-2 text-4xl font-semibold tracking-tight transition-all duration-500",
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                !anyActive || item.isActive(pathname, new URLSearchParams())
                  ? "text-foreground"
                  : "text-foreground/40",
              )}
              style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="container-site border-t border-border py-8 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
          <p className="eyebrow">Contact</p>
          <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="mt-2 block text-xl font-medium">
            {phone}
          </a>
        </div>
      </div>
    </>
  );
}
