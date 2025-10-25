import { asyncMap } from "convex-helpers";
import { v } from "convex/values";

import { query } from "./_generated/server";

export const getTourPackagesByLocation = query({
  args: { locationId: v.id("locations") },
  handler: async (ctx, args) => {
    const tourPackages = await asyncMap(
      await ctx.db
        .query("tourPackages")
        .withIndex("by_location", (q) => q.eq("locationId", args.locationId))
        .order("desc")
        .collect(),
      async (q) => {
        const company = await ctx.db.get(q.companyId);
        return { ...q, companyName: company?.name || "Unknown Company" };
      },
    );

    if (!tourPackages) {
      return null;
    }

    return tourPackages;
  },
});
