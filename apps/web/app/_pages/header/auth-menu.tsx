"use client";

import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";

import { api } from "@turi/convex/_generated/api";

import { ConnectButton } from "@/app/_shared/ui/connect-button";

import { UserDropdown } from "./user-dropdown";

export function AuthMenu() {
  const { data: session } = useSession();
  const user = useQuery(api.users.getMyProfile);

  return (
    <div className="flex items-center gap-3">
      {session ? (
        <UserDropdown
          username={user?.name ?? "Anonymous"}
          address={session.address}
        />
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
