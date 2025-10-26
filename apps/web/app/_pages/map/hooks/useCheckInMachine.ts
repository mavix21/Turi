"use client";

import { useCallback, useEffect } from "react";
import { useMachine } from "@xstate/react";
import { useMutation, useQuery } from "convex/react";
import { parseEventLogs } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import type { Id } from "@turi/convex/_generated/dataModel";
import { api } from "@turi/convex/_generated/api";

import { TravelCheckinAbi, TravelCheckinAddress } from "@/src/constants/abi";

import { CheckInContext, checkInMachine } from "../machines/checkInMachine";
import { Place } from "../model/types";

interface UseCheckInMachineProps {
  place: Place;
}

export function useCheckInMachine({ place }: UseCheckInMachineProps) {
  const { address, isConnected, chainId } = useAccount();

  // Convex queries and mutations
  const hasCheckedIn = useQuery(
    api.checkIns.hasUserCheckedIn,
    place.id ? { locationId: place.id as Id<"locations"> } : "skip",
  );
  const createCheckIn = useMutation(api.checkIns.createCheckIn);
  const incrementScore = useMutation(api.users.incrementReputationScore);

  // Wagmi hooks for contract interaction
  const { writeContract, data: txHash, error: writeError } = useWriteContract();
  const { data: receipt, isSuccess: isTxConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  // Initialize machine with place context
  const initialContext: CheckInContext = {
    placeId: place.id,
    locationId: place.id as Id<"locations">,
    collectibleId: null,
    placeName: place.name,
    collectibleName: null,
    collectibleImage: null,
    userAddress: address ?? null,
    userId: null,
    points: place.points,
    transactionHash: null,
    nftTokenId: null,
    error: null,
  };

  const [state, send] = useMachine(checkInMachine, {
    input: initialContext,
  });

  // Validation logic - triggered by machine state
  const validate = useCallback(() => {
    if (!isConnected || !address) {
      send({
        type: "VALIDATION_FAILED",
        error: "Please connect your wallet to check in",
      });
      return;
    }

    if (hasCheckedIn) {
      send({
        type: "VALIDATION_FAILED",
        error: "You have already checked in at this location",
      });
      return;
    }

    if (place.isInRange === false) {
      send({
        type: "VALIDATION_FAILED",
        error: "You are too far from this location",
      });
      return;
    }

    send({ type: "VALIDATION_SUCCESS" });
  }, [isConnected, address, hasCheckedIn, place.isInRange, send]);

  // Prepare transaction
  const prepareTransaction = useCallback(() => {
    if (!address) {
      send({
        type: "TRANSACTION_FAILED",
        error: "Wallet not connected",
      });
      return;
    }

    send({
      type: "TRANSACTION_PREPARED",
      userAddress: address,
      userId: place.id as Id<"users">,
    });
  }, [address, place.id, send]);

  // Execute contract write
  const executeTransaction = useCallback(() => {
    if (!address || !chainId) {
      send({
        type: "TRANSACTION_FAILED",
        error: "Wallet not connected",
      });
      return;
    }

    writeContract({
      address: TravelCheckinAddress,
      abi: TravelCheckinAbi,
      functionName: "validateCheckin",
      args: [address, place.slug, BigInt(place.points)],
    });
  }, [address, chainId, place.id, place.points, writeContract, send]);

  // Parse transaction receipt
  const parseReceipt = useCallback(() => {
    if (!receipt) {
      send({
        type: "TRANSACTION_FAILED",
        error: "No transaction receipt",
      });
      return;
    }

    try {
      const logs = parseEventLogs({
        abi: TravelCheckinAbi,
        logs: receipt.logs,
        eventName: "CheckinCompleted",
      });

      const checkinEvent = logs[0];
      if (checkinEvent?.args) {
        const eventArgs = checkinEvent.args as {
          user: string;
          placeHash: string;
          placeId: string;
          reward: bigint;
          nftId: bigint;
          timestamp: bigint;
        };

        send({
          type: "TRANSACTION_CONFIRMED",
          nftTokenId: eventArgs.nftId.toString(),
        });
      } else {
        send({
          type: "TRANSACTION_FAILED",
          error: "Could not parse transaction receipt",
        });
      }
    } catch (error) {
      send({
        type: "TRANSACTION_FAILED",
        error:
          error instanceof Error ? error.message : "Failed to parse receipt",
      });
    }
  }, [receipt, send]);

  // Update database
  const updateDatabase = useCallback(async () => {
    const context = state.context;

    if (!chainId) {
      send({
        type: "DATABASE_FAILED",
        error: "Network not connected",
      });
      return;
    }

    if (
      !context.locationId ||
      !context.transactionHash ||
      !context.nftTokenId
    ) {
      send({
        type: "DATABASE_FAILED",
        error: "Missing required transaction data",
      });
      return;
    }

    try {
      await Promise.all([
        createCheckIn({
          locationId: context.locationId,
          collectibleId:
            context.collectibleId ?? (place.id as Id<"collectibles">),
          transactionHash: context.transactionHash,
          nftTokenId: context.nftTokenId,
          contractAddress: TravelCheckinAddress,
          chainId,
        }),
        incrementScore({
          points: context.points,
        }),
      ]);

      send({ type: "DATABASE_UPDATED" });
    } catch (error) {
      send({
        type: "DATABASE_FAILED",
        error:
          error instanceof Error ? error.message : "Database update failed",
      });
    }
  }, [state.context, chainId, createCheckIn, incrementScore, place.id, send]);

  // Only use effect for state-driven side effects
  useEffect(() => {
    if (state.matches("validating")) {
      validate();
    } else if (state.matches("preparingTransaction")) {
      prepareTransaction();
    } else if (state.matches("waitingForSignature")) {
      executeTransaction();
    } else if (state.matches("updatingDatabase")) {
      void updateDatabase();
    }
  }, [
    state.value,
    validate,
    prepareTransaction,
    executeTransaction,
    updateDatabase,
  ]);

  // Handle wagmi state changes
  useEffect(() => {
    if (writeError && state.matches("waitingForSignature")) {
      send({
        type: "TRANSACTION_FAILED",
        error: writeError.message || "Transaction failed",
      });
    }
  }, [writeError, state, send]);

  useEffect(() => {
    if (txHash && state.matches("waitingForSignature")) {
      send({
        type: "TRANSACTION_SIGNED",
        hash: txHash,
      });
    }
  }, [txHash, state, send]);

  useEffect(() => {
    if (isTxConfirmed && receipt && state.matches("waitingForConfirmation")) {
      parseReceipt();
    }
  }, [isTxConfirmed, receipt, state, parseReceipt]);

  return {
    state: state.value,
    context: state.context,
    isIdle: state.matches("idle"),
    isValidating: state.matches("validating"),
    isPreparing: state.matches("preparingTransaction"),
    isWaitingForSignature: state.matches("waitingForSignature"),
    isWaitingForConfirmation: state.matches("waitingForConfirmation"),
    isUpdatingDatabase: state.matches("updatingDatabase"),
    isSuccess: state.matches("success"),
    isError: state.matches("error"),
    isLoading:
      state.matches("validating") ||
      state.matches("preparingTransaction") ||
      state.matches("waitingForSignature") ||
      state.matches("waitingForConfirmation") ||
      state.matches("updatingDatabase"),
    error: state.context.error,
    checkIn: () => send({ type: "CHECK_IN" }),
    retry: () => send({ type: "RETRY" }),
    close: () => send({ type: "CLOSE" }),
  };
}
