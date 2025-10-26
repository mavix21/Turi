"use client";

import { useCallback, useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { formatUnits, parseUnits } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

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
  AlertCircle,
  Calendar,
  CheckCircle2,
  CreditCard,
  Loader2,
  Users,
  Wallet,
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
  const t = useTranslations("home.placeDetail.booking.bookingConfirm");
  const [step, setStep] = useState<PurchaseStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [useMixedPayment, setUseMixedPayment] = useState(true); // Default to mixed payment if available

  const { address, isConnected, chainId } = useAccount();
  const { open: openWallet } = useAppKit();
  const { writeContract, data: txHash, error: writeError } = useWriteContract();
  const { data: receipt, isSuccess: isTxConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  const createBooking = useMutation(api.bookings.createBookingFromPurchase);

  // Read TURI balance to check if user has enough tokens for mixed payment
  const { data: turiBalance } = useReadContract({
    address: TuriTokenAddress,
    abi: TuriTokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!provider.mixedPayment,
    },
  });

  // Calculate payment amounts based on selected payment method
  // CRITICAL: USDX has 6 decimals, TuriToken has 18 decimals
  const hasMixedPayment = !!provider.mixedPayment;

  // Determine payment amounts based on user selection
  const usdxAmount =
    hasMixedPayment && useMixedPayment && provider.mixedPayment
      ? parseUnits(
          (provider.mixedPayment.remainingUSX * participants).toString(),
          6,
        ) // Mixed: partial USDX
      : parseUnits(total.toString(), 6); // Normal: full USDX

  const travelTokensRequired =
    hasMixedPayment && useMixedPayment && provider.mixedPayment
      ? parseUnits(
          (provider.mixedPayment.turiTokens * participants).toString(),
          18,
        ) // Mixed: TURI tokens
      : 0n; // Normal: no TURI tokens

  // Check if user has enough TURI tokens for mixed payment
  const hasEnoughTuriTokens = turiBalance
    ? (turiBalance as bigint) >= travelTokensRequired
    : false;

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open && step === "idle") {
      setError(null);
    }
    if (open) {
      // Reset to mixed payment when dialog opens (if available)
      setUseMixedPayment(true);
    }
  }, [open, step]);

  // Handle transaction errors
  useEffect(() => {
    if (writeError) {
      const errorMessage = writeError.message || "Transaction failed";
      // Check if user rejected the transaction
      if (
        errorMessage.includes("User rejected") ||
        errorMessage.includes("User denied")
      ) {
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
  }, [
    receipt,
    selectedDate,
    chainId,
    createBooking,
    provider._id,
    participants,
    total,
    address,
    usdxAmount,
    travelTokensRequired,
    onOpenChange,
  ]);

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
    if (
      !newOpen &&
      (step === "approving-turi" ||
        step === "waiting-turi-approval" ||
        step === "approving-usdx" ||
        step === "waiting-usdx-approval" ||
        step === "purchasing" ||
        step === "waiting-confirmation" ||
        step === "saving-booking")
    ) {
      return;
    }
    onOpenChange(newOpen);
  };

  // Success view
  if (step === "success") {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange} modal={true}>
        <DialogContent className="max-h-[90vh] max-w-md overflow-hidden p-0">
          <div className="max-h-[90vh] overflow-y-auto px-6 py-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
              </div>
              <DialogTitle className="text-center text-2xl">
                {t("bookingConfirmed")}
              </DialogTitle>
              <DialogDescription className="space-y-2 text-center">
                <p>{t("successMessage")}</p>
                {receipt?.transactionHash && (
                  <div className="flex flex-col items-center gap-2 pt-2">
                    <span className="text-muted-foreground text-xs">
                      {t("transactionHash")}
                    </span>
                    <a
                      href={`https://sepolia.scrollscan.com/tx/${receipt.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex items-center gap-1 font-mono text-xs transition-all hover:underline"
                    >
                      {receipt.transactionHash.slice(0, 10)}...
                      {receipt.transactionHash.slice(-8)}
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
                  </div>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const getButtonText = () => {
    if (!isConnected) return t("connectWallet");

    switch (step) {
      case "approving-turi":
        return t("buttonStates.approvingTURI");
      case "waiting-turi-approval":
        return t("buttonStates.waitingTURIApproval");
      case "approving-usdx":
        return t("buttonStates.approvingUSDX");
      case "waiting-usdx-approval":
        return t("buttonStates.waitingUSDXApproval");
      case "purchasing":
        return t("buttonStates.confirming");
      case "waiting-confirmation":
        return t("buttonStates.waitingConfirmation");
      case "saving-booking":
        return t("buttonStates.savingBooking");
      default:
        if (hasMixedPayment && useMixedPayment && provider.mixedPayment) {
          const turiTotal = provider.mixedPayment.turiTokens * participants;
          const usxTotal = provider.mixedPayment.remainingUSX * participants;
          return t("buttonStates.payMixed", {
            turi: turiTotal,
            usdx: usxTotal,
          });
        }
        return t("buttonStates.payUSDX", { total });
    }
  };

  const getStepMessage = () => {
    const totalSteps = hasMixedPayment && useMixedPayment ? 3 : 2;
    const current = hasMixedPayment && useMixedPayment ? 2 : 1;

    switch (step) {
      case "approving-turi":
        return t("steps.approvingTURI", { current: 1, total: totalSteps });
      case "waiting-turi-approval":
        return t("steps.waitingTURIApproval", {
          current: 1,
          total: totalSteps,
        });
      case "approving-usdx":
        return t("steps.approvingUSDX", { current, total: totalSteps });
      case "waiting-usdx-approval":
        return t("steps.waitingUSDXApproval", { current, total: totalSteps });
      case "purchasing":
        return t("steps.confirming", {
          current: totalSteps,
          total: totalSteps,
        });
      case "waiting-confirmation":
        return t("steps.waitingConfirmation", {
          current: totalSteps,
          total: totalSteps,
        });
      case "saving-booking":
        return t("steps.savingBooking");
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
      <DialogContent className="max-h-[90vh] max-w-md overflow-hidden p-0">
        <div className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="bg-background sticky top-0 z-10 border-b px-6 pt-6 pb-4">
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>
              {isProcessing ? t("descriptionInProgress") : t("descriptionIdle")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 pt-4 pb-6">
            {/* Payment Method Selection - Only show if mixed payment is available */}
            {hasMixedPayment && provider.mixedPayment && !isProcessing && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("paymentMethod")}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {/* Mixed Payment Option */}
                  <button
                    onClick={() => setUseMixedPayment(true)}
                    className={`flex items-start justify-between rounded-lg border-2 p-3 text-left transition-all ${
                      useMixedPayment
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                            useMixedPayment
                              ? "border-primary"
                              : "border-muted-foreground"
                          }`}
                        >
                          {useMixedPayment && (
                            <div className="bg-primary h-2 w-2 rounded-full" />
                          )}
                        </div>
                        <span className="text-sm font-semibold">
                          {t("mixedPayment")}
                        </span>
                      </div>
                      <div className="ml-6 space-y-0.5">
                        <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          {provider.mixedPayment.turiTokens * participants} TURI
                        </div>
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          ${provider.mixedPayment.remainingUSX * participants}{" "}
                          USDX
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Normal Payment Option */}
                  <button
                    onClick={() => setUseMixedPayment(false)}
                    className={`flex items-start justify-between rounded-lg border-2 p-3 text-left transition-all ${
                      !useMixedPayment
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                            !useMixedPayment
                              ? "border-primary"
                              : "border-muted-foreground"
                          }`}
                        >
                          {!useMixedPayment && (
                            <div className="bg-primary h-2 w-2 rounded-full" />
                          )}
                        </div>
                        <span className="text-sm font-semibold">
                          {t("payWithUSDX")}
                        </span>
                      </div>
                      <div className="ml-6">
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          ${total} USDX
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Warning if user doesn't have enough TURI tokens */}
                {useMixedPayment &&
                  !hasEnoughTuriTokens &&
                  travelTokensRequired > 0n && (
                    <div className="flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 text-sm text-yellow-600 dark:text-yellow-500">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <div className="text-xs">
                        <p className="mb-1 font-semibold">
                          {t("insufficientTURITitle")}
                        </p>
                        <p>
                          {t("insufficientTURIMessage", {
                            required: provider.mixedPayment
                              ? (
                                  provider.mixedPayment.turiTokens *
                                  participants
                                ).toFixed(2)
                              : "0",
                            available: turiBalance
                              ? parseFloat(
                                  formatUnits(turiBalance as bigint, 18),
                                ).toFixed(2)
                              : "0",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            )}

            <Card>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <h3 className="mb-1 font-semibold">{provider.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t("by")} {provider.company?.name || t("unknown")}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span>
                      {selectedDate
                        ? format(selectedDate, "EEEE, MMMM d, yyyy")
                        : t("noDateSelected")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="text-muted-foreground h-4 w-4" />
                    <span>
                      {participants}{" "}
                      {participants === 1 ? t("person") : t("people")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-muted-foreground h-4 w-4" />
                    {useMixedPayment &&
                    hasMixedPayment &&
                    provider.mixedPayment ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          {provider.mixedPayment.turiTokens * participants} TURI
                        </span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          ${provider.mixedPayment.remainingUSX * participants}{" "}
                          USDX
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-semibold">
                        ${total} USDX
                      </span>
                    )}
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
            {isProcessing && getStepMessage() && (
              <div className={`${getStepColor()} rounded-lg p-3 text-sm`}>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  <span className="font-medium">{getStepMessage()}</span>
                </div>
                {txHash && (
                  <div className="mt-2 border-t border-current/20 pt-2">
                    <a
                      href={`https://sepolia.scrollscan.com/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-mono text-xs transition-all hover:underline"
                    >
                      {t("viewTransaction")} {txHash.slice(0, 10)}...
                      {txHash.slice(-8)}
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
                  </div>
                )}
              </div>
            )}

            <div className="bg-muted/50 space-y-1 rounded-lg p-4 text-sm">
              <div className="flex flex-col items-start gap-2">
                {provider.guarantees.map((guarantee) => (
                  <div className="flex items-start gap-2" key={guarantee}>
                    <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span className="text-muted-foreground text-xs">
                      {guarantee}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Error message */}
            {error && step === "error" && (
              <div className="bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg p-3 text-sm">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="overflow-wrap-anywhere max-h-32 overflow-y-auto text-xs wrap-break-word">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isProcessing}
              >
                {t("cancel")}
              </Button>
              {step === "error" ? (
                <Button onClick={handleRetry} className="w-full sm:w-auto">
                  {t("tryAgain")}
                </Button>
              ) : (
                <Button
                  onClick={handlePurchase}
                  disabled={
                    isProcessing ||
                    (useMixedPayment &&
                      !hasEnoughTuriTokens &&
                      travelTokensRequired > 0n)
                  }
                  className="w-full sm:w-auto"
                >
                  {getButtonText()}
                </Button>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
