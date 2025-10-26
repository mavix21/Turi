import { defineTable } from "convex/server";
import { v } from "convex/values";

export const locations = defineTable({
  name: v.string(),
  description: v.string(),
  slug: v.string(),
  rating: v.optional(v.number()),
  address: v.object({
    country: v.string(),
    state: v.string(),
    city: v.string(),
    name: v.optional(v.string()),
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
      type: v.literal("Atracción"),
      kind: v.union(
        v.object({
          subtype: v.literal("Sitio Arqueológico"),
        }),
        v.object({
          subtype: v.literal("Sitio Histórico"),
        }),
        v.object({
          subtype: v.literal("Museo"),
        }),
      ),
    }),
    v.object({
      type: v.literal("Negocio"),
      kind: v.union(
        v.object({
          subtype: v.literal("Restaurant"),
        }),
        v.object({
          subtype: v.literal("Tienda de Artesanías"),
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
