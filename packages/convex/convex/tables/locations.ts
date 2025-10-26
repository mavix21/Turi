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
      type: v.union(v.literal("Atracción"), v.literal("Attraction")),
      kind: v.union(
        v.object({
          subtype: v.union(
            v.literal("Sitio Arqueológico"),
            v.literal("Archaeological Site"),
          ),
        }),
        v.object({
          subtype: v.union(
            v.literal("Sitio Histórico"),
            v.literal("Historical Site"),
          ),
        }),
        v.object({
          subtype: v.union(v.literal("Museo"), v.literal("Museum")),
        }),
      ),
    }),
    v.object({
      type: v.union(v.literal("Negocio"), v.literal("Business")),
      kind: v.union(
        v.object({
          subtype: v.union(v.literal("Restaurant"), v.literal("Restaurante")),
        }),
        v.object({
          subtype: v.union(
            v.literal("Tienda de Artesanías"),
            v.literal("Artisan Shop"),
          ),
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
