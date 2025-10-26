"use client";

import { useState } from "react";
import { parseUnits, formatUnits } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";

import { Button } from "@turi/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@turi/ui/components/card";
import { Input } from "@turi/ui/components/input";
import { Label } from "@turi/ui/components/label";
import { Loader2, CheckCircle2, AlertCircle, Droplet, Info } from "@turi/ui/index";
import { useAppKit } from "@/reown";
import { USDXAbi, USDXAddress, TuriTokenAbi, TuriTokenAddress } from "@/src/constants/abi";

export function FaucetButton() {
  const [amount, setAmount] = useState("1000");
  const { address, isConnected } = useAccount();
  const { open: openWallet } = useAppKit();

  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Read USDX balance (6 decimals)
  const { data: usdxBalance } = useReadContract({
    address: USDXAddress,
    abi: USDXAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  // Read TURI balance (18 decimals)
  const { data: turiBalance } = useReadContract({
    address: TuriTokenAddress,
    abi: TuriTokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  const handleFaucet = async () => {
    if (!isConnected) {
      openWallet();
      return;
    }

    try {
      const amountInWei = parseUnits(amount, 6); // USDX has 6 decimals

      writeContract({
        address: USDXAddress,
        abi: USDXAbi,
        functionName: "faucet",
        args: [amountInWei],
      });
    } catch (err) {
      console.error("Faucet error:", err);
    }
  };

  const formattedUSDX = usdxBalance ? parseFloat(formatUnits(usdxBalance as bigint, 6)).toFixed(2) : "0.00";
  const formattedTURI = turiBalance ? parseFloat(formatUnits(turiBalance as bigint, 18)).toFixed(2) : "0.00";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-500" />
          Token Faucet
        </CardTitle>
        <CardDescription>
          Get test USDX tokens and view your balances
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected && (
          <div className="space-y-2">
            {/* USDX Balance */}
            <div className="rounded-lg bg-blue-500/10 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <p className="text-sm font-medium text-muted-foreground">USDX Balance</p>
                </div>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  ${formattedUSDX}
                </p>
              </div>
            </div>

            {/* TURI Balance */}
            <div className="rounded-lg bg-purple-500/10 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500" />
                  <p className="text-sm font-medium text-muted-foreground">TURI Balance</p>
                </div>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {formattedTURI}
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center font-mono pt-1">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (USDX)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000"
            disabled={isPending || isConfirming}
          />
          <p className="text-xs text-muted-foreground">
            Max: 10,000 USDX per request
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="text-xs">{error.message}</p>
          </div>
        )}

        {isSuccess && (
          <div className="bg-green-500/10 text-green-600 dark:text-green-500 rounded-lg p-3 text-sm flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Success!</p>
              <p className="text-xs mt-1">Tokens sent successfully.</p>
              {txHash && (
                <a
                  href={`https://sepolia.scrollscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs hover:underline transition-all flex items-center gap-1 mt-1"
                >
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}

        <Button
          onClick={handleFaucet}
          disabled={isPending || isConfirming || !amount || parseFloat(amount) <= 0}
          className="w-full"
        >
          {!isConnected ? (
            "Connect Wallet"
          ) : isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Requesting...
            </>
          ) : isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirming...
            </>
          ) : (
            <>
              <Droplet className="mr-2 h-4 w-4" />
              Get {amount} USDX
            </>
          )}
        </Button>

        {/* TURI Token Info */}
        <div className="bg-purple-500/10 rounded-lg p-3 text-sm flex items-start gap-2 border border-purple-500/20">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
          <div className="text-xs">
            <p className="font-semibold text-purple-600 dark:text-purple-400 mb-1">
              How to get TURI tokens?
            </p>
            <p className="text-muted-foreground">
              TURI tokens are earned by checking in at tourist locations on the map. Visit places and collect rewards!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
