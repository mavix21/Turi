"use client";

import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";

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
    ? parseFloat(formatUnits(usdxBalance, 6)).toFixed(2)
    : "0.00";
  const formattedTURI = turiBalance
    ? parseFloat(formatUnits(turiBalance, 18)).toFixed(2)
    : "0.00";

  return (
    <div className="flex items-center gap-2">
      {/* USDX Balance */}
      <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1.5 text-sm">
        <div className="h-2 w-2 rounded-full bg-blue-500" />
        <span className="font-mono font-medium text-blue-600 dark:text-blue-400">
          ${formattedUSDX}
        </span>
        <span className="text-muted-foreground text-xs">USDX</span>
      </div>

      {/* TURI Balance */}
      <div className="flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1.5 text-sm">
        <div className="h-2 w-2 rounded-full bg-purple-500" />
        <span className="font-mono font-medium text-purple-600 dark:text-purple-400">
          {formattedTURI}
        </span>
        <span className="text-muted-foreground text-xs">TURI</span>
      </div>
    </div>
  );
}
