import { query } from "./_generated/server";
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
        const collectible = await ctx.db.get(checkIn.collectibleId);
        return {
          ...checkIn,
          ...collectible,
          locationName: location ? location.name : "Unknown location",
        };
      }),
    );
  },
});
