import { defineTable } from "convex/server";
import { v } from "convex/values";

export const checkIns = defineTable({
  userId: v.id("users"),
  locationId: v.id("locations"),
  numberOfVisits: v.number(),
  // Podrías añadir más contexto si quisieras, como el método de verificación (QR, GPS)
})
  .index("by_user", ["userId"])
  .index("by_user_location", ["userId", "locationId"]); // Para evitar check-ins duplicados rápidamente.
