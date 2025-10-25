import { v } from "convex/values";

import { mutation } from "./_generated/server";

export const createUser = mutation({
  args: {
    address: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", args.address))
      .first();

    if (user) {
      return user._id;
    }

    const userId = await ctx.db.insert("users", {
      walletAddress: args.address,
      name: args.address,
      reputationScore: 0,
    });

    return userId;
  },
});
