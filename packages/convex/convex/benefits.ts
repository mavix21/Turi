import { v } from "convex/values";

import { query } from "./_generated/server";

export const getAllBenefits = query({
  handler: async (ctx) => {
    const benefits = await ctx.db.query("benefits").collect();

    return benefits;
  },
});
