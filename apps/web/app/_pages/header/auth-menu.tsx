"use client";

import { useSession } from "next-auth/react";

import { ConnectButton } from "@/app/_shared/ui/connect-button";

import { UserDropdown } from "./user-dropdown";

export function AuthMenu() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-3">
      {session ? <UserDropdown address={session.address} /> : <ConnectButton />}
    </div>
  );
}
