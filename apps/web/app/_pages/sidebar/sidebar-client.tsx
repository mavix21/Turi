"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

import { Button } from "@turi/ui/components/button";

export function SidebarClient() {
  const pathname = usePathname();
  const params = useParams();
  const profileId = params.id as string;

  const navigationItems = [
    {
      id: "tourist-passport",
      label: "My Turi Passport",
      icon: "Ticket",
    },
    {
      id: "collectibles",
      label: "Collectibles",
      icon: "SquareStar",
    },
    { id: "past-trips", label: "Past trips", icon: "Luggage" },
    { id: "rewards", label: "Rewards", icon: "Gift" },
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
              <span className="text-sm">{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
