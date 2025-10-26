import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tourPackages = defineTable({
  name: v.string(),
  description: v.string(),
  basePricePerPerson: v.number(),
  taxesAndFees: v.number(),
  currency: v.union(v.literal("USX"), v.literal("USDC")),

  // Opción 2: Pago mixto (solo si el tour lo ofrece)
  mixedPayment: v.optional(
    v.object({
      turiTokens: v.number(), // Parte que se paga con Turi Tokens
      remainingUSX: v.number(), // Resto que se paga con USX
    }),
  ),

  whatIsIncluded: v.array(v.string()),
  guarantees: v.array(v.string()),
  locationId: v.id("locations"),
  companyId: v.id("companies"),
  availableTickets: v.number(),
})
  .index("by_location", ["locationId"])
  .index("by_company", ["companyId"]);
