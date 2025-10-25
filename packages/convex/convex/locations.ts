import { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";

export const getAllLocations = query({
  handler: async (ctx) => {
    const locations = await ctx.db.query("locations").collect();
    return locations;
  },
});

export const getLocationById = query({
  handler: async (ctx, args: { id: string }) => {
    const location = await ctx.db.get(args.id as Id<"locations">);
    if (!location) {
      return null;
    }

    const collectible = await ctx.db
      .query("collectibles")
      .withIndex("by_location", (q) =>
        q.eq("locationId", args.id as Id<"locations">),
      )
      .first();

    if (!collectible) {
      return null;
    }

    return {
      ...location,
      nftPostcard: { image: collectible.imageUrl, name: collectible.name },
    };
  },
});
