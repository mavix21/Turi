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
  TuriTokenAbi,
  TuriTokenAddress,
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
    mixedPayment?: {
      turiTokens: number;
      remainingUSX: number;
    };
  };
  participants: number;
  selectedDate: Date | undefined;
  total: number;
}

type PurchaseStep =
  | "idle"
  | "approving-turi"
  | "waiting-turi-approval"
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

  // Calculate payment amounts based on mixed payment option
  // CRITICAL: USDX has 6 decimals, TuriToken has 18 decimals
  const hasMixedPayment = !!provider.mixedPayment;

  // If mixedPayment exists, use per-person amounts * participants
  // Otherwise, use total (which is already basePricePerPerson + taxesAndFees * participants)
  const usdxAmount = hasMixedPayment && provider.mixedPayment
    ? parseUnits((provider.mixedPayment.remainingUSX * participants).toString(), 6) // USDX: 6 decimals
    : parseUnits(total.toString(), 6); // USDX: 6 decimals

  const travelTokensRequired = hasMixedPayment && provider.mixedPayment
    ? parseUnits((provider.mixedPayment.turiTokens * participants).toString(), 18) // TURI: 18 decimals
    : 0n;

  // Reset state when dialog closes (but not during active transactions)
  useEffect(() => {
    if (!open && step === "idle") {
      setError(null);
    }
  }, [open, step]);

  // Handle transaction errors
  useEffect(() => {
    if (writeError) {
      const errorMessage = writeError.message || "Transaction failed";
      // Check if user rejected the transaction
      if (errorMessage.includes("User rejected") || errorMessage.includes("User denied")) {
        setError("Transaction cancelled by user");
      } else {
        setError(errorMessage);
      }
      setStep("error");
    }
  }, [writeError]);

  // Handle transaction hash received (user signed)
  useEffect(() => {
    if (txHash && !isTxConfirmed) {
      // Transaction signed, waiting for confirmation
      if (step === "approving-turi") {
        setStep("waiting-turi-approval");
      } else if (step === "approving-usdx") {
        setStep("waiting-usdx-approval");
      } else if (step === "purchasing") {
        setStep("waiting-confirmation");
      }
    }
  }, [txHash, isTxConfirmed, step]);

  // Approve TuriTokens (only if mixed payment)
  const approveTuriTokens = useCallback(() => {
    if (!address || travelTokensRequired === 0n) return;

    setStep("approving-turi");
    setError(null);

    console.log("🟣 Approving TuriTokens:", {
      amount: travelTokensRequired.toString(),
      spender: ProductVaultAddress,
    });

    writeContract({
      address: TuriTokenAddress,
      abi: TuriTokenAbi,
      functionName: "approve",
      args: [ProductVaultAddress, travelTokensRequired],
    });
  }, [address, travelTokensRequired, writeContract]);

  // Approve USDX
  const approveUSDX = useCallback(() => {
    if (!address) return;

    setStep("approving-usdx");
    setError(null);

    // writeContract is async but doesn't return a promise
    // State will change to "waiting-usdx-approval" when txHash is received
    writeContract({
      address: USDXAddress,
      abi: USDXAbi,
      functionName: "approve",
      args: [ProductVaultAddress, usdxAmount],
    });
  }, [address, usdxAmount, writeContract]);

  // Execute purchase
  const executePurchase = useCallback(() => {
    if (!address || !provider.company) return;

    setStep("purchasing");
    setError(null);

    console.log("🔵 Executing purchase with params:", {
      productId: provider._id,
      sellerId: provider.company.slug,
      usdxAmount: usdxAmount.toString(),
      travelTokensRequired: travelTokensRequired.toString(),
      contractAddress: ProductVaultAddress,
    });

    // writeContract is async but doesn't return a promise
    // State will change to "waiting-confirmation" when txHash is received
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
  }, [address, provider, usdxAmount, travelTokensRequired, writeContract]);

  // Save booking to Convex
  const saveBooking = useCallback(async () => {
    if (!receipt || !selectedDate || !chainId) return;

    setStep("saving-booking");
    setError(null);

    console.log("💾 Saving booking to Convex:", {
      tourPackageId: provider._id,
      participants,
      totalPricePaid: total,
      transactionHash: receipt.transactionHash,
      blockNumber: Number(receipt.blockNumber),
    });

    try {
      const bookingId = await createBooking({
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

      console.log("✅ Booking saved successfully:", bookingId);
      setStep("success");

      // Auto close after 3 seconds
      setTimeout(() => {
        onOpenChange(false);
      }, 3000);
    } catch (err: any) {
      console.error("❌ Failed to save booking:", err);
      setError(err.message || "Failed to save booking");
      setStep("error");
    }
  }, [receipt, selectedDate, chainId, createBooking, provider._id, participants, total, address, usdxAmount, travelTokensRequired, onOpenChange]);

  // Handle transaction confirmation (MOVED AFTER CALLBACK DEFINITIONS)
  useEffect(() => {
    if (isTxConfirmed && receipt) {
      if (step === "waiting-turi-approval") {
        // TuriToken approval confirmed, now approve USDX
        approveUSDX();
      } else if (step === "waiting-usdx-approval") {
        // USDX approval confirmed, now purchase
        executePurchase();
      } else if (step === "waiting-confirmation") {
        // Purchase confirmed, save to database
        void saveBooking();
      }
    }
  }, [isTxConfirmed, receipt, step, approveUSDX, executePurchase, saveBooking]);

  // Handle purchase flow
  const handlePurchase = () => {
    if (!isConnected) {
      openWallet();
      return;
    }

    if (!provider.company) {
      setError("Company information not found");
      setStep("error");
      return;
    }

    if (!selectedDate) {
      setError("Please select a date");
      setStep("error");
      return;
    }

    // Start flow:
    // - If mixed payment: TuriTokens → USDX → Purchase
    // - If normal payment: USDX → Purchase
    if (travelTokensRequired > 0n) {
      approveTuriTokens();
    } else {
      approveUSDX();
    }
  };

  // Handle retry after error
  const handleRetry = () => {
    setError(null);
    setStep("idle");
  };

  // Prevent closing dialog during active transactions
  const handleOpenChange = (newOpen: boolean) => {
    // Prevent closing if transaction is in progress
    if (!newOpen && (step === "approving-turi" || step === "waiting-turi-approval" ||
                     step === "approving-usdx" || step === "waiting-usdx-approval" ||
                     step === "purchasing" || step === "waiting-confirmation" ||
                     step === "saving-booking")) {
      return;
    }
    onOpenChange(newOpen);
  };

  // Success view
  if (step === "success") {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange} modal={true}>
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
      case "approving-turi":
        return "Approving TURI...";
      case "waiting-turi-approval":
        return "Waiting for TURI Approval...";
      case "approving-usdx":
        return "Approving USDX...";
      case "waiting-usdx-approval":
        return "Waiting for USDX Approval...";
      case "purchasing":
        return "Confirming Purchase...";
      case "waiting-confirmation":
        return "Waiting for Confirmation...";
      case "saving-booking":
        return "Saving Booking...";
      default:
        if (hasMixedPayment && provider.mixedPayment) {
          const turiTotal = provider.mixedPayment.turiTokens * participants;
          const usxTotal = provider.mixedPayment.remainingUSX * participants;
          return `Pay ${turiTotal} TURI + $${usxTotal} USDX`;
        }
        return `Pay $${total} USDX`;
    }
  };

  const getStepMessage = () => {
    const totalSteps = hasMixedPayment ? 3 : 2;

    switch (step) {
      case "approving-turi":
        return `Step 1/${totalSteps}: Please approve TURI tokens in your wallet...`;
      case "waiting-turi-approval":
        return `Step 1/${totalSteps}: Waiting for TURI approval confirmation...`;
      case "approving-usdx":
        return `Step ${hasMixedPayment ? 2 : 1}/${totalSteps}: Please approve USDX in your wallet...`;
      case "waiting-usdx-approval":
        return `Step ${hasMixedPayment ? 2 : 1}/${totalSteps}: Waiting for USDX approval confirmation...`;
      case "purchasing":
        return `Step ${totalSteps}/${totalSteps}: Please confirm purchase in your wallet...`;
      case "waiting-confirmation":
        return `Step ${totalSteps}/${totalSteps}: Waiting for transaction confirmation...`;
      case "saving-booking":
        return "Saving booking to database...";
      default:
        return null;
    }
  };

  const getStepColor = () => {
    switch (step) {
      case "approving-turi":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "waiting-turi-approval":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "approving-usdx":
      case "purchasing":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "waiting-usdx-approval":
      case "waiting-confirmation":
      case "saving-booking":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const isProcessing = !["idle", "error", "success"].includes(step);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={!isProcessing}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Your Booking</DialogTitle>
          <DialogDescription>
            {isProcessing
              ? "Transaction in progress - do not close this window"
              : "Complete the blockchain transaction to confirm your booking"
            }
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
              {hasMixedPayment && provider.mixedPayment ? (
                <>
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-muted-foreground h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        {provider.mixedPayment.turiTokens * participants} TURI
                      </span>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        ${provider.mixedPayment.remainingUSX * participants} USDX
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="text-muted-foreground h-4 w-4" />
                  <span className="text-lg font-semibold">${total} USDX</span>
                </div>
              )}
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
        {isProcessing && getStepMessage() && (
          <div className={`${getStepColor()} rounded-lg p-3 text-sm flex items-center gap-2`}>
            <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
            <span className="font-medium">{getStepMessage()}</span>
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
            <div className="flex-1">
              <p className="text-xs">{error}</p>
            </div>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          {step === "error" ? (
            <Button
              onClick={handleRetry}
              className="w-full sm:w-auto"
            >
              Try Again
            </Button>
          ) : (
            <Button
              onClick={handlePurchase}
              disabled={isProcessing}
              className="w-full sm:w-auto"
            >
              {getButtonText()}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
