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
    isActive: (pathname, searchParams) =>
      (pathname === "/projects" && !searchParams.get("category")) ||
      (pathname.startsWith("/projects/") && pathname !== "/projects"),
  },
  {
    href: "/projects?category=interior",
    label: "Interior",
    isActive: (pathname, searchParams) =>
      pathname === "/projects" && searchParams.get("category") === "interior",
  },
  {
    href: "/contact",
    label: "Contact",
    isActive: (pathname) => pathname === "/contact" || pathname.startsWith("/contact/"),
  },
];
