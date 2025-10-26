import { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";

export const getAllLocations = query({
  handler: async (ctx) => {
    const locations = await ctx.db.query("locations").collect();
    return locations;
  },
});

export const getLocationsForMap = query({
  handler: async (ctx) => {
    const locations = await ctx.db.query("locations").collect();

    const locationsWithCollectibles = await Promise.all(
      locations.map(async (location) => {
        const collectible = await ctx.db
          .query("collectibles")
          .withIndex("by_location", (q) => q.eq("locationId", location._id))
          .first();

        return {
          id: location._id,
          name: location.name,
          slug: location.slug,
          description: location.description,
          address: location.address.name || location.address.city,
          rating: location.rating || 0,
          location: {
            lat: location.address.coordinates.latitude,
            lng: location.address.coordinates.longitude,
          },
          image: location.imageUrl,
          points: collectible?.pointsValue || 0,
          nftReward: !!collectible,
          collectibleId: collectible?._id || null,
          nftPostcard: collectible
            ? { image: collectible.imageUrl, name: collectible.name }
            : null,
        };
      }),
    );

    return locationsWithCollectibles;
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
