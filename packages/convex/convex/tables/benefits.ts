import { defineTable } from "convex/server";
import { v } from "convex/values";

export const benefits = defineTable({
  title: v.string(),
  description: v.string(),
  discountPercentage: v.number(),
  // El negocio que ofrece el beneficio.
  providerId: v.id("companies"),
  // La condición para desbloquear este beneficio.
  requiredReputation: v.number(),
  imageUrl: v.string(),
  isActive: v.boolean(),
}).index("by_provider", ["providerId"]);
