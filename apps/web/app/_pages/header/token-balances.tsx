"use client";

import { formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@turi/ui/components/popover";
import { Wallet } from "@turi/ui/index";

import {
  TuriTokenAbi,
  TuriTokenAddress,
  USDXAbi,
  USDXAddress,
} from "@/src/constants/abi";

export function TokenBalances() {
  const { address, isConnected } = useAccount();

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

  if (!isConnected || !address) {
    return null;
  }

  const formattedUSDX = usdxBalance
    ? parseFloat(formatUnits(usdxBalance as bigint, 6)).toFixed(2)
    : "0.00";
  const formattedTURI = turiBalance
    ? parseFloat(formatUnits(turiBalance as bigint, 18)).toFixed(2)
    : "0.00";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="border-border bg-background hover:bg-accent flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm transition-colors">
          <Wallet className="text-muted-foreground h-4 w-4" />
          <span className="font-mono text-xs font-medium">Balances</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-sm font-semibold">Token Balances</h4>
            <span className="text-muted-foreground font-mono text-xs">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>

          {/* USDX Balance */}
          <div className="flex items-center justify-between rounded-lg bg-blue-500/10 p-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-muted-foreground text-sm font-medium">
                USDX
              </span>
            </div>
            <span className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400">
              ${formattedUSDX}
            </span>
          </div>

          {/* TURI Balance */}
          <div className="flex items-center justify-between rounded-lg bg-purple-500/10 p-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-500" />
              <span className="text-muted-foreground text-sm font-medium">
                TURI
              </span>
            </div>
            <span className="font-mono text-lg font-bold text-purple-600 dark:text-purple-400">
              {formattedTURI}
            </span>
          </div>

          <p className="text-muted-foreground border-t pt-2 text-center text-xs">
            Updates every 10 seconds
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
