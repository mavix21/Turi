"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { cn } from "@turi/ui/lib/utils";

import { Link } from "@/app/_shared/i18n";

interface HeaderNavigationLink {
  href: string;
  label: string;
  requiresAuth: boolean;
  isActive: boolean;
}

export function useHeaderNavigationLinks(): HeaderNavigationLink[] {
  const t = useTranslations("home.navigation");
  const pathname = usePathname();
  const { data: session } = useSession();

  // Remove locale prefix from pathname for comparison
  const currentPath = pathname.replace(/^\/(en|es)/, "") || "/";

  return [
    { href: "/", label: t("home"), requiresAuth: false },
    { href: "/map", label: t("map"), requiresAuth: true },
    { href: "/test", label: "Faucet", requiresAuth: true },
  ]
    .filter((link) => !link.requiresAuth || session)
    .map((link) => ({
      ...link,
      isActive: currentPath === link.href,
    }));
}

interface NavLinksProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  onNavigate?: () => void;
}

export function NavLinks({
  orientation = "horizontal",
  className,
  onNavigate,
}: NavLinksProps = {}) {
  const links = useHeaderNavigationLinks();

  return (
    <nav
      className={cn(
        orientation === "horizontal"
          ? "hidden items-center gap-8 md:flex"
          : "flex flex-col gap-4",
        className,
      )}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className={cn(
            "font-medium transition",
            orientation === "horizontal" ? "text-sm" : "text-base",
            link.isActive
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
