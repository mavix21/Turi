"use client";

import { useAppKit } from "@reown/appkit/react";
import { LogOut, Settings, User, Wallet } from "lucide-react";
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
  const { open } = useAppKit();

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
        <DropdownMenuItem asChild>
          <Link href={`/profile/me/tourist-passport`}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => open()}>
          <Wallet className="mr-2 h-4 w-4" />
          Wallet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
