"use client";

import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback } from "@turi/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@turi/ui/components/dropdown-menu";

import { Link } from "@/app/_shared/i18n";

interface UserDropdownProps {
  address: string;
  username?: string;
}

export function UserDropdown({ address, username }: UserDropdownProps) {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-accent flex items-center gap-2 rounded-lg px-3 py-2.5">
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {username ? username.charAt(0).toUpperCase() : "A"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-start">
          <p className="text-sm font-medium">{username ?? "Anonymous"}</p>
          <p className="text-muted-foreground max-w-32 truncate text-xs">
            {address}
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={`/profile/me/about`} className="w-full">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
