import { defineTable } from "convex/server";
import { v } from "convex/values";

export const benefits = defineTable({
  title: v.string(),
  description: v.string(),
  // El negocio que ofrece el beneficio.
  providerId: v.id("locations"),
  // La condición para desbloquear este beneficio.
  requiredReputation: v.number(),
  isActive: v.boolean(),
}).index("by_provider", ["providerId"]);
