import { v } from "convex/values";

import { query } from "./_generated/server";

export const getTourPackagesByLocation = query({
  args: { locationId: v.id("locations") },
  handler: async (ctx, args) => {
    let tourPackages = await ctx.db
      .query("tourPackages")
      .withIndex("by_location", (q) => q.eq("locationId", args.locationId))
      .collect();

    if (!tourPackages) {
      return null;
    }

    return tourPackages;
  },
});
