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
      id: "about",
      label: "About me",
      icon: "User",
    },
    {
      id: "tourist-passport",
      label: "My Turi Passport",
      icon: "Ticket",
    },
    { id: "past-trips", label: "Past trips", icon: "Luggage" },
    { id: "rewards", label: "Rewards", icon: "Gift" },
    {
      id: "certified-providers",
      label: "Certified Providers",
      icon: "Store",
    },
  ];

  return (
    <nav className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-x-visible lg:pb-0">
      {navigationItems.map((item) => {
        const href = `/${params.locale}/profile/${profileId}/${item.id}`;
        const isActive = pathname === href;
        console.log("pathname:", pathname);
        console.log("href:", href);
        const Icon = Icons[item.icon as keyof typeof Icons] as LucideIcon;
        return (
          <Button
            key={item.id}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 whitespace-nowrap transition-all ${
              isActive
                ? "bg-muted text-foreground font-medium"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
            asChild
          >
            <Link href={href}>
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
