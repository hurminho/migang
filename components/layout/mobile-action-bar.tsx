import Link from "next/link";
import { MessageSquare, Phone } from "lucide-react";

interface MobileActionBarProps {
  phone: string;
}

export function MobileActionBar({ phone }: MobileActionBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-border bg-white/95 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md md:hidden">
      <a
        href={`tel:${phone.replace(/[^\d+]/g, "")}`}
        className="flex items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-medium"
      >
        <Phone size={16} aria-hidden />
        전화 상담
      </a>
      <Link
        href="/contact"
        className="flex items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-medium text-white"
      >
        <MessageSquare size={16} aria-hidden />
        문의하기
      </Link>
    </div>
  );
}
