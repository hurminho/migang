import Link from "next/link";
import { getSiteSettings } from "@/lib/data/site-settings";

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="page-main border-t border-border">
      <div className="flex flex-col gap-4 text-xs text-muted sm:flex-row sm:justify-between">
        <div className="flex gap-4">
          <Link href="/about" className="text-link">
            About
          </Link>
          <Link href="/projects" className="text-link">
            Projects
          </Link>
          <Link href="/contact" className="text-link">
            Contact
          </Link>
          <Link href="/privacy" className="text-link">
            Privacy
          </Link>
        </div>
      </div>
      <p className="mt-6 text-[13px] text-muted">{settings.footerCopyright}</p>
    </footer>
  );
}
