"use client";

import { useState } from "react";
import { parseUnits, formatUnits } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";

import { Button } from "@turi/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@turi/ui/components/card";
import { Input } from "@turi/ui/components/input";
import { Label } from "@turi/ui/components/label";
import { Loader2, CheckCircle2, AlertCircle, Droplet } from "@turi/ui/index";
import { useAppKit } from "@/reown";
import { USDXAbi, USDXAddress } from "@/src/constants/abi";

export function FaucetButton() {
  const [amount, setAmount] = useState("1000");
  const { address, isConnected } = useAccount();
  const { open: openWallet } = useAppKit();

  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Read current balance
  const { data: balance } = useReadContract({
    address: USDXAddress,
    abi: USDXAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
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

  const formattedBalance = balance ? formatUnits(balance as bigint, 6) : "0";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-500" />
          USDX Faucet
        </CardTitle>
        <CardDescription>
          Get test USDX tokens for testing purchases
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected && (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">Your Balance</p>
            <p className="text-2xl font-bold">{formattedBalance} USDX</p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
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
            <div>
              <p className="font-semibold">Success!</p>
              <p className="text-xs">
                Tokens sent. Transaction: {txHash?.slice(0, 10)}...
              </p>
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

        {txHash && (
          <div className="text-center">
            <a
              href={`https://sepolia.scrollscan.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              View on Scroll Explorer →
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
