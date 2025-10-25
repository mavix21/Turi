import { defineTable } from "convex/server";
import { v } from "convex/values";

export const collectibles = defineTable({
  name: v.string(),
  description: v.string(),
  imageUrl: v.string(), // La URL de la imagen de la postal.
  // Cuántos puntos de reputación ganas al obtener este coleccionable.
  pointsValue: v.number(),
  // Relación: Este coleccionable se obtiene en ESTE lugar.
  locationId: v.id("locations"),
}).index("by_location", ["locationId"]);
