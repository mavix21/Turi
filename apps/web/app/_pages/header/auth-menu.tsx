"use client";

import { useSession } from "next-auth/react";

import { ConnectButton } from "@/app/_shared/ui/connect-button";

import { UserDropdown } from "./user-dropdown";

interface AuthMenuProps {
  isMobile?: boolean;
}

export function AuthMenu({ isMobile = false }: AuthMenuProps = {}) {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-3">
      {session ? (
        <UserDropdown
          username={"Turi Traveler"}
          address={session.address}
          isMobile={isMobile}
        />
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
