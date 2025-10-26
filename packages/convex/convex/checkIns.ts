import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { getUserIdentity } from "./authUtils";

export const getMyCheckIns = query({
  handler: async (ctx) => {
    const userId = await getUserIdentity(ctx);
    const checkIns = await ctx.db
      .query("checkIns")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (!checkIns) {
      return null;
    }

    return await Promise.all(
      checkIns.map(async (checkIn) => {
        const location = await ctx.db.get(checkIn.locationId);
        const collectible = checkIn.collectibleId
          ? await ctx.db.get(checkIn.collectibleId)
          : null;
        return {
          ...checkIn,
          ...(collectible || {}),
          locationName: location ? location.name : "Unknown location",
        };
      }),
    );
  },
});

export const hasUserCheckedIn = query({
  args: {
    locationId: v.id("locations"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdentity(ctx);

    const checkIn = await ctx.db
      .query("checkIns")
      .withIndex("by_user_location", (q) =>
        q.eq("userId", userId).eq("locationId", args.locationId),
      )
      .first();

    return !!checkIn;
  },
});

/**
 * Create a new check-in record after successful blockchain transaction
 */
export const createCheckIn = mutation({
  args: {
    locationId: v.id("locations"),
    collectibleId: v.optional(v.id("collectibles")),
    transactionHash: v.string(),
    nftTokenId: v.string(),
    contractAddress: v.string(),
    chainId: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdentity(ctx);

    // Check if already checked in (safety check)
    const existingCheckIn = await ctx.db
      .query("checkIns")
      .withIndex("by_user_location", (q) =>
        q.eq("userId", userId).eq("locationId", args.locationId),
      )
      .first();

    if (existingCheckIn) {
      throw new Error("Already checked in at this location");
    }

    // Create check-in record with synced status
    const checkInId = await ctx.db.insert("checkIns", {
      userId,
      locationId: args.locationId,
      collectibleId: args.collectibleId,
      numberOfVisits: 1,
      onchainStatus: {
        status: "synced",
        tokenId: args.nftTokenId,
        contractAddress: args.contractAddress,
        chainId: args.chainId,
        nft: {
          metadataURI: "", // Can be populated later if needed
        },
      },
    });

    return checkInId;
  },
});

/**
 * Update check-in status (for error handling or status changes)
 */
export const updateCheckInStatus = mutation({
  args: {
    checkInId: v.id("checkIns"),
    status: v.union(
      v.object({ status: v.literal("pending") }),
      v.object({
        status: v.literal("synced"),
        tokenId: v.string(),
        contractAddress: v.string(),
        chainId: v.number(),
        nft: v.object({
          metadataURI: v.string(),
        }),
      }),
      v.object({ status: v.literal("error"), error: v.string() }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdentity(ctx);

    const checkIn = await ctx.db.get(args.checkInId);
    if (!checkIn) {
      throw new Error("Check-in not found");
    }

    // Verify ownership
    if (checkIn.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Update status
    await ctx.db.patch(args.checkInId, {
      onchainStatus: args.status,
    });

    return args.checkInId;
  },
});

/**
 * Increment visit count for existing check-in (if user visits again)
 */
export const incrementVisitCount = mutation({
  args: {
    locationId: v.id("locations"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdentity(ctx);

    const checkIn = await ctx.db
      .query("checkIns")
      .withIndex("by_user_location", (q) =>
        q.eq("userId", userId).eq("locationId", args.locationId),
      )
      .first();

    if (!checkIn) {
      throw new Error("No check-in found for this location");
    }

    await ctx.db.patch(checkIn._id, {
      numberOfVisits: checkIn.numberOfVisits + 1,
    });

    return checkIn._id;
  },
});
