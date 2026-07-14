export type PublicNavItem = {
  href: string;
  label: string;
  isActive: (pathname: string, searchParams: URLSearchParams) => boolean;
};

export const publicNavItems: PublicNavItem[] = [
  {
    href: "/about",
    label: "About",
    isActive: (pathname) => pathname === "/about" || pathname.startsWith("/about/"),
  },
  {
    href: "/projects",
    label: "Projects",
    isActive: (pathname) =>
      pathname === "/projects" || pathname.startsWith("/projects/"),
  },
  {
    href: "/contact",
    label: "Contact",
    isActive: (pathname) => pathname === "/contact" || pathname.startsWith("/contact/"),
  },
];
