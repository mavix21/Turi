import { defineTable } from "convex/server";
import { v } from "convex/values";

export const locations = defineTable({
  name: v.string(),
  description: v.string(),
  address: v.object({
    country: v.string(),
    state: v.string(),
    city: v.string(),
    coordinates: v.object({
      latitude: v.number(),
      longitude: v.number(),
    }),
  }),
  imageUrl: v.string(),
  highlights: v.array(
    v.object({
      title: v.string(),
      description: v.string(),
    }),
  ),
  category: v.union(
    v.object({
      type: v.literal("Attraction"),
      kind: v.union(
        v.object({
          subtype: v.literal("Archaeological Site"),
        }),
        v.object({
          subtype: v.literal("Historical Site"),
        }),
        v.object({
          subtype: v.literal("Museum"),
        }),
      ),
    }),
    v.object({
      type: v.literal("Business"),
      kind: v.union(
        v.object({
          subtype: v.literal("Restaurant"),
        }),
        v.object({
          subtype: v.literal("Artisan Shop"),
        }),
        v.object({
          subtype: v.literal("Hotel"),
        }),
      ),
    }),
  ),
})
  .index("by_state", ["address.state"])
  .index("by_city", ["address.city"]);
