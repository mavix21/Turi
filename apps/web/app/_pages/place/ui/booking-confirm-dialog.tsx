"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { parseUnits } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useMutation } from "convex/react";
import type { Id } from "@turi/convex/_generated/dataModel";

import { api } from "@turi/convex/_generated/api";
import { Button } from "@turi/ui/components/button";
import { Card, CardContent } from "@turi/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@turi/ui/components/dialog";
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  Users,
  Wallet,
  AlertCircle,
  Loader2,
} from "@turi/ui/index";
import { useAppKit } from "@/reown";
import {
  ProductVaultAbi,
  ProductVaultAddress,
  USDXAbi,
  USDXAddress,
} from "@/src/constants/abi";

interface BookingConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: {
    _id: Id<"tourPackages">;
    name: string;
    guarantees: string[];
    company: {
      slug: string;
      name: string;
    } | null;
  };
  participants: number;
  selectedDate: Date | undefined;
  total: number;
}

type PurchaseStep =
  | "idle"
  | "approving-usdx"
  | "waiting-usdx-approval"
  | "purchasing"
  | "waiting-confirmation"
  | "saving-booking"
  | "success"
  | "error";

export function BookingConfirmDialog({
  open,
  onOpenChange,
  provider,
  participants,
  selectedDate,
  total,
}: BookingConfirmDialogProps) {
  const [step, setStep] = useState<PurchaseStep>("idle");
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected, chainId } = useAccount();
  const { open: openWallet } = useAppKit();
  const { writeContract, data: txHash, error: writeError } = useWriteContract();
  const { data: receipt, isSuccess: isTxConfirmed } = useWaitForTransactionReceipt({
    hash: txHash
  });

  const createBooking = useMutation(api.bookings.createBookingFromPurchase);

  // Convert total to USDX amount (6 decimals)
  const usdxAmount = parseUnits(total.toString(), 6);
  const travelTokensRequired = 0n; // Can add logic for discounts later

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setStep("idle");
      setError(null);
    }
  }, [open]);

  // Handle transaction errors
  useEffect(() => {
    if (writeError) {
      setError(writeError.message || "Transaction failed");
      setStep("error");
    }
  }, [writeError]);

  // Handle transaction confirmation
  useEffect(() => {
    if (isTxConfirmed && receipt) {
      if (step === "waiting-usdx-approval") {
        // USDX approval confirmed, now purchase
        executePurchase();
      } else if (step === "waiting-confirmation") {
        // Purchase confirmed, save to database
        saveBooking();
      }
    }
  }, [isTxConfirmed, receipt, step]);

  // Approve USDX
  const approveUSDX = useCallback(() => {
    if (!address) return;

    setStep("approving-usdx");
    setError(null);

    writeContract({
      address: USDXAddress,
      abi: USDXAbi,
      functionName: "approve",
      args: [ProductVaultAddress, usdxAmount],
    });

    setStep("waiting-usdx-approval");
  }, [address, usdxAmount, writeContract]);

  // Execute purchase
  const executePurchase = useCallback(() => {
    if (!address || !provider.company) return;

    setStep("purchasing");
    setError(null);

    writeContract({
      address: ProductVaultAddress,
      abi: ProductVaultAbi,
      functionName: "purchaseProduct",
      args: [
        provider._id,
        provider.company.slug,
        usdxAmount,
        travelTokensRequired,
      ],
    });

    setStep("waiting-confirmation");
  }, [address, provider, usdxAmount, travelTokensRequired, writeContract]);

  // Save booking to Convex
  const saveBooking = useCallback(async () => {
    if (!receipt || !selectedDate || !chainId) return;

    setStep("saving-booking");
    setError(null);

    try {
      await createBooking({
        tourPackageId: provider._id,
        tourDate: selectedDate.getTime(),
        participants,
        totalPricePaid: total,
        transactionHash: receipt.transactionHash,
        blockNumber: Number(receipt.blockNumber),
        buyerAddress: address || "",
        usdxAmount: usdxAmount.toString(),
        travelTokensBurned: travelTokensRequired.toString(),
        chainId,
      });

      setStep("success");

      // Auto close after 3 seconds
      setTimeout(() => {
        onOpenChange(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save booking");
      setStep("error");
    }
  }, [receipt, selectedDate, chainId, createBooking, provider._id, participants, total, address, usdxAmount, travelTokensRequired, onOpenChange]);

  // Handle purchase flow
  const handlePurchase = () => {
    if (!isConnected) {
      openWallet();
      return;
    }

    if (!provider.company) {
      setError("Company information not found");
      return;
    }

    if (!selectedDate) {
      setError("Please select a date");
      return;
    }

    // Start flow with USDX approval
    approveUSDX();
  };

  // Success view
  if (step === "success") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
            </div>
            <DialogTitle className="text-center text-2xl">
              Booking Confirmed!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your tour has been successfully purchased on-chain.
              <br />
              Transaction: {receipt?.transactionHash.slice(0, 10)}...
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet";

    switch (step) {
      case "approving-usdx":
        return "Approving USDX...";
      case "waiting-usdx-approval":
        return "Waiting for Approval...";
      case "purchasing":
        return "Confirming Purchase...";
      case "waiting-confirmation":
        return "Waiting for Confirmation...";
      case "saving-booking":
        return "Saving Booking...";
      default:
        return `Pay $${total} USDX`;
    }
  };

  const getStepMessage = () => {
    switch (step) {
      case "approving-usdx":
      case "waiting-usdx-approval":
        return "Step 1/2: Approving USDX token...";
      case "purchasing":
      case "waiting-confirmation":
        return "Step 2/2: Confirming purchase...";
      case "saving-booking":
        return "Finalizing booking...";
      default:
        return null;
    }
  };

  const isProcessing = !["idle", "error", "success"].includes(step);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Your Booking</DialogTitle>
          <DialogDescription>
            Complete the blockchain transaction to confirm your booking
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <h3 className="mb-1 font-semibold">{provider.name}</h3>
              <p className="text-muted-foreground text-sm">
                by {provider.company?.name || "Unknown"}
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span>
                  {selectedDate
                    ? format(selectedDate, "EEEE, MMMM d, yyyy")
                    : "No date selected"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-muted-foreground h-4 w-4" />
                <span>
                  {participants} {participants === 1 ? "Person" : "People"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="text-muted-foreground h-4 w-4" />
                <span className="text-lg font-semibold">${total} USDX</span>
              </div>
              {isConnected && address && (
                <div className="flex items-center gap-2">
                  <Wallet className="text-muted-foreground h-4 w-4" />
                  <span className="font-mono text-xs">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress indicator */}
        {isProcessing && (
          <div className="bg-primary/10 text-primary rounded-lg p-3 text-sm flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{getStepMessage()}</span>
          </div>
        )}

        <div className="bg-muted/50 space-y-1 rounded-lg p-4 text-sm">
          <div className="flex flex-col items-start gap-2">
            {provider.guarantees.map((guarantee) => (
              <div className="flex items-start gap-2" key={guarantee}>
                <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                <span className="text-muted-foreground text-xs">{guarantee}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && step === "error" && (
          <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="text-xs">{error}</p>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            {getButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
