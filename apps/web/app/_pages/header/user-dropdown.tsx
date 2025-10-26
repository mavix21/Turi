"use client";

import { useAppKit } from "@reown/appkit/react";
import { Coins, LogOut, User, Wallet } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

import { Avatar, AvatarFallback } from "@turi/ui/components/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@turi/ui/components/menubar";

import { Link } from "@/app/_shared/i18n";
import {
  TuriTokenAbi,
  TuriTokenAddress,
  USDXAbi,
  USDXAddress,
} from "@/src/constants/abi";

interface UserDropdownProps {
  address: string;
  username?: string;
  isMobile?: boolean;
}

// Reusable component for token balance display
function TokenBalanceDisplay({
  usdxBalance,
  turiBalance,
}: {
  usdxBalance: string;
  turiBalance: string;
}) {
  return (
    <div className="px-2 py-2">
      {/* USDX Balance */}
      <div className="mb-2 flex flex-col justify-between rounded-lg bg-blue-500/10 p-2.5">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs font-medium">
            USDX
          </span>
        </div>
        <span className="font-mono text-base font-bold text-blue-600 dark:text-blue-400">
          {usdxBalance}
        </span>
      </div>

      {/* TURI Balance */}
      <div className="flex flex-col justify-between rounded-lg bg-purple-500/10 p-2.5">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs font-medium">
            TURI
          </span>
        </div>
        <span className="font-mono text-base font-bold text-purple-600 dark:text-purple-400">
          {turiBalance}
        </span>
      </div>

      <p className="text-muted-foreground mt-2 text-center text-[0.65rem]">
        Updates every 10s
      </p>
    </div>
  );
}

export function UserDropdown({
  address,
  username,
  isMobile = false,
}: UserDropdownProps) {
  const { open } = useAppKit();
  const t = useTranslations("home.userDropdown");

  // Read USDX balance (6 decimals)
  const { data: usdxBalance } = useReadContract({
    address: USDXAddress,
    abi: USDXAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  // Read TURI balance (18 decimals)
  const { data: turiBalance } = useReadContract({
    address: TuriTokenAddress,
    abi: TuriTokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  const formattedUSDX = usdxBalance
    ? parseFloat(formatUnits(usdxBalance as bigint, 6)).toFixed(2)
    : "0.00";
  const formattedTURI = turiBalance
    ? parseFloat(formatUnits(turiBalance as bigint, 18)).toFixed(2)
    : "0.00";

  const handleLogout = async () => {
    await signOut();
  };

  // Mobile view: Show balances inline without submenu
  if (isMobile) {
    return (
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-3 border-b px-4 pb-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {username ? username.charAt(0).toUpperCase() : "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">
              {username ?? t("anonymous")}
            </p>
            <p className="text-muted-foreground font-mono text-xs">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
        </div>

        {/* Token Balances - Inline on mobile */}
        <div className="px-4">
          <div className="mb-3 flex items-center gap-2">
            <Coins className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">Token Balances</span>
          </div>
          <TokenBalanceDisplay
            usdxBalance={formattedUSDX}
            turiBalance={formattedTURI}
          />
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-1 px-2">
          <Link
            href={`/profile/me/tourist-passport`}
            className="hover:bg-muted flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition"
          >
            <User className="h-4 w-4" />
            {t("profile")}
          </Link>

          <button
            onClick={() => open()}
            className="hover:bg-muted flex items-center gap-3 rounded-md px-3 py-2 text-start text-sm font-medium transition"
          >
            <Wallet className="h-4 w-4" />
            {t("wallet")}
          </button>

          <div className="my-2 border-t" />

          <button
            onClick={handleLogout}
            className="text-destructive hover:bg-destructive/10 flex items-center gap-3 rounded-md px-3 py-2 text-start text-sm font-medium transition"
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
        </div>
      </div>
    );
  }

  // Desktop view: Keep the menubar with submenu

  return (
    <Menubar className="w-full px-0 py-8 lg:py-6">
      <MenubarMenu>
        <MenubarTrigger
          asChild
          className="flex flex-1 cursor-pointer gap-2 px-2"
        >
          <div className="py-4 lg:py-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {username ? username.charAt(0).toUpperCase() : "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-start">
              <p className="text-sm font-medium">
                {username ?? t("anonymous")}
              </p>
              <p className="text-muted-foreground max-w-32 truncate text-xs">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
          </div>
        </MenubarTrigger>
        <MenubarContent align="end" className="w-64">
          <div className="px-2 py-2">
            <p className="text-sm font-semibold">{t("myAccount")}</p>
            <p className="text-muted-foreground font-mono text-xs">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
          <MenubarSeparator />

          <MenubarItem asChild>
            <Link href={`/profile/me/tourist-passport`}>
              <User className="h-4 w-4" />
              {t("profile")}
            </Link>
          </MenubarItem>

          {/* Token Balances Submenu */}
          <MenubarSub>
            <MenubarSubTrigger className="space-x-2">
              <Coins className="text-muted-foreground h-4 w-4" />
              <span>Token Balances</span>
            </MenubarSubTrigger>
            <MenubarSubContent>
              <TokenBalanceDisplay
                usdxBalance={formattedUSDX}
                turiBalance={formattedTURI}
              />
            </MenubarSubContent>
          </MenubarSub>

          <MenubarItem onClick={() => open()}>
            <Wallet className="h-4 w-4" />
            {t("wallet")}
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={handleLogout} variant="destructive">
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
