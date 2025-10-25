import { defineTable } from "convex/server";
import { v } from "convex/values";

export const users = defineTable({
  name: v.string(),
  email: v.optional(v.string()),
  pfpUrl: v.optional(v.string()),
  walletAddress: v.string(),
  verifiedAt: v.optional(v.number()),
  reputationScore: v.number(),
})
  .index("by_email", ["email"])
  .index("by_wallet", ["walletAddress"]);
