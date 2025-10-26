import { defineTable } from "convex/server";
import { v } from "convex/values";

export const bookings = defineTable({
  userId: v.id("users"),
  tourPackageId: v.id("tourPackages"),

  tourDate: v.number(),
  participants: v.number(),
  totalPricePaid: v.number(),

  status: v.union(
    v.literal("confirmed"),
    v.literal("pending"),
    v.literal("cancelled"),
  ),

  // Blockchain data
  transactionHash: v.optional(v.string()),
  blockNumber: v.optional(v.number()),
  buyerAddress: v.optional(v.string()),
  usdxAmount: v.optional(v.string()),
  travelTokensBurned: v.optional(v.string()),
  chainId: v.optional(v.number()),
  purchasedAt: v.optional(v.number()),
}).index("by_user", ["userId"]);
