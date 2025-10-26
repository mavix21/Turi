import { assign, setup } from "xstate";

import type { Id } from "@turi/convex/_generated/dataModel";

export interface CheckInContext {
  // Place & Location data
  placeId: string;
  locationId: Id<"locations">;
  collectibleId: Id<"collectibles"> | null;
  placeName: string;
  collectibleName: string | null;
  collectibleImage: string | null;

  // User data
  userAddress: string | null;
  userId: Id<"users"> | null;

  // Rewards
  points: number;

  // Transaction data
  transactionHash: string | null;
  nftTokenId: string | null;

  // Error handling
  error: string | null;
}

export type CheckInEvent =
  | { type: "CHECK_IN" }
  | { type: "VALIDATION_SUCCESS" }
  | {
      type: "VALIDATION_FAILED";
      error: string;
    }
  | {
      type: "TRANSACTION_PREPARED";
      userAddress: string;
      userId: Id<"users">;
    }
  | {
      type: "TRANSACTION_SIGNED";
      hash: string;
    }
  | { type: "TRANSACTION_FAILED"; error: string }
  | {
      type: "TRANSACTION_CONFIRMED";
      nftTokenId: string;
    }
  | { type: "DATABASE_UPDATED" }
  | { type: "DATABASE_FAILED"; error: string }
  | { type: "RETRY" }
  | { type: "CLOSE" };

export const checkInMachine = setup({
  types: {
    context: {} as CheckInContext,
    events: {} as CheckInEvent,
    input: {} as CheckInContext,
  },
  actions: {
    setValidationSuccess: assign({
      error: null,
    }),
    setValidationError: assign({
      error: ({ event }) =>
        event.type === "VALIDATION_FAILED" ? event.error : null,
    }),
    setTransactionData: assign({
      userAddress: ({ event }) =>
        event.type === "TRANSACTION_PREPARED" ? event.userAddress : null,
      userId: ({ event }) =>
        event.type === "TRANSACTION_PREPARED" ? event.userId : null,
      error: null,
    }),
    setTransactionHash: assign({
      transactionHash: ({ event }) =>
        event.type === "TRANSACTION_SIGNED" ? event.hash : null,
      error: null,
    }),
    setTransactionError: assign({
      error: ({ event }) =>
        event.type === "TRANSACTION_FAILED" ? event.error : null,
      transactionHash: null,
    }),
    setNftTokenId: assign({
      nftTokenId: ({ event }) =>
        event.type === "TRANSACTION_CONFIRMED" ? event.nftTokenId : null,
    }),
    setDatabaseError: assign({
      error: ({ event }) =>
        event.type === "DATABASE_FAILED" ? event.error : null,
    }),
    clearError: assign({
      error: null,
    }),
  },
  guards: {
    hasWalletAddress: ({ context }) => !!context.userAddress,
    hasUserId: ({ context }) => !!context.userId,
    hasCollectible: ({ context }) => !!context.collectibleId,
  },
}).createMachine({
  id: "checkIn",
  initial: "idle",
  context: ({ input }) => input,
  states: {
    idle: {
      on: {
        CHECK_IN: {
          target: "validating",
          actions: "clearError",
        },
      },
    },
    validating: {
      on: {
        VALIDATION_SUCCESS: {
          target: "preparingTransaction",
          actions: "setValidationSuccess",
        },
        VALIDATION_FAILED: {
          target: "error",
          actions: "setValidationError",
        },
      },
    },
    preparingTransaction: {
      on: {
        TRANSACTION_PREPARED: {
          target: "waitingForSignature",
          actions: "setTransactionData",
        },
        TRANSACTION_FAILED: {
          target: "error",
          actions: "setTransactionError",
        },
      },
    },
    waitingForSignature: {
      on: {
        TRANSACTION_SIGNED: {
          target: "waitingForConfirmation",
          actions: "setTransactionHash",
        },
        TRANSACTION_FAILED: {
          target: "error",
          actions: "setTransactionError",
        },
      },
    },
    waitingForConfirmation: {
      on: {
        TRANSACTION_CONFIRMED: {
          target: "updatingDatabase",
          actions: "setNftTokenId",
        },
        TRANSACTION_FAILED: {
          target: "error",
          actions: "setTransactionError",
        },
      },
    },
    updatingDatabase: {
      on: {
        DATABASE_UPDATED: {
          target: "success",
        },
        DATABASE_FAILED: {
          target: "error",
          actions: "setDatabaseError",
        },
      },
    },
    success: {
      on: {
        CLOSE: "idle",
      },
    },
    error: {
      on: {
        RETRY: "idle",
        CLOSE: "idle",
      },
    },
  },
});
