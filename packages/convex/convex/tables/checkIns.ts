import { defineTable } from "convex/server";
import { v } from "convex/values";

export const checkIns = defineTable({
  userId: v.id("users"),
  locationId: v.id("locations"),
  numberOfVisits: v.number(),
  onchainStatus: v.union(
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
})
  .index("by_user", ["userId"])
  .index("by_user_location", ["userId", "locationId"]); // Para evitar check-ins duplicados rápidamente.
