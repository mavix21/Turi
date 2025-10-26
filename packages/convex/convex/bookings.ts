import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { getUserIdentity } from "./authUtils";

// Create booking from blockchain purchase
export const createBookingFromPurchase = mutation({
  args: {
    tourPackageId: v.id("tourPackages"),
    tourDate: v.number(),
    participants: v.number(),
    totalPricePaid: v.number(),
    transactionHash: v.string(),
    blockNumber: v.number(),
    buyerAddress: v.string(),
    usdxAmount: v.string(),
    travelTokensBurned: v.string(),
    chainId: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdentity(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Check if booking already exists with this transaction hash
    const existingBookings = await ctx.db.query("bookings").collect();
    const existing = existingBookings.find(
      (b) =>
        "transactionHash" in b && b.transactionHash === args.transactionHash,
    );

    if (existing) {
      return existing._id;
    }

    // Create new booking
    const bookingId = await ctx.db.insert("bookings", {
      userId,
      tourPackageId: args.tourPackageId,
      tourDate: args.tourDate,
      participants: args.participants,
      totalPricePaid: args.totalPricePaid,
      status: "confirmed",
      transactionHash: args.transactionHash,
      blockNumber: args.blockNumber,
      buyerAddress: args.buyerAddress,
      usdxAmount: args.usdxAmount,
      travelTokensBurned: args.travelTokensBurned,
      chainId: args.chainId,
      purchasedAt: Date.now(),
    });

    // Decrement available tickets
    const tourPackage = await ctx.db.get(args.tourPackageId);
    if (tourPackage && tourPackage.availableTickets > 0) {
      await ctx.db.patch(args.tourPackageId, {
        availableTickets: Math.max(
          0,
          tourPackage.availableTickets - args.participants,
        ),
      });
    }

    return bookingId;
  },
});

// Get user bookings
export const getUserBookings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdentity(ctx);

    if (!userId) {
      return [];
    }

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return bookings;
  },
});
