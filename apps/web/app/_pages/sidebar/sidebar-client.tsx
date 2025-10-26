"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

import { Button } from "@turi/ui/components/button";

export function SidebarClient() {
  const pathname = usePathname();
  const params = useParams();
  const profileId = params.id as string;
  const t = useTranslations("home.profile.navigation");

  const navigationItems = [
    {
      id: "tourist-passport",
      labelKey: "touristPassport",
      icon: "Ticket",
    },
    {
      id: "collectibles",
      labelKey: "collectibles",
      icon: "SquareStar",
    },
    { id: "past-trips", labelKey: "pastTrips", icon: "Luggage" },
    { id: "rewards", labelKey: "rewards", icon: "Gift" },
  ];

  return (
    <nav className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-x-visible lg:pb-0">
      {navigationItems.map((item) => {
        const href = `/${params.locale}/profile/${profileId}/${item.id}`;
        const isActive = pathname === href;
        const Icon = Icons[item.icon as keyof typeof Icons] as LucideIcon;
        return (
          <Button
            key={item.id}
            variant={isActive ? "default" : "secondary"}
            asChild
          >
            <Link href={href}>
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-sm">{t(item.labelKey as any)}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
