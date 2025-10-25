import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tourPackages = defineTable({
  name: v.string(),
  description: v.string(),
  basePricePerPerson: v.number(),
  taxesAndFees: v.number(),
  currency: v.union(v.literal("USX"), v.literal("USDC")),
  whatIsIncluded: v.array(v.string()),
  guarantees: v.array(v.string()),
  locationId: v.id("locations"),
  companyId: v.id("companies"),
  availableTickets: v.number(),
})
  .index("by_location", ["locationId"])
  .index("by_company", ["companyId"]);
