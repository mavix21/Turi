"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { Link } from "@/app/_shared/i18n";

export function NavLinks() {
  const t = useTranslations("home.navigation");
  const pathname = usePathname();

  // Remove locale prefix from pathname for comparison
  const currentPath = pathname.replace(/^\/(en|es)/, "") || "/";

  const links = [
    { href: "/", label: t("home") },
    { href: "/map", label: t("map") },
    { href: "/test", label: "Faucet" },
  ];

  return (
    <nav className="hidden items-center gap-8 md:flex">
      {links.map((link) => {
        const isActive = currentPath === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition ${
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
